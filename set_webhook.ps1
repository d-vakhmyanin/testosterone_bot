# .\set_webhook.ps1 -mode dev
# .\set_webhook.ps1

param (
    [string]$mode = "prod"
)

if ($mode -notin @("prod", "dev")) {
    Write-Host "Error: Invalid mode. Use 'prod' or 'dev'"
    exit 1
}

[Console]::TreatControlCAsInput = $true
$cleanupCompleted = $false
$tunnelProcess = $null
$nextAppProcess = $null

function Write-CleanOutput {
    param (
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Log-Step {
    param (
        [string]$message
    )
    $separator = "=" * ($message.Length + 6)
    Write-CleanOutput "`n$separator"
    Write-CleanOutput "=== $message ==="
    Write-CleanOutput "$separator`n"
}

function Cleanup {
    if (-not $cleanupCompleted) {
        Write-CleanOutput "`n=== Cleaning up... ===" -Color Yellow
        try {
            if ($tunnelProcess -and -not $tunnelProcess.HasExited) {
                Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
                Write-CleanOutput "Stopped tunnel process (PID: $($tunnelProcess.Id))"
            }
            if ($nextAppProcess -and -not $nextAppProcess.HasExited) {
                Stop-Process -Id $nextAppProcess.Id -Force -ErrorAction SilentlyContinue
                Write-CleanOutput "Stopped Next.js process (PID: $($nextAppProcess.Id))"
            }
        } catch {
            Write-CleanOutput "Cleanup warning: $_" -Color DarkYellow
        }
        $cleanupCompleted = $true
        Write-CleanOutput "=== Cleanup completed ===" -Color Green
        exit 0
    }
}

function Exit-WithError {
    param (
        [string]$message
    )
    Write-CleanOutput "ERROR: $message" -Color Red
    Cleanup
    exit 1
}

function Extract-CloudUrl {
    param (
        [string]$output
    )
    
    if ($output -match 'https://[^\s]+') {
        $script:baseUrl = $matches[0]
        return $script:baseUrl
    }
    else {
        Write-Host "cannot find url"
        return $null
    }
}

# Main execution
try {
    Log-Step "Checking port 3000"
    $portInUse = (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).State -contains "Listen"
    if ($portInUse) {
        Write-CleanOutput "Port 3000 is in use. Attempting to free..."
        $process = Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $process.Id -Force
            Write-CleanOutput "Process using port 3000 has been terminated"
        }
        Start-Sleep -Seconds 2
    }

    Log-Step "Loading environment variables"
    $envFile = ".\.env"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile | Where-Object { $_ -notmatch "^TUNNEL_URL=" }
        $envContent | Set-Content $envFile -Force
        
        $envContent | ForEach-Object {
            if ($_ -match "^\s*([^#]\w+)\s*=\s*(.*)\s*$") {
                $varName = $matches[1]
                $varValue = $matches[2] -replace '^"|"$' -replace "'$|^'"
                [Environment]::SetEnvironmentVariable($varName, $varValue)
            }
        }
        Write-CleanOutput "Environment variables loaded"
    }

    Log-Step "Verifying required tokens"
    $TG_TOKEN = [Environment]::GetEnvironmentVariable("TG_TOKEN")
    $TG_WEBHOOK_SECRET = [Environment]::GetEnvironmentVariable("TG_WEBHOOK_SECRET")
    $CLO_TOKEN = [Environment]::GetEnvironmentVariable("CLO_TOKEN")

    if (-not $TG_TOKEN -or -not $TG_WEBHOOK_SECRET -or -not $CLO_TOKEN) {
        Exit-WithError "TG_TOKEN, TG_WEBHOOK_SECRET and CLO_TOKEN must be set in .env"
    }
    Write-CleanOutput "Tokens verified"

    Log-Step "Starting tunnel"
    try {
        ./clo.exe set token $CLO_TOKEN

        $processInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processInfo.FileName = "./clo.exe"
        $processInfo.Arguments = "publish http 3000"
        $processInfo.UseShellExecute = $false
        $processInfo.RedirectStandardOutput = $true

        $tunnelProcess = New-Object System.Diagnostics.Process
        $tunnelProcess.StartInfo = $processInfo
        $tunnelProcess.Start() | Out-Null

        $output = $tunnelProcess.StandardOutput.ReadLine()
        $baseUrl = Extract-CloudUrl $output
        Write-CleanOutput "tunnel creation success. baseUrl: $baseUrl"
    }
    catch {
        Exit-WithError "Failed to launch tunnel: $_"
    }

    Log-Step "Updating .env with tunnel URL"
    Add-Content -Path $envFile -Value "`nTUNNEL_URL=$baseUrl" -Force
    Write-CleanOutput ".env file updated"

    Log-Step "Starting Next.js application"
    try {
        if ($mode -eq "prod") {
            Write-CleanOutput "Building production application..."
            npm run build
            if ($LASTEXITCODE -ne 0) {
                Exit-WithError "Build failed"
            }
            $nextAppProcess = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run start" -PassThru
            Write-CleanOutput "Production server started (PID: $($nextAppProcess.Id))" -Color Green
        }
        else {
            $nextAppProcess = Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run dev" -PassThru
            Write-CleanOutput "Development server started (PID: $($nextAppProcess.Id))" -Color Green
        }
    }
    catch {
        Exit-WithError "Failed to start Next.js: $_"
    }

    Log-Step "Setting Telegram webhook"
    $webhookUrl = "$baseUrl/api"
    try {
        $webhookResult = Invoke-RestMethod -Uri "https://api.telegram.org/bot$TG_TOKEN/setWebhook" `
            -Method Post `
            -ContentType "application/json" `
            -Body (@{
                url = $webhookUrl
                secret_token = $TG_WEBHOOK_SECRET
            } | ConvertTo-Json) `
            -ErrorAction Stop
        
        if (-not $webhookResult.ok) {
            Exit-WithError "Failed to set webhook: $($webhookResult.description)"
        }
        Write-CleanOutput "Webhook configured: $webhookUrl" -Color Green
    }
    catch {
        Exit-WithError "Webhook request failed: $_"
    }

    Write-CleanOutput "`n=== System ready ===" -Color Cyan
    Write-CleanOutput "- Mode: $mode"
    Write-CleanOutput "- Tunnel: $baseUrl"
    Write-CleanOutput "- Webhook: $webhookUrl"
    Write-CleanOutput "- Next.js running (PID: $($nextAppProcess.Id))"
    Write-CleanOutput "`nPress Ctrl+C to stop all processes`n" -Color Yellow
    
    while ($true) {
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Modifiers -eq [ConsoleModifiers]::Control -and $key.Key -eq "C") {
                Cleanup
                break
            }
        }
        Start-Sleep -Seconds 1
    }
}
catch {
    Exit-WithError "Script error: $_"
}
finally {
    Cleanup
}