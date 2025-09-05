/**
 * @fileoverview Centralized error handler for the Hono HTTP transport.
 * This middleware intercepts errors that occur during request processing,
 * standardizes them using the application's ErrorHandler utility, and
 * formats them into a consistent JSON-RPC error response.
 * @module src/mcp-server/transports/httpErrorHandler
 */
import { Context } from "hono";
import { BaseErrorCode } from "../../types-global/errors.js";
/**
 * A centralized error handling middleware for Hono.
 * This function is registered with `app.onError()` and will catch any errors
 * thrown from preceding middleware or route handlers.
 *
 * @param err - The error that was thrown.
 * @param c - The Hono context object for the request.
 * @returns A Response object containing the formatted JSON-RPC error.
 */
export declare const httpErrorHandler: (err: Error, c: Context) => Promise<Response & import("hono").TypedResponse<{
    jsonrpc: string;
    error: {
        code: number | BaseErrorCode;
        message: string;
    };
    id: string | number | null;
}, import("hono/utils/http-status").ContentfulStatusCode, "json">>;
