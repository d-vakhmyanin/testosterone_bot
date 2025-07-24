# ssh-keygen -t ed25519
# .\set_webhook.ps1 -mode dev
# .\set_webhook.ps1

param (
    [string]$mode = "prod"  # Default to production mode
)

# 1. Validate mode parameter
if ($mode -notin @("prod", "dev")) {
    Write-Host "Error: Invalid mode. Use 'prod' or 'dev'"
    exit 1
}

[Console]::TreatControlCAsInput = $true
$cleanupCompleted = $false

function Cleanup {
    if (-not $cleanupCompleted) {
        Write-Host "`nCleaning up..."
        Stop-Job $tunnelJob -ErrorAction SilentlyContinue
        Remove-Job $tunnelJob -ErrorAction SilentlyContinue
        Stop-Process -Id $nextAppProcess.Id -Force -ErrorAction SilentlyContinue
        $cleanupCompleted = $true
        Write-Host "All processes stopped"
        exit 0
    }
}

# 2. Load and clean .env file
$envFile = ".\.env"
if (Test-Path $envFile) {
    # Remove existing TUNNEL_URL if present
    $envContent = Get-Content $envFile | Where-Object { $_ -notmatch "^TUNNEL_URL=" }
    $envContent | Set-Content $envFile -Force
    
    # Load other variables
    $envContent | ForEach-Object {
        if ($_ -match "^\s*([^#]\w+)\s*=\s*(.*)\s*$") {
            $varName = $matches[1]
            $varValue = $matches[2] -replace '^"|"$' -replace "'$|^'"
            [Environment]::SetEnvironmentVariable($varName, $varValue)
        }
    }
}

# 3. Verify required tokens
$TG_TOKEN = [Environment]::GetEnvironmentVariable("TG_TOKEN")
$TG_WEBHOOK_SECRET = [Environment]::GetEnvironmentVariable("TG_WEBHOOK_SECRET")

if (-not $TG_TOKEN -or -not $TG_WEBHOOK_SECRET) {
    Write-Host "Error: TG_TOKEN and TG_WEBHOOK_SECRET must be set in .env"
    exit 1
}

# 4. Start tunnel in background
Write-Host "Starting tunnel..."
$tunnelJob = Start-Job -ScriptBlock {
    ssh -o StrictHostKeyChecking=no -R testosterone_bot:80:localhost:3000 serveo.net 2>&1
}

# 5. Wait for tunnel URL
$baseUrl = $null
$attempts = 0
while ($attempts -lt 10 -and -not $baseUrl) {
    Start-Sleep -Seconds 2
    $output = Receive-Job $tunnelJob
    $baseUrl = $output | Select-String -Pattern "Forwarding HTTP traffic from (https://[a-f0-9]+\.serveo\.net)" | ForEach-Object { $_.Matches.Groups[1].Value }
    $attempts++
}

if (-not $baseUrl) {
    Write-Host "Error: Failed to establish tunnel"
    Stop-Job $tunnelJob
    exit 1
}

# 6. Update .env with new tunnel URL
Add-Content -Path $envFile -Value "`nTUNNEL_URL=$baseUrl" -Force
Write-Host "Tunnel established: $baseUrl"

# 7. Set Telegram webhook
$webhookUrl = "$baseUrl/api"
Write-Host "Configuring webhook: $webhookUrl"

$curlCommand = "curl.exe -X POST `"https://api.telegram.org/bot$TG_TOKEN/setWebhook`" -H `"Content-Type: application/json`" -d '{\`"url\`":\`"$webhookUrl\`",\`"secret_token\`":\`"$TG_WEBHOOK_SECRET\`"}'"
Invoke-Expression $curlCommand

# 8. Start Next.js application based on mode
Write-Host "Starting Next.js in $mode mode..."

if ($mode -eq "prod") {
    # Production mode - build and start
    $buildProcess = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run build" -Wait -PassThru
    if ($buildProcess.ExitCode -ne 0) {
        Write-Host "Error: Build failed"
        Stop-Job $tunnelJob
        exit 1
    }
    $nextAppProcess = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run start" -PassThru
}
else {
    # Development mode
    $nextAppProcess = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -PassThru
}

# 9. Keep running and handle cleanup
try {
    Write-Host "System ready:"
    Write-Host "- Mode: $mode"
    Write-Host "- Tunnel: $baseUrl"
    Write-Host "- Webhook: $webhookUrl"
    Write-Host "- Next.js running (PID: $($nextAppProcess.Id))"
    Write-Host "Press Ctrl+C to stop all processes"
    
    while ($true) {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Modifiers -eq [ConsoleModifiers]::Control -and $key.Key -eq "C") {
                Cleanup
            }
        }
        Start-Sleep -Seconds 1
    }
}
finally {
    Cleanup
}