#!/usr/bin/env pwsh
# PowerShell wrapper for the cross-platform Node bootstrapper.
try {
  $node = Get-Command node -ErrorAction Stop
} catch {
  Write-Error "Node.js is required to run this script. Please install Node 22.x and try again."
  exit 2
}

& node (Join-Path $PSScriptRoot 'bootstrap.js') @Args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
