/**
 * @module ObsidianRestApiTypes
 * @description
 * Type definitions for interacting with the Obsidian Local REST API,
 * based on its OpenAPI specification.
 */
import { AxiosRequestConfig } from "axios";
import { RequestContext } from "../../utils/index.js";
/**
 * Defines the signature for the internal request function passed to method implementations.
 * This function is bound to the `ObsidianRestApiService` instance and handles the core
 * logic of making an HTTP request, including authentication, error handling, and logging.
 *
 * @template T The expected return type of the API call.
 * @param config The Axios request configuration.
 * @param context The request context for logging and correlation.
 * @param operationName A descriptive name for the operation being performed, used for logging.
 * @returns A promise that resolves with the data of type `T`.
 */
export type RequestFunction = <T = any>(config: AxiosRequestConfig, context: RequestContext, operationName: string) => Promise<T>;
/**
 * Filesystem metadata for a note.
 */
export interface NoteStat {
    ctime: number;
    mtime: number;
    size: number;
}
/**
 * JSON representation of an Obsidian note.
 * Returned when requesting with Accept: application/vnd.olrapi.note+json
 */
export interface NoteJson {
    content: string;
    frontmatter: Record<string, any>;
    path: string;
    stat: NoteStat;
    tags: string[];
}
/**
 * Response structure for listing files in a directory.
 */
export interface FileListResponse {
    files: string[];
}
/**
 * Match details within a simple search result.
 */
export interface SimpleSearchMatchDetail {
    start: number;
    end: number;
}
/**
 * Contextual match information for simple search.
 */
export interface SimpleSearchMatch {
    context: string;
    match: SimpleSearchMatchDetail;
}
/**
 * Result item for a simple text search.
 */
export interface SimpleSearchResult {
    filename: string;
    matches: SimpleSearchMatch[];
    score: number;
}
/**
 * Result item for a complex (Dataview/JsonLogic) search.
 */
export interface ComplexSearchResult {
    filename: string;
    result: any;
}
/**
 * Structure for an available Obsidian command.
 */
export interface ObsidianCommand {
    id: string;
    name: string;
}
/**
 * Response structure for listing available commands.
 */
export interface CommandListResponse {
    commands: ObsidianCommand[];
}
/**
 * Basic status response from the API root.
 */
export interface ApiStatusResponse {
    authenticated: boolean;
    ok: string;
    service: string;
    versions: {
        obsidian: string;
        self: string;
    };
}
/**
 * Standard error response structure from the API.
 */
export interface ApiError {
    errorCode: number;
    message: string;
}
/**
 * Options for PATCH operations.
 */
export interface PatchOptions {
    operation: "append" | "prepend" | "replace";
    targetType: "heading" | "block" | "frontmatter";
    target: string;
    targetDelimiter?: string;
    trimTargetWhitespace?: boolean;
    /**
     * If true, creates the target if it's missing.
     * This is implemented via the `Create-Target-If-Missing` HTTP header.
     * Particularly useful for adding new frontmatter keys.
     */
    createTargetIfMissing?: boolean;
    contentType?: "text/markdown" | "application/json";
}
/**
 * Type alias for periodic note periods.
 */
export type Period = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
