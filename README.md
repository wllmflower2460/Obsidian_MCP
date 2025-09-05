# Obsidian MCP Server - Complete Package

[![TypeScript](https://img.shields.io/badge/TypeScript-^5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP%20SDK-^1.13.0-green.svg)](https://modelcontextprotocol.io/)
[![Version](https://img.shields.io/badge/Version-2.0.7-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen.svg)](https://github.com/wllmflower2460/Obsidian_MCP)

**Complete Obsidian MCP Server package with source code and comprehensive documentation!**

This repository contains the complete Obsidian MCP (Model Context Protocol) server providing comprehensive access to your Obsidian vault. Enables AI assistants like Claude to read, write, search, and manage your notes through the [Obsidian Local REST API plugin](https://github.com/coddingtonbear/obsidian-local-rest-api).

## 🚀 What's Included

This repository provides:
- **Complete Source Code**: Full TypeScript implementation of the MCP server
- **Ready-to-Run Distribution**: Pre-built server in `dist/` directory
- **Comprehensive Documentation**: Detailed guides for setup, configuration, and usage
- **All Dependencies**: Complete `node_modules` for immediate use

## 📁 Repository Structure

```
├── 📁 src/                    # Complete TypeScript source code
├── 📁 dist/                   # Pre-built server distribution
├── 📁 docs/                   # Additional technical documentation
├── 📁 node_modules/           # All dependencies installed
├── 📄 README.md               # This file
├── 📄 TOOLS_REFERENCE.md      # Detailed tool documentation
├── 📄 CONFIGURATION.md        # Setup and configuration guide
├── 📄 USE_CASES.md           # Practical workflows and examples
├── 📄 TROUBLESHOOTING.md     # Common issues and solutions
├── 📄 CHANGELOG.md           # Version history and updates
├── 📄 package.json           # Node.js project configuration
├── 📄 LICENSE                # Apache 2.0 license
└── 📄 mcp.json              # MCP inspector configuration
```

## 🎯 Core Capabilities: Obsidian Tools 🛠️

This server equips your AI with 8 specialized tools to interact with your Obsidian vault:

| Tool Name | Description | Key Features |
|-----------|-------------|--------------|
| [`obsidian_read_note`](./src/mcp-server/tools/obsidianReadNoteTool/) | Retrieves content and metadata of notes | Read in `markdown` or `json` format, case-insensitive fallback |
| [`obsidian_update_note`](./src/mcp-server/tools/obsidianUpdateNoteTool/) | Modifies notes with whole-file operations | `append`, `prepend`, or `overwrite` content with file creation |
| [`obsidian_search_replace`](./src/mcp-server/tools/obsidianSearchReplaceTool/) | Performs search-and-replace operations | String or regex search with case sensitivity options |
| [`obsidian_global_search`](./src/mcp-server/tools/obsidianGlobalSearchTool/) | Searches across the entire vault | Text/regex search, path filtering, pagination |
| [`obsidian_list_notes`](./src/mcp-server/tools/obsidianListNotesTool/) | Lists notes and subdirectories in folders | Extension filtering, regex name matching, tree view |
| [`obsidian_manage_frontmatter`](./src/mcp-server/tools/obsidianManageFrontmatterTool/) | Atomically manages YAML frontmatter | `get`, `set`, or `delete` frontmatter keys |
| [`obsidian_manage_tags`](./src/mcp-server/tools/obsidianManageTagsTool/) | Adds, removes, or lists tags for notes | Manages both YAML frontmatter and inline tags |
| [`obsidian_delete_note`](./src/mcp-server/tools/obsidianDeleteNoteTool/) | Permanently deletes notes from vault | Case-insensitive path fallback for safety |

## 🚀 Quick Start

### 1. Install Dependencies (Already Done!)
```bash
# Dependencies are already installed in node_modules/
# But you can reinstall if needed:
npm install
```

### 2. Configure Obsidian
1. Install the [Obsidian Local REST API plugin](https://github.com/coddingtonbear/obsidian-local-rest-api)
2. Generate an API key in the plugin settings
3. Note the API endpoint URL (usually `http://127.0.0.1:27123`)

### 3. Configure Your MCP Client
Add to your MCP client configuration (e.g., `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "obsidian-mcp-server": {
      "command": "node",
      "args": ["/path/to/this/repo/dist/index.js"],
      "env": {
        "OBSIDIAN_API_KEY": "YOUR_OBSIDIAN_API_KEY",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_VERIFY_SSL": "false",
        "OBSIDIAN_ENABLE_CACHE": "true"
      }
    }
  }
}
```

### 4. Start Using!
Your AI assistant can now interact with your Obsidian vault using the 8 available tools.

## 📚 Documentation

### Comprehensive Guides
- **[TOOLS_REFERENCE.md](./TOOLS_REFERENCE.md)** - Detailed documentation of all 8 MCP tools with examples
- **[CONFIGURATION.md](./CONFIGURATION.md)** - Complete setup and environment configuration guide
- **[USE_CASES.md](./USE_CASES.md)** - Practical workflows and advanced use cases
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and debugging solutions

### Technical Documentation
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and updates
- **[docs/tree.md](./docs/tree.md)** - Detailed file structure
- **[LICENSE](./LICENSE)** - Apache 2.0 license terms

## ⚡ Key Features

### Core Utilities
- **Robust Architecture**: Built on `cyanheads/mcp-ts-template` with comprehensive error handling
- **Performance Optimized**: Intelligent in-memory caching with 10-minute refresh cycles
- **Security First**: API key authentication, input validation, and sensitive data redaction
- **Type Safety**: Strong TypeScript typing with Zod schema validation
- **Transport Flexibility**: Support for both stdio and HTTP transports

### Obsidian Integration
- **Direct API Integration**: Communicates with Obsidian Local REST API plugin
- **Comprehensive Operations**: Full CRUD operations for notes, tags, and frontmatter
- **Smart Targeting**: Target files by path, active note, or periodic notes
- **Resilient Design**: Fallback mechanisms and case-insensitive path resolution
- **Cache Intelligence**: Automatic cache updates and search fallbacks

## 🔧 Development

### Available Scripts
```bash
# Build the project
npm run build

# Start server (stdio transport)
npm run start:stdio

# Start server (HTTP transport) 
npm run start:http

# Rebuild everything
npm run rebuild

# Format code
npm run format

# Inspect capabilities
npm run inspect:stdio
```

### Testing the Server
```bash
# Test with MCP Inspector
npm run inspect

# Manual API testing
curl -H "Authorization: Bearer YOUR_API_KEY" http://127.0.0.1:27123/vault/
```

## 🌟 Use Case Examples

### Research Workflows
- Automatically gather information from multiple notes
- Generate literature reviews and summaries
- Create cross-reference maps and connections

### Vault Maintenance
- Standardize tagging across your knowledge base
- Fix broken internal links
- Clean up inconsistent formatting

### Content Creation
- Generate structured meeting notes
- Create project status reports
- Build knowledge synthesis documents

*See [USE_CASES.md](./USE_CASES.md) for detailed examples and workflows.*

## 🛠️ Architecture

### Project Structure
```
src/
├── index.ts           # Entry point and server initialization
├── config/            # Configuration loading and validation
├── mcp-server/        # Core MCP server logic
│   ├── server.ts      # Server setup and tool registration
│   ├── tools/         # All 8 MCP tool implementations
│   └── transports/    # Stdio and HTTP transport logic
├── services/          # External API clients and caching
│   └── obsidianRestAPI/
├── types-global/      # Shared TypeScript definitions
└── utils/             # Common utilities and helpers
```

### Key Components
- **VaultCacheService**: Intelligent in-memory caching for performance
- **ObsidianRestApiService**: Typed client for Obsidian Local REST API
- **Tool Implementations**: 8 comprehensive vault interaction tools
- **Transport Layer**: Flexible stdio/HTTP communication protocols

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Based on the original [obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server) by Casey Hand (@cyanheads).

This repository packages the complete server with documentation for enhanced note-taking workflows.

---

<div align="center">

**Ready to transform your note-taking with AI assistance?**

Start with the [CONFIGURATION.md](./CONFIGURATION.md) guide!

Built with the [Model Context Protocol](https://modelcontextprotocol.io/)

</div>