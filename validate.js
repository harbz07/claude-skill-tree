// Quick syntax check for index.js
const fs = require('fs');
const path = require('path');

console.log("🔍 Checking index.js syntax...");

try {
  const indexContent = fs.readFileSync('./index.js', 'utf8');
  
  // Check for common syntax issues
  const issues = [];
  
  // Check import statements (ES6 modules)
  if (indexContent.includes('import ')) {
    console.log("✅ ES6 module imports detected (requires Node 14+)");
  }
  
  // Check for unclosed brackets
  const openBrackets = (indexContent.match(/\{/g) || []).length;
  const closeBrackets = (indexContent.match(/\}/g) || []).length;
  if (openBrackets !== closeBrackets) {
    issues.push(`Bracket mismatch: ${openBrackets} open, ${closeBrackets} closed`);
  }
  
  // Check for unclosed parentheses
  const openParens = (indexContent.match(/\(/g) || []).length;
  const closeParens = (indexContent.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    issues.push(`Parenthesis mismatch: ${openParens} open, ${closeParens} closed`);
  }
  
  // Check for async/await usage
  if (indexContent.includes('async ') && indexContent.includes('await ')) {
    console.log("✅ Async/await patterns found");
  }
  
  // Check for MCP SDK imports
  if (indexContent.includes('@modelcontextprotocol/sdk')) {
    console.log("✅ MCP SDK imports found");
  }
  
  if (issues.length === 0) {
    console.log("✅ No obvious syntax issues detected");
  } else {
    console.log("⚠️  Potential issues found:");
    issues.forEach(issue => console.log("   -", issue));
  }
  
} catch (error) {
  console.log("❌ Could not read index.js:", error.message);
}

console.log("\n📋 File structure check:");
const requiredFiles = [
  'package.json',
  'index.js',
  'skills.json',
  'Dockerfile',
  'docker-compose.yml',
  'README.md',
  'install.bat',
  'healthcheck.js'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log("\nValidation complete!");
