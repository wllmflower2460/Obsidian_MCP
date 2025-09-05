import { z } from "zod";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
/**
 * Zod schema used for registering the tool with the MCP SDK (`server.tool`).
 * This schema defines the expected input structure from the client's perspective.
 * It flattens the structure slightly by making mode-specific fields optional at this stage,
 * relying on the refined schema (`ObsidianUpdateFileInputSchema`) for stricter validation
 * within the handler logic.
 */
declare const ObsidianUpdateNoteRegistrationSchema: z.ZodObject<{
    /** Specifies the target note: 'filePath' (requires targetIdentifier), 'activeFile' (currently open file), or 'periodicNote' (requires targetIdentifier with period like 'daily'). */
    targetType: z.ZodEnum<["filePath", "activeFile", "periodicNote"]>;
    /** The content for the modification. Must be a string for whole-file operations. */
    content: z.ZodString;
    /** Identifier for the target when targetType is 'filePath' (vault-relative path, e.g., 'Notes/My File.md') or 'periodicNote' (period string: 'daily', 'weekly', etc.). Not used for 'activeFile'. */
    targetIdentifier: z.ZodOptional<z.ZodString>;
    /** Determines the modification strategy: must be 'wholeFile'. */
    modificationType: z.ZodLiteral<"wholeFile">;
    /** For 'wholeFile' mode: 'append', 'prepend', or 'overwrite'. Required if modificationType is 'wholeFile'. */
    wholeFileMode: z.ZodOptional<z.ZodEnum<["append", "prepend", "overwrite"]>>;
    /** For 'wholeFile' mode: If true (default), creates the target file/note if it doesn't exist before modifying. If false, fails if the target doesn't exist. */
    createIfNeeded: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** For 'wholeFile' mode with 'overwrite': If false (default), the operation fails if the target file already exists. If true, allows overwriting the existing file. */
    overwriteIfExists: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, returns the final content of the file in the response. Defaults to false. */
    returnContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    targetType: "filePath" | "activeFile" | "periodicNote";
    returnContent: boolean;
    modificationType: "wholeFile";
    createIfNeeded: boolean;
    overwriteIfExists: boolean;
    targetIdentifier?: string | undefined;
    wholeFileMode?: "append" | "prepend" | "overwrite" | undefined;
}, {
    content: string;
    targetType: "filePath" | "activeFile" | "periodicNote";
    modificationType: "wholeFile";
    targetIdentifier?: string | undefined;
    returnContent?: boolean | undefined;
    wholeFileMode?: "append" | "prepend" | "overwrite" | undefined;
    createIfNeeded?: boolean | undefined;
    overwriteIfExists?: boolean | undefined;
}>;
/**
 * The shape of the registration schema, used by `server.tool` for basic validation.
 * @see ObsidianUpdateFileRegistrationSchema
 */
export declare const ObsidianUpdateNoteInputSchemaShape: {
    /** Specifies the target note: 'filePath' (requires targetIdentifier), 'activeFile' (currently open file), or 'periodicNote' (requires targetIdentifier with period like 'daily'). */
    targetType: z.ZodEnum<["filePath", "activeFile", "periodicNote"]>;
    /** The content for the modification. Must be a string for whole-file operations. */
    content: z.ZodString;
    /** Identifier for the target when targetType is 'filePath' (vault-relative path, e.g., 'Notes/My File.md') or 'periodicNote' (period string: 'daily', 'weekly', etc.). Not used for 'activeFile'. */
    targetIdentifier: z.ZodOptional<z.ZodString>;
    /** Determines the modification strategy: must be 'wholeFile'. */
    modificationType: z.ZodLiteral<"wholeFile">;
    /** For 'wholeFile' mode: 'append', 'prepend', or 'overwrite'. Required if modificationType is 'wholeFile'. */
    wholeFileMode: z.ZodOptional<z.ZodEnum<["append", "prepend", "overwrite"]>>;
    /** For 'wholeFile' mode: If true (default), creates the target file/note if it doesn't exist before modifying. If false, fails if the target doesn't exist. */
    createIfNeeded: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** For 'wholeFile' mode with 'overwrite': If false (default), the operation fails if the target file already exists. If true, allows overwriting the existing file. */
    overwriteIfExists: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, returns the final content of the file in the response. Defaults to false. */
    returnContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
};
/**
 * TypeScript type inferred from the registration schema. Represents the raw input
 * received by the tool handler *before* refinement.
 * @see ObsidianUpdateFileRegistrationSchema
 */
export type ObsidianUpdateNoteRegistrationInput = z.infer<typeof ObsidianUpdateNoteRegistrationSchema>;
/**
 * Refined Zod schema used internally within the tool's logic for strict validation.
 * It builds upon `WholeFileUpdateSchema` and adds cross-field validation rules using `.refine()`.
 * This ensures that `targetIdentifier` is provided and valid when required by `targetType`.
 */
export declare const ObsidianUpdateNoteInputSchema: z.ZodEffects<z.ZodObject<{
    /** Specifies the type of target note. */
    targetType: z.ZodEnum<["filePath", "activeFile", "periodicNote"]>;
    /** The content to use for the modification. Must be a string for whole-file operations. */
    content: z.ZodString;
    /**
     * Identifier for the target. Required and must be a vault-relative path if targetType is 'filePath'.
     * Required and must be a valid period string (e.g., 'daily') if targetType is 'periodicNote'.
     * Not used if targetType is 'activeFile'.
     */
    targetIdentifier: z.ZodOptional<z.ZodString>;
} & {
    /** The modification type, fixed to 'wholeFile'. */
    modificationType: z.ZodLiteral<"wholeFile">;
    /** The specific whole-file operation ('append', 'prepend', 'overwrite'). */
    wholeFileMode: z.ZodEnum<["append", "prepend", "overwrite"]>;
    /** If true (default), creates the target file/note if it doesn't exist before applying the modification. If false, the operation fails if the target doesn't exist. */
    createIfNeeded: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** Only relevant for 'overwrite' mode. If true, allows overwriting an existing file. If false (default) and the file exists, the 'overwrite' operation fails. */
    overwriteIfExists: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, includes the final content of the modified file in the response. Defaults to false. */
    returnContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    targetType: "filePath" | "activeFile" | "periodicNote";
    returnContent: boolean;
    modificationType: "wholeFile";
    wholeFileMode: "append" | "prepend" | "overwrite";
    createIfNeeded: boolean;
    overwriteIfExists: boolean;
    targetIdentifier?: string | undefined;
}, {
    content: string;
    targetType: "filePath" | "activeFile" | "periodicNote";
    modificationType: "wholeFile";
    wholeFileMode: "append" | "prepend" | "overwrite";
    targetIdentifier?: string | undefined;
    returnContent?: boolean | undefined;
    createIfNeeded?: boolean | undefined;
    overwriteIfExists?: boolean | undefined;
}>, {
    content: string;
    targetType: "filePath" | "activeFile" | "periodicNote";
    returnContent: boolean;
    modificationType: "wholeFile";
    wholeFileMode: "append" | "prepend" | "overwrite";
    createIfNeeded: boolean;
    overwriteIfExists: boolean;
    targetIdentifier?: string | undefined;
}, {
    content: string;
    targetType: "filePath" | "activeFile" | "periodicNote";
    modificationType: "wholeFile";
    wholeFileMode: "append" | "prepend" | "overwrite";
    targetIdentifier?: string | undefined;
    returnContent?: boolean | undefined;
    createIfNeeded?: boolean | undefined;
    overwriteIfExists?: boolean | undefined;
}>;
/**
 * TypeScript type inferred from the *refined* input schema (`ObsidianUpdateFileInputSchema`).
 * This type represents the validated and structured input used within the core processing logic.
 */
export type ObsidianUpdateNoteInput = z.infer<typeof ObsidianUpdateNoteInputSchema>;
/**
 * Represents the structure of file statistics after formatting, including
 * human-readable timestamps and an estimated token count.
 */
type FormattedStat = {
    /** Creation time formatted as a standard date-time string. */
    createdTime: string;
    /** Last modified time formatted as a standard date-time string. */
    modifiedTime: string;
    /** Estimated token count of the file content (using tiktoken 'gpt-4o'). */
    tokenCountEstimate: number;
};
/**
 * Defines the structure of the successful response returned by the `processObsidianUpdateFile` function.
 * This object is typically serialized to JSON and sent back to the client.
 */
export interface ObsidianUpdateNoteResponse {
    /** Indicates whether the operation was successful. */
    success: boolean;
    /** A human-readable message describing the outcome of the operation. */
    message: string;
    /** Optional file statistics (creation/modification times, token count) if the file could be read after the update. */
    stats?: FormattedStat;
    /** Optional final content of the file, included only if `returnContent` was true in the request and the file could be read. */
    finalContent?: string;
}
/**
 * Processes the core logic for the 'obsidian_update_file' tool when using the 'wholeFile'
 * modification type (append, prepend, overwrite). It handles pre-checks, performs the
 * update via the Obsidian REST API, retrieves the final state, and constructs the response.
 *
 * @param {ObsidianUpdateFileInput} params - The validated input parameters conforming to the refined schema.
 * @param {RequestContext} context - The request context for logging and correlation.
 * @param {ObsidianRestApiService} obsidianService - The instance of the Obsidian REST API service.
 * @returns {Promise<ObsidianUpdateFileResponse>} A promise resolving to the structured success response.
 * @throws {McpError} Throws an McpError if validation fails or the API interaction results in an error.
 */
export declare const processObsidianUpdateNote: (params: ObsidianUpdateNoteInput, // Use the refined, validated type
context: RequestContext, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<ObsidianUpdateNoteResponse>;
export {};
