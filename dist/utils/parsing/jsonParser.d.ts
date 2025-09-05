/**
 * @fileoverview Provides a utility class for parsing potentially partial JSON strings,
 * with support for handling and logging optional LLM <think> blocks.
 * It wraps the 'partial-json' library.
 * @module src/utils/parsing/jsonParser
 */
import { RequestContext } from "../internal/index.js";
/**
 * Enum mirroring `partial-json`'s `Allow` constants. These constants specify
 * what types of partial JSON structures are permissible during parsing.
 * They can be combined using bitwise OR (e.g., `Allow.STR | Allow.OBJ`).
 *
 * - `Allow.OBJ`: Allows partial objects (e.g., `{"key": "value",`)
 * - `Allow.ARR`: Allows partial arrays (e.g., `[1, 2,`)
 * - `Allow.STR`: Allows partial strings (e.g., `"abc`)
 * - `Allow.NUM`: Allows partial numbers (e.g., `1.2e+`)
 * - `Allow.BOOL`: Allows partial booleans (e.g., `tru`)
 * - `Allow.NULL`: Allows partial nulls (e.g., `nul`)
 * - `Allow.ALL`: Allows all types of partial JSON structures (default).
 */
export declare const Allow: {
    STR: number;
    NUM: number;
    ARR: number;
    OBJ: number;
    NULL: number;
    BOOL: number;
    NAN: number;
    INFINITY: number;
    _INFINITY: number;
    INF: number;
    SPECIAL: number;
    ATOM: number;
    COLLECTION: number;
    ALL: number;
};
/**
 * Utility class for parsing JSON strings that may be partial or incomplete.
 * It wraps the 'partial-json' library to provide a consistent parsing interface
 * and includes logic to handle and log optional `<think>...</think>` blocks
 * that might precede the JSON content (often found in LLM outputs).
 */
declare class JsonParser {
    /**
     * Parses a JSON string, which may be partial or prefixed with an LLM `<think>` block.
     *
     * @template T The expected type of the parsed JavaScript value. Defaults to `any`.
     * @param {string} jsonString - The JSON string to parse.
     * @param {number} [allowPartial=Allow.ALL] - A bitwise OR combination of `Allow` constants
     *   specifying which types of partial JSON structures are permissible (e.g., `Allow.OBJ | Allow.ARR`).
     *   Defaults to `Allow.ALL`, permitting any form of partial JSON.
     * @param {RequestContext} [providedContext] - Optional `RequestContext` for logging,
     *   especially for capturing `<think>` block content or parsing errors.
     * @returns {T} The parsed JavaScript value.
     * @throws {McpError} Throws an `McpError` with `BaseErrorCode.VALIDATION_ERROR` if:
     *   - The string is empty after removing a `<think>` block.
     *   - The remaining content does not appear to be a valid JSON structure (object, array, or permitted primitive).
     *   - The `partial-json` library encounters a parsing error.
     */
    parse<T = any>(jsonString: string, allowPartial?: number, providedContext?: RequestContext): T;
}
/**
 * Singleton instance of the `JsonParser`.
 * Use this instance for all partial JSON parsing needs.
 *
 * Example:
 * ```typescript
 * import { jsonParser, Allow, RequestContext } from './jsonParser';
 * import { requestContextService } from '../internal'; // Assuming requestContextService is exported from internal utils
 * const context: RequestContext = requestContextService.createRequestContext({ operation: 'MyOperation' });
 * try {
 *   const data = jsonParser.parse('<think>Thinking...</think>{"key": "value", "arr": [1,', Allow.ALL, context);
 *   console.log(data); // Output: { key: "value", arr: [ 1 ] }
 * } catch (e) {
 *   console.error("Parsing failed:", e);
 * }
 * ```
 */
export declare const jsonParser: JsonParser;
export {};
