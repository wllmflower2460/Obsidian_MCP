# Obsidian MCP Server Troubleshooting Guide

This guide covers common issues and their solutions when using the Obsidian MCP Server.

## 🚨 Common Issues

### Connection Problems
- [API Connection Failed](#api-connection-failed)
- [SSL Certificate Errors](#ssl-certificate-errors)
- [Port Conflicts](#port-conflicts)

### Authentication Issues
- [Unauthorized Access](#unauthorized-access)
- [API Key Problems](#api-key-problems)

### Performance Issues
- [Slow Search Operations](#slow-search-operations)
- [Memory Usage](#memory-usage)
- [Cache Problems](#cache-problems)

### Tool-Specific Issues
- [File Not Found Errors](#file-not-found-errors)
- [Search Results Empty](#search-results-empty)
- [Frontmatter Corruption](#frontmatter-corruption)

---

## 🔧 Connection Problems

### API Connection Failed

**Symptoms**:
- "Connection refused" errors
- "ECONNREFUSED" in logs
- MCP tools timing out

**Causes & Solutions**:

1. **Obsidian Not Running**
   ```bash
   # Check if Obsidian is running
   ps aux | grep -i obsidian
   ```
   **Solution**: Launch Obsidian

2. **Local REST API Plugin Disabled**
   - Open Obsidian Settings → Community plugins
   - Ensure "Local REST API" is enabled
   - Check plugin status indicator

3. **Wrong Port/URL Configuration**
   ```bash
   # Test the configured endpoint
   curl -H "Authorization: Bearer YOUR_API_KEY" http://127.0.0.1:27123/
   ```
   **Common URLs**:
   - HTTP: `http://127.0.0.1:27123`
   - HTTPS: `https://127.0.0.1:27124`

4. **Firewall Blocking Connection**
   ```bash
   # Test port accessibility
   telnet 127.0.0.1 27123
   ```
   **Solution**: Configure firewall to allow local connections

### SSL Certificate Errors

**Symptoms**:
- "self signed certificate" errors
- "CERT_HAS_EXPIRED" messages
- SSL handshake failures

**Solutions**:

1. **Disable SSL Verification (Recommended)**
   ```json
   {
     "env": {
       "OBSIDIAN_VERIFY_SSL": "false"
     }
   }
   ```

2. **Switch to HTTP Endpoint**
   ```json
   {
     "env": {
       "OBSIDIAN_BASE_URL": "http://127.0.0.1:27123"
     }
   }
   ```

3. **Accept Self-Signed Certificate**
   - Browser: Visit HTTPS URL and accept security warning
   - System: Add certificate to trusted store

### Port Conflicts

**Symptoms**:
- "Port already in use" errors
- Service fails to start
- Connection works intermittently

**Diagnosis**:
```bash
# Check what's using the port
lsof -i :27123
netstat -tulpn | grep :27123
```

**Solutions**:
1. **Stop Conflicting Service**
2. **Change Obsidian API Port** (in plugin settings)
3. **Use Alternative Port** in configuration

---

## 🔐 Authentication Issues

### Unauthorized Access

**Symptoms**:
- "401 Unauthorized" responses
- "Authentication failed" messages
- Access denied errors

**Diagnosis Steps**:

1. **Verify API Key Format**
   ```bash
   # Test API key directly
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        http://127.0.0.1:27123/vault/
   ```

2. **Check Key Configuration**
   - Ensure no extra spaces or quotes
   - Verify environment variable is set correctly
   - Check for invisible characters

3. **Validate Plugin Settings**
   - Open Obsidian → Settings → Local REST API
   - Verify API key matches configuration
   - Check if key has expired or been regenerated

**Solutions**:

1. **Regenerate API Key**
   - Create new key in plugin settings
   - Update MCP client configuration
   - Restart MCP server

2. **Check Environment Variable**
   ```bash
   # Verify env var is set (in MCP client)
   echo $OBSIDIAN_API_KEY
   ```

3. **Clear and Reset Configuration**
   - Remove existing configuration
   - Generate fresh API key
   - Reconfigure from scratch

### API Key Problems

**Common Issues**:

1. **Key Contains Special Characters**
   - Escape special characters in configuration
   - Use quotes around key value
   - Consider regenerating simpler key

2. **Key Length Issues**
   - Ensure key is complete (not truncated)
   - Check for line breaks in key
   - Verify minimum/maximum length requirements

3. **Multiple Keys Confusion**
   - Use only one active key
   - Disable unused keys in plugin
   - Document which key is current

---

## ⚡ Performance Issues

### Slow Search Operations

**Symptoms**:
- Global search takes >10 seconds
- Search timeouts
- High CPU usage during search

**Solutions**:

1. **Enable Caching**
   ```json
   {
     "env": {
       "OBSIDIAN_ENABLE_CACHE": "true",
       "OBSIDIAN_CACHE_REFRESH_INTERVAL_MIN": "10"
     }
   }
   ```

2. **Optimize Search Queries**
   - Use specific search paths
   - Avoid overly broad regex patterns
   - Implement pagination for large results

3. **Reduce Vault Size Impact**
   - Exclude large binary files
   - Use `.gitignore` style exclusions
   - Archive old/unused notes

### Memory Usage

**Symptoms**:
- High memory consumption
- "Out of memory" errors
- System becomes sluggish

**Monitoring**:
```bash
# Monitor MCP server memory usage
ps -p PID -o pid,ppid,%mem,%cpu,cmd
```

**Solutions**:

1. **Adjust Cache Settings**
   ```json
   {
     "env": {
       "OBSIDIAN_ENABLE_CACHE": "false"
     }
   }
   ```

2. **Increase System Memory**
3. **Optimize Vault Size**
4. **Restart Server Periodically**

### Cache Problems

**Symptoms**:
- Stale search results
- Recent changes not reflected
- Cache rebuild failures

**Solutions**:

1. **Manual Cache Refresh**
   ```bash
   # Restart server to rebuild cache
   # (Implementation depends on your MCP client)
   ```

2. **Adjust Refresh Interval**
   ```json
   {
     "env": {
       "OBSIDIAN_CACHE_REFRESH_INTERVAL_MIN": "5"
     }
   }
   ```

3. **Disable Cache Temporarily**
   ```json
   {
     "env": {
       "OBSIDIAN_ENABLE_CACHE": "false"
     }
   }
   ```

---

## 📁 Tool-Specific Issues

### File Not Found Errors

**Symptoms**:
- "File does not exist" messages
- Path resolution failures
- Case sensitivity issues

**Solutions**:

1. **Check File Path Format**
   ```json
   // Correct formats
   "Projects/My Project.md"
   "./Daily Notes/2024-01-15.md"
   "/absolute/path/to/note.md"
   ```

2. **Use Case-Insensitive Fallback**
   - The server automatically tries case variations
   - Check vault for actual file names
   - Verify file extensions

3. **List Directory Contents**
   ```json
   {
     "tool": "obsidian_list_notes",
     "dirPath": "Projects/",
     "fileExtensionFilter": ".md"
   }
   ```

### Search Results Empty

**Symptoms**:
- Global search returns no results
- Expected content not found
- Search works in Obsidian UI but not via MCP

**Debugging Steps**:

1. **Test Simple Search**
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "the",
     "pageSize": 5
   }
   ```

2. **Check Search Parameters**
   - Verify regex syntax if using `useRegex: true`
   - Test without path restrictions first
   - Try broader search terms

3. **Verify Vault Access**
   ```json
   {
     "tool": "obsidian_list_notes",
     "dirPath": ""
   }
   ```

**Solutions**:
- Test direct API access with curl
- Check plugin permissions
- Verify vault path configuration

### Frontmatter Corruption

**Symptoms**:
- YAML parsing errors
- Frontmatter becomes unreadable
- Metadata operations fail

**Prevention**:
- Always backup before frontmatter operations
- Use `get` operation to verify structure first
- Test with non-critical files initially

**Recovery**:
1. **Manual Restoration**
   - Use Obsidian's version history
   - Restore from backups
   - Manually fix YAML syntax

2. **Automated Repair**
   ```json
   {
     "tool": "obsidian_read_note",
     "filePath": "damaged-file.md",
     "format": "markdown"
   }
   ```
   - Extract content manually
   - Recreate frontmatter structure
   - Use `overwrite` mode to replace file

---

## 🔍 Debugging Tools

### Enable Debug Logging
```json
{
  "env": {
    "MCP_LOG_LEVEL": "debug"
  }
}
```

### API Testing Commands
```bash
# Test basic connectivity
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://127.0.0.1:27123/vault/

# Test specific endpoints
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://127.0.0.1:27123/vault/notes/

# Test with verbose output
curl -v -H "Authorization: Bearer YOUR_API_KEY" \
     http://127.0.0.1:27123/vault/
```

### MCP Inspector
```bash
cd /Users/willflower/Documents/Projects/obsidian-mcp-server
npm run inspect:stdio
```

### Log Analysis
1. **Check MCP client logs** for error patterns
2. **Monitor system resources** during operations
3. **Compare timestamps** between operations and errors
4. **Look for correlation** between specific tools and issues

---

## 📞 Getting Help

### Before Reporting Issues
1. **Check this troubleshooting guide**
2. **Test with minimal configuration**
3. **Gather relevant logs and error messages**
4. **Document steps to reproduce**

### Support Resources
- **GitHub Issues**: [obsidian-mcp-server issues](https://github.com/cyanheads/obsidian-mcp-server/issues)
- **MCP Documentation**: [Model Context Protocol docs](https://modelcontextprotocol.io/)
- **Obsidian Community**: [Community forums](https://forum.obsidian.md/)

### Issue Report Template
```
**Environment**:
- OS: macOS 14.6.0
- Node.js version: 
- Obsidian version:
- Plugin version:
- MCP client:

**Configuration**:
```json
{
  "env": {
    "OBSIDIAN_BASE_URL": "...",
    // ... other relevant config
  }
}
```

**Issue Description**:
[Detailed description of the problem]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Logs/Error Messages**:
```
[Paste relevant log entries]
```
```

---

*For additional use cases and workflows, see [USE_CASES.md](./USE_CASES.md)*