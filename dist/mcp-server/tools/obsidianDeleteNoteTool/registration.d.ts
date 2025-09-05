import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
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
export declare const registerObsidianDeleteNoteTool: (server: McpServer, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<void>;
