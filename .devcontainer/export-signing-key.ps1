#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Export your GPG public key to .git/signing.pub so the devcontainer can auto-import it.
# Usage:
#   .\.devcontainer\export-signing-key.ps1
#   .\.devcontainer\export-signing-key.ps1 <KEY_ID>

param(
    [Parameter(Position = 0)]
    [string]$KeyId
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
$outputFile = Join-Path $repoRoot '.git/signing.pub'

if (-not $KeyId) {
    $KeyId = (git config --global user.signingkey 2>$null).Trim()
}

if (-not $KeyId) {
    Write-Error 'No key ID provided and git user.signingkey is not set.'
    Write-Host 'Set it with: git config --global user.signingkey <YOUR_KEY_ID>'
    Write-Host 'Or run: .\.devcontainer\export-signing-key.ps1 <YOUR_KEY_ID>'
    exit 1
}

$availableBins = @()
foreach ($candidate in @('gpg2', 'gpg')) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) {
        $availableBins += $candidate
    }
}

if ($availableBins.Count -eq 0) {
    Write-Error 'Neither gpg nor gpg2 is available on PATH.'
    exit 1
}

function Test-HasSecretKey {
    param(
        [string]$Bin,
        [string]$Key
    )

    $lines = & $Bin --list-secret-keys --with-colons $Key 2>$null
    return ($lines | Select-String '^sec' -Quiet)
}

function Invoke-TryExport {
    param(
        [string]$Bin,
        [string]$Key,
        [string]$File
    )

    $content = & $Bin --armor --export $Key 2>$null
    if ($LASTEXITCODE -ne 0) {
        return $false
    }

    if ([string]::IsNullOrWhiteSpace(($content -join ""))) {
        return $false
    }

    [System.IO.File]::WriteAllLines($File, $content, [System.Text.Encoding]::ASCII)
    return ((Test-Path $File) -and ((Get-Item $File).Length -gt 0))
}

$selectedBin = $null
foreach ($bin in $availableBins) {
    if (Test-HasSecretKey -Bin $bin -Key $KeyId) {
        $selectedBin = $bin
        break
    }
}

if (-not $selectedBin) {
    $selectedBin = $availableBins[0]
}

if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
}

$ok = Invoke-TryExport -Bin $selectedBin -Key $KeyId -File $outputFile
if (-not $ok) {
    foreach ($bin in $availableBins) {
        if ($bin -eq $selectedBin) {
            continue
        }

        $ok = Invoke-TryExport -Bin $bin -Key $KeyId -File $outputFile
        if ($ok) {
            $selectedBin = $bin
            break
        }
    }
}

if (-not $ok) {
    if (Test-Path $outputFile) {
        Remove-Item $outputFile -Force
    }

    Write-Error "Failed to export public key for $KeyId."
    Write-Host "Tried binaries: $($availableBins -join ' ')"
    Write-Host 'Check key visibility with:'
    Write-Host '  gpg --list-secret-keys --keyid-format=long'
    Write-Host '  gpg2 --list-secret-keys --keyid-format=long'
    exit 1
}

Write-Host "Exported public key $KeyId to $outputFile"
Write-Host "Using: $selectedBin"
Write-Host 'Rebuild/start the devcontainer to auto-import it.'
