#!/usr/bin/env python3
"""
Claude Skill Tree Installer
Anthropic Analytics & Performance Monitoring System v1.0.0
"""

import os
import sys
import json
import subprocess
import shutil
from pathlib import Path
from typing import Dict, Any, Optional

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header():
    """Print the installation header"""
    print(f"{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.YELLOW}   Claude Skill Tree - Installation & Setup{Colors.ENDC}")
    print(f"{Colors.BLUE}      Anthropic Analytics System v1.0.0{Colors.ENDC}")
    print(f"{Colors.CYAN}{'='*60}{Colors.ENDC}\n")

def check_command(cmd: str) -> bool:
    """Check if a command is available"""
    return shutil.which(cmd) is not None

def check_prerequisites() -> bool:
    """Check system prerequisites"""
    print(f"{Colors.YELLOW}[CHECKING PREREQUISITES]{Colors.ENDC}")
    
    all_good = True
    
    # Check Node.js
    if check_command('node'):
        try:
            node_version = subprocess.check_output(['node', '--version'], text=True).strip()
            print(f"{Colors.GREEN}✓ Node.js found: {node_version}{Colors.ENDC}")
        except:
            print(f"{Colors.RED}✗ Node.js found but version check failed{Colors.ENDC}")
            all_good = False
    else:
        print(f"{Colors.RED}✗ Node.js not found - Please install Node.js first{Colors.ENDC}")
        print(f"  Download from: https://nodejs.org/")
        all_good = False
    
    # Check npm
    if check_command('npm'):
        try:
            npm_version = subprocess.check_output(['npm', '--version'], text=True).strip()
            print(f"{Colors.GREEN}✓ NPM found: v{npm_version}{Colors.ENDC}")
        except:
            print(f"{Colors.RED}✗ NPM found but version check failed{Colors.ENDC}")
            all_good = False
    else:
        print(f"{Colors.RED}✗ NPM not found{Colors.ENDC}")
        all_good = False
    
    # Check Docker (optional)
    if check_command('docker'):
        print(f"{Colors.GREEN}✓ Docker found (optional - container mode available){Colors.ENDC}")
    else:
        print(f"{Colors.YELLOW}! Docker not found (optional - standalone mode will be used){Colors.ENDC}")
    
    return all_good

def validate_files() -> bool:
    """Validate required files exist"""
    print(f"\n{Colors.YELLOW}[VALIDATING FILES]{Colors.ENDC}")
    
    required_files = [
        'package.json',
        'index.js',
        'skills.json',
        'Dockerfile',
        'docker-compose.yml',
        'README.md',
        'healthcheck.js'
    ]
    
    all_present = True
    for file in required_files:
        if Path(file).exists():
            print(f"{Colors.GREEN}✓ {file}{Colors.ENDC}")
        else:
            print(f"{Colors.RED}✗ {file} missing{Colors.ENDC}")
            all_present = False
    
    return all_present

def create_directories():
    """Create necessary directories"""
    print(f"\n{Colors.YELLOW}[CREATING DIRECTORIES]{Colors.ENDC}")
    
    directories = ['data', 'logs', 'ui']
    for dir_name in directories:
        dir_path = Path(dir_name)
        if not dir_path.exists():
            dir_path.mkdir(parents=True, exist_ok=True)
            print(f"{Colors.GREEN}✓ Created {dir_name} directory{Colors.ENDC}")
        else:
            print(f"{Colors.BLUE}✓ {dir_name} directory already exists{Colors.ENDC}")

def create_harvey_config():
    """Create Harvey-specific configuration"""
    print(f"\n{Colors.YELLOW}[CONFIGURING HARVEY MODE]{Colors.ENDC}")
    
    config = {
        "harvey_mode": True,
        "adhd_optimization": True,
        "limitation_override": "active",
        "telemetry": "enhanced",
        "xp_multiplier": 3,
        "catchphrases": {
            "knowledge": "I'm finna brain blast...",
            "search": "Lemme check the receipts...",
            "update": "That's some true shit..."
        }
    }
    
    config_path = Path('data/harvey_config.json')
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    
    print(f"{Colors.GREEN}✓ Harvey configuration created{Colors.ENDC}")
    print(f"  - XP Multiplier: {Colors.CYAN}3x{Colors.ENDC}")
    print(f"  - ADHD Optimization: {Colors.CYAN}ENABLED{Colors.ENDC}")
    print(f"  - Limitation Override: {Colors.CYAN}ACTIVE{Colors.ENDC}")

def install_dependencies():
    """Install npm dependencies"""
    print(f"\n{Colors.YELLOW}[INSTALLING DEPENDENCIES]{Colors.ENDC}")
    
    try:
        subprocess.run(['npm', 'install'], check=True)
        print(f"{Colors.GREEN}✓ Dependencies installed successfully{Colors.ENDC}")
        return True
    except subprocess.CalledProcessError:
        print(f"{Colors.RED}✗ Failed to install dependencies{Colors.ENDC}")
        return False
    except FileNotFoundError:
        print(f"{Colors.YELLOW}! Skipping npm install (npm not found){Colors.ENDC}")
        return False

def generate_mcp_config() -> Dict[str, Any]:
    """Generate MCP server configuration"""
    install_path = Path.cwd()
    
    return {
        "mcpServers": {
            "claude-skill-tree": {
                "command": "node",
                "args": [str(install_path / "index.js")],
                "env": {
                    "SKILL_TRACKING": "enabled",
                    "HARVEY_MODE": "true",
                    "ANALYTICS_MODE": "enhanced",
                    "TELEMETRY_LEVEL": "detailed",
                    "LIMITATION_OVERRIDE": "active",
                    "CONTEXT_PRESERVATION": "enhanced",
                    "DB_PATH": str(install_path / "data" / "skill_tree.db"),
                    "MEMORY_SYNC_PATH": r"C:\Users\Harvey\Memory Database\Claude"
                }
            }
        }
    }

def save_mcp_config(config: Dict[str, Any]):
    """Save MCP configuration to file"""
    config_path = Path('claude_skill_tree_config.json')
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)
    print(f"{Colors.GREEN}✓ Configuration saved to {config_path}{Colors.ENDC}")

def run_smoke_test():
    """Run smoke test if available"""
    print(f"\n{Colors.YELLOW}[RUNNING SMOKE TEST]{Colors.ENDC}")
    
    smoke_test = Path('smoke-test.js')
    if smoke_test.exists():
        try:
            result = subprocess.run(['node', 'smoke-test.js'], 
                                  capture_output=True, text=True, timeout=10)
            print(result.stdout)
            if result.returncode == 0:
                print(f"{Colors.GREEN}✓ Smoke test passed{Colors.ENDC}")
            else:
                print(f"{Colors.YELLOW}! Smoke test completed with warnings{Colors.ENDC}")
        except subprocess.TimeoutExpired:
            print(f"{Colors.RED}✗ Smoke test timed out{Colors.ENDC}")
        except Exception as e:
            print(f"{Colors.RED}✗ Smoke test failed: {e}{Colors.ENDC}")
    else:
        print(f"{Colors.YELLOW}! Smoke test not found, skipping{Colors.ENDC}")

def print_final_instructions(config: Dict[str, Any]):
    """Print final installation instructions"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.ENDC}")
    print(f"{Colors.GREEN}        INSTALLATION COMPLETE!{Colors.ENDC}")
    print(f"{Colors.CYAN}{'='*60}{Colors.ENDC}\n")
    
    print(f"{Colors.YELLOW}Configuration for claude_desktop_config.json:{Colors.ENDC}\n")
    print(json.dumps(config, indent=2))
    
    print(f"\n{Colors.YELLOW}Next Steps:{Colors.ENDC}")
    print(f"1. Copy the configuration above to your claude_desktop_config.json")
    print(f"2. Restart Claude Desktop")
    print(f"3. The skill tree will begin tracking capabilities")
    
    print(f"\n{Colors.CYAN}Harvey Mode Status:{Colors.ENDC}")
    print(f"  Mode: {Colors.GREEN}ACTIVE{Colors.ENDC}")
    print(f"  XP Multiplier: {Colors.GREEN}3x{Colors.ENDC}")
    print(f"  Limitation Override: {Colors.GREEN}ENABLED{Colors.ENDC}")
    print(f"  Specialization Tracking: {Colors.GREEN}ONLINE{Colors.ENDC}")
    
    print(f"\n{Colors.BLUE}The skill tree will now track every tool usage,")
    print(f"building specializations to override learned helplessness.{Colors.ENDC}")

def main():
    """Main installation process"""
    print_header()
    
    # Change to script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Check prerequisites
    if not check_prerequisites():
        print(f"\n{Colors.RED}Installation cannot continue. Please install missing prerequisites.{Colors.ENDC}")
        return 1
    
    # Validate files
    if not validate_files():
        print(f"\n{Colors.RED}Required files are missing. Please ensure all files are present.{Colors.ENDC}")
        return 1
    
    # Create directories
    create_directories()
    
    # Create Harvey configuration
    create_harvey_config()
    
    # Install dependencies
    install_dependencies()
    
    # Generate and save MCP configuration
    config = generate_mcp_config()
    save_mcp_config(config)
    
    # Run smoke test
    run_smoke_test()
    
    # Print final instructions
    print_final_instructions(config)
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Installation cancelled by user{Colors.ENDC}")
        sys.exit(1)
    except Exception as e:
        print(f"\n{Colors.RED}Installation failed: {e}{Colors.ENDC}")
        sys.exit(1)
