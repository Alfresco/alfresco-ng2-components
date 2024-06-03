$dir = Split-Path -Parent $MyInvocation.MyCommand.Path

if ($env:CI -eq "true") {
    Write-Host "Updating webdriver-manager with chromedriver: $env:npm_package_config_chromeDriver."
    ./node_modules/protractor/bin/webdriver-manager update --gecko=false --versions.chrome=$(google-chrome --product-version)
} else {
    Write-Host "Updating webdriver-manager with latest chromedriver, be sure to use evergreen Chrome."
    npx webdriver-manager update --gecko=false
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n==============================================================="
        Write-Host "FAILED TO UPDATE WEBDRIVER-MANAGER, PLEASE DO IT MANUALLY!"
        Write-Host "Run the following command (sometimes needs more than one kick):"
        Write-Host ""
        Write-Host "npx webdriver-manager update --gecko=false"
        Write-Host ""
        Write-Host "==============================================================="
    }
}
