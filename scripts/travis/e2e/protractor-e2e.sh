#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Start search e2e"

cd $DIR/../../../

echo "====== Update webdriver-manager ====="
if [ "$CI" = "true" ]; then
    export chrome=$(google-chrome --product-version)
    echo "Updating wedriver-manager with chromedriver: $chrome."
    ./node_modules/protractor/bin/webdriver-manager update --gecko=false --versions.chrome=$chrome
else
    echo "Updating wedriver-manager with latest chromedriver, be sure to use evergreen Chrome."
    ./node_modules/protractor/bin/webdriver-manager update --gecko=false
fi

./node_modules/protractor/bin/protractor ./e2e/protractor.conf.js --specs "e2e/core/user-info-component-cloud.e2e.ts" || exit 1
