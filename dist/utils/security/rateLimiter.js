/**
 * @fileoverview Provides a generic rate limiter class to manage request rates
 * based on configurable time windows and request counts. It supports custom
 * key generation, periodic cleanup of expired entries, and skipping rate
 * limiting in development environments.
 * @module src/utils/security/rateLimiter
 */
import { BaseErrorCode, McpError } from "../../types-global/errors.js";
import { environment } from "../../config/index.js";
import { logger, requestContextService, } from "../internal/index.js"; // Use internal index for RequestContext
/**
 * A generic rate limiter class that can be used to control the frequency of
 * operations or requests from various sources. It stores request counts in memory.
 */
export class RateLimiter {
    /**
     * Creates a new `RateLimiter` instance.
     * @param {Partial<RateLimitConfig>} [initialConfig={}] - Optional initial configuration
     *   to override default settings.
     */
    constructor(initialConfig = {}) {
        this.cleanupTimer = null;
        this.currentConfig = { ...RateLimiter.DEFAULT_CONFIG, ...initialConfig };
        this.limits = new Map();
        this.startCleanupTimer();
        // Initial log message about instantiation can be done by the code that creates the singleton instance,
        // after logger itself is fully initialized.
    }
    /**
     * Starts the periodic cleanup timer for expired rate limit entries.
     * If a timer already exists, it's cleared and restarted.
     * @private
     */
    startCleanupTimer() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        const interval = this.currentConfig.cleanupInterval;
        if (interval && interval > 0) {
            this.cleanupTimer = setInterval(() => {
                this.cleanupExpiredEntries();
            }, interval);
            // Allow Node.js to exit if this timer is the only thing running.
            if (this.cleanupTimer.unref) {
                this.cleanupTimer.unref();
            }
        }
    }
    /**
     * Removes expired entries from the rate limit store to free up memory.
     * This method is called periodically by the cleanup timer.
     * @private
     */
    cleanupExpiredEntries() {
        const now = Date.now();
        let expiredCount = 0;
        const internalContext = requestContextService.createRequestContext({
            operation: "RateLimiter.cleanupExpiredEntries",
        });
        for (const [key, entry] of this.limits.entries()) {
            if (now >= entry.resetTime) {
                this.limits.delete(key);
                expiredCount++;
            }
        }
        if (expiredCount > 0) {
            logger.debug(`Cleaned up ${expiredCount} expired rate limit entries.`, {
                ...internalContext,
                totalRemaining: this.limits.size,
            });
        }
    }
    /**
     * Updates the rate limiter's configuration.
     * @param {Partial<RateLimitConfig>} newConfig - Partial configuration object
     *   with new settings to apply.
     */
    configure(newConfig) {
        const oldCleanupInterval = this.currentConfig.cleanupInterval;
        this.currentConfig = { ...this.currentConfig, ...newConfig };
        if (newConfig.cleanupInterval !== undefined &&
            newConfig.cleanupInterval !== oldCleanupInterval) {
            this.startCleanupTimer(); // Restart timer if interval changed
        }
        // Consider logging configuration changes if needed, using a RequestContext.
    }
    /**
     * Retrieves a copy of the current rate limiter configuration.
     * @returns {RateLimitConfig} The current configuration.
     */
    getConfig() {
        return { ...this.currentConfig };
    }
    /**
     * Resets all rate limits, clearing all tracked keys and their counts.
     * @param {RequestContext} [context] - Optional context for logging the reset operation.
     */
    reset(context) {
        this.limits.clear();
        const opContext = context ||
            requestContextService.createRequestContext({
                operation: "RateLimiter.reset",
            });
        logger.info("Rate limiter has been reset. All limits cleared.", opContext);
    }
    /**
     * Checks if a request identified by a key exceeds the configured rate limit.
     * If the limit is exceeded, an `McpError` is thrown.
     *
     * @param {string} identifier - A unique string identifying the source of the request
     *   (e.g., IP address, user ID, session ID).
     * @param {RequestContext} [context] - Optional request context for logging and potentially
     *   for use by a custom `keyGenerator`.
     * @throws {McpError} If the rate limit is exceeded for the given key.
     *   The error will have `BaseErrorCode.RATE_LIMITED`.
     */
    check(identifier, context) {
        const opContext = context ||
            requestContextService.createRequestContext({
                operation: "RateLimiter.check",
                identifier,
            });
        if (this.currentConfig.skipInDevelopment && environment === "development") {
            logger.debug(`Rate limiting skipped for key "${identifier}" in development environment.`, opContext);
            return;
        }
        const limitKey = this.currentConfig.keyGenerator
            ? this.currentConfig.keyGenerator(identifier, opContext)
            : identifier;
        const now = Date.now();
        const entry = this.limits.get(limitKey);
        if (!entry || now >= entry.resetTime) {
            // New entry or expired window
            this.limits.set(limitKey, {
                count: 1,
                resetTime: now + this.currentConfig.windowMs,
            });
            return; // First request in window, allow
        }
        // Window is active, check count
        if (entry.count >= this.currentConfig.maxRequests) {
            const waitTimeSeconds = Math.ceil((entry.resetTime - now) / 1000);
            const errorMessageTemplate = this.currentConfig.errorMessage ||
                RateLimiter.DEFAULT_CONFIG.errorMessage;
            const errorMessage = errorMessageTemplate.replace("{waitTime}", waitTimeSeconds.toString());
            logger.warning(`Rate limit exceeded for key "${limitKey}".`, {
                ...opContext,
                limitKey,
                count: entry.count,
                maxRequests: this.currentConfig.maxRequests,
                resetTime: new Date(entry.resetTime).toISOString(),
                waitTimeSeconds,
            });
            throw new McpError(BaseErrorCode.RATE_LIMITED, errorMessage, { ...opContext, keyUsed: limitKey, waitTime: waitTimeSeconds });
        }
        // Increment count and update entry
        entry.count++;
        // No need to this.limits.set(limitKey, entry) again if entry is a reference to the object in the map.
    }
    /**
     * Retrieves the current rate limit status for a given key.
     * @param {string} key - The rate limit key (as generated by `keyGenerator` or the raw identifier).
     * @returns {{ current: number; limit: number; remaining: number; resetTime: number } | null}
     *   An object with current status, or `null` if the key is not currently tracked (or has expired).
     *   `resetTime` is a Unix timestamp (milliseconds).
     */
    getStatus(key) {
        const entry = this.limits.get(key);
        if (!entry || Date.now() >= entry.resetTime) {
            // Also consider expired as not found for status
            return null;
        }
        return {
            current: entry.count,
            limit: this.currentConfig.maxRequests,
            remaining: Math.max(0, this.currentConfig.maxRequests - entry.count),
            resetTime: entry.resetTime,
        };
    }
    /**
     * Stops the cleanup timer and clears all rate limit entries.
     * This should be called if the rate limiter instance is no longer needed,
     * to prevent resource leaks (though `unref` on the timer helps).
     * @param {RequestContext} [context] - Optional context for logging the disposal.
     */
    dispose(context) {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
        this.limits.clear();
        const opContext = context ||
            requestContextService.createRequestContext({
                operation: "RateLimiter.dispose",
            });
        logger.info("Rate limiter disposed, cleanup timer stopped and limits cleared.", opContext);
    }
}
/**
 * Default configuration values for the rate limiter.
 */
RateLimiter.DEFAULT_CONFIG = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    errorMessage: "Rate limit exceeded. Please try again in {waitTime} seconds.",
    skipInDevelopment: false,
    cleanupInterval: 5 * 60 * 1000, // 5 minutes
};
/**
 * A default, shared instance of the `RateLimiter`.
 * This instance is configured with default settings (e.g., 100 requests per 15 minutes).
 * It can be reconfigured using `rateLimiter.configure()`.
 *
 * Example:
 * ```typescript
 * import { rateLimiter, RequestContext } from './rateLimiter';
 * import { requestContextService } from '../internal';
 *
 * const context: RequestContext = requestContextService.createRequestContext({ operation: 'MyApiCall' });
 * const userIp = '123.45.67.89';
 *
 * try {
 *   rateLimiter.check(userIp, context);
 *   // Proceed with operation
 * } catch (e) {
 *   if (e instanceof McpError && e.code === BaseErrorCode.RATE_LIMITED) {
 *     console.error("Rate limit hit:", e.message);
 *   } else {
 *     // Handle other errors
 *   }
 * }
 * ```
 */
export const rateLimiter = new RateLimiter({}); // Initialize with default or empty to use class defaults
