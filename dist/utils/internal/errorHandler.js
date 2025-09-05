/**
 * @fileoverview This module provides utilities for robust error handling.
 * It defines structures for error context, options for handling errors,
 * and mappings for classifying errors. The main `ErrorHandler` class
 * offers static methods for consistent error processing, logging, and transformation.
 * @module src/utils/internal/errorHandler
 */
import { BaseErrorCode, McpError } from "../../types-global/errors.js";
import { generateUUID, sanitizeInputForLogging } from "../index.js"; // Import from main barrel file
import { logger } from "./logger.js";
/**
 * Maps standard JavaScript error constructor names to `BaseErrorCode` values.
 * @private
 */
const ERROR_TYPE_MAPPINGS = {
    SyntaxError: BaseErrorCode.VALIDATION_ERROR,
    TypeError: BaseErrorCode.VALIDATION_ERROR,
    ReferenceError: BaseErrorCode.INTERNAL_ERROR,
    RangeError: BaseErrorCode.VALIDATION_ERROR,
    URIError: BaseErrorCode.VALIDATION_ERROR,
    EvalError: BaseErrorCode.INTERNAL_ERROR,
};
/**
 * Array of `BaseErrorMapping` rules to classify errors by message/name patterns.
 * Order matters: more specific patterns should precede generic ones.
 * @private
 */
const COMMON_ERROR_PATTERNS = [
    {
        pattern: /auth|unauthorized|unauthenticated|not.*logged.*in|invalid.*token|expired.*token/i,
        errorCode: BaseErrorCode.UNAUTHORIZED,
    },
    {
        pattern: /permission|forbidden|access.*denied|not.*allowed/i,
        errorCode: BaseErrorCode.FORBIDDEN,
    },
    {
        pattern: /not found|missing|no such|doesn't exist|couldn't find/i,
        errorCode: BaseErrorCode.NOT_FOUND,
    },
    {
        pattern: /invalid|validation|malformed|bad request|wrong format|missing required/i,
        errorCode: BaseErrorCode.VALIDATION_ERROR,
    },
    {
        pattern: /conflict|already exists|duplicate|unique constraint/i,
        errorCode: BaseErrorCode.CONFLICT,
    },
    {
        pattern: /rate limit|too many requests|throttled/i,
        errorCode: BaseErrorCode.RATE_LIMITED,
    },
    {
        pattern: /timeout|timed out|deadline exceeded/i,
        errorCode: BaseErrorCode.TIMEOUT,
    },
    {
        pattern: /service unavailable|bad gateway|gateway timeout|upstream error/i,
        errorCode: BaseErrorCode.SERVICE_UNAVAILABLE,
    },
];
/**
 * Creates a "safe" RegExp for testing error messages.
 * Ensures case-insensitivity and removes the global flag.
 * @param pattern - The string or RegExp pattern.
 * @returns A new RegExp instance.
 * @private
 */
function createSafeRegex(pattern) {
    if (pattern instanceof RegExp) {
        let flags = pattern.flags.replace("g", "");
        if (!flags.includes("i")) {
            flags += "i";
        }
        return new RegExp(pattern.source, flags);
    }
    return new RegExp(pattern, "i");
}
/**
 * Retrieves a descriptive name for an error object or value.
 * @param error - The error object or value.
 * @returns A string representing the error's name or type.
 * @private
 */
function getErrorName(error) {
    if (error instanceof Error) {
        return error.name || "Error";
    }
    if (error === null) {
        return "NullValueEncountered";
    }
    if (error === undefined) {
        return "UndefinedValueEncountered";
    }
    if (typeof error === "object" &&
        error !== null &&
        error.constructor &&
        typeof error.constructor.name === "string" &&
        error.constructor.name !== "Object") {
        return `${error.constructor.name}Encountered`;
    }
    return `${typeof error}Encountered`;
}
/**
 * Extracts a message string from an error object or value.
 * @param error - The error object or value.
 * @returns The error message string.
 * @private
 */
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (error === null) {
        return "Null value encountered as error";
    }
    if (error === undefined) {
        return "Undefined value encountered as error";
    }
    if (typeof error === "string") {
        return error;
    }
    try {
        const str = String(error);
        if (str === "[object Object]" && error !== null) {
            try {
                return `Non-Error object encountered: ${JSON.stringify(error)}`;
            }
            catch (stringifyError) {
                return `Unstringifyable non-Error object encountered (constructor: ${error.constructor?.name || "Unknown"})`;
            }
        }
        return str;
    }
    catch (e) {
        return `Error converting error to string: ${e instanceof Error ? e.message : "Unknown conversion error"}`;
    }
}
/**
 * A utility class providing static methods for comprehensive error handling.
 */
export class ErrorHandler {
    /**
     * Determines an appropriate `BaseErrorCode` for a given error.
     * Checks `McpError` instances, `ERROR_TYPE_MAPPINGS`, and `COMMON_ERROR_PATTERNS`.
     * Defaults to `BaseErrorCode.INTERNAL_ERROR`.
     * @param error - The error instance or value to classify.
     * @returns The determined error code.
     */
    static determineErrorCode(error) {
        if (error instanceof McpError) {
            return error.code;
        }
        const errorName = getErrorName(error);
        const errorMessage = getErrorMessage(error);
        if (errorName in ERROR_TYPE_MAPPINGS) {
            return ERROR_TYPE_MAPPINGS[errorName];
        }
        for (const mapping of COMMON_ERROR_PATTERNS) {
            const regex = createSafeRegex(mapping.pattern);
            if (regex.test(errorMessage) || regex.test(errorName)) {
                return mapping.errorCode;
            }
        }
        return BaseErrorCode.INTERNAL_ERROR;
    }
    /**
     * Handles an error with consistent logging and optional transformation.
     * Sanitizes input, determines error code, logs details, and can rethrow.
     * @param error - The error instance or value that occurred.
     * @param options - Configuration for handling the error.
     * @returns The handled (and potentially transformed) error instance.
     */
    static handleError(error, options) {
        const { context = {}, operation, input, rethrow = false, errorCode: explicitErrorCode, includeStack = true, critical = false, errorMapper, } = options;
        const sanitizedInput = input !== undefined ? sanitizeInputForLogging(input) : undefined;
        const originalErrorName = getErrorName(error);
        const originalErrorMessage = getErrorMessage(error);
        const originalStack = error instanceof Error ? error.stack : undefined;
        let finalError;
        let loggedErrorCode;
        const errorDetailsSeed = error instanceof McpError &&
            typeof error.details === "object" &&
            error.details !== null
            ? { ...error.details }
            : {};
        const consolidatedDetails = {
            ...errorDetailsSeed,
            ...context, // Spread context here to allow its properties to be overridden by more specific error details if needed
            originalErrorName,
            originalMessage: originalErrorMessage,
        };
        if (originalStack &&
            !(error instanceof McpError && error.details?.originalStack) // Avoid duplicating if already in McpError details
        ) {
            consolidatedDetails.originalStack = originalStack;
        }
        if (error instanceof McpError) {
            loggedErrorCode = error.code;
            // If an errorMapper is provided, use it. Otherwise, reconstruct McpError with consolidated details.
            finalError = errorMapper
                ? errorMapper(error)
                : new McpError(error.code, error.message, consolidatedDetails);
        }
        else {
            loggedErrorCode =
                explicitErrorCode || ErrorHandler.determineErrorCode(error);
            const message = `Error in ${operation}: ${originalErrorMessage}`;
            finalError = errorMapper
                ? errorMapper(error)
                : new McpError(loggedErrorCode, message, consolidatedDetails);
        }
        // Preserve stack trace if the error was transformed but the new error doesn't have one
        if (finalError !== error && // if error was transformed
            error instanceof Error && // original was an Error
            finalError instanceof Error && // final is an Error
            !finalError.stack && // final has no stack
            error.stack // original had a stack
        ) {
            finalError.stack = error.stack;
        }
        const logRequestId = typeof context.requestId === "string" && context.requestId
            ? context.requestId
            : generateUUID(); // Generate if not provided in context
        const logTimestamp = typeof context.timestamp === "string" && context.timestamp
            ? context.timestamp
            : new Date().toISOString(); // Generate if not provided
        // Prepare log payload, ensuring RequestContext properties are at the top level for logger
        const logPayload = {
            requestId: logRequestId,
            timestamp: logTimestamp,
            operation,
            input: sanitizedInput,
            critical,
            errorCode: loggedErrorCode,
            originalErrorType: originalErrorName, // Renamed from originalErrorName for clarity in logs
            finalErrorType: getErrorName(finalError),
            // Spread remaining context properties, excluding what's already explicitly set
            ...Object.fromEntries(Object.entries(context).filter(([key]) => key !== "requestId" && key !== "timestamp")),
        };
        // Add detailed error information
        if (finalError instanceof McpError && finalError.details) {
            logPayload.errorDetails = finalError.details; // Already consolidated
        }
        else {
            // For non-McpErrors or McpErrors without details, use consolidatedDetails
            logPayload.errorDetails = consolidatedDetails;
        }
        if (includeStack) {
            const stack = finalError instanceof Error ? finalError.stack : originalStack;
            if (stack) {
                logPayload.stack = stack;
            }
        }
        // Log using the logger, casting logPayload to RequestContext for compatibility
        // The logger's `error` method expects a RequestContext as its second or third argument.
        logger.error(`Error in ${operation}: ${finalError.message || originalErrorMessage}`, finalError, // Pass the actual error object
        logPayload);
        if (rethrow) {
            throw finalError;
        }
        return finalError;
    }
    /**
     * Maps an error to a specific error type `T` based on `ErrorMapping` rules.
     * Returns original/default error if no mapping matches.
     * @template T The target error type, extending `Error`.
     * @param error - The error instance or value to map.
     * @param mappings - An array of mapping rules to apply.
     * @param defaultFactory - Optional factory for a default error if no mapping matches.
     * @returns The mapped error of type `T`, or the original/defaulted error.
     */
    static mapError(error, mappings, defaultFactory) {
        const errorMessage = getErrorMessage(error);
        const errorName = getErrorName(error);
        for (const mapping of mappings) {
            const regex = createSafeRegex(mapping.pattern);
            if (regex.test(errorMessage) || regex.test(errorName)) {
                return mapping.factory(error, mapping.additionalContext);
            }
        }
        if (defaultFactory) {
            return defaultFactory(error);
        }
        // Ensure a proper Error object is returned
        return error instanceof Error ? error : new Error(String(error));
    }
    /**
     * Formats an error into a consistent object structure for API responses or structured logging.
     * @param error - The error instance or value to format.
     * @returns A structured representation of the error.
     */
    static formatError(error) {
        if (error instanceof McpError) {
            return {
                code: error.code,
                message: error.message,
                details: typeof error.details === "object" && error.details !== null
                    ? error.details // Use existing details if they are an object
                    : {}, // Default to empty object if details are not suitable
            };
        }
        if (error instanceof Error) {
            return {
                code: ErrorHandler.determineErrorCode(error),
                message: error.message,
                details: { errorType: error.name || "Error" }, // Ensure errorType is always present
            };
        }
        // Handle non-Error types
        return {
            code: BaseErrorCode.UNKNOWN_ERROR,
            message: getErrorMessage(error), // Use helper to get a string message
            details: { errorType: getErrorName(error) }, // Use helper to get a type name
        };
    }
    /**
     * Safely executes a function (sync or async) and handles errors using `ErrorHandler.handleError`.
     * The error is always rethrown by default by `handleError` when `rethrow` is true.
     * @template T The expected return type of the function `fn`.
     * @param fn - The function to execute.
     * @param options - Error handling options (excluding `rethrow`, as it's forced to true).
     * @returns A promise resolving with the result of `fn` if successful.
     * @throws {McpError | Error} The error processed by `ErrorHandler.handleError`.
     * @example
     * ```typescript
     * async function fetchData(userId: string, context: RequestContext) {
     *   return ErrorHandler.tryCatch(
     *     async () => {
     *       const response = await fetch(`/api/users/${userId}`);
     *       if (!response.ok) throw new Error(`Failed to fetch user: ${response.status}`);
     *       return response.json();
     *     },
     *     { operation: 'fetchUserData', context, input: { userId } } // rethrow is implicitly true
     *   );
     * }
     * ```
     */
    static async tryCatch(fn, options) {
        try {
            // Await the promise if fn returns one, otherwise resolve directly.
            const result = fn();
            return await Promise.resolve(result);
        }
        catch (error) {
            // ErrorHandler.handleError will return the error to be thrown.
            // rethrow is true by default when calling handleError this way.
            throw ErrorHandler.handleError(error, { ...options, rethrow: true });
        }
    }
}
