// Smoke test for Claude Skill Tree
console.log("🔥 Claude Skill Tree - Smoke Test");
console.log("==================================");

// Test 1: Check if package.json is valid
try {
  const pkg = require('./package.json');
  console.log("✅ Package loaded:", pkg.name, "v" + pkg.version);
} catch (e) {
  console.log("❌ Failed to load package.json:", e.message);
}

// Test 2: Check if skills.json is valid
try {
  const skills = require('./skills.json');
  console.log("✅ Skills config loaded");
  console.log("   - Contexts:", Object.keys(skills.contexts).length);
  console.log("   - Harvey mode:", skills.harvey_optimizations ? "ACTIVE" : "INACTIVE");
  console.log("   - Immutable values:", skills.immutable_values.length);
} catch (e) {
  console.log("❌ Failed to load skills.json:", e.message);
}

// Test 3: Check SQLite3 availability
try {
  const sqlite3 = require('sqlite3');
  console.log("✅ SQLite3 module available");
} catch (e) {
  console.log("⚠️  SQLite3 not installed - run 'npm install' first");
}

// Test 4: Validate core concepts
const expectedContexts = ['u', 'ut', 's', 'w', 'st', 'c', 'co', 'cr', 'g', 'ontology'];
try {
  const skills = require('./skills.json');
  const foundContexts = Object.keys(skills.contexts);
  const hasAllContexts = expectedContexts.every(ctx => foundContexts.includes(ctx));
  
  if (hasAllContexts) {
    console.log("✅ All 10 contexts present");
  } else {
    console.log("⚠️  Missing contexts:", expectedContexts.filter(c => !foundContexts.includes(c)));
  }
} catch (e) {
  console.log("❌ Context validation failed");
}

// Test 5: Check Harvey's catchphrases
try {
  const skills = require('./skills.json');
  const catchphrases = skills.harvey_optimizations.catchphrases;
  console.log("✅ Harvey catchphrases loaded:");
  console.log("   -", catchphrases.knowledge_query);
  console.log("   -", catchphrases.conversation_search);
  console.log("   -", catchphrases.behavioral_update);
} catch (e) {
  console.log("❌ Catchphrase check failed");
}

console.log("\n==================================");
console.log("Smoke test complete!");
console.log("\nNext steps:");
console.log("1. Run 'npm install' to install dependencies");
console.log("2. Add to claude_desktop_config.json");
console.log("3. Restart Claude Desktop");
console.log("\nThe skill tree will then track and enhance capabilities.");