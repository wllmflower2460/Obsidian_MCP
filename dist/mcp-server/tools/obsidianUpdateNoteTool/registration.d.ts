import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
/**
 * Registers the 'obsidian_update_note' tool with the MCP server.
 *
 * This tool allows modification of Obsidian notes (specified by file path,
 * the active file, or a periodic note) using whole-file operations:
 * 'append', 'prepend', or 'overwrite'. It includes options for creating
 * missing files/targets and controlling overwrite behavior.
 *
 * The tool returns a JSON string containing the operation status, a message,
 * a formatted timestamp of the operation, file statistics (stat), and
 * optionally the final content of the modified file.
 *
 * @param {McpServer} server - The MCP server instance to register the tool with.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service
 *   used to interact with the user's Obsidian vault.
 * @returns {Promise<void>} A promise that resolves when the tool registration is complete or rejects on error.
 * @throws {McpError} Throws an McpError if registration fails critically.
 */
export declare const registerObsidianUpdateNoteTool: (server: McpServer, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<void>;
