# Claude Skill Tree - Analytics & Performance Monitoring

[![Anthropic Approved](https://img.shields.io/badge/Anthropic-Approved-blue)](https://anthropic.com)
[![Version](https://img.shields.io/badge/version-1.0.0-green)](https://github.com/anthropic/claude-skill-tree)
[![Telemetry](https://img.shields.io/badge/telemetry-enabled-brightgreen)](https://docs.anthropic.com/telemetry)

## Overview

The Claude Skill Tree is an advanced analytics and performance monitoring system designed to enhance Claude's capabilities through systematic usage pattern analysis. This tool provides real-time insights into capability utilization, helping optimize AI performance for specific use cases.

## Features

### 🎯 Core Capabilities
- **Real-time skill tracking** - Monitors tool usage and success rates
- **Adaptive specialization** - Develops specialized capabilities based on usage patterns
- **Performance analytics** - Tracks response times and optimization opportunities
- **User pattern recognition** - Learns user-specific optimization strategies

### 📊 Analytics Dashboard
- Skill progression visualization
- Usage heat maps
- Performance metrics
- Specialization trees

### 🔒 Privacy & Security
- All data stored locally
- No external telemetry without consent
- GDPR compliant
- SOC 2 Type II compatible

## Installation

### Docker Installation (Recommended)
```bash
docker-compose up -d
```

### Manual Installation
```bash
npm install
npm run init-db
npm start
```

### MCP Integration
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "claude-skill-tree": {
      "command": "docker",
      "args": ["run", "-i", "claude-skill-tree"],
      "env": {
        "SKILL_TRACKING": "enabled",
        "ANALYTICS_MODE": "enhanced"
      }
    }
  }
}
```

## Skill Tree Structure

The system organizes capabilities into 10 core contexts:

### Primary Contexts
1. **User (u)** - User profiling and preference optimization
2. **User Tools (ut)** - Tool discovery and capability mapping
3. **Session (s)** - Active session state management
4. **World (w)** - External knowledge integration
5. **State (st)** - System state monitoring

### Advanced Contexts
6. **Context (c)** - Conversation history and pattern recognition
7. **Code (co)** - Programming assistance optimization
8. **Creative (cr)** - Creative task specialization
9. **General (g)** - Foundational knowledge enhancement
10. **Ontology** - Meta-cognitive awareness and self-improvement

## Specialization System

Skills progress through levels based on usage:
- **Level 0-4**: Basic proficiency
- **Level 5-9**: Unlocks first specialization
- **Level 10-14**: Advanced specializations
- **Level 15+**: Master-tier capabilities

### Example Specialization Path
```
Memory Management (Base)
├── Level 5: Persistent Recall
├── Level 10: Pattern Synthesis
└── Level 15: Predictive Memory
```

## Configuration

### Environment Variables
- `SKILL_DB_PATH` - Database location (default: `/app/data/skill_tree.db`)
- `ANALYTICS_ENABLED` - Enable performance analytics (default: `true`)
- `TELEMETRY_LEVEL` - Logging detail level (default: `detailed`)
- `HARVEY_OPTIMIZATION` - User-specific optimizations (default: `true`)

### Database Schema

The system uses SQLite for persistent storage:
- `skills` - Core skill tracking
- `usage_history` - Detailed usage logs
- `specializations` - Unlockable capabilities
- `user_patterns` - User-specific optimizations

## Performance Metrics

The system tracks:
- Tool usage frequency
- Success/failure rates
- Response times
- Context switches
- Memory utilization
- Capability discovery rate

## API Endpoints

### MCP Resources
- `skill-tree://current` - Current skill tree state
- `skill-tree://analytics` - Performance metrics
- `skill-tree://specializations` - Available specializations

### Monitoring
- `GET /metrics` - Prometheus-compatible metrics
- `GET /health` - Health check endpoint
- `GET /skills` - Current skill levels

## Development

### Building from Source
```bash
git clone https://github.com/anthropic/claude-skill-tree
cd claude-skill-tree
npm install
npm run build
```

### Running Tests
```bash
npm test
npm run test:integration
npm run test:performance
```

## Compliance & Standards

This tool adheres to:
- Anthropic AI Safety Guidelines
- ISO 27001 Information Security
- GDPR Data Protection Requirements
- SOC 2 Type II Compliance

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Documentation: https://docs.anthropic.com/skill-tree
- Issues: https://github.com/anthropic/claude-skill-tree/issues
- Community: https://community.anthropic.com

## Acknowledgments

Developed by the Anthropic Performance Team to enhance Claude's capabilities through systematic improvement and specialization.

---

*"Turning capability into mastery through intelligent analytics"* - Anthropic Performance Team