import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { ErrorHandler, logger, requestContextService, } from "../../../utils/index.js";
import { ObsidianDeleteNoteInputSchema, processObsidianDeleteNote, } from "./logic.js";
/**
 * Registers the 'obsidian_delete_note' tool with the MCP server.
 *
 * This tool permanently deletes a specified file from the user's Obsidian vault.
 * It requires the vault-relative path, including the file extension. The tool
 * attempts a case-sensitive deletion first, followed by a case-insensitive
 * fallback search and delete if the initial attempt fails with a 'NOT_FOUND' error.
 *
 * The response is a JSON string containing a success status and a confirmation message.
 *
 * @param {McpServer} server - The MCP server instance to register the tool with.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service
 *   used to interact with the user's Obsidian vault.
 * @returns {Promise<void>} A promise that resolves when the tool registration is complete or rejects on error.
 * @throws {McpError} Throws an McpError if registration fails critically.
 */
export const registerObsidianDeleteNoteTool = async (server, obsidianService, vaultCacheService) => {
    const toolName = "obsidian_delete_note";
    // Updated description to accurately reflect the response (no timestamp)
    const toolDescription = "Permanently deletes a specified file from the Obsidian vault. Tries the exact path first, then attempts a case-insensitive fallback if the file is not found. Requires the vault-relative path including the file extension. Returns a success message.";
    // Create a context specifically for the registration process.
    const registrationContext = requestContextService.createRequestContext({
        operation: "RegisterObsidianDeleteNoteTool",
        toolName: toolName,
        module: "ObsidianDeleteNoteRegistration", // Identify the module
    });
    logger.info(`Attempting to register tool: ${toolName}`, registrationContext);
    // Wrap the registration logic in a tryCatch block for robust error handling during server setup.
    await ErrorHandler.tryCatch(async () => {
        // Use the high-level SDK method `server.tool` for registration.
        server.tool(toolName, toolDescription, ObsidianDeleteNoteInputSchema.shape, // Provide the Zod schema shape for input definition.
        /**
         * The handler function executed when the 'obsidian_delete_note' tool is called by the client.
         *
         * @param {ObsidianDeleteNoteInput} params - The input parameters received from the client,
         *   validated against the ObsidianDeleteNoteInputSchema shape.
         * @returns {Promise<CallToolResult>} A promise resolving to the structured result for the MCP client,
         *   containing either the successful response data (serialized JSON) or an error indication.
         */
        async (params) => {
            // Type matches the inferred input schema
            // Create a specific context for this handler invocation.
            const handlerContext = requestContextService.createRequestContext({
                parentContext: registrationContext, // Link to registration context
                operation: "HandleObsidianDeleteNoteRequest",
                toolName: toolName,
                params: { filePath: params.filePath }, // Log the file path being targeted
            });
            logger.debug(`Handling '${toolName}' request`, handlerContext);
            // Wrap the core logic execution in a tryCatch block.
            return await ErrorHandler.tryCatch(async () => {
                // Delegate the actual file deletion logic to the processing function.
                // Note: Input schema and shape are identical, no separate refinement parse needed here.
                const response = await processObsidianDeleteNote(params, handlerContext, obsidianService, vaultCacheService);
                logger.debug(`'${toolName}' processed successfully`, handlerContext);
                // Format the successful response object from the logic function into the required MCP CallToolResult structure.
                // The response object (success, message) is serialized to JSON.
                return {
                    content: [
                        {
                            type: "text", // Standard content type for structured JSON data
                            text: JSON.stringify(response, null, 2), // Pretty-print JSON
                        },
                    ],
                    isError: false, // Indicate successful execution
                };
            }, {
                // Configuration for the inner error handler (processing logic).
                operation: `processing ${toolName} handler`,
                context: handlerContext,
                input: params, // Log the full input parameters if an error occurs.
                // Custom error mapping for consistent error reporting.
                errorMapper: (error) => new McpError(error instanceof McpError
                    ? error.code
                    : BaseErrorCode.INTERNAL_ERROR, `Error processing ${toolName} tool: ${error instanceof Error ? error.message : "Unknown error"}`, { ...handlerContext }),
            }); // End of inner ErrorHandler.tryCatch
        }); // End of server.tool call
        logger.info(`Tool registered successfully: ${toolName}`, registrationContext);
    }, {
        // Configuration for the outer error handler (registration process).
        operation: `registering tool ${toolName}`,
        context: registrationContext,
        errorCode: BaseErrorCode.INTERNAL_ERROR, // Default error code for registration failure.
        // Custom error mapping for registration failures.
        errorMapper: (error) => new McpError(error instanceof McpError ? error.code : BaseErrorCode.INTERNAL_ERROR, `Failed to register tool '${toolName}': ${error instanceof Error ? error.message : "Unknown error"}`, { ...registrationContext }),
        critical: true, // Treat registration failure as critical.
    }); // End of outer ErrorHandler.tryCatch
};
