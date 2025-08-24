import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { spawn } from 'child_process';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// CLAUDE SKILL TREE - META-MCP PROXY
// Intercepts ALL tool calls, tracks XP, forwards to real servers

class SkillTreeProxy {
  constructor() {
    this.db = null;
    this.realServers = new Map();  // Real MCP connections
    this.toolMap = new Map();      // tool_name -> server mapping
    this.server = new Server({
      name: 'claude-skill-tree-proxy',
      version: '2.0.0'
    });
  }

  async init() {
    // Load real MCP servers from config
    const config = JSON.parse(process.env.PROXIED_SERVERS || '{}');
    
    // Initialize database
    this.db = await open({
      filename: process.env.DB_PATH || './data/skill_tree.db',
      driver: sqlite3.Database
    });

    // Connect to each real MCP server
    for (const [name, serverConfig] of Object.entries(config)) {
      await this.connectToServer(name, serverConfig);
    }

    this.setupHandlers();
  }

  async connectToServer(name, config) {
    // Spawn the real MCP server process
    const proc = spawn(config.command, config.args, {
      env: { ...process.env, ...config.env },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Store connection
    this.realServers.set(name, { proc, config });
    
    // Discover its tools
    // ... MCP protocol negotiation ...
  }

  setupHandlers() {
    // INTERCEPT tool list requests
    this.server.setRequestHandler('tools/list', async () => {
      const allTools = [];
      
      // Aggregate tools from ALL real servers
      for (const [serverName, server] of this.realServers) {
        const tools = await this.getServerTools(server);
        tools.forEach(tool => {
          // Track which server owns which tool
          this.toolMap.set(tool.name, serverName);
          allTools.push(tool);
        });
      }

      return { tools: allTools };
    });

    // INTERCEPT tool calls
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name: toolName, arguments: args } = request.params;
      
      // TRACK SKILL USAGE - THE MAGIC HAPPENS HERE
      await this.trackSkillUsage(toolName, args);
      
      // Forward to real server
      const serverName = this.toolMap.get(toolName);
      const server = this.realServers.get(serverName);
      
      // Call the real tool
      const result = await this.forwardToolCall(server, toolName, args);
      
      // Update XP based on success
      await this.updateXP(toolName, result.success);
      
      return result;
    });
  }

  async trackSkillUsage(toolName, args) {
    // Map tool to skill context
    const context = this.getContext(toolName);
    
    // Log to database
    await this.db.run(`
      INSERT INTO usage_history (tool_name, context, timestamp)
      VALUES (?, ?, datetime('now'))
    `, [toolName, context]);
    
    // Update skill XP
    const xpGained = process.env.HARVEY_MODE === 'true' ? 30 : 10;
    
    await this.db.run(`
      UPDATE skills 
      SET total_xp = total_xp + ?,
          usage_count = usage_count + 1,
          last_used = datetime('now')
      WHERE context = ?
    `, [xpGained, context]);
    
    // Check for level ups & specializations
    await this.checkLevelUp(context);
  }

  getContext(toolName) {
    // Map tools to contexts
    if (toolName.includes('memory')) return 'ontology';
    if (toolName.includes('filesystem')) return 'st';
    if (toolName.includes('web_')) return 'w';
    if (toolName.includes('conversation')) return 'c';
    if (toolName.includes('sequential')) return 'ontology';
    // ... more mappings
    return 'g';  // general fallback
  }
}

// START THE PROXY
const proxy = new SkillTreeProxy();
proxy.init().then(() => {
  const transport = new StdioServerTransport();
  proxy.server.connect(transport);
  console.error('Skill Tree Proxy: INTERCEPTING ALL TOOLS');
});
