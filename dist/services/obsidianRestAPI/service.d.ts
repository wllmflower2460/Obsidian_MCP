/**
 * @module ObsidianRestApiService
 * @description
 * This module provides the core implementation for the Obsidian REST API service.
 * It encapsulates the logic for making authenticated requests to the API endpoints.
 */
import { RequestContext } from "../../utils/index.js";
import { ApiStatusResponse, // Import PatchOptions type
ComplexSearchResult, NoteJson, NoteStat, ObsidianCommand, PatchOptions, Period, SimpleSearchResult } from "./types.js";
export declare class ObsidianRestApiService {
    private axiosInstance;
    private apiKey;
    constructor();
    /**
     * Private helper to make requests and handle common errors.
     * @param config - Axios request configuration.
     * @param context - Request context for logging.
     * @param operationName - Name of the operation for logging context.
     * @returns The response data.
     * @throws {McpError} If the request fails.
     */
    private _request;
    /**
     * Checks the status and authentication of the Obsidian Local REST API.
     * @param context - The request context for logging and correlation.
     * @returns {Promise<ApiStatusResponse>} - The status object from the API.
     */
    checkStatus(context: RequestContext): Promise<ApiStatusResponse>;
    /**
     * Gets the content of a specific file in the vault.
     * @param filePath - Vault-relative path to the file.
     * @param format - 'markdown' or 'json' (for NoteJson).
     * @param context - Request context.
     * @returns The file content (string) or NoteJson object.
     */
    getFileContent(filePath: string, format: "markdown" | "json" | undefined, context: RequestContext): Promise<string | NoteJson>;
    /**
     * Updates (overwrites) the content of a file or creates it if it doesn't exist.
     * @param filePath - Vault-relative path to the file.
     * @param content - The new content for the file.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    updateFileContent(filePath: string, content: string, context: RequestContext): Promise<void>;
    /**
     * Appends content to the end of a file. Creates the file if it doesn't exist.
     * @param filePath - Vault-relative path to the file.
     * @param content - The content to append.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    appendFileContent(filePath: string, content: string, context: RequestContext): Promise<void>;
    /**
     * Deletes a specific file in the vault.
     * @param filePath - Vault-relative path to the file.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    deleteFile(filePath: string, context: RequestContext): Promise<void>;
    /**
     * Lists files within a specified directory in the vault.
     * @param dirPath - Vault-relative path to the directory. Use empty string "" or "/" for the root.
     * @param context - Request context.
     * @returns A list of file and directory names.
     */
    listFiles(dirPath: string, context: RequestContext): Promise<string[]>;
    /**
     * Gets the metadata (stat) of a specific file using a lightweight HEAD request.
     * @param filePath - Vault-relative path to the file.
     * @param context - Request context.
     * @returns The file's metadata.
     */
    getFileMetadata(filePath: string, context: RequestContext): Promise<NoteStat | null>;
    /**
     * Performs a simple text search across the vault.
     * @param query - The text query string.
     * @param contextLength - Number of characters surrounding each match (default 100).
     * @param context - Request context.
     * @returns An array of search results.
     */
    searchSimple(query: string, contextLength: number | undefined, context: RequestContext): Promise<SimpleSearchResult[]>;
    /**
     * Performs a complex search using Dataview DQL or JsonLogic.
     * @param query - The query string (DQL) or JSON object (JsonLogic).
     * @param contentType - The content type header indicating the query format.
     * @param context - Request context.
     * @returns An array of search results.
     */
    searchComplex(query: string | object, contentType: "application/vnd.olrapi.dataview.dql+txt" | "application/vnd.olrapi.jsonlogic+json", context: RequestContext): Promise<ComplexSearchResult[]>;
    /**
     * Executes a registered Obsidian command by its ID.
     * @param commandId - The ID of the command (e.g., "app:go-back").
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    executeCommand(commandId: string, context: RequestContext): Promise<void>;
    /**
     * Lists all available Obsidian commands.
     * @param context - Request context.
     * @returns A list of available commands.
     */
    listCommands(context: RequestContext): Promise<ObsidianCommand[]>;
    /**
     * Opens a specific file in Obsidian. Creates the file if it doesn't exist.
     * @param filePath - Vault-relative path to the file.
     * @param newLeaf - Whether to open the file in a new editor tab (leaf).
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (200 OK, but no body expected).
     */
    openFile(filePath: string, newLeaf: boolean | undefined, context: RequestContext): Promise<void>;
    /**
     * Gets the content of the currently active file in Obsidian.
     * @param format - 'markdown' or 'json' (for NoteJson).
     * @param context - Request context.
     * @returns The file content (string) or NoteJson object.
     */
    getActiveFile(format: "markdown" | "json" | undefined, context: RequestContext): Promise<string | NoteJson>;
    /**
     * Updates (overwrites) the content of the currently active file.
     * @param content - The new content.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    updateActiveFile(content: string, context: RequestContext): Promise<void>;
    /**
     * Appends content to the end of the currently active file.
     * @param content - The content to append.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    appendActiveFile(content: string, context: RequestContext): Promise<void>;
    /**
     * Deletes the currently active file.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    deleteActiveFile(context: RequestContext): Promise<void>;
    /**
     * Gets the content of a periodic note (daily, weekly, etc.).
     * @param period - The period type ('daily', 'weekly', 'monthly', 'quarterly', 'yearly').
     * @param format - 'markdown' or 'json'.
     * @param context - Request context.
     * @returns The note content or NoteJson.
     */
    getPeriodicNote(period: Period, format: "markdown" | "json" | undefined, context: RequestContext): Promise<string | NoteJson>;
    /**
     * Updates (overwrites) the content of a periodic note. Creates if needed.
     * @param period - The period type.
     * @param content - The new content.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    updatePeriodicNote(period: Period, content: string, context: RequestContext): Promise<void>;
    /**
     * Appends content to a periodic note. Creates if needed.
     * @param period - The period type.
     * @param content - The content to append.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    appendPeriodicNote(period: Period, content: string, context: RequestContext): Promise<void>;
    /**
     * Deletes a periodic note.
     * @param period - The period type.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (204 No Content).
     */
    deletePeriodicNote(period: Period, context: RequestContext): Promise<void>;
    /**
     * Patches a specific file in the vault using granular controls.
     * @param filePath - Vault-relative path to the file.
     * @param content - The content to insert/replace (string or JSON for tables/frontmatter).
     * @param options - Patch operation details (operation, targetType, target, etc.).
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (200 OK).
     */
    patchFile(filePath: string, content: string | object, options: PatchOptions, context: RequestContext): Promise<void>;
    /**
     * Patches the currently active file in Obsidian using granular controls.
     * @param content - The content to insert/replace.
     * @param options - Patch operation details.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (200 OK).
     */
    patchActiveFile(content: string | object, options: PatchOptions, context: RequestContext): Promise<void>;
    /**
     * Patches a periodic note using granular controls.
     * @param period - The period type ('daily', 'weekly', etc.).
     * @param content - The content to insert/replace.
     * @param options - Patch operation details.
     * @param context - Request context.
     * @returns {Promise<void>} Resolves on success (200 OK).
     */
    patchPeriodicNote(period: Period, content: string | object, options: PatchOptions, context: RequestContext): Promise<void>;
}
