#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Getting currently installed Chrome Version"

if [ "$CI" = "true" ]; then
    chromeVersion=$(google-chrome --version )
else
    chromeVersion=$(/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version )
fi

chromeVersion=${chromeVersion:14:20}

echo "Intalling webdriver for version: $chromeVersion"

function show_error() {
    echo -e "\e[31m===============================================================\e[0m"
    echo -e "\e[31mFAILED TO UPDATE WEBDRIVER-MANAGER, PLEASE DO IT MANUALLY!\e[0m"
    echo -e "\e[31mRun the following command (sometimes needs more than one kick):\e[0m"
    echo -e ""
    echo -e "\e[31mnpx webdriver-manager update --gecko=false\e[0m"
    echo -e ""
    echo -e "\e[31m===============================================================\e[0m"
}

ROOTDIR="$DIR/.."

if [ "$(uname)" == "Darwin" ]; then
    BROWSER_TYPE="mac-x64"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    BROWSER_TYPE="linux64"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    BROWSER_TYPE="win32"
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    BROWSER_TYPE="win64"
fi

echo "BROWSER => $BROWSER_TYPE"


PATH_TO_COMMANDS=./node_modules/webdriver-manager/built/lib/cmds
PATH_TO_BINARIES=./node_modules/webdriver-manager/built/lib/binaries
PATH_TO_SELENIUM=./node_modules/webdriver-manager/selenium

# Remove existing drivers
rm -rf $PATH_TO_SELENIUM/selenium-server-*
rm -rf $PATH_TO_SELENIUM/chromedriver-*
rm -f $PATH_TO_SELENIUM/chromedriver_*

# Replace browser type in file and create new file
echo 'Replacing new webdriver files'
sed "s/mac-x64/$BROWSER_TYPE/" $DIR/chrome_xml_schema.js > $DIR/chrome_xml.js && sed  "s/mac-x64/$BROWSER_TYPE/" $DIR/update_schema.js > $DIR/update.js;

if [ "$?" -ne 0 ]; then
    show_error
    exit 0
fi

echo "============== Trying to update the files =============="
sleep 2

# Replace webdriver files
echo "cp -f $DIR/update.js $PATH_TO_COMMANDS/update.js"
cp -f $DIR/update.js $PATH_TO_COMMANDS/update.js
cp -f $DIR/chrome_xml.js $PATH_TO_BINARIES/chrome_xml.js

rm -f $DIR/update.js
rm -f $DIR/chrome_xml.js

node ./node_modules/webdriver-manager/bin/webdriver-manager update --gecko=false --versions.chrome=$chromeVersion
