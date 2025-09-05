# Obsidian MCP Server Documentation

[![Version](https://img.shields.io/badge/Version-2.0.7-blue.svg)](https://github.com/cyanheads/obsidian-mcp-server)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen.svg)](https://github.com/cyanheads/obsidian-mcp-server)

**Empower your AI agents with seamless Obsidian integration!**

This documentation covers the Model Context Protocol (MCP) server that provides comprehensive access to your Obsidian vault, enabling AI assistants like Claude to read, write, search, and manage your notes through the Obsidian Local REST API plugin.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Local Installation](#local-installation)
- [Tools Reference](#tools-reference)
- [Configuration Guide](#configuration-guide)
- [Use Cases & Workflows](#use-cases--workflows)
- [Troubleshooting](#troubleshooting)

## 🚀 Overview

The Obsidian MCP Server acts as a bridge between AI assistants and your Obsidian vault, allowing:

- **Automated vault management**: Read, update, search, and organize notes programmatically
- **AI-enhanced workflows**: Enable LLMs to access your knowledge base for research and writing
- **Custom integrations**: Build external tools that interact with your vault data

**Local Installation Path**: `/Users/willflower/Documents/Projects/obsidian-mcp-server`

## ✨ Features

### Core Capabilities
- **Comprehensive Note Operations**: Read, write, update, and delete notes
- **Advanced Search**: Global vault search with regex support and caching
- **Metadata Management**: Handle frontmatter and tags programmatically  
- **Performance Optimization**: In-memory caching with 10-minute refresh cycles
- **Resilient Design**: Fallback mechanisms for API failures
- **Security**: API key authentication and SSL configuration options

### Architecture Highlights
- Built on robust MCP TypeScript template
- Integrates with Obsidian Local REST API plugin
- Supports both HTTP and stdio transports
- Structured logging with sensitive data redaction
- Input validation and sanitization with Zod schemas

## 🛠️ Local Installation

**Server Location**: `/Users/willflower/Documents/Projects/obsidian-mcp-server`

### Prerequisites
1. **Obsidian** with Local REST API plugin installed
2. **API Key** configured in the Local REST API plugin settings  
3. **Node.js** v18+ and npm

### Installation Status
- ✅ Server installed and configured
- ✅ Dependencies resolved (`node_modules` present)
- ✅ Built distribution available (`dist/` directory)
- ✅ MCP configuration file present (`mcp.json`)

## 📚 Next Steps

See the additional documentation files in this directory:

- **[Tools Reference](./TOOLS_REFERENCE.md)** - Detailed guide to all 8 MCP tools
- **[Configuration Guide](./CONFIGURATION.md)** - Setup and environment configuration
- **[Use Cases & Workflows](./USE_CASES.md)** - Practical examples and workflows
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions

---

*This documentation is for the locally installed Obsidian MCP Server at `/Users/willflower/Documents/Projects/obsidian-mcp-server`*