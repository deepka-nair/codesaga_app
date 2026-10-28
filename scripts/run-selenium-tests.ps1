# ==============================================================================
# CodeSaga Selenium E2E Automation Runner (Windows PowerShell)
# File: scripts/run-selenium-tests.ps1
# ------------------------------------------------------------------------------
# 1. Inspects and starts Express Backend (port 5000) & Vite Frontend (port 5173)
# 2. Bounded health check loop (max 60s) for http://localhost:5000/api/health
#    and http://localhost:5173
# 3. Prints service logs if startup fails and exits with clear diagnostic
# 4. Runs existing Selenium test suite: 'npm test' in selenium-tests
# 5. Guaranteed cleanup in finally block: stops ONLY runner-started processes
# ==============================================================================

[CmdletBinding()]
param(
    [int]$TimeoutSeconds = 60
)

$ErrorActionPreference = "Continue"
$rootDir = (Resolve-Path "$PSScriptRoot\..").Path

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  CodeSaga 310-Test Selenium E2E Automation Suite Runner (Windows)" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "Workspace Root: $rootDir`n" -ForegroundColor Gray

# Helper to test HTTP endpoint readiness using .NET HttpWebRequest
function Test-HttpEndpoint {
    param([string]$Url, [int]$TimeoutMs = 1500)
    $targets = @($Url)
    if ($Url -match "localhost") {
        $targets += $Url.Replace("localhost", "127.0.0.1")
    }
    foreach ($target in $targets) {
        try {
            $req = [System.Net.HttpWebRequest]::Create($target)
            $req.Timeout = $TimeoutMs
            $req.Method = "GET"
            $resp = $req.GetResponse()
            $code = [int]$resp.StatusCode
            $resp.Close()
            if ($code -ge 200 -and $code -lt 500) {
                return $true
            }
        } catch {
            if ($_.Exception -and $_.Exception.Response) {
                $code = [int]$_.Exception.Response.StatusCode
                $_.Exception.Response.Close()
                if ($code -ge 200 -and $code -lt 500) {
                    return $true
                }
            }
        }
    }
    return $false
}

$backendLog = Join-Path $rootDir "backend.log"
$frontendLog = Join-Path $rootDir "frontend.log"

$startedBackendProcess = $null
$startedFrontendProcess = $null
$testExitCode = 1

try {
    # --------------------------------------------------------------------------
    # Step 1: Check or Start Express Backend API (Port 5000)
    # --------------------------------------------------------------------------
    $backendUrl = "http://localhost:5000/api/health"
    if (Test-HttpEndpoint -Url $backendUrl) {
        Write-Host "✅ Express API Backend is ALREADY running and healthy on port 5000." -ForegroundColor Green
    } else {
        Write-Host "🚀 Starting Express API Backend on port 5000 (logging to backend.log)..." -ForegroundColor Yellow
        if (Test-Path $backendLog) { Remove-Item $backendLog -Force -ErrorAction SilentlyContinue }
        
        $env:PORT = "5000"
        $env:FRONTEND_URL = "http://localhost:5173"
        $startedBackendProcess = Start-Process -FilePath "cmd.exe" `
            -ArgumentList "/c node server.js > `"$backendLog`" 2>&1" `
            -WorkingDirectory $rootDir `
            -PassThru `
            -WindowStyle Hidden
            
        Write-Host "  Backend process started with PID: $($startedBackendProcess.Id)" -ForegroundColor Gray
    }

    # --------------------------------------------------------------------------
    # Step 2: Check or Start Vite Frontend Dev Server (Port 5173)
    # --------------------------------------------------------------------------
    $frontendUrl = "http://localhost:5173"
    if (Test-HttpEndpoint -Url $frontendUrl) {
        Write-Host "✅ Vite Frontend is ALREADY running and reachable on port 5173." -ForegroundColor Green
    } else {
        Write-Host "🚀 Starting Vite Frontend on port 5173 (logging to frontend.log)..." -ForegroundColor Yellow
        if (Test-Path $frontendLog) { Remove-Item $frontendLog -Force -ErrorAction SilentlyContinue }
        
        $env:VITE_API_BASE_URL = "http://localhost:5000"
        $startedFrontendProcess = Start-Process -FilePath "cmd.exe" `
            -ArgumentList "/c npm run dev -- --host 0.0.0.0 --port 5173 > `"$frontendLog`" 2>&1" `
            -WorkingDirectory $rootDir `
            -PassThru `
            -WindowStyle Hidden

        Write-Host "  Frontend process started with PID: $($startedFrontendProcess.Id)" -ForegroundColor Gray
    }

    # --------------------------------------------------------------------------
    # Step 3: Bounded Health Check Loop (Max 60 Seconds)
    # --------------------------------------------------------------------------
    Write-Host "`n⏳ Waiting for services to become healthy (maximum ${TimeoutSeconds}s timeout)..." -ForegroundColor Cyan
    $backendReady = Test-HttpEndpoint -Url $backendUrl
    $frontendReady = Test-HttpEndpoint -Url $frontendUrl
    $startTime = [DateTime]::UtcNow

    while ((-not ($backendReady -and $frontendReady)) -and (([DateTime]::UtcNow - $startTime).TotalSeconds -lt $TimeoutSeconds)) {
        Start-Sleep -Seconds 1
        $elapsed = [int]([DateTime]::UtcNow - $startTime).TotalSeconds

        if (-not $backendReady) {
            $backendReady = Test-HttpEndpoint -Url $backendUrl
            if ($backendReady) {
                Write-Host "  ✅ Express Backend is healthy on port 5000 (${elapsed}s)" -ForegroundColor Green
            }
        }

        if (-not $frontendReady) {
            $frontendReady = Test-HttpEndpoint -Url $frontendUrl
            if ($frontendReady) {
                Write-Host "  ✅ Vite Frontend is healthy on port 5173 (${elapsed}s)" -ForegroundColor Green
            }
        }

        # Early exit if a runner-started process crashed unexpectedly
        if ($startedBackendProcess -and $startedBackendProcess.HasExited) {
            Write-Host "❌ Backend process exited unexpectedly with exit code $($startedBackendProcess.ExitCode)!" -ForegroundColor Red
            break
        }
        if ($startedFrontendProcess -and $startedFrontendProcess.HasExited) {
            Write-Host "❌ Frontend process exited unexpectedly with exit code $($startedFrontendProcess.ExitCode)!" -ForegroundColor Red
            break
        }
    }

    if (-not ($backendReady -and $frontendReady)) {
        Write-Host "`n❌ Service startup check timed out or failed! Printing diagnostics:" -ForegroundColor Red
        if (Test-Path $backendLog) {
            Write-Host "`n==================== BACKEND LOGS (backend.log) ====================" -ForegroundColor DarkYellow
            Get-Content $backendLog -Tail 50
        }
        if (Test-Path $frontendLog) {
            Write-Host "`n==================== FRONTEND LOGS (frontend.log) ====================" -ForegroundColor DarkYellow
            Get-Content $frontendLog -Tail 50
        }
        Write-Host "======================================================================`n" -ForegroundColor DarkYellow
        throw "Services failed to become healthy within $TimeoutSeconds seconds."
    }

    Write-Host "`n🎉 Both services are healthy and responsive!" -ForegroundColor Green

    # --------------------------------------------------------------------------
    # Step 4: Execute Existing Selenium Test Suite
    # --------------------------------------------------------------------------
    Write-Host "🚀 Executing Selenium Web E2E Test Suite (310 Test Cases)...`n" -ForegroundColor Cyan
    $seleniumDir = Join-Path $rootDir "selenium-tests"
    
    $env:TEST_BASE_URL = "http://localhost:5173"
    $env:FRONTEND_URL = "http://localhost:5173"
    
    Push-Location $seleniumDir
    try {
        & npm test
        $testExitCode = $LASTEXITCODE
    } finally {
        Pop-Location
    }

} catch {
    Write-Host "`n❌ Error during test run: $($_.Exception.Message)" -ForegroundColor Red
    $testExitCode = 1
} finally {
    # --------------------------------------------------------------------------
    # Step 5: Stop ONLY the processes started by this runner
    # --------------------------------------------------------------------------
    Write-Host "`n🧹 Cleaning up runner-managed processes..." -ForegroundColor Cyan
    if ($startedBackendProcess -and (-not $startedBackendProcess.HasExited)) {
        Write-Host "  Stopping runner-started backend (PID: $($startedBackendProcess.Id))..." -ForegroundColor Gray
        try {
            cmd.exe /c "taskkill /pid $($startedBackendProcess.Id) /T /F" *>$null
        } catch {}
    }
    if ($startedFrontendProcess -and (-not $startedFrontendProcess.HasExited)) {
        Write-Host "  Stopping runner-started frontend (PID: $($startedFrontendProcess.Id))..." -ForegroundColor Gray
        try {
            cmd.exe /c "taskkill /pid $($startedFrontendProcess.Id) /T /F" *>$null
        } catch {}
    }
    Write-Host "✅ Process cleanup finished." -ForegroundColor Green
}

exit $testExitCode
