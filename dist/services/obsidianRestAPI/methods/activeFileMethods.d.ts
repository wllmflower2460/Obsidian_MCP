/**
 * @module ActiveFileMethods
 * @description
 * Methods for interacting with the currently active file in Obsidian via the REST API.
 */
import { RequestContext } from "../../../utils/index.js";
import { NoteJson, RequestFunction } from "../types.js";
/**
 * Gets the content of the currently active file in Obsidian.
 * @param _request - The internal request function from the service instance.
 * @param format - 'markdown' or 'json' (for NoteJson).
 * @param context - Request context.
 * @returns The file content (string) or NoteJson object.
 */
export declare function getActiveFile(_request: RequestFunction, format: "markdown" | "json" | undefined, context: RequestContext): Promise<string | NoteJson>;
/**
 * Updates (overwrites) the content of the currently active file.
 * @param _request - The internal request function from the service instance.
 * @param content - The new content.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function updateActiveFile(_request: RequestFunction, content: string, context: RequestContext): Promise<void>;
/**
 * Appends content to the end of the currently active file.
 * @param _request - The internal request function from the service instance.
 * @param content - The content to append.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function appendActiveFile(_request: RequestFunction, content: string, context: RequestContext): Promise<void>;
/**
 * Deletes the currently active file.
 * @param _request - The internal request function from the service instance.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function deleteActiveFile(_request: RequestFunction, context: RequestContext): Promise<void>;
