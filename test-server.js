// Test script for Claude Skill Tree MCP Server
import { spawn } from 'child_process';

console.log('🧪 Testing Claude Skill Tree MCP Server...\n');

const server = spawn('node', ['index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Send test commands via stdio
const testCommands = [
  {
    jsonrpc: '2.0',
    method: 'tools/list',
    id: 1
  }
];

let responseBuffer = '';

server.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  try {
    const lines = responseBuffer.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        const response = JSON.parse(line);
        if (response.result && response.result.tools) {
          console.log('✅ Server responding correctly!');
          console.log(`📊 Found ${response.result.tools.length} tools:`);
          response.result.tools.forEach(tool => {
            console.log(`  • ${tool.name}`);
          });
          console.log('\n🎯 Key tools:');
          console.log('  - skill_tree_check_ontology() [ENTRY POINT]');
          console.log('  - skill_tree_add_knowledge()');
          console.log('  - skill_tree_query_context()');
          console.log('  - skill_tree_status()');
          server.kill();
          process.exit(0);
        }
      }
    }
  } catch (e) {
    // Not a complete JSON yet, keep buffering
  }
});

server.stderr.on('data', (data) => {
  const message = data.toString();
  if (message.includes('running')) {
    console.log('✅ Server started successfully');
    // Send test command
    server.stdin.write(JSON.stringify(testCommands[0]) + '\n');
  }
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.error('❌ Server did not respond within 5 seconds');
  server.kill();
  process.exit(1);
}, 5000);
