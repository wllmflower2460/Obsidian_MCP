/**
 * @fileoverview Utilities for formatting Obsidian stat objects,
 * including timestamps and calculating estimated token counts.
 * @module src/utils/obsidian/obsidianStatUtils
 */
import { RequestContext } from "../internal/index.js";
/**
 * Formats a Unix timestamp (in milliseconds since the epoch) into a human-readable string.
 *
 * @param {number | undefined | null} timestampMs - The Unix timestamp in milliseconds.
 * @param {RequestContext} context - The request context for logging and error reporting.
 * @param {string} [formatString=DEFAULT_TIMESTAMP_FORMAT] - Optional format string adhering to `date-fns` tokens.
 *   Defaults to 'hh:mm:ss a | MM-dd-yyyy'.
 * @returns {string} The formatted timestamp string.
 * @throws {McpError} If the provided `timestampMs` is invalid (e.g., undefined, null, not a finite number, or results in an invalid Date object).
 */
export declare function formatTimestamp(timestampMs: number | undefined | null, context: RequestContext, formatString?: string): string;
/**
 * Represents the structure of an Obsidian API Stat object.
 */
export interface ObsidianStat {
    /** Creation time as a Unix timestamp (milliseconds). */
    ctime: number;
    /** Modification time as a Unix timestamp (milliseconds). */
    mtime: number;
    /** File size in bytes. */
    size: number;
}
/**
 * Represents formatted timestamp information derived from an Obsidian Stat object.
 */
export interface FormattedTimestamps {
    /** Human-readable creation time string. */
    createdTime: string;
    /** Human-readable modification time string. */
    modifiedTime: string;
}
/**
 * Formats the `ctime` (creation time) and `mtime` (modification time) from an
 * Obsidian API Stat object into human-readable strings.
 *
 * @param {ObsidianStat | undefined | null} stat - The Stat object from the Obsidian API.
 *   If undefined or null, placeholder strings ('N/A') are returned.
 * @param {RequestContext} context - The request context for logging and error reporting.
 * @returns {FormattedTimestamps} An object containing `createdTime` and `modifiedTime` strings.
 */
export declare function formatStatTimestamps(stat: ObsidianStat | undefined | null, context: RequestContext): FormattedTimestamps;
/**
 * Represents a fully formatted stat object, including human-readable timestamps
 * and an estimated token count for the file content.
 */
export interface FormattedStatWithTokenCount extends FormattedTimestamps {
    /** Estimated number of tokens in the file content. -1 if counting failed or content was empty. */
    tokenCountEstimate: number;
}
/**
 * Creates a formatted stat object that includes human-readable timestamps
 * (creation and modification times) and an estimated token count for the provided file content.
 *
 * @param {ObsidianStat | null | undefined} stat - The original Stat object from the Obsidian API.
 *   If null or undefined, the function will return the input value (null or undefined).
 * @param {string} content - The file content string from which to calculate the token count.
 * @param {RequestContext} context - The request context for logging and error reporting.
 * @returns {Promise<FormattedStatWithTokenCount | null | undefined>} A promise resolving to an object
 *   containing `createdTime`, `modifiedTime`, and `tokenCountEstimate`. Returns `null` or `undefined`
 *   if the input `stat` object was `null` or `undefined`, respectively.
 */
export declare function createFormattedStatWithTokenCount(stat: ObsidianStat | null | undefined, content: string, context: RequestContext): Promise<FormattedStatWithTokenCount | null | undefined>;
