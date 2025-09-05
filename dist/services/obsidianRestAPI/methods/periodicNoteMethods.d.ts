/**
 * @module PeriodicNoteMethods
 * @description
 * Methods for interacting with periodic notes (daily, weekly, etc.) via the Obsidian REST API.
 */
import { RequestContext } from "../../../utils/index.js";
import { NoteJson, Period, RequestFunction } from "../types.js";
/**
 * Gets the content of a periodic note (daily, weekly, etc.).
 * @param _request - The internal request function from the service instance.
 * @param period - The period type ('daily', 'weekly', 'monthly', 'quarterly', 'yearly').
 * @param format - 'markdown' or 'json'.
 * @param context - Request context.
 * @returns The note content or NoteJson.
 */
export declare function getPeriodicNote(_request: RequestFunction, period: Period, format: "markdown" | "json" | undefined, context: RequestContext): Promise<string | NoteJson>;
/**
 * Updates (overwrites) the content of a periodic note. Creates if needed.
 * @param _request - The internal request function from the service instance.
 * @param period - The period type.
 * @param content - The new content.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function updatePeriodicNote(_request: RequestFunction, period: Period, content: string, context: RequestContext): Promise<void>;
/**
 * Appends content to a periodic note. Creates if needed.
 * @param _request - The internal request function from the service instance.
 * @param period - The period type.
 * @param content - The content to append.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function appendPeriodicNote(_request: RequestFunction, period: Period, content: string, context: RequestContext): Promise<void>;
/**
 * Deletes a periodic note.
 * @param _request - The internal request function from the service instance.
 * @param period - The period type.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function deletePeriodicNote(_request: RequestFunction, period: Period, context: RequestContext): Promise<void>;
