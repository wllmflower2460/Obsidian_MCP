import { RequestContext } from "./requestContext.js";
/**
 * Configuration for the {@link retryWithDelay} function, defining how retries are handled.
 */
export interface RetryConfig<T> {
    /**
     * A descriptive name for the operation being retried. Used in logging.
     * Example: "FetchUserData", "ProcessPayment".
     */
    operationName: string;
    /**
     * The request context associated with the operation, for logging and tracing.
     */
    context: RequestContext;
    /**
     * The maximum number of retry attempts before failing.
     */
    maxRetries: number;
    /**
     * The delay in milliseconds between retry attempts.
     */
    delayMs: number;
    /**
     * An optional function to determine if a retry should be attempted based on the error.
     * If not provided, retries will be attempted for any error.
     * @param error - The error that occurred during the operation.
     * @returns `true` if a retry should be attempted, `false` otherwise.
     */
    shouldRetry?: (error: unknown) => boolean;
    /**
     * An optional function to execute before each retry attempt.
     * Useful for custom logging or cleanup actions.
     * @param attempt - The current retry attempt number.
     * @param error - The error that triggered the retry.
     */
    onRetry?: (attempt: number, error: unknown) => void;
}
/**
 * Executes an asynchronous operation with a configurable retry mechanism.
 * This function will attempt the operation up to `maxRetries` times, with a specified
 * `delayMs` between attempts. It allows for custom logic to decide if an error
 * warrants a retry and for actions to be taken before each retry.
 *
 * @template T The expected return type of the asynchronous operation.
 * @param {() => Promise<T>} operation - The asynchronous function to execute.
 *   This function should return a Promise resolving to type `T`.
 * @param {RetryConfig<T>} config - Configuration options for the retry behavior,
 *   including operation name, context, retry limits, delay, and custom handlers.
 * @returns {Promise<T>} A promise that resolves with the result of the operation if successful.
 * @throws {McpError} Throws an `McpError` if the operation fails after all retry attempts,
 *   or if an unexpected error occurs during the retry logic. The error will contain details
 *   about the operation name, context, and the last encountered error.
 */
export declare function retryWithDelay<T>(operation: () => Promise<T>, config: RetryConfig<T>): Promise<T>;
