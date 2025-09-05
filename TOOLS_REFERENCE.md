# Obsidian MCP Tools Reference

This document provides detailed information about all 8 tools available in the Obsidian MCP Server.

## 🛠️ Available Tools

| Tool Name | Description | Key Features |
|-----------|-------------|--------------|
| [`obsidian_read_note`](#obsidian_read_note) | Retrieves content and metadata of a note | Multiple formats, file stats, case-insensitive fallback |
| [`obsidian_update_note`](#obsidian_update_note) | Modifies notes with whole-file operations | Append, prepend, overwrite modes with file creation |
| [`obsidian_search_replace`](#obsidian_search_replace) | Search-and-replace operations within notes | String/regex support, case sensitivity options |
| [`obsidian_global_search`](#obsidian_global_search) | Search across entire vault | Text/regex search, path filtering, pagination |
| [`obsidian_list_notes`](#obsidian_list_notes) | List notes and subdirectories in folders | Extension filtering, regex name matching, tree view |
| [`obsidian_manage_frontmatter`](#obsidian_manage_frontmatter) | Manage YAML frontmatter atomically | Get, set, delete operations for metadata |
| [`obsidian_manage_tags`](#obsidian_manage_tags) | Add, remove, or list note tags | Frontmatter and inline tag management |
| [`obsidian_delete_note`](#obsidian_delete_note) | Permanently delete notes from vault | Case-insensitive path fallback for safety |

---

## Tool Details

### `obsidian_read_note`

**Purpose**: Retrieves the content and metadata of a specified note.

**Parameters**:
- `filePath` (required): Path to the note file
- `format` (optional): Output format - `"markdown"` or `"json"` (default: `"markdown"`)
- `includeStat` (optional): Include file statistics (default: `true`)

**Features**:
- Case-insensitive path fallback
- File creation/modification timestamps
- Support for both markdown and JSON output formats

**Example Usage**:
```json
{
  "filePath": "Daily Notes/2024-01-15.md",
  "format": "json",
  "includeStat": true
}
```

### `obsidian_update_note`

**Purpose**: Modifies notes using whole-file operations (append, prepend, or overwrite).

**Parameters**:
- `targetType` (required): `"file_path"`, `"active_note"`, or `"periodic_note"`
- `content` (required): Content to add or replace
- `targetIdentifier` (optional): File path or periodic note identifier
- `wholeFileMode` (required): `"append"`, `"prepend"`, or `"overwrite"`

**Features**:
- Can create files if they don't exist
- Support for active note and periodic note targeting
- Atomic file operations

**Example Usage**:
```json
{
  "targetType": "file_path",
  "targetIdentifier": "Projects/My Project.md",
  "content": "\n## New Section\n\nAdditional content here.",
  "wholeFileMode": "append"
}
```

### `obsidian_search_replace`

**Purpose**: Performs search-and-replace operations within a target note.

**Parameters**:
- `targetType` (required): Target specification type
- `replacements` (required): Array of search-replace operations
- `useRegex` (optional): Enable regex search (default: `false`)
- `replaceAll` (optional): Replace all occurrences (default: `false`)

**Features**:
- String and regex search support
- Case sensitivity options
- Whole word matching
- Bulk replacement operations

**Example Usage**:
```json
{
  "targetType": "file_path",
  "targetIdentifier": "Notes/Research.md",
  "replacements": [
    {
      "search": "old term",
      "replace": "new term"
    }
  ],
  "replaceAll": true
}
```

### `obsidian_global_search`

**Purpose**: Performs a search across the entire vault.

**Parameters**:
- `query` (required): Search query string
- `searchInPath` (optional): Limit search to specific path
- `useRegex` (optional): Enable regex search (default: `false`)
- `page` (optional): Page number for pagination (default: `1`)
- `pageSize` (optional): Results per page (default: `20`)

**Features**:
- Full-text search across all notes
- Path filtering capabilities
- Regex pattern matching
- Paginated results
- Cached fallback for performance

**Example Usage**:
```json
{
  "query": "machine learning",
  "searchInPath": "Research/",
  "useRegex": false,
  "page": 1,
  "pageSize": 10
}
```

### `obsidian_list_notes`

**Purpose**: Lists notes and subdirectories within a specified vault folder.

**Parameters**:
- `dirPath` (required): Directory path to list
- `fileExtensionFilter` (optional): Filter by file extension
- `nameRegexFilter` (optional): Filter by name using regex

**Features**:
- Hierarchical directory listing
- File extension filtering
- Regex name pattern matching
- Formatted tree view output

**Example Usage**:
```json
{
  "dirPath": "Projects/",
  "fileExtensionFilter": ".md",
  "nameRegexFilter": ".*2024.*"
}
```

### `obsidian_manage_frontmatter`

**Purpose**: Atomically manages a note's YAML frontmatter.

**Parameters**:
- `filePath` (required): Path to the note file
- `operation` (required): `"get"`, `"set"`, or `"delete"`
- `key` (required): Frontmatter key to manage
- `value` (optional): Value to set (required for `"set"` operation)

**Features**:
- Atomic frontmatter operations
- Preserves existing frontmatter structure
- Avoids full file rewrites for metadata changes

**Example Usage**:
```json
{
  "filePath": "Notes/Project Status.md",
  "operation": "set",
  "key": "status",
  "value": "completed"
}
```

### `obsidian_manage_tags`

**Purpose**: Adds, removes, or lists tags for a note.

**Parameters**:
- `filePath` (required): Path to the note file
- `operation` (required): `"add"`, `"remove"`, or `"list"`
- `tags` (required): Array of tags to manage

**Features**:
- Manages tags in YAML frontmatter
- Handles inline tags in content
- Bulk tag operations
- Tag normalization

**Example Usage**:
```json
{
  "filePath": "Notes/Meeting Notes.md",
  "operation": "add",
  "tags": ["meeting", "project-alpha", "urgent"]
}
```

### `obsidian_delete_note`

**Purpose**: Permanently deletes a specified note from the vault.

**Parameters**:
- `filePath` (required): Path to the note file to delete

**Features**:
- Permanent file deletion
- Case-insensitive path fallback
- Safety confirmations

**Example Usage**:
```json
{
  "filePath": "Temporary/Draft.md"
}
```

---

## Common Patterns

### File Path Targeting
Most tools support flexible file path targeting:
- **Absolute paths**: `"Projects/My Project.md"`
- **Relative paths**: `"./Daily Notes/2024-01-15.md"`
- **Case-insensitive fallback**: Automatically handles case mismatches

### Error Handling
All tools return structured JSON responses with:
- Success/failure status
- Detailed error messages
- Request correlation IDs for debugging
- Fallback mechanisms where applicable

### Performance Considerations
- **Caching**: Global search uses intelligent caching for performance
- **Batch Operations**: Search-replace and tag management support bulk operations
- **Atomic Updates**: Frontmatter operations avoid unnecessary file rewrites

---

*For configuration details, see [CONFIGURATION.md](./CONFIGURATION.md)*