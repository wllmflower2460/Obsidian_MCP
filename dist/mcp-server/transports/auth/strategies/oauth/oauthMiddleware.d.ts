/**
 * @fileoverview Hono middleware for OAuth 2.1 Bearer Token validation.
 * This middleware extracts a JWT from the Authorization header, validates it against
 * a remote JWKS (JSON Web Key Set), and checks its issuer and audience claims.
 * On success, it populates an AuthInfo object and stores it in an AsyncLocalStorage
 * context for use in downstream handlers.
 *
 * @module src/mcp-server/transports/auth/strategies/oauth/oauthMiddleware
 */
import { HttpBindings } from "@hono/node-server";
import { Context, Next } from "hono";
/**
 * Hono middleware for verifying OAuth 2.1 JWT Bearer tokens.
 * It validates the token and uses AsyncLocalStorage to pass auth info.
 * @param c - The Hono context object.
 * @param next - The function to call to proceed to the next middleware.
 */
export declare function oauthMiddleware(c: Context<{
    Bindings: HttpBindings;
}>, next: Next): Promise<void>;
