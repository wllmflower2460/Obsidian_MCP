import { z } from "zod";
import { NoteJson, ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
/**
 * Zod schema for validating the input parameters of the 'obsidian_read_note' tool.
 */
export declare const ObsidianReadNoteInputSchema: z.ZodObject<{
    /**
     * The vault-relative path to the target file (e.g., "Folder/My Note.md").
     * Must include the file extension. The tool first attempts a case-sensitive match.
     * If not found, it attempts a case-insensitive fallback search within the same directory.
     */
    filePath: z.ZodString;
    /**
     * Specifies the desired format for the returned content.
     * 'markdown' returns the raw file content as a string.
     * 'json' returns a structured NoteJson object containing content, parsed frontmatter, tags, and file metadata (stat).
     * Defaults to 'markdown'.
     */
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["markdown", "json"]>>>;
    /**
     * If true and the requested format is 'markdown', includes formatted file statistics
     * (creation time, modification time, token count estimate) in the response's 'stat' field.
     * Defaults to false. This flag is ignored if the format is 'json', as stats are always included within the NoteJson object itself (and also added to the top-level 'stat' field in the response).
     */
    includeStat: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    includeStat: boolean;
    format?: "markdown" | "json" | undefined;
}, {
    filePath: string;
    format?: "markdown" | "json" | undefined;
    includeStat?: boolean | undefined;
}>;
/**
 * TypeScript type inferred from the input schema (`ObsidianReadNoteInputSchema`).
 * Represents the validated input parameters used within the core processing logic.
 */
export type ObsidianReadNoteInput = z.infer<typeof ObsidianReadNoteInputSchema>;
/**
 * Represents the structure of file statistics after formatting, including
 * human-readable timestamps and an estimated token count.
 */
type FormattedStat = {
    /** Creation time formatted as a standard date-time string (e.g., "05:29:00 PM | 05-03-2025"). */
    createdTime: string;
    /** Last modified time formatted as a standard date-time string (e.g., "05:29:00 PM | 05-03-2025"). */
    modifiedTime: string;
    /** Estimated token count of the file content (using tiktoken 'gpt-4o'). */
    tokenCountEstimate: number;
};
/**
 * Defines the structure of the successful response returned by the `processObsidianReadNote` function.
 * This object is typically serialized to JSON and sent back to the client.
 */
export interface ObsidianReadNoteResponse {
    /**
     * The content of the file in the requested format.
     * If format='markdown', this is a string.
     * If format='json', this is a NoteJson object (which also contains the content string and stats).
     */
    content: string | NoteJson;
    /**
     * Optional formatted file statistics.
     * Included if format='json', or if format='markdown' and includeStat=true.
     */
    stats?: FormattedStat;
}
/**
 * Processes the core logic for reading a file from the Obsidian vault.
 *
 * It attempts to read the file using the provided path (case-sensitive first,
 * then case-insensitive fallback). It always fetches the full NoteJson object
 * internally to access file statistics. Finally, it formats the response
 * according to the requested format ('markdown' or 'json') and the 'includeStat' flag.
 *
 * @param {ObsidianReadNoteInput} params - The validated input parameters.
 * @param {RequestContext} context - The request context for logging and correlation.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service.
 * @returns {Promise<ObsidianReadNoteResponse>} A promise resolving to the structured success response
 *   containing the file content and optionally formatted statistics.
 * @throws {McpError} Throws an McpError if the file cannot be found (even with fallback),
 *   if there's an ambiguous fallback match, or if any other API interaction fails.
 */
export declare const processObsidianReadNote: (params: ObsidianReadNoteInput, context: RequestContext, obsidianService: ObsidianRestApiService) => Promise<ObsidianReadNoteResponse>;
export {};
