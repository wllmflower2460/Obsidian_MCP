/**
 * @module PatchMethods
 * @description
 * Methods for performing granular PATCH operations within notes via the Obsidian REST API.
 */
import { RequestContext } from "../../../utils/index.js";
import { PatchOptions, Period, RequestFunction } from "../types.js";
/**
 * Patches a specific file in the vault.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param content - The content to insert/replace (string or JSON for tables/frontmatter).
 * @param options - Patch operation details (operation, targetType, target, etc.).
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (200 OK).
 */
export declare function patchFile(_request: RequestFunction, filePath: string, content: string | object, // Allow object for JSON content type
options: PatchOptions, context: RequestContext): Promise<void>;
/**
 * Patches the currently active file in Obsidian.
 * @param _request - The internal request function from the service instance.
 * @param content - The content to insert/replace.
 * @param options - Patch operation details.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (200 OK).
 */
export declare function patchActiveFile(_request: RequestFunction, content: string | object, options: PatchOptions, context: RequestContext): Promise<void>;
/**
 * Patches a periodic note.
 * @param _request - The internal request function from the service instance.
 * @param period - The period type ('daily', 'weekly', etc.).
 * @param content - The content to insert/replace.
 * @param options - Patch operation details.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (200 OK).
 */
export declare function patchPeriodicNote(_request: RequestFunction, period: Period, content: string | object, options: PatchOptions, context: RequestContext): Promise<void>;
