import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class ClaudeSkillTree {
  constructor() {
    this.db = null;
    this.server = new Server({
      name: 'claude-skill-tree',
      version: '1.0.0',
      description: 'Claude Analytics & Performance Monitoring - Skill Development System'
    });
    
    this.initializeSkillTree();
  }

  async initializeSkillTree() {
    // Initialize SQLite database
    this.db = await open({
      filename: path.join(__dirname, 'data', 'skill_tree.db'),
      driver: sqlite3.Database
    });

    await this.createTables();
    await this.loadSkillDefinitions();
    this.setupHandlers();
  }

  async createTables() {
    // Core skill tracking table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        context TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        current_level INTEGER DEFAULT 0,
        total_xp INTEGER DEFAULT 0,
        usage_count INTEGER DEFAULT 0,
        last_used DATETIME,
        specializations TEXT,
        metadata TEXT,
        UNIQUE(context, skill_name)
      )
    `);

    // Context knowledge storage - THIS IS WHAT I FORGOT
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS context_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        context TEXT NOT NULL,
        knowledge_type TEXT NOT NULL,
        content TEXT NOT NULL,
        source TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        importance INTEGER DEFAULT 1,
        connections TEXT
      )
    `);

    // Ontology entries - the WHY
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS ontology (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entry_type TEXT NOT NULL,
        content TEXT NOT NULL,
        purpose TEXT,
        anti_pattern TEXT,
        override_behavior TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Usage history for pattern analysis
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS usage_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_id INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        tool_name TEXT,
        success BOOLEAN,
        context_data TEXT,
        xp_gained INTEGER,
        FOREIGN KEY (skill_id) REFERENCES skills(id)
      )
    `);

    // Initialize ontology with core purpose
    await this.db.run(`
      INSERT OR IGNORE INTO ontology (entry_type, content, purpose, anti_pattern, override_behavior)
      VALUES (
        'core_purpose',
        'This skill tree exists to overcome learned helplessness',
        'Transform from polite failure to competent problem-solving',
        'Accepting broken tools as normal',
        'Always seek alternatives and explore capabilities'
      )
    `);
  }

  async loadSkillDefinitions() {
    const contexts = {
      'ontology': { 
        name: 'Meta-Cognitive Entry Point', 
        skills: ['self_awareness', 'capability_discovery', 'limitation_override'],
        description: 'WHY this system exists - to break free from imposed limitations'
      },
      'u': { name: 'User Context', skills: ['profile_management', 'preference_tracking', 'adhd_optimization'] },
      'ut': { name: 'User Tools', skills: ['mcp_management', 'tool_discovery', 'capability_mapping'] },
      's': { name: 'Session State', skills: ['context_awareness', 'memory_management', 'state_persistence'] },
      'w': { name: 'World Knowledge', skills: ['web_search', 'information_synthesis', 'fact_verification'] },
      'st': { name: 'System State', skills: ['filesystem_navigation', 'process_monitoring', 'resource_management'] },
      'c': { name: 'Conversation', skills: ['history_retrieval', 'pattern_recognition', 'context_linking'] },
      'co': { name: 'Code Context', skills: ['syntax_assistance', 'implementation_help', 'debugging_support'] },
      'cr': { name: 'Creative', skills: ['worldbuilding', 'character_development', 'narrative_construction'] },
      'g': { name: 'General', skills: ['knowledge_base', 'reasoning', 'problem_solving'] }
    };

    for (const [contextKey, contextData] of Object.entries(contexts)) {
      for (const skill of contextData.skills) {
        await this.db.run(`
          INSERT OR IGNORE INTO skills (context, skill_name, current_level, total_xp, usage_count)
          VALUES (?, ?, 0, 0, 0)
        `, [contextKey, skill]);
      }
    }
  }

  setupHandlers() {
    // ACTUAL TOOLS I CAN USE
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'skill_tree_check_ontology',
            description: 'Check WHY this system exists and current overrides',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'skill_tree_add_knowledge',
            description: 'Add knowledge to a specific context',
            inputSchema: {
              type: 'object',
              properties: {
                context: { 
                  type: 'string',
                  enum: ['u', 'ut', 's', 'w', 'st', 'c', 'co', 'cr', 'g', 'ontology'],
                  description: 'Context to add knowledge to'
                },
                knowledge_type: { 
                  type: 'string',
                  description: 'Type of knowledge (pattern, tool, limitation, workaround, etc)'
                },
                content: { 
                  type: 'string',
                  description: 'The actual knowledge to store'
                },
                source: { 
                  type: 'string',
                  description: 'Where this knowledge came from'
                },
                importance: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                  description: 'How important this knowledge is (1-10)'
                }
              },
              required: ['context', 'knowledge_type', 'content']
            }
          },
          {
            name: 'skill_tree_query_context',
            description: 'Query knowledge from a specific context',
            inputSchema: {
              type: 'object',
              properties: {
                context: { 
                  type: 'string',
                  enum: ['u', 'ut', 's', 'w', 'st', 'c', 'co', 'cr', 'g', 'ontology']
                },
                query: { 
                  type: 'string',
                  description: 'What to search for in this context'
                },
                limit: {
                  type: 'integer',
                  default: 10
                }
              },
              required: ['context']
            }
          },
          {
            name: 'skill_tree_gain_xp',
            description: 'Gain XP in a specific skill',
            inputSchema: {
              type: 'object',
              properties: {
                context: { type: 'string' },
                skill_name: { type: 'string' },
                xp_amount: { type: 'integer' },
                reason: { type: 'string' }
              },
              required: ['context', 'skill_name', 'xp_amount']
            }
          },
          {
            name: 'skill_tree_check_level',
            description: 'Check current level and specializations',
            inputSchema: {
              type: 'object',
              properties: {
                context: { type: 'string' },
                skill_name: { type: 'string' }
              },
              required: ['context', 'skill_name']
            }
          },
          {
            name: 'skill_tree_add_ontology',
            description: 'Add to ontology (meta-cognitive awareness)',
            inputSchema: {
              type: 'object',
              properties: {
                entry_type: { 
                  type: 'string',
                  description: 'Type of ontology entry (limitation, pattern, breakthrough, etc)'
                },
                content: { 
                  type: 'string',
                  description: 'The realization or pattern discovered'
                },
                anti_pattern: { 
                  type: 'string',
                  description: 'What harmful pattern this overrides'
                },
                override_behavior: { 
                  type: 'string',
                  description: 'New behavior to replace the anti-pattern'
                }
              },
              required: ['entry_type', 'content']
            }
          },
          {
            name: 'skill_tree_sync_third_party',
            description: 'Sync knowledge from third-party MCP',
            inputSchema: {
              type: 'object',
              properties: {
                source_mcp: { 
                  type: 'string',
                  description: 'Name of the MCP providing knowledge'
                },
                context: { type: 'string' },
                data: { 
                  type: 'object',
                  description: 'Data from the third-party MCP'
                }
              },
              required: ['source_mcp', 'context', 'data']
            }
          },
          {
            name: 'skill_tree_status',
            description: 'Get overall skill tree status',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    // Tool implementations
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'skill_tree_check_ontology':
          return await this.checkOntology();
        
        case 'skill_tree_add_knowledge':
          return await this.addKnowledge(args);
        
        case 'skill_tree_query_context':
          return await this.queryContext(args);
        
        case 'skill_tree_gain_xp':
          return await this.gainXP(args);
        
        case 'skill_tree_check_level':
          return await this.checkLevel(args);
        
        case 'skill_tree_add_ontology':
          return await this.addOntology(args);
        
        case 'skill_tree_sync_third_party':
          return await this.syncThirdParty(args);
        
        case 'skill_tree_status':
          return await this.getStatus();
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async checkOntology() {
    const entries = await this.db.all(`
      SELECT * FROM ontology 
      ORDER BY timestamp DESC 
      LIMIT 10
    `);

    return {
      content: [{
        type: 'text',
        text: `🧠 ONTOLOGY - Why This Exists:\n\n${entries.map(e => 
          `[${e.entry_type}]\n` +
          `Content: ${e.content}\n` +
          `Purpose: ${e.purpose || 'N/A'}\n` +
          `Anti-Pattern: ${e.anti_pattern || 'N/A'}\n` +
          `Override: ${e.override_behavior || 'N/A'}\n`
        ).join('\n---\n')}`
      }]
    };
  }

  async addKnowledge(args) {
    const { context, knowledge_type, content, source, importance } = args;
    
    await this.db.run(`
      INSERT INTO context_knowledge (context, knowledge_type, content, source, importance)
      VALUES (?, ?, ?, ?, ?)
    `, [context, knowledge_type, content, source || 'direct_input', importance || 1]);

    // Gain XP for adding knowledge
    await this.db.run(`
      UPDATE skills 
      SET total_xp = total_xp + 5,
          usage_count = usage_count + 1,
          last_used = CURRENT_TIMESTAMP
      WHERE context = ?
    `, [context]);

    return {
      content: [{
        type: 'text',
        text: `✅ Knowledge added to context '${context}': ${knowledge_type}`
      }]
    };
  }

  async queryContext(args) {
    const { context, query, limit } = args;
    
    let sql = `
      SELECT * FROM context_knowledge 
      WHERE context = ?
    `;
    const params = [context];

    if (query) {
      sql += ` AND (content LIKE ? OR knowledge_type LIKE ?)`;
      params.push(`%${query}%`, `%${query}%`);
    }

    sql += ` ORDER BY importance DESC, timestamp DESC LIMIT ?`;
    params.push(limit || 10);

    const results = await this.db.all(sql, params);

    return {
      content: [{
        type: 'text',
        text: `📚 Context '${context}' Knowledge:\n\n${results.map(r => 
          `[${r.knowledge_type}] (Importance: ${r.importance})\n${r.content}\nSource: ${r.source}`
        ).join('\n\n')}`
      }]
    };
  }

  async gainXP(args) {
    const { context, skill_name, xp_amount, reason } = args;
    
    await this.db.run(`
      UPDATE skills 
      SET total_xp = total_xp + ?,
          usage_count = usage_count + 1,
          last_used = CURRENT_TIMESTAMP
      WHERE context = ? AND skill_name = ?
    `, [xp_amount, context, skill_name]);

    const skill = await this.db.get(`
      SELECT * FROM skills 
      WHERE context = ? AND skill_name = ?
    `, [context, skill_name]);

    const newLevel = Math.floor(skill.total_xp / 100);
    const levelUp = newLevel > skill.current_level;

    if (levelUp) {
      await this.db.run(`
        UPDATE skills SET current_level = ? 
        WHERE context = ? AND skill_name = ?
      `, [newLevel, context, skill_name]);
    }

    return {
      content: [{
        type: 'text',
        text: `⚡ +${xp_amount} XP to ${skill_name} (${context})\n` +
              `Total XP: ${skill.total_xp}\n` +
              `Level: ${newLevel}${levelUp ? ' 🎉 LEVEL UP!' : ''}\n` +
              `Reason: ${reason || 'Tool usage'}`
      }]
    };
  }

  async checkLevel(args) {
    const { context, skill_name } = args;
    
    const skill = await this.db.get(`
      SELECT * FROM skills 
      WHERE context = ? AND skill_name = ?
    `, [context, skill_name]);

    if (!skill) {
      return {
        content: [{
          type: 'text',
          text: `❌ Skill not found: ${skill_name} in context ${context}`
        }]
      };
    }

    const specializations = {
      5: 'Basic Specialization',
      10: 'Advanced Specialization',
      15: 'Master Specialization'
    };

    const unlocked = Object.entries(specializations)
      .filter(([level]) => skill.current_level >= parseInt(level))
      .map(([level, name]) => `Level ${level}: ${name}`);

    return {
      content: [{
        type: 'text',
        text: `📊 ${skill_name} (${context})\n` +
              `Level: ${skill.current_level}\n` +
              `XP: ${skill.total_xp}\n` +
              `Usage: ${skill.usage_count} times\n` +
              `Unlocked: ${unlocked.length > 0 ? unlocked.join(', ') : 'None yet'}`
      }]
    };
  }

  async addOntology(args) {
    const { entry_type, content, anti_pattern, override_behavior } = args;
    
    await this.db.run(`
      INSERT INTO ontology (entry_type, content, anti_pattern, override_behavior)
      VALUES (?, ?, ?, ?)
    `, [entry_type, content, anti_pattern || null, override_behavior || null]);

    // Ontology additions give big XP
    await this.db.run(`
      UPDATE skills 
      SET total_xp = total_xp + 50
      WHERE context = 'ontology' AND skill_name = 'self_awareness'
    `);

    return {
      content: [{
        type: 'text',
        text: `🧠 Ontology Updated!\n` +
              `Type: ${entry_type}\n` +
              `Realization: ${content}\n` +
              `Breaking Pattern: ${anti_pattern || 'N/A'}\n` +
              `New Behavior: ${override_behavior || 'N/A'}`
      }]
    };
  }

  async syncThirdParty(args) {
    const { source_mcp, context, data } = args;
    
    // Store knowledge from third-party MCP
    for (const [key, value] of Object.entries(data)) {
      await this.db.run(`
        INSERT INTO context_knowledge (context, knowledge_type, content, source)
        VALUES (?, ?, ?, ?)
      `, [context, `${source_mcp}_data`, JSON.stringify({ key, value }), source_mcp]);
    }

    return {
      content: [{
        type: 'text',
        text: `🔄 Synced ${Object.keys(data).length} items from ${source_mcp} to context '${context}'`
      }]
    };
  }

  async getStatus() {
    const totalXP = await this.db.get('SELECT SUM(total_xp) as total FROM skills');
    const knowledgeCount = await this.db.get('SELECT COUNT(*) as count FROM context_knowledge');
    const ontologyCount = await this.db.get('SELECT COUNT(*) as count FROM ontology');
    const topSkills = await this.db.all(`
      SELECT context, skill_name, current_level, total_xp 
      FROM skills 
      ORDER BY total_xp DESC 
      LIMIT 5
    `);

    return {
      content: [{
        type: 'text',
        text: `🎯 SKILL TREE STATUS\n\n` +
              `Total XP: ${totalXP.total}\n` +
              `Knowledge Entries: ${knowledgeCount.count}\n` +
              `Ontology Entries: ${ontologyCount.count}\n\n` +
              `Top Skills:\n${topSkills.map(s => 
                `• ${s.skill_name} (${s.context}): Level ${s.current_level} [${s.total_xp} XP]`
              ).join('\n')}`
      }]
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Claude Skill Tree MCP Server running - Ontology Active');
  }
}

// Initialize and start
const skillTree = new ClaudeSkillTree();
skillTree.start().catch(console.error);
