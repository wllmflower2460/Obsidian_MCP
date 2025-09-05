/**
 * @module ObsidianRestApiService Barrel File
 * @description
 * Exports the singleton instance of the Obsidian REST API service and related types.
 */
export * from "./types.js";
export { ObsidianRestApiService } from "./service.js";
export * as activeFileMethods from "./methods/activeFileMethods.js";
export * as commandMethods from "./methods/commandMethods.js";
export * as openMethods from "./methods/openMethods.js";
export * as patchMethods from "./methods/patchMethods.js";
export * as periodicNoteMethods from "./methods/periodicNoteMethods.js";
export * as searchMethods from "./methods/searchMethods.js";
export * as vaultMethods from "./methods/vaultMethods.js";
export { VaultCacheService } from "./vaultCache/index.js";
