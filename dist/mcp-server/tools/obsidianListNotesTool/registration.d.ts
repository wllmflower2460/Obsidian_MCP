/**
 * @fileoverview Registers the 'obsidian_list_notes' tool with the MCP server.
 * This file defines the tool's metadata and sets up the handler that links
 * the tool call to its core processing logic.
 * @module src/mcp-server/tools/obsidianListNotesTool/registration
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
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
export declare const registerObsidianListNotesTool: (server: McpServer, obsidianService: ObsidianRestApiService) => Promise<void>;
