import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
/**
 * Registers the 'obsidian_read_note' tool with the MCP server.
 *
 * This tool retrieves the content and optionally metadata of a specified file
 * within the user's Obsidian vault. It supports specifying the output format
 * ('markdown' or 'json') and includes a case-insensitive fallback mechanism
 * if the exact file path is not found initially.
 *
 * The response is a JSON string containing the file content in the requested format
 * and optionally formatted file statistics (timestamps, token count).
 *
 * @param {McpServer} server - The MCP server instance to register the tool with.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service
 *   used to interact with the user's Obsidian vault.
 * @returns {Promise<void>} A promise that resolves when the tool registration is complete or rejects on error.
 * @throws {McpError} Throws an McpError if registration fails critically.
 */
export declare const registerObsidianReadNoteTool: (server: McpServer, obsidianService: ObsidianRestApiService) => Promise<void>;
