import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
/**
 * Registers the 'obsidian_search_replace' tool with the MCP server.
 *
 * This tool performs one or more search-and-replace operations within a specified
 * Obsidian note (identified by file path, the active file, or a periodic note).
 * It reads the note content, applies the replacements sequentially based on the
 * provided options (regex, case sensitivity, etc.), writes the modified content
 * back to the vault, and returns the operation results.
 *
 * The response includes success status, a summary message, the total number of
 * replacements made, formatted file statistics (timestamp, token count), and
 * optionally the final content of the note.
 *
 * @param {McpServer} server - The MCP server instance to register the tool with.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service
 *   used to interact with the user's Obsidian vault.
 * @returns {Promise<void>} A promise that resolves when the tool registration is complete or rejects on error.
 * @throws {McpError} Throws an McpError if registration fails critically.
 */
export declare const registerObsidianSearchReplaceTool: (server: McpServer, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<void>;
