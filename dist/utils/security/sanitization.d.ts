/**
 * @fileoverview Provides a comprehensive sanitization utility class for various input types,
 * including HTML, strings, URLs, file paths, JSON, and numbers. It also includes
 * functionality for redacting sensitive information from objects for safe logging.
 * @module src/utils/security/sanitization
 */
import sanitizeHtml from "sanitize-html";
import { RequestContext } from "../internal/index.js";
/**
 * Options for path sanitization, controlling how file paths are cleaned and validated.
 */
export interface PathSanitizeOptions {
    /**
     * If provided, restricts sanitized paths to be relative to this root directory.
     * Attempts to traverse above this root (e.g., using `../`) will result in an error.
     * The final sanitized path will be relative to this `rootDir`.
     */
    rootDir?: string;
    /**
     * If `true`, normalizes Windows-style backslashes (`\\`) to POSIX-style forward slashes (`/`).
     * Defaults to `false`.
     */
    toPosix?: boolean;
    /**
     * If `true`, allows absolute paths, subject to `rootDir` constraints if `rootDir` is also provided.
     * If `false` (default), absolute paths are converted to relative paths by removing leading slashes or drive letters.
     */
    allowAbsolute?: boolean;
}
/**
 * Information returned by the `sanitizePath` method, providing details about
 * the sanitization process and its outcome.
 */
export interface SanitizedPathInfo {
    /** The final sanitized and normalized path string. */
    sanitizedPath: string;
    /** The original path string passed to the function before any normalization or sanitization. */
    originalInput: string;
    /** Indicates if the input path was determined to be absolute after initial `path.normalize()`. */
    wasAbsolute: boolean;
    /**
     * Indicates if an initially absolute path was converted to a relative path
     * (typically because `options.allowAbsolute` was `false`).
     */
    convertedToRelative: boolean;
    /** The effective options (including defaults) that were used for sanitization. */
    optionsUsed: PathSanitizeOptions;
}
/**
 * Options for context-specific string sanitization using `sanitizeString`.
 */
export interface SanitizeStringOptions {
    /**
     * Specifies the context in which the string will be used, guiding the sanitization strategy.
     * - `'text'`: (Default) Strips all HTML tags, suitable for plain text content.
     * - `'html'`: Sanitizes for safe HTML embedding, using `allowedTags` and `allowedAttributes`.
     * - `'attribute'`: Sanitizes for use within an HTML attribute value (strips all tags).
     * - `'url'`: Validates and trims the string as a URL.
     * - `'javascript'`: **Disallowed.** Throws an error to prevent unsafe JavaScript sanitization.
     */
    context?: "text" | "html" | "attribute" | "url" | "javascript";
    /** Custom allowed HTML tags when `context` is `'html'`. Overrides default HTML sanitization tags. */
    allowedTags?: string[];
    /** Custom allowed HTML attributes per tag when `context` is `'html'`. Overrides default HTML sanitization attributes. */
    allowedAttributes?: Record<string, string[]>;
}
/**
 * Configuration options for HTML sanitization using `sanitizeHtml`.
 */
export interface HtmlSanitizeConfig {
    /** An array of allowed HTML tag names (e.g., `['p', 'a', 'strong']`). */
    allowedTags?: string[];
    /**
     * A map specifying allowed attributes for HTML tags.
     * Keys can be tag names (e.g., `'a'`) or `'*'` for global attributes.
     * Values are arrays of allowed attribute names (e.g., `{'a': ['href', 'title']}`).
     */
    allowedAttributes?: sanitizeHtml.IOptions["allowedAttributes"];
    /** If `true`, HTML comments (`<!-- ... -->`) are preserved. Defaults to `false`. */
    preserveComments?: boolean;
    /**
     * Custom rules for transforming tags during sanitization.
     * See `sanitize-html` documentation for `transformTags` options.
     */
    transformTags?: sanitizeHtml.IOptions["transformTags"];
}
/**
 * A singleton utility class for performing various input sanitization tasks.
 * It provides methods to clean and validate strings, HTML, URLs, file paths, JSON,
 * and numbers, and to redact sensitive data for logging.
 */
export declare class Sanitization {
    private static instance;
    private sensitiveFields;
    private defaultHtmlSanitizeConfig;
    private constructor();
    /**
     * Gets the singleton instance of the `Sanitization` class.
     * @returns {Sanitization} The singleton instance.
     */
    static getInstance(): Sanitization;
    /**
     * Sets or extends the list of field names considered sensitive for log redaction.
     * Field names are matched case-insensitively.
     * @param {string[]} fields - An array of field names to add to the sensitive list.
     * @param {RequestContext} [context] - Optional context for logging this configuration change.
     */
    setSensitiveFields(fields: string[], context?: RequestContext): void;
    /**
     * Retrieves a copy of the current list of sensitive field names used for log redaction.
     * @returns {string[]} An array of sensitive field names (all lowercase).
     */
    getSensitiveFields(): string[];
    /**
     * Sanitizes an HTML string by removing potentially malicious tags and attributes,
     * based on a configurable allow-list.
     * @param {string} input - The HTML string to sanitize.
     * @param {HtmlSanitizeConfig} [config] - Optional custom configuration for HTML sanitization.
     *   Overrides defaults for `allowedTags`, `allowedAttributes`, etc.
     * @returns {string} The sanitized HTML string. Returns an empty string if input is falsy.
     */
    sanitizeHtml(input: string, config?: HtmlSanitizeConfig): string;
    /**
     * Sanitizes a tag name by removing the leading '#' and replacing invalid characters.
     * @param {string} input - The tag string to sanitize.
     * @returns {string} The sanitized tag name.
     */
    sanitizeTagName(input: string): string;
    /**
  >>>>>>> REPLACE
     * Sanitizes a string based on its intended usage context (e.g., HTML, URL, plain text).
     *
     * **Security Note:** Using `context: 'javascript'` is explicitly disallowed and will throw an `McpError`.
     * This is to prevent accidental introduction of XSS vulnerabilities through ineffective sanitization
     * of JavaScript code. Proper contextual encoding or safer methods should be used for JavaScript.
     *
     * @param {string} input - The string to sanitize.
     * @param {SanitizeStringOptions} [options={}] - Options specifying the sanitization context
     *   and any context-specific parameters (like `allowedTags` for HTML).
     * @param {RequestContext} [contextForLogging] - Optional context for logging warnings or errors.
     * @returns {string} The sanitized string. Returns an empty string if input is falsy.
     * @throws {McpError} If `options.context` is `'javascript'`.
     */
    sanitizeString(input: string, options?: SanitizeStringOptions, contextForLogging?: RequestContext): string;
    /**
     * Sanitizes a URL string by validating its format and protocol.
     * @param {string} input - The URL string to sanitize.
     * @param {string[]} [allowedProtocols=['http', 'https']] - An array of allowed URL protocols (e.g., 'http', 'https', 'ftp').
     * @param {RequestContext} [contextForLogging] - Optional context for logging errors.
     * @returns {string} The sanitized and trimmed URL string.
     * @throws {McpError} If the URL is invalid, uses a disallowed protocol, or contains 'javascript:'.
     */
    sanitizeUrl(input: string, allowedProtocols?: string[], contextForLogging?: RequestContext): string;
    /**
     * Sanitizes a file path to prevent path traversal attacks and normalize its format.
     *
     * @param {string} input - The file path string to sanitize.
     * @param {PathSanitizeOptions} [options={}] - Options to control sanitization behavior (e.g., `rootDir`, `toPosix`).
     * @param {RequestContext} [contextForLogging] - Optional context for logging warnings or errors.
     * @returns {SanitizedPathInfo} An object containing the sanitized path and metadata about the sanitization.
     * @throws {McpError} If the path is invalid (e.g., empty, contains null bytes) or determined to be unsafe
     *   (e.g., attempts to traverse outside `rootDir` or current working directory if no `rootDir`).
     */
    sanitizePath(input: string, options?: PathSanitizeOptions, contextForLogging?: RequestContext): SanitizedPathInfo;
    /**
     * Sanitizes a JSON string by parsing it to validate its format.
     * Optionally checks if the JSON string's byte size exceeds a maximum limit.
     *
     * @template T The expected type of the parsed JSON object. Defaults to `unknown`.
     * @param {string} input - The JSON string to sanitize/validate.
     * @param {number} [maxSizeBytes] - Optional maximum allowed size of the JSON string in bytes.
     * @param {RequestContext} [contextForLogging] - Optional context for logging errors.
     * @returns {T} The parsed JavaScript object.
     * @throws {McpError} If the input is not a string, is not valid JSON, or exceeds `maxSizeBytes`.
     */
    sanitizeJson<T = unknown>(input: string, maxSizeBytes?: number, contextForLogging?: RequestContext): T;
    /**
     * Sanitizes a numeric input (number or string) by converting it to a number
     * and optionally clamping it within a specified min/max range.
     *
     * @param {number | string} input - The numeric value or string representation of a number.
     * @param {number} [min] - Optional minimum allowed value (inclusive).
     * @param {number} [max] - Optional maximum allowed value (inclusive).
     * @param {RequestContext} [contextForLogging] - Optional context for logging clamping or errors.
     * @returns {number} The sanitized (and potentially clamped) number.
     * @throws {McpError} If the input cannot be parsed into a valid, finite number.
     */
    sanitizeNumber(input: number | string, min?: number, max?: number, contextForLogging?: RequestContext): number;
    /**
     * Sanitizes an object or array for logging by deep cloning it and redacting fields
     * whose names (case-insensitively) match any of the configured sensitive field names.
     * Redacted fields are replaced with the string `'[REDACTED]'`.
     *
     * @param {unknown} input - The object, array, or other value to sanitize for logging.
     *   If input is not an object or array, it's returned as is.
     * @param {RequestContext} [contextForLogging] - Optional context for logging errors during sanitization.
     * @returns {unknown} A sanitized copy of the input, safe for logging.
     *   Returns `'[Log Sanitization Failed]'` if an unexpected error occurs during sanitization.
     */
    sanitizeForLogging(input: unknown, contextForLogging?: RequestContext): unknown;
    /**
     * Helper to convert attribute format for sanitize-html.
     * `sanitize-html` expects `allowedAttributes` in a specific format.
     * This method assumes the input `attrs` (from `SanitizeStringOptions`)
     * is already in the correct format or a compatible one.
     * @param {Record<string, string[]>} attrs - Attributes configuration.
     * @returns {sanitizeHtml.IOptions['allowedAttributes']} Attributes in `sanitize-html` format.
     * @private
     */
    private convertAttributesFormat;
    /**
     * Recursively redacts sensitive fields within an object or array.
     * This method modifies the input object/array in place.
     * @param {unknown} obj - The object or array to redact sensitive fields from.
     * @private
     */
    private redactSensitiveFields;
}
/**
 * A default, shared instance of the `Sanitization` class.
 * Use this instance for all sanitization tasks.
 *
 * Example:
 * ```typescript
 * import { sanitization, sanitizeInputForLogging } from './sanitization';
 *
 * const unsafeHtml = "<script>alert('xss')</script><p>Safe</p>";
 * const safeHtml = sanitization.sanitizeHtml(unsafeHtml);
 *
 * const sensitiveData = { password: '123', username: 'user' };
 * const safeLogData = sanitizeInputForLogging(sensitiveData);
 * // safeLogData will be { password: '[REDACTED]', username: 'user' }
 * ```
 */
export declare const sanitization: Sanitization;
/**
 * A convenience function that wraps `sanitization.sanitizeForLogging`.
 * Sanitizes an object or array for logging by redacting sensitive fields.
 *
 * @param {unknown} input - The data to sanitize for logging.
 * @param {RequestContext} [contextForLogging] - Optional context for logging errors during sanitization.
 * @returns {unknown} A sanitized copy of the input, safe for logging.
 */
export declare const sanitizeInputForLogging: (input: unknown, contextForLogging?: RequestContext) => unknown;
