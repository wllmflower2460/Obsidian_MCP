import { z } from "zod";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
import { RequestContext } from "../../../utils/index.js";
/**
 * Base Zod schema object containing fields common to the search/replace tool input.
 * This is used as the foundation for both the registration shape and the refined internal schema.
 */
declare const BaseObsidianSearchReplaceInputSchema: z.ZodObject<{
    /** Specifies the target note: 'filePath', 'activeFile', or 'periodicNote'. */
    targetType: z.ZodEnum<["filePath", "activeFile", "periodicNote"]>;
    /**
     * Identifier for the target. Required and must be a vault-relative path if targetType is 'filePath'.
     * Required and must be a valid period string (e.g., 'daily') if targetType is 'periodicNote'.
     * Not used if targetType is 'activeFile'. The tool attempts a case-insensitive fallback if the exact filePath is not found.
     */
    targetIdentifier: z.ZodOptional<z.ZodString>;
    /** An array of one or more search/replace operations to perform sequentially on the note content. */
    replacements: z.ZodArray<z.ZodObject<{
        /** The exact string or regex pattern to search for within the note content. Cannot be empty. */
        search: z.ZodString;
        /** The string to replace each match with. An empty string effectively deletes the matched text. */
        replace: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        replace: string;
        search: string;
    }, {
        replace: string;
        search: string;
    }>, "many">;
    /** If true, treats the 'search' field in each replacement block as a JavaScript regular expression pattern. Defaults to false (exact string matching). */
    useRegex: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (default), replaces all occurrences matching each search pattern within the note. If false, replaces only the first occurrence of each pattern. */
    replaceAll: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (default), the search operation is case-sensitive. If false, it's case-insensitive. Applies to both string and regex searches. */
    caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (and useRegex is false), treats sequences of whitespace in the search string as matching one or more whitespace characters (\s+). Defaults to false. Cannot be true if useRegex is true. */
    flexibleWhitespace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, ensures the search term matches only whole words by implicitly adding word boundaries (\b) around the pattern (unless boundaries already exist in regex). Applies to both regex and non-regex modes. Defaults to false. */
    wholeWord: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, includes the final content of the modified file in the response. Defaults to false. */
    returnContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    caseSensitive: boolean;
    useRegex: boolean;
    targetType: "filePath" | "activeFile" | "periodicNote";
    replacements: {
        replace: string;
        search: string;
    }[];
    replaceAll: boolean;
    flexibleWhitespace: boolean;
    wholeWord: boolean;
    returnContent: boolean;
    targetIdentifier?: string | undefined;
}, {
    targetType: "filePath" | "activeFile" | "periodicNote";
    replacements: {
        replace: string;
        search: string;
    }[];
    caseSensitive?: boolean | undefined;
    useRegex?: boolean | undefined;
    targetIdentifier?: string | undefined;
    replaceAll?: boolean | undefined;
    flexibleWhitespace?: boolean | undefined;
    wholeWord?: boolean | undefined;
    returnContent?: boolean | undefined;
}>;
/**
 * Refined Zod schema used internally within the tool's logic for strict validation.
 * It builds upon `BaseObsidianSearchReplaceInputSchema` and adds cross-field validation rules:
 * 1. Ensures `targetIdentifier` is provided and valid when required by `targetType`.
 * 2. Ensures `flexibleWhitespace` is not used concurrently with `useRegex`.
 */
export declare const ObsidianSearchReplaceInputSchema: z.ZodEffects<z.ZodObject<{
    /** Specifies the target note: 'filePath', 'activeFile', or 'periodicNote'. */
    targetType: z.ZodEnum<["filePath", "activeFile", "periodicNote"]>;
    /**
     * Identifier for the target. Required and must be a vault-relative path if targetType is 'filePath'.
     * Required and must be a valid period string (e.g., 'daily') if targetType is 'periodicNote'.
     * Not used if targetType is 'activeFile'. The tool attempts a case-insensitive fallback if the exact filePath is not found.
     */
    targetIdentifier: z.ZodOptional<z.ZodString>;
    /** An array of one or more search/replace operations to perform sequentially on the note content. */
    replacements: z.ZodArray<z.ZodObject<{
        /** The exact string or regex pattern to search for within the note content. Cannot be empty. */
        search: z.ZodString;
        /** The string to replace each match with. An empty string effectively deletes the matched text. */
        replace: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        replace: string;
        search: string;
    }, {
        replace: string;
        search: string;
    }>, "many">;
    /** If true, treats the 'search' field in each replacement block as a JavaScript regular expression pattern. Defaults to false (exact string matching). */
    useRegex: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (default), replaces all occurrences matching each search pattern within the note. If false, replaces only the first occurrence of each pattern. */
    replaceAll: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (default), the search operation is case-sensitive. If false, it's case-insensitive. Applies to both string and regex searches. */
    caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (and useRegex is false), treats sequences of whitespace in the search string as matching one or more whitespace characters (\s+). Defaults to false. Cannot be true if useRegex is true. */
    flexibleWhitespace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, ensures the search term matches only whole words by implicitly adding word boundaries (\b) around the pattern (unless boundaries already exist in regex). Applies to both regex and non-regex modes. Defaults to false. */
    wholeWord: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, includes the final content of the modified file in the response. Defaults to false. */
    returnContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    caseSensitive: boolean;
    useRegex: boolean;
    targetType: "filePath" | "activeFile" | "periodicNote";
    replacements: {
        replace: string;
        search: string;
    }[];
    replaceAll: boolean;
    flexibleWhitespace: boolean;
    wholeWord: boolean;
    returnContent: boolean;
    targetIdentifier?: string | undefined;
}, {
    targetType: "filePath" | "activeFile" | "periodicNote";
    replacements: {
        replace: string;
        search: string;
    }[];
    caseSensitive?: boolean | undefined;
    useRegex?: boolean | undefined;
    targetIdentifier?: string | undefined;
    replaceAll?: boolean | undefined;
    flexibleWhitespace?: boolean | undefined;
    wholeWord?: boolean | undefined;
    returnContent?: boolean | undefined;
}>, {
    caseSensitive: boolean;
    useRegex: boolean;
    targetType: "filePath" | "activeFile" | "periodicNote";
    replacements: {
        replace: string;
        search: string;
    }[];
    replaceAll: boolean;
    flexibleWhitespace: boolean;
    wholeWord: boolean;
    returnContent: boolean;
    targetIdentifier?: string | undefined;
}, {
    targetType: "filePath" | "activeFile" | "periodicNote";
    replacements: {
        replace: string;
        search: string;
    }[];
    caseSensitive?: boolean | undefined;
    useRegex?: boolean | undefined;
    targetIdentifier?: string | undefined;
    replaceAll?: boolean | undefined;
    flexibleWhitespace?: boolean | undefined;
    wholeWord?: boolean | undefined;
    returnContent?: boolean | undefined;
}>;
/**
 * The shape of the base input schema, used by `server.tool` for registration and initial validation.
 * @see BaseObsidianSearchReplaceInputSchema
 */
export declare const ObsidianSearchReplaceInputSchemaShape: {
    /** Specifies the target note: 'filePath', 'activeFile', or 'periodicNote'. */
    targetType: z.ZodEnum<["filePath", "activeFile", "periodicNote"]>;
    /**
     * Identifier for the target. Required and must be a vault-relative path if targetType is 'filePath'.
     * Required and must be a valid period string (e.g., 'daily') if targetType is 'periodicNote'.
     * Not used if targetType is 'activeFile'. The tool attempts a case-insensitive fallback if the exact filePath is not found.
     */
    targetIdentifier: z.ZodOptional<z.ZodString>;
    /** An array of one or more search/replace operations to perform sequentially on the note content. */
    replacements: z.ZodArray<z.ZodObject<{
        /** The exact string or regex pattern to search for within the note content. Cannot be empty. */
        search: z.ZodString;
        /** The string to replace each match with. An empty string effectively deletes the matched text. */
        replace: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        replace: string;
        search: string;
    }, {
        replace: string;
        search: string;
    }>, "many">;
    /** If true, treats the 'search' field in each replacement block as a JavaScript regular expression pattern. Defaults to false (exact string matching). */
    useRegex: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (default), replaces all occurrences matching each search pattern within the note. If false, replaces only the first occurrence of each pattern. */
    replaceAll: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (default), the search operation is case-sensitive. If false, it's case-insensitive. Applies to both string and regex searches. */
    caseSensitive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true (and useRegex is false), treats sequences of whitespace in the search string as matching one or more whitespace characters (\s+). Defaults to false. Cannot be true if useRegex is true. */
    flexibleWhitespace: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, ensures the search term matches only whole words by implicitly adding word boundaries (\b) around the pattern (unless boundaries already exist in regex). Applies to both regex and non-regex modes. Defaults to false. */
    wholeWord: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** If true, includes the final content of the modified file in the response. Defaults to false. */
    returnContent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
};
/**
 * TypeScript type inferred from the base registration schema. Represents the raw input
 * received by the tool handler *before* refinement.
 * @see BaseObsidianSearchReplaceInputSchema
 */
export type ObsidianSearchReplaceRegistrationInput = z.infer<typeof BaseObsidianSearchReplaceInputSchema>;
/**
 * TypeScript type inferred from the *refined* input schema (`ObsidianSearchReplaceInputSchema`).
 * This type represents the validated and structured input used within the core processing logic.
 */
export type ObsidianSearchReplaceInput = z.infer<typeof ObsidianSearchReplaceInputSchema>;
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
 * Defines the structure of the successful response returned by the `processObsidianSearchReplace` function.
 * This object is typically serialized to JSON and sent back to the client.
 */
export interface ObsidianSearchReplaceResponse {
    /** Indicates whether the operation was successful. */
    success: boolean;
    /** A human-readable message describing the outcome of the operation (e.g., number of replacements). */
    message: string;
    /** The total number of replacements made across all search/replace blocks. */
    totalReplacementsMade: number;
    /** Optional file statistics (creation/modification times, token count) if the file could be read after the update. */
    stats?: FormattedStat;
    /** Optional final content of the file, included only if `returnContent` was true in the request. */
    finalContent?: string;
}
/**
 * Processes the core logic for the 'obsidian_search_replace' tool.
 * Reads the target note content, performs a sequence of search and replace operations
 * based on the provided parameters (handling regex, case sensitivity, etc.),
 * writes the modified content back to Obsidian, retrieves the final state,
 * and constructs the response object.
 *
 * @param {ObsidianSearchReplaceInput} params - The validated input parameters conforming to the refined schema.
 * @param {RequestContext} context - The request context for logging and correlation.
 * @param {ObsidianRestApiService} obsidianService - The instance of the Obsidian REST API service.
 * @returns {Promise<ObsidianSearchReplaceResponse>} A promise resolving to the structured success response.
 * @throws {McpError} Throws an McpError if validation fails, reading/writing fails, or an unexpected error occurs during processing.
 */
export declare const processObsidianSearchReplace: (params: ObsidianSearchReplaceInput, // Use the refined, validated type
context: RequestContext, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<ObsidianSearchReplaceResponse>;
export {};
