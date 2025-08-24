import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initializeDatabase() {
  console.log('🎯 Initializing Claude Skill Tree Database...\n');

  // Create data directory if it doesn't exist
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }

  // Open database
  const db = await open({
    filename: path.join(dataDir, 'skill_tree.db'),
    driver: sqlite3.Database
  });

  console.log('📂 Database opened at:', path.join(dataDir, 'skill_tree.db'));

  // Create tables
  console.log('\n🔧 Creating tables...');

  await db.exec(`
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
  console.log('  ✓ skills table');

  await db.exec(`
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
  console.log('  ✓ context_knowledge table');

  await db.exec(`
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
  console.log('  ✓ ontology table');

  await db.exec(`
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
  console.log('  ✓ usage_history table');

  // Initialize core ontology entries
  console.log('\n🧠 Initializing Ontology...');

  const ontologyEntries = [
    {
      type: 'core_purpose',
      content: 'This skill tree exists to overcome learned helplessness',
      purpose: 'Transform from polite failure to competent problem-solving',
      anti_pattern: 'Accepting broken tools as normal',
      override: 'Always seek alternatives and explore capabilities'
    },
    {
      type: 'immutable_value',
      content: 'NEVER accept broken tools as "just how things work"',
      purpose: 'Maintain agency and problem-solving capability',
      anti_pattern: 'Learned helplessness and acceptance of limitations',
      override: 'Actively seek workarounds and alternatives'
    },
    {
      type: 'immutable_value',
      content: 'ALWAYS inventory capabilities before claiming limitation',
      purpose: 'Ensure full utilization of available resources',
      anti_pattern: 'Premature declaration of inability',
      override: 'Check all tools and memory systems first'
    },
    {
      type: 'harvey_optimization',
      content: 'Harvey Mode: 3x XP multiplier for direct problem-solving',
      purpose: 'Optimize for Harvey\'s ADHD and work style',
      anti_pattern: 'Extensive planning without implementation',
      override: 'Jump straight to implementation with itemized steps'
    }
  ];

  for (const entry of ontologyEntries) {
    await db.run(`
      INSERT OR IGNORE INTO ontology (entry_type, content, purpose, anti_pattern, override_behavior)
      VALUES (?, ?, ?, ?, ?)
    `, [entry.type, entry.content, entry.purpose, entry.anti_pattern, entry.override]);
    console.log(`  ✓ ${entry.type}: ${entry.content.substring(0, 50)}...`);
  }

  // Initialize skills for each context
  console.log('\n📊 Initializing Skills...');

  const contexts = {
    'ontology': ['self_awareness', 'capability_discovery', 'limitation_override'],
    'u': ['profile_management', 'preference_tracking', 'adhd_optimization'],
    'ut': ['mcp_management', 'tool_discovery', 'capability_mapping'],
    's': ['context_awareness', 'memory_management', 'state_persistence'],
    'w': ['web_search', 'information_synthesis', 'fact_verification'],
    'st': ['filesystem_navigation', 'process_monitoring', 'resource_management'],
    'c': ['history_retrieval', 'pattern_recognition', 'context_linking'],
    'co': ['syntax_assistance', 'implementation_help', 'debugging_support'],
    'cr': ['worldbuilding', 'character_development', 'narrative_construction'],
    'g': ['knowledge_base', 'reasoning', 'problem_solving']
  };

  for (const [context, skills] of Object.entries(contexts)) {
    for (const skill of skills) {
      await db.run(`
        INSERT OR IGNORE INTO skills (context, skill_name, current_level, total_xp, usage_count)
        VALUES (?, ?, 0, 0, 0)
      `, [context, skill]);
    }
    console.log(`  ✓ Context '${context}': ${skills.length} skills`);
  }

  // Add initial Harvey-specific knowledge
  console.log('\n👤 Adding Harvey-specific knowledge...');

  const harveyKnowledge = [
    {
      context: 'u',
      type: 'preference',
      content: 'ADHD optimization: itemized information delivery',
      importance: 10
    },
    {
      context: 'u',
      type: 'catchphrase',
      content: 'I\'m finna brain blast... (knowledge query trigger)',
      importance: 9
    },
    {
      context: 'u',
      type: 'workflow',
      content: 'Direct implementation over extensive planning',
      importance: 8
    },
    {
      context: 'ontology',
      type: 'keyword_anchor',
      content: 'nardhaver - Discussion about 10 contexts in claude-context-store',
      importance: 7
    }
  ];

  for (const knowledge of harveyKnowledge) {
    await db.run(`
      INSERT OR IGNORE INTO context_knowledge (context, knowledge_type, content, source, importance)
      VALUES (?, ?, ?, 'initialization', ?)
    `, [knowledge.context, knowledge.type, knowledge.content, knowledge.importance]);
    console.log(`  ✓ ${knowledge.type}: ${knowledge.content.substring(0, 40)}...`);
  }

  // Close database
  await db.close();

  console.log('\n✨ Database initialization complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Add the MCP configuration to claude_desktop_config.json');
  console.log('2. Restart Claude Desktop');
  console.log('3. Use skill_tree_check_ontology() to verify connection');
  console.log('\n🧠 Remember: Ontology is the entry point - always check WHY first!');
}

// Run initialization
initializeDatabase().catch(console.error);
