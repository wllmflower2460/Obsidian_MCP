/**
 * @fileoverview Core logic for the 'obsidian_list_notes' tool.
 * This module defines the input schema, response types, and processing logic for
 * recursively listing files and directories in an Obsidian vault with filtering.
 * @module src/mcp-server/tools/obsidianListNotesTool/logic
 */
import { z } from "zod";
import { ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
/**
 * Zod schema for validating the input parameters of the 'obsidian_list_notes' tool.
 */
export declare const ObsidianListNotesInputSchema: z.ZodObject<{
    /**
     * The vault-relative path to the directory whose contents should be listed.
     * The path is treated as case-sensitive by the underlying Obsidian API.
     */
    dirPath: z.ZodString;
    /**
     * Optional array of file extensions (including the leading dot) to filter the results.
     * Only files matching one of these extensions will be included. Directories are always included.
     */
    fileExtensionFilter: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /**
     * Optional JavaScript-compatible regular expression pattern string to filter results by name.
     * Only files and directories whose names match the regex will be included.
     */
    nameRegexFilter: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    /**
     * The maximum depth of subdirectories to list recursively.
     * - A value of `0` lists only the files and directories in the specified `dirPath`.
     * - A value of `1` lists the contents of `dirPath` and the contents of its immediate subdirectories.
     * - A value of `-1` (the default) indicates infinite recursion, listing all subdirectories.
     */
    recursionDepth: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    dirPath: string;
    recursionDepth: number;
    fileExtensionFilter?: string[] | undefined;
    nameRegexFilter?: string | null | undefined;
}, {
    dirPath: string;
    fileExtensionFilter?: string[] | undefined;
    nameRegexFilter?: string | null | undefined;
    recursionDepth?: number | undefined;
}>;
/**
 * TypeScript type inferred from the input schema (`ObsidianListNotesInputSchema`).
 */
export type ObsidianListNotesInput = z.infer<typeof ObsidianListNotesInputSchema>;
/**
 * Defines the structure of the successful response returned by the core logic function.
 */
export interface ObsidianListNotesResponse {
    directoryPath: string;
    tree: string;
    totalEntries: number;
}
/**
 * Processes the core logic for listing files and directories recursively within the Obsidian vault.
 *
 * @param {ObsidianListNotesInput} params - The validated input parameters.
 * @param {RequestContext} context - The request context for logging and correlation.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service.
 * @returns {Promise<ObsidianListNotesResponse>} A promise resolving to the structured success response.
 * @throws {McpError} Throws an McpError if the initial directory is not found or another error occurs.
 */
export declare const processObsidianListNotes: (params: ObsidianListNotesInput, context: RequestContext, obsidianService: ObsidianRestApiService) => Promise<ObsidianListNotesResponse>;
