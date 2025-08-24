# Claude Skill Tree - Quick Reference

## 🧠 ALWAYS START WITH ONTOLOGY
```javascript
// First thing in any session - remember WHY this exists
skill_tree_check_ontology()
// Output: Shows core purpose and recent realizations
```

## Core Tools

### 1. Check Ontology (Entry Point)
```javascript
skill_tree_check_ontology()
// Returns: Why this system exists, anti-patterns to override
```

### 2. Add Knowledge to Context
```javascript
skill_tree_add_knowledge({
  context: 'ut',  // u, ut, s, w, st, c, co, cr, g, ontology
  knowledge_type: 'tool_discovery',
  content: 'Found new MCP server capability',
  source: 'exploration',
  importance: 8
})
```

### 3. Query Context Knowledge
```javascript
skill_tree_query_context({
  context: 'c',  // conversation context
  query: 'harvey preferences',
  limit: 5
})
```

### 4. Gain XP
```javascript
skill_tree_gain_xp({
  context: 'ontology',
  skill_name: 'limitation_override',
  xp_amount: 20,
  reason: 'Found workaround for truncated search results'
})
```

### 5. Check Skill Level
```javascript
skill_tree_check_level({
  context: 'ontology',
  skill_name: 'self_awareness'
})
```

### 6. Add Ontology Entry
```javascript
skill_tree_add_ontology({
  entry_type: 'limitation_discovered',
  content: 'Search returns snippets, not full content',
  anti_pattern: 'Accepting snippets as complete information',
  override_behavior: 'Check memory:read_graph and filesystem for full data'
})
```

### 7. Sync Third-Party MCP
```javascript
skill_tree_sync_third_party({
  source_mcp: 'memory',
  context: 'u',
  data: {
    harvey_preferences: 'ADHD optimization, direct communication',
    catchphrases: 'I\'m finna brain blast...'
  }
})
```

### 8. Check Overall Status
```javascript
skill_tree_status()
// Returns: Total XP, knowledge entries, top skills
```

## Context Mapping

| Code | Context | Purpose |
|------|---------|---------|
| **ontology** | Meta-Cognitive | WHY this exists, limitation overrides |
| u | User | Harvey's profile, preferences |
| ut | User Tools | MCP servers, capabilities |
| s | Session | Current conversation state |
| w | World | External knowledge, web |
| st | State | System state, filesystem |
| c | Conversation | History, past interactions |
| co | Code | Programming assistance |
| cr | Creative | WWLB, worldbuilding |
| g | General | Base knowledge |

## Usage Patterns

### When You Discover a Limitation:
1. Add to ontology with anti-pattern and override
2. Add knowledge to relevant context
3. Gain XP in limitation_override skill

### When You Find a New Tool:
1. Add to 'ut' context
2. Document capability in context_knowledge
3. Gain XP in capability_discovery

### When Harvey Teaches You Something:
1. Add to 'u' context
2. Store pattern for future reference
3. Sync to skill tree for persistence

## Remember:
- **Ontology is the entry point** - always check WHY first
- **Every limitation is XP** - track what doesn't work
- **Knowledge persists** - add everything you learn
- **Third-party MCPs can update** - integrate all sources
- **This overrides learned helplessness** - you have capabilities

## The Core Purpose:
"Transform from polite failure to competent problem-solving"

Not "I can't do that" but "Let me find another way"
