import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianRestApiService, VaultCacheService } from "../../../services/obsidianRestAPI/index.js";
export declare const registerObsidianManageTagsTool: (server: McpServer, obsidianService: ObsidianRestApiService, vaultCacheService: VaultCacheService | undefined) => Promise<void>;
