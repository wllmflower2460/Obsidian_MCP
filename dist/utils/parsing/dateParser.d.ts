/**
 * @fileoverview Provides utilities for parsing natural language date strings
 * into Date objects or detailed parsing results using the 'chrono-node' library.
 * @module src/utils/parsing/dateParser
 */
import * as chrono from "chrono-node";
import { RequestContext } from "../internal/index.js";
/**
 * Parses a natural language date string (e.g., "tomorrow", "in 5 days", "2024-01-15")
 * into a JavaScript `Date` object.
 *
 * @async
 * @param {string} text - The natural language date string to parse.
 * @param {RequestContext} context - The request context for logging and error tracking.
 * @param {Date} [refDate] - Optional reference date for parsing relative date expressions.
 *   Defaults to the current date and time if not provided.
 * @returns {Promise<Date | null>} A promise that resolves to a `Date` object representing
 *   the parsed date, or `null` if `chrono-node` could not parse the input string into a date.
 * @throws {McpError} If an unexpected error occurs during the parsing process,
 *   an `McpError` with `BaseErrorCode.PARSING_ERROR` is thrown.
 */
declare function parseDateString(text: string, context: RequestContext, refDate?: Date): Promise<Date | null>;
/**
 * Parses a natural language date string and returns detailed parsing results,
 * including all components and their confidence levels, as provided by `chrono-node`.
 *
 * @async
 * @param {string} text - The natural language date string to parse.
 * @param {RequestContext} context - The request context for logging and error tracking.
 * @param {Date} [refDate] - Optional reference date for parsing relative date expressions.
 *   Defaults to the current date and time if not provided.
 * @returns {Promise<chrono.ParsedResult[]>} A promise that resolves to an array of
 *   `chrono.ParsedResult` objects. The array will be empty if no date components
 *   could be parsed from the input string.
 * @throws {McpError} If an unexpected error occurs during the parsing process,
 *   an `McpError` with `BaseErrorCode.PARSING_ERROR` is thrown.
 */
declare function parseDateStringDetailed(text: string, context: RequestContext, refDate?: Date): Promise<chrono.ParsedResult[]>;
/**
 * Provides methods for parsing natural language date strings.
 * - `parseToDate`: Parses a string to a single `Date` object or `null`.
 * - `getDetailedResults`: Provides comprehensive parsing results from `chrono-node`.
 */
export declare const dateParser: {
    /**
     * Parses a natural language date string into a `Date` object.
     * @see {@link parseDateString}
     */
    parseToDate: typeof parseDateString;
    /**
     * Parses a natural language date string and returns detailed `chrono.ParsedResult` objects.
     * @see {@link parseDateStringDetailed}
     */
    getDetailedResults: typeof parseDateStringDetailed;
};
export {};
