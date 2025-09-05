/**
 * @module ObsidianApiUtils
 * @description
 * Internal utilities for the Obsidian REST API service.
 */
/**
 * Encodes a vault-relative file path correctly for API URLs.
 * Ensures path separators '/' are not encoded, but individual components are.
 * Handles leading slashes correctly.
 *
 * @param filePath - The raw vault-relative file path (e.g., "/Notes/My File.md" or "Notes/My File.md").
 * @returns The URL-encoded path suitable for appending to `/vault`.
 */
export declare function encodeVaultPath(filePath: string): string;
