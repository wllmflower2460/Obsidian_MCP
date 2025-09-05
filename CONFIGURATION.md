# Obsidian MCP Server Configuration Guide

This guide covers the complete setup and configuration of the Obsidian MCP Server for your local environment.

## 🏠 Local Environment Details

**Server Location**: `/Users/willflower/Documents/Projects/obsidian-mcp-server`
**Documentation Location**: `/Users/willflower/Documents/flower.mobile@gmail.com/04__Operations/Obsidian_MCP`

## 📋 Prerequisites

### Required Components
1. **Obsidian**: Installed and running
2. **Obsidian Local REST API Plugin**: [Install from Community Plugins](https://github.com/coddingtonbear/obsidian-local-rest-api)
3. **Node.js**: Version 18+ (currently installed)
4. **API Key**: Generated from the Local REST API plugin settings

### Current Installation Status
- ✅ Server installed at local path
- ✅ Node modules resolved
- ✅ Distribution built (`dist/` directory present)
- ✅ Configuration files present (`mcp.json`, `package.json`)

## 🔧 Obsidian Local REST API Setup

### Step 1: Install the Plugin
1. Open Obsidian
2. Go to Settings → Community plugins
3. Browse and install "Local REST API"
4. Enable the plugin

### Step 2: Configure API Access
1. In plugin settings, generate an API key
2. Configure server endpoints:
   - **HTTP (Recommended)**: `http://127.0.0.1:27123`
   - **HTTPS**: `https://127.0.0.1:27124` (requires SSL configuration)

### Step 3: Test API Connection
```bash
# Test the API endpoint (replace YOUR_API_KEY)
curl -H "Authorization: Bearer YOUR_API_KEY" http://127.0.0.1:27123/vault/
```

## 🌐 MCP Client Configuration

### For Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "obsidian-mcp-server": {
      "command": "node",
      "args": ["/Users/willflower/Documents/Projects/obsidian-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_API_KEY": "YOUR_OBSIDIAN_API_KEY",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_VERIFY_SSL": "false",
        "OBSIDIAN_ENABLE_CACHE": "true",
        "MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

### For Cline/Other MCP Clients
Add to your `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "obsidian-mcp-server": {
      "command": "node",
      "args": ["/Users/willflower/Documents/Projects/obsidian-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_API_KEY": "YOUR_OBSIDIAN_API_KEY",
        "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_VERIFY_SSL": "false",
        "OBSIDIAN_ENABLE_CACHE": "true"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 🔐 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| **`OBSIDIAN_API_KEY`** | API Key from Obsidian Local REST API plugin | **Yes** | `undefined` |
| **`OBSIDIAN_BASE_URL`** | Base URL of your Obsidian Local REST API | **Yes** | `http://127.0.0.1:27123` |
| `OBSIDIAN_VERIFY_SSL` | Disable SSL verification for self-signed certs | No | `true` |
| `OBSIDIAN_ENABLE_CACHE` | Enable in-memory vault cache | No | `true` |
| `OBSIDIAN_CACHE_REFRESH_INTERVAL_MIN` | Cache refresh interval in minutes | No | `10` |
| `MCP_TRANSPORT_TYPE` | Server transport: `stdio` or `http` | No | `stdio` |
| `MCP_LOG_LEVEL` | Logging level: `debug`, `info`, `error` | No | `info` |

### SSL Configuration Options

#### Option 1: HTTP (Recommended for Local Use)
- Use `http://127.0.0.1:27123`
- No SSL verification needed
- Simpler setup

#### Option 2: HTTPS with Self-Signed Certificate
- Use `https://127.0.0.1:27124`
- Set `OBSIDIAN_VERIFY_SSL=false`
- More secure but complex setup

## 🚀 Starting the Server

### Development Mode
```bash
cd /Users/willflower/Documents/Projects/obsidian-mcp-server

# Start with stdio transport (for MCP clients)
npm run start:stdio

# Start with HTTP transport (for web clients)
npm run start:http

# Debug mode
MCP_LOG_LEVEL=debug npm run start:stdio
```

### Production Mode
```bash
# Run the built distribution
node /Users/willflower/Documents/Projects/obsidian-mcp-server/dist/index.js
```

## 🔍 Testing the Installation

### 1. Health Check
```bash
# Test server health (if using HTTP transport)
curl http://localhost:3010/health
```

### 2. MCP Inspector
```bash
cd /Users/willflower/Documents/Projects/obsidian-mcp-server

# Inspect available tools and capabilities
npm run inspect:stdio
```

### 3. Test Basic Operations
Use your MCP client to test basic operations:
1. List notes in a directory
2. Read a simple note
3. Search for content

## 🎯 Cache Configuration

### Enable Caching (Recommended)
```bash
OBSIDIAN_ENABLE_CACHE=true
OBSIDIAN_CACHE_REFRESH_INTERVAL_MIN=10
```

**Benefits**:
- Faster search operations
- Fallback for API failures
- Reduced API calls to Obsidian

**Considerations**:
- Uses memory proportional to vault size
- 10-minute refresh cycle may miss immediate changes
- Automatically updates after write operations

### Disable Caching
```bash
OBSIDIAN_ENABLE_CACHE=false
```

Use this for:
- Very large vaults (>10GB)
- Real-time accuracy requirements
- Memory-constrained environments

## 🔒 Security Considerations

### API Key Management
- Store API keys securely
- Rotate keys periodically
- Use environment-specific configurations

### Network Security
- Use HTTP for local-only access
- Configure HTTPS for network access
- Consider firewall rules for production

### Access Control
- Limit MCP client access
- Monitor log files for suspicious activity
- Regular security audits

## 📝 Logging Configuration

### Log Levels
- `debug`: Detailed debugging information
- `info`: General operational information  
- `warn`: Warning messages
- `error`: Error conditions only

### Log Locations
- Console output for development
- File rotation for production (if configured)
- MCP client integration logs

## 🐛 Troubleshooting

### Common Issues

#### "Connection Refused" Errors
1. Verify Obsidian is running
2. Check Local REST API plugin is enabled
3. Confirm API endpoint URL and port

#### "Unauthorized" Errors
1. Verify API key is correct
2. Check API key has proper permissions
3. Ensure no extra spaces in configuration

#### "SSL Certificate" Errors
1. Set `OBSIDIAN_VERIFY_SSL=false`
2. Or switch to HTTP endpoint
3. Configure proper SSL certificates

#### Performance Issues
1. Enable caching: `OBSIDIAN_ENABLE_CACHE=true`
2. Adjust cache refresh interval
3. Monitor memory usage

### Debug Commands
```bash
# Check server status
ps aux | grep obsidian-mcp-server

# Test API connectivity
curl -H "Authorization: Bearer YOUR_API_KEY" http://127.0.0.1:27123/vault/

# View logs
tail -f /path/to/logfile.log
```

---

*For practical examples and workflows, see [USE_CASES.md](./USE_CASES.md)*