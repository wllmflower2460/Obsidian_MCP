/**
 * @fileoverview Core logic for the 'obsidian_list_notes' tool.
 * This module defines the input schema, response types, and processing logic for
 * recursively listing files and directories in an Obsidian vault with filtering.
 * @module src/mcp-server/tools/obsidianListNotesTool/logic
 */

import path from "node:path";
import { z } from "zod";
import { ObsidianRestApiService } from "../../../services/obsidianRestAPI/index.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import {
  logger,
  RequestContext,
  retryWithDelay,
} from "../../../utils/index.js";

// ====================================================================================
// Schema Definitions for Input Validation
// ====================================================================================

/**
 * Zod schema for validating the input parameters of the 'obsidian_list_notes' tool.
 */
export const ObsidianListNotesInputSchema = z
  .object({
    /**
     * The vault-relative path to the directory whose contents should be listed.
     * The path is treated as case-sensitive by the underlying Obsidian API.
     */
    dirPath: z
      .string()
      .describe(
        'The vault-relative path to the directory to list (e.g., "developer/atlas-mcp-server", "/" for root). Case-sensitive.',
      ),
    /**
     * Optional array of file extensions (including the leading dot) to filter the results.
     * Only files matching one of these extensions will be included. Directories are always included.
     */
    fileExtensionFilter: z
      .array(z.string().startsWith(".", "Extension must start with a dot '.'"))
      .optional()
      .describe(
        'Optional array of file extensions (e.g., [".md"]) to filter files. Directories are always included.',
      ),
    /**
     * Optional JavaScript-compatible regular expression pattern string to filter results by name.
     * Only files and directories whose names match the regex will be included.
     */
    nameRegexFilter: z
      .string()
      .nullable()
      .optional()
      .describe(
        "Optional regex pattern (JavaScript syntax) to filter results by name.",
      ),
    /**
     * The maximum depth of subdirectories to list recursively.
     * - A value of `0` lists only the files and directories in the specified `dirPath`.
     * - A value of `1` lists the contents of `dirPath` and the contents of its immediate subdirectories.
     * - A value of `-1` (the default) indicates infinite recursion, listing all subdirectories.
     */
    recursionDepth: z
      .number()
      .int()
      .default(-1)
      .describe(
        "Maximum recursion depth. 0 for no recursion, -1 for infinite (default).",
      ),
  })
  .describe(
    "Input parameters for listing files and subdirectories within a specified Obsidian vault directory, with optional filtering and recursion.",
  );

/**
 * TypeScript type inferred from the input schema (`ObsidianListNotesInputSchema`).
 */
export type ObsidianListNotesInput = z.infer<
  typeof ObsidianListNotesInputSchema
>;

// ====================================================================================
// Response & Internal Type Definitions
// ====================================================================================

/**
 * Defines the structure of a node in the file tree.
 */
interface FileTreeNode {
  name: string;
  type: "file" | "directory";
  children: FileTreeNode[];
}

/**
 * Defines the structure of the successful response returned by the core logic function.
 */
export interface ObsidianListNotesResponse {
  directoryPath: string;
  tree: string;
  totalEntries: number;
}

// ====================================================================================
// Helper Functions
// ====================================================================================

/**
 * Recursively builds a formatted tree string from a nested array of FileTreeNode objects.
 *
 * @param {FileTreeNode[]} nodes - The array of nodes to format.
 * @param {string} [indent=""] - The indentation prefix for the current level.
 * @returns {{ tree: string, count: number }} An object containing the formatted tree string and the total count of entries.
 */
function formatTree(
  nodes: FileTreeNode[],
  indent = "",
): { tree: string; count: number } {
  let treeString = "";
  let count = nodes.length;

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const prefix = isLast ? "└── " : "├── ";
    const childIndent = isLast ? "    " : "│   ";

    treeString += `${indent}${prefix}${node.name}\n`;

    if (node.children && node.children.length > 0) {
      const result = formatTree(node.children, indent + childIndent);
      treeString += result.tree;
      count += result.count;
    }
  });

  return { tree: treeString, count };
}

/**
 * Recursively builds a file tree by fetching directory contents from the Obsidian API.
 *
 * @param {string} dirPath - The path of the directory to process.
 * @param {number} currentDepth - The current recursion depth.
 * @param {ObsidianListNotesInput} params - The original validated input parameters, including filters and max depth.
 * @param {RequestContext} context - The request context for logging.
 * @param {ObsidianRestApiService} obsidianService - The Obsidian API service instance.
 * @returns {Promise<FileTreeNode[]>} A promise that resolves to an array of file tree nodes.
 */
async function buildFileTree(
  dirPath: string,
  currentDepth: number,
  params: ObsidianListNotesInput,
  context: RequestContext,
  obsidianService: ObsidianRestApiService,
): Promise<FileTreeNode[]> {
  const { recursionDepth, fileExtensionFilter, nameRegexFilter } = params;

  // Stop recursion if max depth is reached (and it's not infinite)
  if (recursionDepth !== -1 && currentDepth > recursionDepth) {
    return [];
  }

  let fileNames;
  try {
    fileNames = await obsidianService.listFiles(dirPath, context);
  } catch (error) {
    if (error instanceof McpError && error.code === BaseErrorCode.NOT_FOUND) {
      logger.warning(
        `Directory not found during recursive list: ${dirPath}. Skipping.`,
        context,
      );
      return []; // Return empty array if a subdirectory is not found
    }
    throw error; // Re-throw other errors
  }

  const regex =
    nameRegexFilter && nameRegexFilter.trim() !== ""
      ? new RegExp(nameRegexFilter)
      : null;

  const treeNodes: FileTreeNode[] = [];

  for (const name of fileNames) {
    const fullPath = path.posix.join(dirPath, name);
    const isDirectory = name.endsWith("/");
    const cleanName = isDirectory ? name.slice(0, -1) : name;

    // Apply filters
    if (regex && !regex.test(cleanName)) {
      continue;
    }
    if (!isDirectory && fileExtensionFilter && fileExtensionFilter.length > 0) {
      const extension = path.posix.extname(name);
      if (!fileExtensionFilter.includes(extension)) {
        continue;
      }
    }

    const node: FileTreeNode = {
      name: cleanName,
      type: isDirectory ? "directory" : "file",
      children: [],
    };

    if (isDirectory) {
      node.name += "/"; // Add trailing slash back for display
      node.children = await buildFileTree(
        fullPath,
        currentDepth + 1,
        params,
        context,
        obsidianService,
      );
    }

    treeNodes.push(node);
  }

  // Sort entries: directories first, then files, alphabetically
  treeNodes.sort((a, b) => {
    if (a.type === "directory" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  return treeNodes;
}

// ====================================================================================
// Core Logic Function
// ====================================================================================

/**
 * Processes the core logic for listing files and directories recursively within the Obsidian vault.
 *
 * @param {ObsidianListNotesInput} params - The validated input parameters.
 * @param {RequestContext} context - The request context for logging and correlation.
 * @param {ObsidianRestApiService} obsidianService - An instance of the Obsidian REST API service.
 * @returns {Promise<ObsidianListNotesResponse>} A promise resolving to the structured success response.
 * @throws {McpError} Throws an McpError if the initial directory is not found or another error occurs.
 */
export const processObsidianListNotes = async (
  params: ObsidianListNotesInput,
  context: RequestContext,
  obsidianService: ObsidianRestApiService,
): Promise<ObsidianListNotesResponse> => {
  const { dirPath } = params;
  const dirPathForLog = dirPath === "" || dirPath === "/" ? "/" : dirPath;

  logger.debug(
    `Processing obsidian_list_notes request for path: ${dirPathForLog}`,
    { ...context, params },
  );

  try {
    const effectiveDirPath = dirPath === "" ? "/" : dirPath;

    // --- Step 1: Build the file tree recursively with retry for the initial call ---
    const buildTreeContext = {
      ...context,
      operation: "buildFileTreeWithRetry",
    };
    const shouldRetryNotFound = (err: unknown) =>
      err instanceof McpError && err.code === BaseErrorCode.NOT_FOUND;

    const fileTree = await retryWithDelay(
      () =>
        buildFileTree(
          effectiveDirPath,
          0, // Start at depth 0
          params,
          buildTreeContext,
          obsidianService,
        ),
      {
        operationName: "buildFileTreeWithRetry",
        context: buildTreeContext,
        maxRetries: 3,
        delayMs: 300,
        shouldRetry: shouldRetryNotFound,
      },
    );

    // --- Step 2: Format the tree and count entries ---
    const formatContext = { ...context, operation: "formatResponse" };
    if (fileTree.length === 0) {
      logger.debug(
        "Directory is empty or all items were filtered out.",
        formatContext,
      );
      return {
        directoryPath: dirPathForLog,
        tree: "(empty or all items filtered)",
        totalEntries: 0,
      };
    }

    const { tree, count } = formatTree(fileTree);

    // --- Step 3: Construct and return the response ---
    const response: ObsidianListNotesResponse = {
      directoryPath: dirPathForLog,
      tree: tree.trimEnd(), // Remove trailing newline
      totalEntries: count,
    };

    logger.debug(
      `Successfully processed list request for ${dirPathForLog}. Found ${count} entries.`,
      context,
    );
    return response;
  } catch (error) {
    if (error instanceof McpError) {
      // Provide a more specific message if the directory wasn't found after retries
      if (error.code === BaseErrorCode.NOT_FOUND) {
        const notFoundMsg = `Directory not found after retries: ${dirPathForLog}`;
        logger.error(notFoundMsg, error, context);
        throw new McpError(error.code, notFoundMsg, context);
      }
      logger.error(
        `McpError during file listing for ${dirPathForLog}: ${error.message}`,
        error,
        context,
      );
      throw error;
    }

    const errorMessage = `Unexpected error listing Obsidian files in ${dirPathForLog}`;
    logger.error(
      errorMessage,
      error instanceof Error ? error : undefined,
      context,
    );
    throw new McpError(
      BaseErrorCode.INTERNAL_ERROR,
      `${errorMessage}: ${error instanceof Error ? error.message : String(error)}`,
      context,
    );
  }
};
