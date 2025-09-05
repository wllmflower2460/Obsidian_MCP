import path from "node:path"; // Using POSIX path functions for vault path manipulation
import { z } from "zod";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { createFormattedStatWithTokenCount, logger, retryWithDelay, } from "../../../utils/index.js";
// ====================================================================================
// Schema Definitions for Input Validation
// ====================================================================================
/**
 * Defines the allowed formats for the returned file content.
 * - 'markdown': Returns the raw Markdown content as a string.
 * - 'json': Returns a structured NoteJson object including content, frontmatter, tags, and stats.
 */
const ReadNoteFormatSchema = z
    .enum(["markdown", "json"])
    .default("markdown")
    .describe("Specifies the format for the returned content ('markdown' or 'json'). Defaults to 'markdown'.");
/**
 * Zod schema for validating the input parameters of the 'obsidian_read_note' tool.
 */
export const ObsidianReadNoteInputSchema = z
    .object({
    /**
     * The vault-relative path to the target file (e.g., "Folder/My Note.md").
     * Must include the file extension. The tool first attempts a case-sensitive match.
     * If not found, it attempts a case-insensitive fallback search within the same directory.
     */
    filePath: z
        .string()
        .min(1, "filePath cannot be empty")
        .describe('The vault-relative path to the target file (e.g., "developer/github/tips.md"). Tries case-sensitive first, then case-insensitive fallback.'),
    /**
     * Specifies the desired format for the returned content.
     * 'markdown' returns the raw file content as a string.
     * 'json' returns a structured NoteJson object containing content, parsed frontmatter, tags, and file metadata (stat).
     * Defaults to 'markdown'.
     */
    format: ReadNoteFormatSchema.optional() // Optional, defaults to 'markdown' via ReadNoteFormatSchema
        .describe("Format for the returned content ('markdown' or 'json'). Defaults to 'markdown'."),
    /**
     * If true and the requested format is 'markdown', includes formatted file statistics
     * (creation time, modification time, token count estimate) in the response's 'stat' field.
     * Defaults to false. This flag is ignored if the format is 'json', as stats are always included within the NoteJson object itself (and also added to the top-level 'stat' field in the response).
     */
    includeStat: z
        .boolean()
        .optional()
        .default(false)
        .describe("If true and format is 'markdown', includes file stats in the response. Defaults to false. Ignored if format is 'json'."),
})
    .describe("Retrieves the content and optionally metadata of a specific file within the connected Obsidian vault. Supports case-insensitive path fallback.");
// ====================================================================================
// Core Logic Function
// ====================================================================================
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
export const processObsidianReadNote = async (params, context, obsidianService) => {
    const { filePath: originalFilePath, format: requestedFormat, includeStat, } = params;
    let effectiveFilePath = originalFilePath; // Track the actual path used (might change during fallback)
    logger.debug(`Processing obsidian_read_note request for path: ${originalFilePath}`, { ...context, format: requestedFormat, includeStat });
    const shouldRetryNotFound = (err) => err instanceof McpError && err.code === BaseErrorCode.NOT_FOUND;
    try {
        let noteJson;
        // --- Step 1: Read File Content (always fetch JSON internally) ---
        const readContext = { ...context, operation: "readFileAsJson" };
        try {
            // Attempt 1: Read using the provided path (case-sensitive)
            logger.debug(`Attempting to read file as JSON (case-sensitive): ${originalFilePath}`, readContext);
            noteJson = await retryWithDelay(() => obsidianService.getFileContent(originalFilePath, "json", readContext), {
                operationName: "readFileWithRetry",
                context: readContext,
                maxRetries: 3,
                delayMs: 300,
                shouldRetry: shouldRetryNotFound,
            });
            effectiveFilePath = originalFilePath; // Confirm exact path worked
            logger.debug(`Successfully read file as JSON using exact path: ${originalFilePath}`, readContext);
        }
        catch (error) {
            // Attempt 2: Case-insensitive fallback if initial read failed with NOT_FOUND
            if (error instanceof McpError && error.code === BaseErrorCode.NOT_FOUND) {
                logger.info(`File not found with exact path: ${originalFilePath}. Attempting case-insensitive fallback.`, readContext);
                const fallbackContext = {
                    ...readContext,
                    subOperation: "caseInsensitiveFallback",
                };
                try {
                    // Use POSIX path functions as vault paths are typically /-separated
                    const dirname = path.posix.dirname(originalFilePath);
                    const filenameLower = path.posix
                        .basename(originalFilePath)
                        .toLowerCase();
                    // Handle case where the file is in the vault root (dirname is '.')
                    const dirToList = dirname === "." ? "/" : dirname;
                    logger.debug(`Listing directory for fallback: ${dirToList}`, fallbackContext);
                    const filesInDir = await retryWithDelay(() => obsidianService.listFiles(dirToList, fallbackContext), {
                        operationName: "listFilesForReadFallback",
                        context: fallbackContext,
                        maxRetries: 3,
                        delayMs: 300,
                        shouldRetry: shouldRetryNotFound,
                    });
                    // Filter directory listing for files matching the lowercase filename
                    const matches = filesInDir.filter((f) => !f.endsWith("/") && // Ensure it's a file, not a directory entry ending in /
                        path.posix.basename(f).toLowerCase() === filenameLower);
                    if (matches.length === 1) {
                        // Found exactly one case-insensitive match
                        const correctFilename = path.posix.basename(matches[0]);
                        effectiveFilePath = path.posix.join(dirname, correctFilename); // Construct the correct path
                        logger.info(`Found case-insensitive match: ${effectiveFilePath}. Retrying read as JSON.`, fallbackContext);
                        // Retry reading the file content using the corrected path
                        noteJson = await retryWithDelay(() => obsidianService.getFileContent(effectiveFilePath, "json", fallbackContext), {
                            operationName: "readFileWithFallbackRetry",
                            context: fallbackContext,
                            maxRetries: 3,
                            delayMs: 300,
                            shouldRetry: shouldRetryNotFound,
                        });
                        logger.debug(`Successfully read file as JSON using fallback path: ${effectiveFilePath}`, fallbackContext);
                    }
                    else if (matches.length > 1) {
                        // Ambiguous match: Multiple files match case-insensitively
                        logger.error(`Case-insensitive fallback failed: Multiple matches found for ${filenameLower} in ${dirToList}.`, { ...fallbackContext, matches });
                        throw new McpError(BaseErrorCode.CONFLICT, // Use CONFLICT for ambiguity
                        `File read failed: Ambiguous case-insensitive matches for '${originalFilePath}'. Found: [${matches.join(", ")}]`, fallbackContext);
                    }
                    else {
                        // No match found even with fallback
                        logger.error(`Case-insensitive fallback failed: No match found for ${filenameLower} in ${dirToList}.`, fallbackContext);
                        throw new McpError(BaseErrorCode.NOT_FOUND, `File not found: '${originalFilePath}' (case-insensitive fallback also failed).`, fallbackContext);
                    }
                }
                catch (fallbackError) {
                    // Catch errors specifically from the fallback logic
                    if (fallbackError instanceof McpError)
                        throw fallbackError; // Re-throw known errors
                    // Wrap unexpected fallback errors
                    const errorMessage = `Unexpected error during case-insensitive fallback for ${originalFilePath}`;
                    logger.error(errorMessage, fallbackError instanceof Error ? fallbackError : undefined, fallbackContext);
                    throw new McpError(BaseErrorCode.INTERNAL_ERROR, `${errorMessage}: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`, fallbackContext);
                }
            }
            else {
                // Re-throw errors from the initial read attempt that were not NOT_FOUND
                throw error;
            }
        }
        // --- Step 2: Format the Response ---
        const formatContext = {
            ...context,
            operation: "formatResponse",
            effectiveFilePath,
        };
        logger.debug(`Formatting response. Requested format: ${requestedFormat}, Include stat: ${includeStat}`, formatContext);
        // Generate formatted statistics using the utility function.
        // Provide the content string for token counting. Handle cases where stat might be missing.
        const formattedStatResult = noteJson.stat
            ? await createFormattedStatWithTokenCount(noteJson.stat, noteJson.content ?? "", formatContext) // Await the async utility
            : undefined;
        // Ensure stat is undefined if the utility returned null (e.g., token counting failed)
        const formattedStat = formattedStatResult === null ? undefined : formattedStatResult;
        // Initialize the response object
        const response = {
            content: "", // Placeholder, will be set based on format
            // stat is added conditionally below
        };
        // Populate response based on requested format
        if (requestedFormat === "json") {
            // Return the full NoteJson object. Its internal 'stat' will remain numeric.
            // The formatted stats are provided in the top-level 'response.stats'.
            response.content = noteJson;
            response.stats = formattedStat; // Always include formatted stat at top level for JSON format
            logger.debug(`Response format set to JSON, including full NoteJson (with original numeric stat) and top-level formatted stat.`, formatContext);
        }
        else {
            // 'markdown' format
            response.content = noteJson.content ?? ""; // Extract the markdown content string
            if (includeStat && formattedStat) {
                response.stats = formattedStat; // Include formatted stats only if requested for markdown
                logger.debug(`Response format set to markdown, including formatted stat as requested.`, formatContext);
            }
            else {
                logger.debug(`Response format set to markdown, excluding stat (includeStat=${includeStat}).`, formatContext);
            }
        }
        logger.debug(`Successfully processed read request for ${effectiveFilePath}.`, context);
        return response;
    }
    catch (error) {
        // Catch any errors that propagated up (e.g., from initial read, fallback, or unexpected issues)
        if (error instanceof McpError) {
            // Log known McpErrors that reached this top level
            logger.error(`McpError during file read process for ${originalFilePath}: ${error.message}`, error, context);
            throw error; // Re-throw McpError
        }
        else {
            // Wrap unexpected errors in a generic McpError
            const errorMessage = `Unexpected error processing read request for ${originalFilePath}`;
            logger.error(errorMessage, error instanceof Error ? error : undefined, context);
            throw new McpError(BaseErrorCode.INTERNAL_ERROR, `${errorMessage}: ${error instanceof Error ? error.message : String(error)}`, context);
        }
    }
};
