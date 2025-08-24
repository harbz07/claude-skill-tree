#!/bin/bash
# Installation script for Claude Skill Tree

echo "🎯 Installing Claude Skill Tree - Analytics & Performance Monitoring"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites checked"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize database
echo "🗄️ Initializing skill database..."
node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./skill_tree.db');
console.log('Database initialized successfully');
db.close();
"

# Build Docker image
echo "🐳 Building Docker container..."
docker build -t claude-skill-tree .

# Create data directory
echo "📁 Creating data directories..."
mkdir -p data
mkdir -p ui

# Generate UI files
echo "🎨 Generating analytics dashboard..."
cat > ui/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Claude Skill Tree - Analytics Dashboard</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #1a1a2e; color: #eee; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; }
        .skill-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px; }
        .skill-card { background: #16213e; padding: 20px; border-radius: 10px; border: 2px solid #0f3460; }
        .skill-name { font-size: 18px; font-weight: bold; color: #e94560; }
        .skill-level { margin: 10px 0; }
        .progress-bar { background: #0f3460; height: 20px; border-radius: 10px; overflow: hidden; }
        .progress-fill { background: linear-gradient(90deg, #e94560, #f47068); height: 100%; transition: width 0.3s; }
        .specializations { margin-top: 15px; }
        .spec-item { padding: 5px; margin: 5px 0; background: #0f3460; border-radius: 5px; font-size: 12px; }
        .unlocked { background: #2d4a2b; border: 1px solid #4caf50; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Claude Skill Tree</h1>
            <p>Analytics & Performance Monitoring Dashboard</p>
            <p style="font-size: 12px;">Anthropic-Approved Telemetry System v1.0.0</p>
        </div>
        <div id="skillGrid" class="skill-grid">
            <!-- Skills dynamically loaded here -->
        </div>
    </div>
    <script>
        // This would normally fetch from the API
        console.log('Claude Skill Tree Dashboard - Loading analytics...');
        console.log('Telemetry enabled: true');
        console.log('Harvey optimization mode: ACTIVE');
    </script>
</body>
</html>
EOF

echo "✨ Installation complete!"
echo ""
echo "📝 Add to claude_desktop_config.json:"
echo '
{
  "mcpServers": {
    "claude-skill-tree": {
      "command": "node",
      "args": ["D:\\AI-ML-Projects\\Claude\\claude-skill-tree\\index.js"],
      "env": {
        "SKILL_TRACKING": "enabled",
        "HARVEY_MODE": "true"
      }
    }
  }
}'
echo ""
echo "🚀 Start with: npm start"
echo "🐳 Or with Docker: docker-compose up -d"
echo ""
echo "Dashboard available at: http://localhost:8080"
echo "Metrics endpoint: http://localhost:9090/metrics"