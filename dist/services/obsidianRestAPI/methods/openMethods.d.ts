/**
 * @module OpenMethods
 * @description
 * Methods for opening files in Obsidian via the REST API.
 */
import { RequestContext } from "../../../utils/index.js";
import { RequestFunction } from "../types.js";
/**
 * Opens a specific file in Obsidian. Creates the file if it doesn't exist.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param newLeaf - Whether to open the file in a new editor tab (leaf).
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (200 OK, but no body expected).
 */
export declare function openFile(_request: RequestFunction, filePath: string, newLeaf: boolean | undefined, context: RequestContext): Promise<void>;
