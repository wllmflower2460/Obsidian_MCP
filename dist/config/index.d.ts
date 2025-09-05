/**
 * Main application configuration object.
 */
export declare const config: {
    pkg: {
        name: string;
        version: string;
    };
    mcpServerName: string;
    mcpServerVersion: string;
    logLevel: string;
    logsPath: string;
    environment: string;
    mcpTransportType: "stdio" | "http";
    mcpHttpPort: number;
    mcpHttpHost: string;
    mcpAllowedOrigins: string[] | undefined;
    mcpAuthMode: "jwt" | "oauth" | undefined;
    mcpAuthSecretKey: string | undefined;
    oauthIssuerUrl: string | undefined;
    oauthAudience: string | undefined;
    oauthJwksUri: string | undefined;
    obsidianApiKey: string;
    obsidianBaseUrl: string;
    obsidianVerifySsl: boolean;
    obsidianCacheRefreshIntervalMin: number;
    obsidianEnableCache: boolean;
    obsidianApiSearchTimeoutMs: number;
};
/**
 * The configured logging level for the application.
 * Exported separately for convenience (e.g., logger initialization).
 * @type {string}
 */
export declare const logLevel: string;
/**
 * The configured runtime environment for the application.
 * Exported separately for convenience.
 * @type {string}
 */
export declare const environment: string;
