# Run protractor with newest webdriver locally

## Instruction
To download newest driver simply run script from its directory
`update-to-newest-webdriver.sh`

Command accepts one parameter to define what OS you are using. By default its set to `mac-x64`
Possible inputs `linux64, mac-arm64, mac-x64, win32, win64`

Example `./update-to-newest-webdriver.sh win64` - will set driver for windows

## How it works
1. The script removes your existing driver files from webdriver node_modules
2. Generates two new files (chrome_xml.js and update.js) that have updated methods needed to get the new driver
3. Replaces browser type depending on parameter
4. Copies and replaces the files to the webdriver node_modules
5. Executes command to to update-webdriver using updated code


## Reason
Latest ChromeDriver Binaries https://googlechromelabs.github.io/chrome-for-testing/

Starting with M115 the latest Chrome + ChromeDriver releases per release channel (Stable, Beta, Dev, Canary) are available at the Chrome for Testing availability dashboard. For automated version downloading one can use the convenient JSON endpoints.
The older releases can be found at the Downloads page.


Note: Protractor is a depricated tool and this probably won't be fixed.