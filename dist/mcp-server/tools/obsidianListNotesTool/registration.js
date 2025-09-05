/**
 * @fileoverview Registers the 'obsidian_list_notes' tool with the MCP server.
 * This file defines the tool's metadata and sets up the handler that links
 * the tool call to its core processing logic.
 * @module src/mcp-server/tools/obsidianListNotesTool/registration
 */
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { ErrorHandler, logger, requestContextService, } from "../../../utils/index.js";
import { ObsidianListNotesInputSchema, processObsidianListNotes, } from "./logic.js";
/**
 * Registers the 'obsidian_list_notes' tool with the MCP server.
 *
 * This tool lists the files and subdirectories within a specified directory
 * in the user's Obsidian vault. It supports optional filtering by file extension,
 * by a regular expression matching the entry name, and recursive listing up to a
 * specified depth.
 *
 * @param {McpServer} server - The MCP server instance to register the tool with.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service
 *   used to interact with the user's Obsidian vault.
 * @returns {Promise<void>} A promise that resolves when the tool registration is complete or rejects on error.
 * @throws {McpError} Throws an McpError if registration fails critically.
 */
export const registerObsidianListNotesTool = async (server, obsidianService) => {
    const toolName = "obsidian_list_notes";
    const toolDescription = "Lists files and subdirectories within a specified Obsidian vault folder. Supports optional filtering by extension or name regex, and recursive listing to a specified depth (-1 for infinite). Returns an object containing the listed directory path, a formatted tree string of its contents, and the total entry count. Use an empty string or '/' for dirPath to list the vault root.";
    // Create a context specifically for the registration process.
    const registrationContext = requestContextService.createRequestContext({
        operation: "RegisterObsidianListNotesTool",
        toolName: toolName,
        module: "ObsidianListNotesRegistration", // Identify the module
    });
    logger.info(`Attempting to register tool: ${toolName}`, registrationContext);
    // Wrap the registration logic in a tryCatch block for robust error handling during server setup.
    await ErrorHandler.tryCatch(async () => {
        // Use the high-level SDK method `server.tool` for registration.
        server.tool(toolName, toolDescription, ObsidianListNotesInputSchema.shape, // Provide the Zod schema shape for input definition.
        /**
         * The handler function executed when the 'obsidian_list_notes' tool is called by the client.
         *
         * @param {ObsidianListNotesInput} params - The input parameters received from the client,
         *   validated against the ObsidianListNotesInputSchema shape.
         * @returns {Promise<CallToolResult>} A promise resolving to the structured result for the MCP client,
         *   containing either the successful response data (serialized JSON) or an error indication.
         */
        async (params) => {
            // Type matches the inferred input schema
            // Create a specific context for this handler invocation.
            const handlerContext = requestContextService.createRequestContext({
                parentContext: registrationContext, // Link to registration context
                operation: "HandleObsidianListNotesRequest",
                toolName: toolName,
                params: {
                    // Log all relevant parameters for debugging
                    dirPath: params.dirPath,
                    fileExtensionFilter: params.fileExtensionFilter,
                    nameRegexFilter: params.nameRegexFilter,
                    recursionDepth: params.recursionDepth,
                },
            });
            logger.debug(`Handling '${toolName}' request`, handlerContext);
            // Wrap the core logic execution in a tryCatch block.
            return await ErrorHandler.tryCatch(async () => {
                // Delegate the actual file listing and filtering logic to the processing function.
                const response = await processObsidianListNotes(params, handlerContext, obsidianService);
                logger.debug(`'${toolName}' processed successfully`, handlerContext);
                // Format the successful response object from the logic function into the required MCP CallToolResult structure.
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
