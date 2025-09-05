/**
 * @fileoverview Provides a comprehensive sanitization utility class for various input types,
 * including HTML, strings, URLs, file paths, JSON, and numbers. It also includes
 * functionality for redacting sensitive information from objects for safe logging.
 * @module src/utils/security/sanitization
 */
import path from "path";
import sanitizeHtml from "sanitize-html";
import validator from "validator";
import { BaseErrorCode, McpError } from "../../types-global/errors.js";
import { logger, requestContextService, } from "../internal/index.js"; // Use internal index
/**
 * A singleton utility class for performing various input sanitization tasks.
 * It provides methods to clean and validate strings, HTML, URLs, file paths, JSON,
 * and numbers, and to redact sensitive data for logging.
 */
export class Sanitization {
    constructor() {
        this.sensitiveFields = [
            "password",
            "token",
            "secret",
            "key",
            "apiKey",
            "auth",
            "credential",
            "jwt",
            "ssn",
            "credit",
            "card",
            "cvv",
            "authorization",
            "passphrase",
            "privatekey", // Added more common sensitive field names
            "obsidianapikey", // Specific to this project potentially
        ];
        this.defaultHtmlSanitizeConfig = {
            allowedTags: [
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "p",
                "a",
                "ul",
                "ol",
                "li",
                "b",
                "i",
                "strong",
                "em",
                "strike",
                "code",
                "hr",
                "br",
                "div",
                "table",
                "thead",
                "tbody",
                "tr",
                "th",
                "td",
                "pre",
                "blockquote", // Added blockquote
            ],
            allowedAttributes: {
                a: ["href", "name", "target", "title"], // Added title for links
                img: ["src", "alt", "title", "width", "height"],
                "*": ["class", "id", "style", "data-*"], // Allow data-* attributes
            },
            preserveComments: false,
        };
        // Singleton constructor
    }
    /**
     * Gets the singleton instance of the `Sanitization` class.
     * @returns {Sanitization} The singleton instance.
     */
    static getInstance() {
        if (!Sanitization.instance) {
            Sanitization.instance = new Sanitization();
        }
        return Sanitization.instance;
    }
    /**
     * Sets or extends the list of field names considered sensitive for log redaction.
     * Field names are matched case-insensitively.
     * @param {string[]} fields - An array of field names to add to the sensitive list.
     * @param {RequestContext} [context] - Optional context for logging this configuration change.
     */
    setSensitiveFields(fields, context) {
        const opContext = context ||
            requestContextService.createRequestContext({
                operation: "Sanitization.setSensitiveFields",
            });
        this.sensitiveFields = [
            ...new Set([
                ...this.sensitiveFields,
                ...fields.map((f) => f.toLowerCase()),
            ]),
        ];
        logger.debug("Updated sensitive fields list for log redaction.", {
            ...opContext,
            newCount: this.sensitiveFields.length,
        });
    }
    /**
     * Retrieves a copy of the current list of sensitive field names used for log redaction.
     * @returns {string[]} An array of sensitive field names (all lowercase).
     */
    getSensitiveFields() {
        return [...this.sensitiveFields];
    }
    /**
     * Sanitizes an HTML string by removing potentially malicious tags and attributes,
     * based on a configurable allow-list.
     * @param {string} input - The HTML string to sanitize.
     * @param {HtmlSanitizeConfig} [config] - Optional custom configuration for HTML sanitization.
     *   Overrides defaults for `allowedTags`, `allowedAttributes`, etc.
     * @returns {string} The sanitized HTML string. Returns an empty string if input is falsy.
     */
    sanitizeHtml(input, config) {
        if (!input)
            return "";
        const effectiveConfig = { ...this.defaultHtmlSanitizeConfig, ...config };
        const options = {
            allowedTags: effectiveConfig.allowedTags,
            allowedAttributes: effectiveConfig.allowedAttributes,
            transformTags: effectiveConfig.transformTags,
        };
        if (effectiveConfig.preserveComments) {
            // Ensure '!--' is not duplicated if already present
            options.allowedTags = [
                ...new Set([...(options.allowedTags || []), "!--"]),
            ];
        }
        return sanitizeHtml(input, options);
    }
    /**
     * Sanitizes a tag name by removing the leading '#' and replacing invalid characters.
     * @param {string} input - The tag string to sanitize.
     * @returns {string} The sanitized tag name.
     */
    sanitizeTagName(input) {
        if (!input)
            return "";
        // Remove leading '#' and replace spaces/invalid characters with nothing
        return input.replace(/^#/, "").replace(/[\s#,\\?%*:|"<>]/g, "");
    }
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
    sanitizeString(input, options = {}, contextForLogging) {
        const opContext = contextForLogging ||
            requestContextService.createRequestContext({
                operation: "sanitizeString",
                inputContext: options.context,
            });
        if (!input)
            return "";
        switch (options.context) {
            case "html":
                return this.sanitizeHtml(input, {
                    allowedTags: options.allowedTags,
                    allowedAttributes: options.allowedAttributes
                        ? this.convertAttributesFormat(options.allowedAttributes)
                        : undefined,
                });
            case "attribute":
                // For HTML attributes, strip all tags. Values should be further encoded by the templating engine.
                return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
            case "url":
                // Validate and trim. Throws McpError on failure.
                try {
                    return this.sanitizeUrl(input, ["http", "https"], opContext); // Use sanitizeUrl for consistent validation
                }
                catch (urlError) {
                    logger.warning("Invalid URL detected during string sanitization (context: url).", {
                        ...opContext,
                        input,
                        error: urlError instanceof Error ? urlError.message : String(urlError),
                    });
                    return ""; // Return empty or rethrow, depending on desired strictness. Empty for now.
                }
            case "javascript":
                logger.error("Attempted JavaScript sanitization via sanitizeString, which is disallowed.", { ...opContext, inputPreview: input.substring(0, 100) });
                throw new McpError(BaseErrorCode.VALIDATION_ERROR, "JavaScript sanitization is not supported via sanitizeString due to security risks. Use appropriate contextual encoding or safer alternatives.", opContext);
            case "text":
            default:
                // Default to stripping all HTML for plain text contexts.
                return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
        }
    }
    /**
     * Sanitizes a URL string by validating its format and protocol.
     * @param {string} input - The URL string to sanitize.
     * @param {string[]} [allowedProtocols=['http', 'https']] - An array of allowed URL protocols (e.g., 'http', 'https', 'ftp').
     * @param {RequestContext} [contextForLogging] - Optional context for logging errors.
     * @returns {string} The sanitized and trimmed URL string.
     * @throws {McpError} If the URL is invalid, uses a disallowed protocol, or contains 'javascript:'.
     */
    sanitizeUrl(input, allowedProtocols = ["http", "https"], contextForLogging) {
        const opContext = contextForLogging ||
            requestContextService.createRequestContext({ operation: "sanitizeUrl" });
        try {
            if (!input || typeof input !== "string") {
                throw new Error("Invalid URL input: must be a non-empty string.");
            }
            const trimmedInput = input.trim();
            // Stricter check for 'javascript:' regardless of validator's protocol check
            if (trimmedInput.toLowerCase().startsWith("javascript:")) {
                throw new Error("JavaScript pseudo-protocol is explicitly disallowed.");
            }
            if (!validator.isURL(trimmedInput, {
                protocols: allowedProtocols,
                require_protocol: true,
            })) {
                throw new Error(`Invalid URL format or protocol not in allowed list: [${allowedProtocols.join(", ")}].`);
            }
            return trimmedInput;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Invalid or disallowed URL.";
            logger.warning(`URL sanitization failed: ${message}`, {
                ...opContext,
                input,
            });
            throw new McpError(BaseErrorCode.VALIDATION_ERROR, message, {
                ...opContext,
                input,
            });
        }
    }
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
    sanitizePath(input, options = {}, contextForLogging) {
        const opContext = contextForLogging ||
            requestContextService.createRequestContext({ operation: "sanitizePath" });
        const originalInput = input;
        const effectiveOptions = {
            toPosix: options.toPosix ?? false,
            allowAbsolute: options.allowAbsolute ?? false,
            rootDir: options.rootDir ? path.resolve(options.rootDir) : undefined, // Resolve rootDir upfront
        };
        let wasAbsoluteInitially = false;
        let convertedToRelative = false;
        try {
            if (!input || typeof input !== "string") {
                throw new Error("Invalid path input: must be a non-empty string.");
            }
            if (input.includes("\0")) {
                throw new Error("Path contains null byte, which is disallowed.");
            }
            let normalized = path.normalize(input); // Normalize first (e.g., 'a/b/../c' -> 'a/c')
            wasAbsoluteInitially = path.isAbsolute(normalized);
            if (effectiveOptions.toPosix) {
                normalized = normalized.replace(/\\/g, "/");
            }
            let finalSanitizedPath;
            if (effectiveOptions.rootDir) {
                // Resolve the input path against the root directory.
                // If 'normalized' is absolute, path.resolve treats it as the new root.
                // To correctly join, ensure 'normalized' is treated as relative to 'rootDir' if it's not already escaping.
                let tempPathForResolve = normalized;
                if (path.isAbsolute(normalized) && !effectiveOptions.allowAbsolute) {
                    // If absolute paths are not allowed, make it relative before resolving with rootDir
                    tempPathForResolve = normalized.replace(/^(?:[A-Za-z]:)?[/\\]+/, "");
                    convertedToRelative = true;
                }
                else if (path.isAbsolute(normalized) &&
                    effectiveOptions.allowAbsolute) {
                    // Absolute path is allowed, check if it's within rootDir
                    if (!normalized.startsWith(effectiveOptions.rootDir + path.sep) &&
                        normalized !== effectiveOptions.rootDir) {
                        throw new Error("Absolute path is outside the specified root directory.");
                    }
                    finalSanitizedPath = path.relative(effectiveOptions.rootDir, normalized);
                    finalSanitizedPath =
                        finalSanitizedPath === "" ? "." : finalSanitizedPath; // Handle case where path is rootDir itself
                    // Early return if absolute path is allowed and within root.
                    return {
                        sanitizedPath: finalSanitizedPath,
                        originalInput,
                        wasAbsolute: wasAbsoluteInitially,
                        convertedToRelative,
                        optionsUsed: effectiveOptions,
                    };
                }
                // If path was relative or made relative, join with rootDir
                const fullPath = path.resolve(effectiveOptions.rootDir, tempPathForResolve);
                if (!fullPath.startsWith(effectiveOptions.rootDir + path.sep) &&
                    fullPath !== effectiveOptions.rootDir) {
                    throw new Error("Path traversal detected: sanitized path escapes root directory.");
                }
                finalSanitizedPath = path.relative(effectiveOptions.rootDir, fullPath);
                finalSanitizedPath =
                    finalSanitizedPath === "" ? "." : finalSanitizedPath;
            }
            else {
                // No rootDir specified
                if (path.isAbsolute(normalized)) {
                    if (effectiveOptions.allowAbsolute) {
                        finalSanitizedPath = normalized; // Absolute path allowed
                    }
                    else {
                        // Convert to relative (strip leading slash/drive)
                        finalSanitizedPath = normalized.replace(/^(?:[A-Za-z]:)?[/\\]+/, "");
                        convertedToRelative = true;
                    }
                }
                else {
                    // Path is relative, and no rootDir
                    // For relative paths without a rootDir, ensure they don't traverse "above" the conceptual CWD.
                    // path.resolve('.') gives current working directory.
                    const resolvedAgainstCwd = path.resolve(normalized);
                    if (!resolvedAgainstCwd.startsWith(path.resolve("."))) {
                        // This check is a bit tricky because '..' is valid if it stays within CWD's subtree.
                        // A more robust check might involve comparing segments or ensuring it doesn't go "too high".
                        // For simplicity, if it resolves outside CWD's prefix, consider it traversal.
                        // This might be too strict for some use cases but safer for general utility.
                        // A common pattern is to check if path.relative(cwd, resolvedPath) starts with '..'.
                        if (path
                            .relative(path.resolve("."), resolvedAgainstCwd)
                            .startsWith("..")) {
                            throw new Error("Relative path traversal detected (escapes current working directory context).");
                        }
                    }
                    finalSanitizedPath = normalized;
                }
            }
            return {
                sanitizedPath: finalSanitizedPath,
                originalInput,
                wasAbsolute: wasAbsoluteInitially,
                convertedToRelative,
                optionsUsed: effectiveOptions,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Invalid or unsafe path.";
            logger.warning(`Path sanitization error: ${message}`, {
                ...opContext,
                input: originalInput,
                options: effectiveOptions,
                errorDetails: String(error),
            });
            throw new McpError(BaseErrorCode.VALIDATION_ERROR, message, {
                ...opContext,
                input: originalInput,
            });
        }
    }
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
    sanitizeJson(input, maxSizeBytes, contextForLogging) {
        const opContext = contextForLogging ||
            requestContextService.createRequestContext({ operation: "sanitizeJson" });
        try {
            if (typeof input !== "string") {
                throw new Error("Invalid input: expected a JSON string.");
            }
            if (maxSizeBytes !== undefined &&
                Buffer.byteLength(input, "utf8") > maxSizeBytes) {
                throw new McpError(// Throw McpError directly
                BaseErrorCode.VALIDATION_ERROR, `JSON content exceeds maximum allowed size of ${maxSizeBytes} bytes. Actual size: ${Buffer.byteLength(input, "utf8")} bytes.`, {
                    ...opContext,
                    size: Buffer.byteLength(input, "utf8"),
                    maxSize: maxSizeBytes,
                });
            }
            const parsed = JSON.parse(input);
            // Note: This function only validates JSON structure. It does not sanitize content within the JSON.
            // For deep sanitization of object values, additional logic would be needed.
            return parsed;
        }
        catch (error) {
            if (error instanceof McpError)
                throw error; // Re-throw if already McpError (e.g., size limit)
            const message = error instanceof Error ? error.message : "Invalid JSON format.";
            logger.warning(`JSON sanitization failed: ${message}`, {
                ...opContext,
                inputPreview: input.substring(0, 100),
                errorDetails: String(error),
            });
            throw new McpError(BaseErrorCode.VALIDATION_ERROR, message, {
                ...opContext,
                inputPreview: input.length > 100 ? `${input.substring(0, 100)}...` : input,
            });
        }
    }
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
    sanitizeNumber(input, min, max, contextForLogging) {
        const opContext = contextForLogging ||
            requestContextService.createRequestContext({
                operation: "sanitizeNumber",
            });
        let value;
        if (typeof input === "string") {
            const trimmedInput = input.trim();
            // Validator's isNumeric allows empty strings, so check explicitly.
            if (trimmedInput === "" || !validator.isNumeric(trimmedInput)) {
                throw new McpError(BaseErrorCode.VALIDATION_ERROR, "Invalid number format: string is not numeric or is empty.", { ...opContext, input });
            }
            value = parseFloat(trimmedInput);
        }
        else if (typeof input === "number") {
            value = input;
        }
        else {
            throw new McpError(BaseErrorCode.VALIDATION_ERROR, "Invalid input type: expected number or string.", { ...opContext, input: String(input) });
        }
        if (isNaN(value) || !isFinite(value)) {
            throw new McpError(BaseErrorCode.VALIDATION_ERROR, "Invalid number value (NaN or Infinity).", { ...opContext, input });
        }
        let clamped = false;
        let originalValueForLog = value; // Store original before clamping for logging
        if (min !== undefined && value < min) {
            value = min;
            clamped = true;
        }
        if (max !== undefined && value > max) {
            value = max;
            clamped = true;
        }
        if (clamped) {
            logger.debug("Number clamped to range.", {
                ...opContext,
                originalValue: originalValueForLog,
                min,
                max,
                finalValue: value,
            });
        }
        return value;
    }
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
    sanitizeForLogging(input, contextForLogging) {
        const opContext = contextForLogging ||
            requestContextService.createRequestContext({
                operation: "sanitizeForLogging",
            });
        try {
            // Primitives and null are returned as is.
            if (input === null || typeof input !== "object") {
                return input;
            }
            // Use structuredClone if available (Node.js >= 17), otherwise fallback to JSON parse/stringify.
            // JSON.parse(JSON.stringify(obj)) is a common way to deep clone, but has limitations
            // (e.g., loses functions, undefined, Date objects become strings).
            // For logging, this is often acceptable.
            const clonedInput = typeof structuredClone === "function"
                ? structuredClone(input)
                : JSON.parse(JSON.stringify(input));
            this.redactSensitiveFields(clonedInput);
            return clonedInput;
        }
        catch (error) {
            logger.error("Error during log sanitization process.", error instanceof Error ? error : undefined, {
                ...opContext,
                errorDetails: error instanceof Error ? error.message : String(error),
            });
            return "[Log Sanitization Failed]"; // Fallback string indicating sanitization failure
        }
    }
    /**
     * Helper to convert attribute format for sanitize-html.
     * `sanitize-html` expects `allowedAttributes` in a specific format.
     * This method assumes the input `attrs` (from `SanitizeStringOptions`)
     * is already in the correct format or a compatible one.
     * @param {Record<string, string[]>} attrs - Attributes configuration.
     * @returns {sanitizeHtml.IOptions['allowedAttributes']} Attributes in `sanitize-html` format.
     * @private
     */
    convertAttributesFormat(attrs) {
        // The type Record<string, string[]> is compatible with sanitizeHtml.IOptions['allowedAttributes']
        // which can be Record<string, Array<string | RegExp>> or boolean.
        // No complex conversion needed if options.allowedAttributes is already Record<string, string[]>.
        return attrs;
    }
    /**
     * Recursively redacts sensitive fields within an object or array.
     * This method modifies the input object/array in place.
     * @param {unknown} obj - The object or array to redact sensitive fields from.
     * @private
     */
    redactSensitiveFields(obj) {
        if (!obj || typeof obj !== "object") {
            return; // Not an object or array, or null
        }
        if (Array.isArray(obj)) {
            obj.forEach((item) => {
                // Recurse only if the item is an object (including nested arrays)
                if (item && typeof item === "object") {
                    this.redactSensitiveFields(item);
                }
            });
            return;
        }
        // It's an object (but not an array)
        for (const key in obj) {
            // Check if the property belongs to the object itself, not its prototype
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                const lowerKey = key.toLowerCase();
                // Special handling for non-serializable but non-sensitive objects
                if (key === "httpsAgent") {
                    obj[key] = "[HttpAgent Instance]";
                    continue; // Skip further processing for this key
                }
                // Check if the lowercase key includes any of the lowercase sensitive field terms
                const isSensitive = this.sensitiveFields.some((field) => lowerKey.includes(field));
                if (isSensitive) {
                    obj[key] = "[REDACTED]";
                }
                else if (value && typeof value === "object") {
                    // If the value is another object or array, recurse
                    this.redactSensitiveFields(value);
                }
            }
        }
    }
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
export const sanitization = Sanitization.getInstance();
/**
 * A convenience function that wraps `sanitization.sanitizeForLogging`.
 * Sanitizes an object or array for logging by redacting sensitive fields.
 *
 * @param {unknown} input - The data to sanitize for logging.
 * @param {RequestContext} [contextForLogging] - Optional context for logging errors during sanitization.
 * @returns {unknown} A sanitized copy of the input, safe for logging.
 */
export const sanitizeInputForLogging = (input, contextForLogging) => sanitization.sanitizeForLogging(input, contextForLogging);
