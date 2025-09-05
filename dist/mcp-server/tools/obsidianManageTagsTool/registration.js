import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { ErrorHandler, logger, requestContextService, } from "../../../utils/index.js";
import { ManageTagsInputSchema, ObsidianManageTagsInputSchemaShape, processObsidianManageTags, } from "./logic.js";
export const registerObsidianManageTagsTool = async (server, obsidianService, vaultCacheService) => {
    const toolName = "obsidian_manage_tags";
    const toolDescription = "Manages tags for a specified note, handling them in both the YAML frontmatter and inline content. Supports adding, removing, and listing tags to provide a comprehensive tag management solution.";
    const registrationContext = requestContextService.createRequestContext({
        operation: "RegisterObsidianManageTagsTool",
        toolName: toolName,
        module: "ObsidianManageTagsRegistration",
    });
    logger.info(`Attempting to register tool: ${toolName}`, registrationContext);
    await ErrorHandler.tryCatch(async () => {
        server.tool(toolName, toolDescription, ObsidianManageTagsInputSchemaShape, async (params) => {
            const handlerContext = requestContextService.createRequestContext({
                parentContext: registrationContext,
                operation: "HandleObsidianManageTagsRequest",
                toolName: toolName,
                params: params,
            });
            logger.debug(`Handling '${toolName}' request`, handlerContext);
            return await ErrorHandler.tryCatch(async () => {
                const validatedParams = ManageTagsInputSchema.parse(params);
                const response = await processObsidianManageTags(validatedParams, handlerContext, obsidianService, vaultCacheService);
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
