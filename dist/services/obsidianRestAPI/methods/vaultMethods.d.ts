/**
 * @module VaultMethods
 * @description
 * Methods for interacting with vault files and directories via the Obsidian REST API.
 */
import { RequestContext } from "../../../utils/index.js";
import { NoteJson, NoteStat, RequestFunction } from "../types.js";
/**
 * Gets the content of a specific file in the vault.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param format - 'markdown' or 'json' (for NoteJson).
 * @param context - Request context.
 * @returns The file content (string) or NoteJson object.
 */
export declare function getFileContent(_request: RequestFunction, filePath: string, format: "markdown" | "json" | undefined, context: RequestContext): Promise<string | NoteJson>;
/**
 * Updates (overwrites) the content of a file or creates it if it doesn't exist.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param content - The new content for the file.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function updateFileContent(_request: RequestFunction, filePath: string, content: string, context: RequestContext): Promise<void>;
/**
 * Appends content to the end of a file. Creates the file if it doesn't exist.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param content - The content to append.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function appendFileContent(_request: RequestFunction, filePath: string, content: string, context: RequestContext): Promise<void>;
/**
 * Deletes a specific file in the vault.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function deleteFile(_request: RequestFunction, filePath: string, context: RequestContext): Promise<void>;
/**
 * Lists files within a specified directory in the vault.
 * @param _request - The internal request function from the service instance.
 * @param dirPath - Vault-relative path to the directory. Use empty string "" or "/" for the root.
 * @param context - Request context.
 * @returns A list of file and directory names.
 */
export declare function listFiles(_request: RequestFunction, dirPath: string, context: RequestContext): Promise<string[]>;
/**
 * Gets the metadata (stat) of a specific file using a lightweight HEAD request.
 * @param _request - The internal request function from the service instance.
 * @param filePath - Vault-relative path to the file.
 * @param context - Request context.
 * @returns The file's metadata.
 */
export declare function getFileMetadata(_request: RequestFunction, filePath: string, context: RequestContext): Promise<NoteStat | null>;
