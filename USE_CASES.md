# Obsidian MCP Use Cases & Workflows

This document provides practical examples and workflows for using the Obsidian MCP Server to enhance your note-taking and knowledge management.

## 🎯 Core Use Cases

### 1. **Research & Knowledge Synthesis**
Transform scattered notes into comprehensive insights

### 2. **Automated Vault Maintenance**
Keep your knowledge base organized and consistent

### 3. **Content Creation Workflows**
Generate structured content from existing knowledge

### 4. **Project Management Integration**
Link notes with project tracking and status updates

### 5. **Daily & Periodic Reviews**
Automated analysis of your productivity and learning

---

## 🔬 Research & Knowledge Synthesis

### Use Case: Literature Review Automation
**Scenario**: You're researching machine learning techniques and have dozens of papers and notes scattered across your vault.

**Workflow**:
1. **Gather Sources**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "machine learning OR deep learning OR neural networks",
     "searchInPath": "Research/Papers/",
     "pageSize": 50
   }
   ```

2. **Extract Key Concepts**:
   - AI reads each paper note
   - Identifies common themes and methodologies
   - Creates concept maps linking related ideas

3. **Generate Synthesis**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Research/ML Literature Review 2024.md",
     "wholeFileMode": "overwrite",
     "content": "# Machine Learning Literature Review\n\n## Key Findings\n[AI-generated synthesis]..."
   }
   ```

**Benefits**:
- Comprehensive overview from scattered sources
- Identification of research gaps
- Automated bibliography generation

### Use Case: Cross-Reference Discovery
**Scenario**: Find connections between different areas of your knowledge base.

**Workflow**:
1. **Search Related Topics**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "productivity.*flow state",
     "useRegex": true
   }
   ```

2. **Analyze Connections**:
   - AI identifies common patterns across notes
   - Maps relationships between concepts
   - Suggests new connections

3. **Create Connection Notes**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Maps of Content/Productivity-Flow Connections.md",
     "wholeFileMode": "append",
     "content": "## New Connection Discovered\n[[Note A]] relates to [[Note B]] through..."
   }
   ```

---

## 🧹 Automated Vault Maintenance

### Use Case: Tag Standardization
**Scenario**: Your vault has inconsistent tagging (e.g., "machine-learning", "ML", "machinelearning").

**Workflow**:
1. **Find Tag Variations**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "#machine.?learning|#ML\\b|#machinelearning",
     "useRegex": true
   }
   ```

2. **Standardize Tags**:
   For each note found:
   ```json
   {
     "tool": "obsidian_manage_tags",
     "filePath": "Research/Paper Note.md",
     "operation": "remove",
     "tags": ["machine-learning", "ML"]
   }
   ```
   Then:
   ```json
   {
     "tool": "obsidian_manage_tags",
     "filePath": "Research/Paper Note.md",
     "operation": "add",
     "tags": ["machine_learning"]
   }
   ```

**Benefits**:
- Consistent tagging across vault
- Improved search accuracy
- Better organization

### Use Case: Broken Link Detection
**Scenario**: Identify and fix broken internal links in your vault.

**Workflow**:
1. **Find Potential Broken Links**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "\\[\\[[^]]*\\]\\]",
     "useRegex": true
   }
   ```

2. **Validate Links**:
   - Extract link targets from search results
   - Check if target files exist using `obsidian_read_note`
   - Compile list of broken links

3. **Fix or Update Links**:
   ```json
   {
     "tool": "obsidian_search_replace",
     "targetType": "file_path",
     "targetIdentifier": "Project Notes/Overview.md",
     "replacements": [
       {
         "search": "[[Old Note Name]]",
         "replace": "[[New Note Name]]"
       }
     ]
   }
   ```

---

## ✍️ Content Creation Workflows

### Use Case: Meeting Notes Template
**Scenario**: Generate structured meeting notes with consistent formatting.

**Workflow**:
1. **Create Template Content**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Meetings/2024-01-15 Team Standup.md",
     "wholeFileMode": "overwrite",
     "content": "# Team Standup - January 15, 2024\n\n## Attendees\n- \n\n## Agenda Items\n### Previous Action Items\n- \n\n### Current Sprint Progress\n- \n\n### Blockers & Issues\n- \n\n### Next Actions\n- [ ] \n\n---\n*Meeting Notes Created: 2024-01-15*"
   }
   ```

2. **Set Metadata**:
   ```json
   {
     "tool": "obsidian_manage_frontmatter",
     "filePath": "Meetings/2024-01-15 Team Standup.md",
     "operation": "set",
     "key": "meeting_type",
     "value": "standup"
   }
   ```

3. **Add Tags**:
   ```json
   {
     "tool": "obsidian_manage_tags",
     "filePath": "Meetings/2024-01-15 Team Standup.md",
     "operation": "add",
     "tags": ["meeting", "standup", "team"]
   }
   ```

### Use Case: Project Status Reports
**Scenario**: Generate weekly project status reports from scattered project notes.

**Workflow**:
1. **Gather Project Notes**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "project-alpha",
     "searchInPath": "Projects/"
   }
   ```

2. **Extract Status Information**:
   - AI reads each project-related note
   - Identifies completed tasks, blockers, and next steps
   - Compiles progress metrics

3. **Generate Status Report**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Reports/Project Alpha - Week 3.md",
     "wholeFileMode": "overwrite",
     "content": "# Project Alpha Status Report\n**Week of**: January 15-21, 2024\n\n## Completed This Week\n[AI-compiled achievements]\n\n## Current Blockers\n[Identified issues]\n\n## Next Week Priorities\n[Planned activities]"
   }
   ```

---

## 📊 Project Management Integration

### Use Case: Task Tracking Across Notes
**Scenario**: Track project tasks scattered across multiple notes and generate consolidated views.

**Workflow**:
1. **Find All Task Items**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "- \\[ \\]|- \\[x\\]",
     "useRegex": true,
     "searchInPath": "Projects/"
   }
   ```

2. **Categorize Tasks**:
   - Parse task status (complete/incomplete)
   - Extract task descriptions and contexts
   - Group by project or priority

3. **Create Task Dashboard**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Dashboards/Active Tasks.md",
     "wholeFileMode": "overwrite",
     "content": "# Active Tasks Dashboard\n*Updated: 2024-01-15*\n\n## High Priority\n[AI-compiled urgent tasks]\n\n## In Progress\n[Current work items]\n\n## Completed This Week\n[Recent achievements]"
   }
   ```

### Use Case: Sprint Planning
**Scenario**: Plan development sprints using historical velocity and task complexity from notes.

**Workflow**:
1. **Analyze Historical Data**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "sprint.*completed|velocity|story points",
     "useRegex": true,
     "searchInPath": "Planning/"
   }
   ```

2. **Estimate Capacity**:
   - AI analyzes past sprint notes
   - Calculates team velocity trends
   - Identifies capacity constraints

3. **Generate Sprint Plan**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Planning/Sprint 24 Plan.md",
     "wholeFileMode": "overwrite",
     "content": "# Sprint 24 Planning\n**Duration**: Jan 15-28, 2024\n**Team Velocity**: 32 points (based on last 3 sprints)\n\n## Sprint Goals\n[AI-suggested objectives]\n\n## Selected User Stories\n[Prioritized backlog items]"
   }
   ```

---

## 📅 Daily & Periodic Reviews

### Use Case: Weekly Learning Journal
**Scenario**: Automatically compile learning insights from daily notes into weekly summaries.

**Workflow**:
1. **Gather Daily Notes**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "learned|insight|discovery",
     "searchInPath": "Daily Notes/",
     "filter": "2024-01-15 to 2024-01-21"
   }
   ```

2. **Extract Learning Themes**:
   - AI identifies key learning moments
   - Groups insights by topic or skill
   - Tracks learning progression

3. **Create Weekly Summary**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Reviews/Learning Week 3 2024.md",
     "wholeFileMode": "overwrite",
     "content": "# Learning Summary - Week 3, 2024\n\n## Key Insights\n[Top learning moments]\n\n## Skills Developed\n[Skill progression notes]\n\n## Knowledge Gaps Identified\n[Areas for future learning]"
   }
   ```

### Use Case: Monthly Productivity Analysis
**Scenario**: Analyze productivity patterns and optimize workflows.

**Workflow**:
1. **Collect Productivity Data**:
   ```json
   {
     "tool": "obsidian_global_search",
     "query": "productivity|focus|distraction|deep work",
     "searchInPath": "Daily Notes/"
   }
   ```

2. **Analyze Patterns**:
   - AI identifies peak productivity times
   - Correlates activities with energy levels
   - Finds common distraction sources

3. **Generate Optimization Report**:
   ```json
   {
     "tool": "obsidian_update_note",
     "targetType": "file_path",
     "targetIdentifier": "Reviews/Productivity Analysis January 2024.md",
     "wholeFileMode": "overwrite",
     "content": "# Productivity Analysis - January 2024\n\n## Peak Performance Times\n[Optimal work windows]\n\n## Major Distractions\n[Common interruption sources]\n\n## Optimization Recommendations\n[AI-suggested improvements]"
   }
   ```

---

## 🔧 Advanced Workflows

### Multi-Vault Knowledge Integration
**Scenario**: Integrate insights from multiple Obsidian vaults for comprehensive analysis.

**Tools Combination**:
1. Search across different vault sections
2. Cross-reference findings
3. Create unified knowledge maps
4. Generate comparative analyses

### Automated Content Archiving
**Scenario**: Archive old notes based on age and activity patterns.

**Process**:
1. Identify stale content using search patterns
2. Analyze reference counts and recent modifications
3. Move or tag content for archival
4. Update index files and navigation

### Dynamic Template System
**Scenario**: Create context-aware note templates based on existing vault content.

**Implementation**:
1. Analyze successful note patterns in vault
2. Extract common structures and metadata
3. Generate adaptive templates
4. Apply templates with smart defaults

---

## 📈 Measuring Success

### Key Metrics to Track
- **Note Creation Rate**: Measure vault growth over time
- **Cross-Reference Density**: Track link creation and usage
- **Search Query Patterns**: Understand information retrieval needs
- **Tag Usage Evolution**: Monitor organizational improvements
- **Content Quality Indicators**: Assess note completeness and structure

### Automation Impact Assessment
- **Time Savings**: Compare manual vs. automated task completion
- **Consistency Improvements**: Measure standardization across vault
- **Discovery Enhancement**: Track new connections and insights found
- **Knowledge Retention**: Assess improved information recall and usage

---

*For troubleshooting common issues, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)*