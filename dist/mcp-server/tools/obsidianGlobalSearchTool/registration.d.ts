/**
 * @module ObsidianGlobalSearchToolRegistration
 * @description Registers the 'obsidian_global_search' tool with the MCP server.
 * This tool allows searching the Obsidian vault using text/regex queries with optional date filters.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
import type { VaultCacheService } from "../../../services/obsidianRestAPI/vaultCache/index.js";
/**
 * Registers the 'obsidian_global_search' tool with the MCP server instance.
 *
 * @param {McpServer} server - The MCP server instance.
 * @param {ObsidianRestApiService} obsidianService - The instance of the Obsidian REST API service.
 * @param {VaultCacheService} vaultCacheService - The instance of the Vault Cache service.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 * @throws {McpError} If registration fails critically.
 */
export declare function registerObsidianGlobalSearchTool(server: McpServer, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService): Promise<void>;
