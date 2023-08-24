#!/bin/bash
#set -x
BROWSER_TYPE=mac-x64

if [ ! -z "$1" ]; then BROWSER_TYPE=$1 ; fi

PATH_TO_COMMANDS=../../node_modules/webdriver-manager/built/lib/cmds
PATH_TO_BINARIES=../../node_modules/webdriver-manager/built/lib/binaries
PATH_TO_SELENIUM=../../node_modules/webdriver-manager/selenium

# Remove existing drivers
rm -rf $PATH_TO_SELENIUM/selenium-server-*
rm -rf $PATH_TO_SELENIUM/chromedriver-*
rm -f $PATH_TO_SELENIUM/chromedriver_*

# Replace browser type in file and create new file
sed  "s/mac-x64/$BROWSER_TYPE/" chrome_xml_schema.js > chrome_xml.js
sed  "s/mac-x64/$BROWSER_TYPE/" update_schema.js > update.js
sleep 2

# Replace webdriver files
cp -f update.js $PATH_TO_COMMANDS/update.js
cp -f chrome_xml.js $PATH_TO_BINARIES/chrome_xml.js

rm -f update.js
rm -f chrome_xml.js

#$(npm bin)/webdriver-manager update --gecko=false
node ../../node_modules/webdriver-manager/bin/webdriver-manager update --gecko=false