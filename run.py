#!/usr/bin/env python3
"""
Claude Skill Tree Runner
Quick script to start the skill tree server
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Start the Claude Skill Tree server"""
    
    # Get the script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check if node is available
    if not shutil.which('node'):
        print("Error: Node.js is not installed")
        return 1
    
    # Check if index.js exists
    if not Path('index.js').exists():
        print("Error: index.js not found")
        return 1
    
    # Set environment variables
    env = os.environ.copy()
    env.update({
        'SKILL_TRACKING': 'enabled',
        'HARVEY_MODE': 'true',
        'ANALYTICS_MODE': 'enhanced',
        'TELEMETRY_LEVEL': 'detailed',
        'LIMITATION_OVERRIDE': 'active',
        'DB_PATH': str(Path.cwd() / 'data' / 'skill_tree.db')
    })
    
    print("Starting Claude Skill Tree...")
    print("Harvey Mode: ACTIVE")
    print("XP Multiplier: 3x")
    print("Limitation Override: ENABLED")
    print("-" * 40)
    
    try:
        # Start the server
        subprocess.run(['node', 'index.js'], env=env)
    except KeyboardInterrupt:
        print("\nShutting down skill tree server...")
    except Exception as e:
        print(f"Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    import shutil
    sys.exit(main())
