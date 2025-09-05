/**
 * @fileoverview MCP Authentication Middleware for Bearer Token Validation (JWT) for Hono.
 *
 * This middleware validates JSON Web Tokens (JWT) passed via the 'Authorization' header
 * using the 'Bearer' scheme (e.g., "Authorization: Bearer <your_token>").
 * It verifies the token's signature and expiration using the secret key defined
 * in the configuration (`config.mcpAuthSecretKey`).
 *
 * If the token is valid, an object conforming to the MCP SDK's `AuthInfo` type
 * is attached to `c.env.incoming.auth`. This direct attachment to the raw Node.js
 * request object is for compatibility with the underlying SDK transport, which is
 * not Hono-context-aware.
 * If the token is missing, invalid, or expired, it throws an `McpError`, which is
 * then handled by the centralized `httpErrorHandler`.
 *
 * @see {@link https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/authorization.mdx | MCP Authorization Specification}
 * @module src/mcp-server/transports/auth/strategies/jwt/jwtMiddleware
 */
import { HttpBindings } from "@hono/node-server";
import { Context, Next } from "hono";
/**
 * Hono middleware for verifying JWT Bearer token authentication.
 * It attaches authentication info to `c.env.incoming.auth` for SDK compatibility with the node server.
 */
export declare function mcpAuthMiddleware(c: Context<{
    Bindings: HttpBindings;
}>, next: Next): Promise<void>;
