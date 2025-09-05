/**
 * @fileoverview Configures and starts the Streamable HTTP MCP transport using Hono.
 * This module integrates the `@modelcontextprotocol/sdk`'s `StreamableHTTPServerTransport`
 * into a Hono web server. Its responsibilities include:
 * - Creating a Hono server instance.
 * - Applying and configuring middleware for CORS, rate limiting, and authentication (JWT/OAuth).
 * - Defining the routes (`/mcp` endpoint for POST, GET, DELETE) to handle the MCP lifecycle.
 * - Orchestrating session management by mapping session IDs to SDK transport instances.
 * - Implementing port-binding logic with automatic retry on conflicts.
 *
 * The underlying implementation of the MCP Streamable HTTP specification, including
 * Server-Sent Events (SSE) for streaming, is handled by the SDK's transport class.
 *
 * Specification Reference:
 * https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/transports.mdx#streamable-http
 * @module src/mcp-server/transports/httpTransport
 */
import { ServerType } from "@hono/node-server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestContext } from "../../utils/index.js";
export declare function startHttpTransport(createServerInstanceFn: () => Promise<McpServer>, parentContext: RequestContext): Promise<ServerType>;
