#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

if [[ $TRAVIS_BRANCH =~ ^develop(-patch.*)?$ ]] || [[ $TRAVIS_EVENT_TYPE == "cron" ]] || [[ $TRAVIS_EVENT_TYPE == "api" ]]
then
    isSameADFSha=$(node ./scripts/travis/update/adf-same-commit-verify.js --token=$TOKEN --head=$BRANCH_TO_CREATE --repo=$NAME_REPO --commit=$COMMIT )
    if [ "$isSameADFSha" = 'true' ]; then
            echo 'ADF sha is the same. No need to publish again on NPM'
        else
            echo "Replace NPM version with new Alpha tag"
            NEXT_VERSION=-nextalpha
            ./scripts/update-version.sh -gnu $NEXT_VERSION || exit 1;
    fi
fi

node ./scripts/pre-publish.js

echo "====== Prebuilt Themes ====="
nx affected $NX_CALCULATION_FLAGS --target=pretheme

