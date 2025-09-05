/**
 * @module CommandMethods
 * @description
 * Methods for interacting with Obsidian commands via the REST API.
 */
import { RequestContext } from "../../../utils/index.js";
import { ObsidianCommand, RequestFunction } from "../types.js";
/**
 * Executes a registered Obsidian command by its ID.
 * @param _request - The internal request function from the service instance.
 * @param commandId - The ID of the command (e.g., "app:go-back").
 * @param context - Request context.
 * @returns {Promise<void>} Resolves on success (204 No Content).
 */
export declare function executeCommand(_request: RequestFunction, commandId: string, context: RequestContext): Promise<void>;
/**
 * Lists all available Obsidian commands.
 * @param _request - The internal request function from the service instance.
 * @param context - Request context.
 * @returns A list of available commands.
 */
export declare function listCommands(_request: RequestFunction, context: RequestContext): Promise<ObsidianCommand[]>;
