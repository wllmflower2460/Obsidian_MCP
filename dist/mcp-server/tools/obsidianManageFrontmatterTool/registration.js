import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { ErrorHandler, logger, requestContextService, } from "../../../utils/index.js";
import { ManageFrontmatterInputSchema, ObsidianManageFrontmatterInputSchemaShape, processObsidianManageFrontmatter, } from "./logic.js";
export const registerObsidianManageFrontmatterTool = async (server, obsidianService, vaultCacheService) => {
    const toolName = "obsidian_manage_frontmatter";
    const toolDescription = "Atomically manages a note's YAML frontmatter. Supports getting, setting (creating/updating), and deleting specific keys without rewriting the entire file. Ideal for efficient metadata operations on primitive or structured Obsidian frontmatter data.";
    const registrationContext = requestContextService.createRequestContext({
        operation: "RegisterObsidianManageFrontmatterTool",
        toolName: toolName,
        module: "ObsidianManageFrontmatterRegistration",
    });
    logger.info(`Attempting to register tool: ${toolName}`, registrationContext);
    await ErrorHandler.tryCatch(async () => {
        server.tool(toolName, toolDescription, ObsidianManageFrontmatterInputSchemaShape, async (params) => {
            const handlerContext = requestContextService.createRequestContext({
                parentContext: registrationContext,
                operation: "HandleObsidianManageFrontmatterRequest",
                toolName: toolName,
                params: params,
            });
            logger.debug(`Handling '${toolName}' request`, handlerContext);
            return await ErrorHandler.tryCatch(async () => {
                const validatedParams = ManageFrontmatterInputSchema.parse(params);
                const response = await processObsidianManageFrontmatter(validatedParams, handlerContext, obsidianService, vaultCacheService);
                logger.debug(`'${toolName}' processed successfully`, handlerContext);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(response, null, 2),
                        },
                    ],
                    isError: false,
                };
            }, {
                operation: `processing ${toolName} handler`,
                context: handlerContext,
                input: params,
                errorMapper: (error) => new McpError(error instanceof McpError
                    ? error.code
                    : BaseErrorCode.INTERNAL_ERROR, `Error processing ${toolName} tool: ${error instanceof Error ? error.message : "Unknown error"}`, { ...handlerContext }),
            });
        });
        logger.info(`Tool registered successfully: ${toolName}`, registrationContext);
    }, {
        operation: `registering tool ${toolName}`,
        context: registrationContext,
        errorCode: BaseErrorCode.INTERNAL_ERROR,
        errorMapper: (error) => new McpError(error instanceof McpError ? error.code : BaseErrorCode.INTERNAL_ERROR, `Failed to register tool '${toolName}': ${error instanceof Error ? error.message : "Unknown error"}`, { ...registrationContext }),
        critical: true,
    });
};
