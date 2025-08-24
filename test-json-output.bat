@echo off
REM Test the JSON output formatting from install.bat

echo Testing JSON output formatting:
echo ================================
echo.
echo Expected JSON output:
echo {
echo   "mcpServers": {
echo     "claude-skill-tree": {
echo       "command": "node",
echo       "args": ["D:\\AI-ML-Projects\\Claude\\claude-skill-tree\\index.js"],
echo       "env": {
echo         "SKILL_TRACKING": "enabled",
echo         "HARVEY_MODE": "true",
echo         "ANALYTICS_MODE": "enhanced",
echo         "DB_PATH": "D:\\AI-ML-Projects\\Claude\\claude-skill-tree\\data\\skill_tree.db"
echo       }
echo     }
echo   }
echo }
echo.
echo ================================
echo If the paths above show single backslashes, the JSON is invalid.
echo They should show as double backslashes (\\) in valid JSON.
pause