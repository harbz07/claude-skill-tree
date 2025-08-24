#!/usr/bin/env python3
"""
Claude Skill Tree - Quick Test
Verifies the installation is ready
"""

import json
import sys
from pathlib import Path

def test_json_files():
    """Test if JSON files are valid"""
    json_files = ['package.json', 'skills.json']
    
    print("Testing JSON files...")
    for file in json_files:
        try:
            with open(file, 'r') as f:
                data = json.load(f)
            print(f"  ✓ {file} - Valid JSON")
            
            # Special checks for skills.json
            if file == 'skills.json':
                contexts = data.get('contexts', {})
                expected = ['u', 'ut', 's', 'w', 'st', 'c', 'co', 'cr', 'g', 'ontology']
                found = list(contexts.keys())
                
                if all(ctx in found for ctx in expected):
                    print(f"    ✓ All 10 contexts present")
                else:
                    missing = [ctx for ctx in expected if ctx not in found]
                    print(f"    ✗ Missing contexts: {missing}")
                
                # Check Harvey optimizations
                harvey = data.get('harvey_optimizations', {})
                if harvey.get('greeting_protocol') == "I'm finna brain blast...":
                    print(f"    ✓ Harvey catchphrases configured")
                
                # Check immutable values
                values = data.get('immutable_values', [])
                if len(values) > 0:
                    print(f"    ✓ {len(values)} immutable values set")
                    
        except json.JSONDecodeError as e:
            print(f"  ✗ {file} - Invalid JSON: {e}")
            return False
        except FileNotFoundError:
            print(f"  ✗ {file} - File not found")
            return False
    
    return True

def test_mcp_config():
    """Generate and validate MCP configuration"""
    print("\nTesting MCP configuration generation...")
    
    install_path = Path.cwd()
    config = {
        "mcpServers": {
            "claude-skill-tree": {
                "command": "node",
                "args": [str(install_path / "index.js")],
                "env": {
                    "SKILL_TRACKING": "enabled",
                    "HARVEY_MODE": "true",
                    "ANALYTICS_MODE": "enhanced",
                    "DB_PATH": str(install_path / "data" / "skill_tree.db")
                }
            }
        }
    }
    
    # Verify paths don't have escaping issues
    args_path = config["mcpServers"]["claude-skill-tree"]["args"][0]
    db_path = config["mcpServers"]["claude-skill-tree"]["env"]["DB_PATH"]
    
    print(f"  Args path: {args_path}")
    print(f"  DB path: {db_path}")
    
    # Test JSON serialization
    try:
        json_str = json.dumps(config, indent=2)
        print("  ✓ Configuration serializes to valid JSON")
        
        # Check for proper escaping in JSON output
        if '\\\\' in json_str:
            print("  ✓ Paths properly escaped in JSON")
        elif '\\' in json_str:
            print("  ! Single backslashes detected - may need escaping")
        else:
            print("  ✓ Using forward slashes or no path separators")
            
    except Exception as e:
        print(f"  ✗ JSON serialization failed: {e}")
        return False
    
    return True

def main():
    """Run all tests"""
    print("Claude Skill Tree - Pre-Installation Test")
    print("=" * 40)
    
    all_good = True
    
    # Test JSON files
    if not test_json_files():
        all_good = False
    
    # Test MCP configuration
    if not test_mcp_config():
        all_good = False
    
    print("\n" + "=" * 40)
    if all_good:
        print("✓ All tests passed - ready to install!")
        print("\nRun: python install.py")
        return 0
    else:
        print("✗ Some tests failed - please fix issues before installing")
        return 1

if __name__ == "__main__":
    sys.exit(main())
