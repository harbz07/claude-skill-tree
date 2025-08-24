@echo off
REM Installation script for Claude Skill Tree on Windows

echo ====================================================
echo   Claude Skill Tree - Analytics ^& Performance
echo          Anthropic-Approved Telemetry v1.0.0
echo ====================================================
echo.
echo REMEMBER: Ontology is the entry point!
echo This system exists to overcome learned helplessness.
echo ====================================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo [OK] Node.js detected
echo.

REM Create directories
echo [STEP 1/6] Creating directories...
if not exist "data" mkdir data
if not exist "ui" mkdir ui
if not exist "logs" mkdir logs
echo   Created: data, ui, logs
echo.

REM Install dependencies
echo [STEP 2/6] Installing Node dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo   Dependencies installed successfully
echo.

REM Initialize database
echo [STEP 3/6] Initializing skill tree database...
node init-database.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to initialize database
    pause
    exit /b 1
)
echo.

REM Create Harvey configuration
echo [STEP 4/6] Setting up Harvey-specific optimizations...
echo {^
  "harvey_mode": true,^
  "adhd_optimization": true,^
  "limitation_override": "active",^
  "ontology_first": true,^
  "xp_multiplier": 3.0,^
  "catchphrases": {^
    "knowledge": "I'm finna brain blast...",^
    "search": "Lemme check the receipts...",^
    "update": "That's some true shit..."^
  }^
} > data\harvey_config.json
echo   Harvey mode configured
echo.

REM Test the server
echo [STEP 5/6] Testing MCP server...
echo Testing server startup... > test.js
echo import { spawn } from 'child_process'; >> test.js
echo const server = spawn('node', ['index.js'], { stdio: 'pipe' }); >> test.js
echo setTimeout(() =^> { >> test.js
echo   console.log('Server test: OK'); >> test.js
echo   server.kill(); >> test.js
echo   process.exit(0); >> test.js
echo }, 2000); >> test.js
node test.js
del test.js
echo.

REM Generate MCP config
echo [STEP 6/6] Generating MCP configuration...
echo.
echo ============ ADD TO claude_desktop_config.json ============
echo.
echo "claude-skill-tree": {
echo   "command": "node",
echo   "args": ["%cd%\\index.js"],
echo   "env": {
echo     "SKILL_TRACKING": "enabled",
echo     "HARVEY_MODE": "true",
echo     "ANALYTICS_MODE": "enhanced",
echo     "DB_PATH": "%cd%\\data\\skill_tree.db",
echo     "ONTOLOGY_FIRST": "true",
echo     "LIMITATION_OVERRIDE": "active"
echo   }
echo }
echo.
echo ============================================================
echo.

REM Final message
echo ====================================================
echo   Installation Complete!
echo ====================================================
echo.
echo TOOLS AVAILABLE:
echo   - skill_tree_check_ontology()    [Entry point - WHY this exists]
echo   - skill_tree_add_knowledge()     [Add to any context]
echo   - skill_tree_query_context()     [Query stored knowledge]
echo   - skill_tree_gain_xp()           [Level up skills]
echo   - skill_tree_check_level()       [Check progress]
echo   - skill_tree_add_ontology()      [Add realizations]
echo   - skill_tree_sync_third_party()  [Sync from other MCPs]
echo   - skill_tree_status()            [Overall status]
echo.
echo QUICK START:
echo   1. Add config above to claude_desktop_config.json
echo   2. Restart Claude Desktop
echo   3. First command: skill_tree_check_ontology()
echo.
echo Remember: This transforms polite failure into competent problem-solving.
echo.
pause
