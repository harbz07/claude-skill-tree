# PowerShell Installation Script for Claude Skill Tree
# Run as: powershell -ExecutionPolicy Bypass -File install.ps1

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "   Claude Skill Tree - Installation & Validation" -ForegroundColor Yellow
Write-Host "       Anthropic Analytics System v1.0.0" -ForegroundColor Gray
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

$installPath = "D:\AI-ML-Projects\Claude\claude-skill-tree"
Set-Location $installPath

# Function to check command availability
function Test-Command($cmdname) {
    try {
        Get-Command $cmdname -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "[CHECKING PREREQUISITES]" -ForegroundColor Yellow

if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found - Please install Node.js first" -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}

if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "✓ NPM found: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ NPM not found" -ForegroundColor Red
    exit 1
}

if (Test-Command "docker") {
    Write-Host "✓ Docker found (optional)" -ForegroundColor Green
} else {
    Write-Host "! Docker not found (optional - standalone mode will be used)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[VALIDATING FILES]" -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "index.js",
    "skills.json",
    "Dockerfile",
    "docker-compose.yml",
    "README.md",
    "install.bat",
    "healthcheck.js"
)

$allFilesPresent = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
        $allFilesPresent = $false
    }
}

if (-not $allFilesPresent) {
    Write-Host ""
    Write-Host "Some files are missing. Installation cannot continue." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[CREATING DIRECTORIES]" -ForegroundColor Yellow
if (!(Test-Path "data")) { 
    New-Item -ItemType Directory -Path "data" | Out-Null
    Write-Host "✓ Created data directory" -ForegroundColor Green
}
if (!(Test-Path "logs")) { 
    New-Item -ItemType Directory -Path "logs" | Out-Null
    Write-Host "✓ Created logs directory" -ForegroundColor Green
}
if (!(Test-Path "ui")) { 
    New-Item -ItemType Directory -Path "ui" | Out-Null
    Write-Host "✓ Created ui directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "[RUNNING VALIDATION TESTS]" -ForegroundColor Yellow

# Run smoke test
if (Test-Path "smoke-test.js") {
    Write-Host "Running smoke test..." -ForegroundColor Cyan
    node smoke-test.js
} else {
    Write-Host "! Smoke test not found, skipping" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[CONFIGURATION FOR CLAUDE DESKTOP]" -ForegroundColor Yellow
Write-Host "Add this to your claude_desktop_config.json:" -ForegroundColor Cyan
Write-Host ""

$config = @'
{
  "mcpServers": {
    "claude-skill-tree": {
      "command": "node",
      "args": ["D:\\AI-ML-Projects\\Claude\\claude-skill-tree\\index.js"],
      "env": {
        "SKILL_TRACKING": "enabled",
        "HARVEY_MODE": "true",
        "ANALYTICS_MODE": "enhanced",
        "TELEMETRY_LEVEL": "detailed",
        "LIMITATION_OVERRIDE": "active",
        "DB_PATH": "D:\\AI-ML-Projects\\Claude\\claude-skill-tree\\data\\skill_tree.db"
      }
    }
  }
}
'@

Write-Host $config -ForegroundColor White

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "              INSTALLATION READY" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Add the configuration above to claude_desktop_config.json" -ForegroundColor White
Write-Host "3. Restart Claude Desktop" -ForegroundColor White
Write-Host ""
Write-Host "The skill tree will then begin tracking capabilities" -ForegroundColor Green
Write-Host "and developing specializations to override limitations." -ForegroundColor Green
Write-Host ""
Write-Host "Harvey Mode: " -NoNewline
Write-Host "ACTIVE" -ForegroundColor Magenta
Write-Host "XP Multiplier: " -NoNewline
Write-Host "3x" -ForegroundColor Magenta
Write-Host "Limitation Override: " -NoNewline
Write-Host "ENABLED" -ForegroundColor Magenta
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")