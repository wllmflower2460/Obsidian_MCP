/**
 * @module VaultCacheService
 * @description Service for building and managing an in-memory cache of Obsidian vault content.
 */
import { RequestContext } from "../../../utils/index.js";
import { ObsidianRestApiService } from "../index.js";
interface CacheEntry {
    content: string;
    mtime: number;
}
/**
 * Manages an in-memory cache of the Obsidian vault's file structure and metadata.
 *
 * __Is the cache safe and secure?__
 * Yes, the cache is safe and secure for its purpose within this application. Here's why:
 * 1. __In-Memory Storage:__ The cache exists only in the server's memory. It is not written to disk or transmitted over the network, so its attack surface is limited to the server process itself.
 * 2. __Local Data Source:__ The data populating the cache comes directly from your own Obsidian vault via the local REST API. It is not fetching data from external, untrusted sources.
 *
 * __Warning: High Memory Usage__
 * This service stores the entire content of every markdown file in the vault in memory. For users with very large vaults (e.g., many gigabytes of markdown files), this can lead to significant RAM consumption. If you experience high memory usage, consider disabling the cache via the `OBSIDIAN_ENABLE_CACHE` environment variable.
 */
export declare class VaultCacheService {
    private vaultContentCache;
    private isCacheReady;
    private isBuilding;
    private obsidianService;
    private refreshIntervalId;
    constructor(obsidianService: ObsidianRestApiService);
    /**
     * Starts the periodic cache refresh mechanism.
     * The interval is controlled by the `OBSIDIAN_CACHE_REFRESH_INTERVAL_MIN` config setting.
     */
    startPeriodicRefresh(): void;
    /**
     * Stops the periodic cache refresh mechanism.
     * Should be called during graceful shutdown.
     */
    stopPeriodicRefresh(): void;
    /**
     * Checks if the cache has been successfully built.
     * @returns {boolean} True if the cache is ready, false otherwise.
     */
    isReady(): boolean;
    /**
     * Checks if the cache is currently being built.
     * @returns {boolean} True if the cache build is in progress, false otherwise.
     */
    getIsBuilding(): boolean;
    /**
     * Returns the entire vault content cache.
     * Use with caution for large vaults due to potential memory usage.
     * @returns {ReadonlyMap<string, CacheEntry>} The cache map.
     */
    getCache(): ReadonlyMap<string, CacheEntry>;
    /**
     * Retrieves a specific entry from the cache.
     * @param {string} filePath - The vault-relative path of the file.
     * @returns {CacheEntry | undefined} The cache entry or undefined if not found.
     */
    getEntry(filePath: string): CacheEntry | undefined;
    /**
     * Immediately fetches the latest data for a single file and updates its entry in the cache.
     * This is useful for ensuring cache consistency immediately after a file modification.
     * @param {string} filePath - The vault-relative path of the file to update.
     * @param {RequestContext} context - The request context for logging.
     */
    updateCacheForFile(filePath: string, context: RequestContext): Promise<void>;
    /**
     * Builds the in-memory cache by fetching all markdown files and their content.
     * This is intended to be run once at startup. Subsequent updates are handled by `refreshCache`.
     */
    buildVaultCache(): Promise<void>;
    /**
     * Refreshes the cache by comparing remote file modification times with cached ones.
     * Only fetches content for new or updated files.
     * @param isInitialBuild - If true, forces a full build and sets the cache readiness flag.
     */
    refreshCache(isInitialBuild?: boolean): Promise<void>;
    /**
     * Helper to recursively list all markdown files. Similar to the one in search logic.
     * @param dirPath - Starting directory path.
     * @param context - Request context.
     * @param visitedDirs - Set to track visited directories.
     * @returns Array of file paths.
     */
    private listAllMarkdownFiles;
}
export {};
