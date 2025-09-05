import { z } from "zod";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
/**
 * Zod schema for validating the input parameters of the 'obsidian_delete_note' tool.
 */
export declare const ObsidianDeleteNoteInputSchema: z.ZodObject<{
    /**
     * The vault-relative path to the file to be permanently deleted.
     * Must include the file extension (e.g., "Old Notes/Obsolete File.md").
     * The tool first attempts a case-sensitive match. If not found, it attempts
     * a case-insensitive fallback search within the same directory.
     */
    filePath: z.ZodString;
}, "strip", z.ZodTypeAny, {
    filePath: string;
}, {
    filePath: string;
}>;
/**
 * TypeScript type inferred from the input schema (`ObsidianDeleteNoteInputSchema`).
 * Represents the validated input parameters used within the core processing logic.
 */
export type ObsidianDeleteNoteInput = z.infer<typeof ObsidianDeleteNoteInputSchema>;
/**
 * Defines the structure of the successful response returned by the `processObsidianDeleteNote` function.
 * This object is typically serialized to JSON and sent back to the client.
 */
export interface ObsidianDeleteNoteResponse {
    /** Indicates whether the deletion operation was successful. */
    success: boolean;
    /** A human-readable message confirming the deletion and specifying the path used. */
    message: string;
}
/**
 * Processes the core logic for deleting a file from the Obsidian vault.
 *
 * It attempts to delete the file using the provided path (case-sensitive first).
 * If that fails with a 'NOT_FOUND' error, it attempts a case-insensitive fallback:
 * it lists the directory, finds a unique case-insensitive match for the filename,
 * and retries the deletion with the corrected path.
 *
 * @param {ObsidianDeleteNoteInput} params - The validated input parameters.
 * @param {RequestContext} context - The request context for logging and correlation.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service.
 * @returns {Promise<ObsidianDeleteNoteResponse>} A promise resolving to the structured success response
 *   containing a confirmation message.
 * @throws {McpError} Throws an McpError if the file cannot be found (even with fallback),
 *   if there's an ambiguous fallback match, or if any other API interaction fails.
 */
export declare const processObsidianDeleteNote: (params: ObsidianDeleteNoteInput, context: RequestContext, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<ObsidianDeleteNoteResponse>;
