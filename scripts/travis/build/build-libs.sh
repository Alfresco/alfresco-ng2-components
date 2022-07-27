#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

rm -rf tmp && mkdir tmp;

npx @alfresco/adf-cli@alpha update-commit-sha --pointer "HEAD" --pathPackage "$(pwd)"

if [ $TRAVIS_EVENT_TYPE == "push" ] || [ $TRAVIS_EVENT_TYPE == "cron" ] || [ $TRAVIS_EVENT_TYPE == "api" ]
then

    if [[ $TRAVIS_BRANCH =~ ^develop(-patch.*)?$ ]] || [[ $TRAVIS_EVENT_TYPE == "cron" ]] || [[ $TRAVIS_EVENT_TYPE == "api" ]]
    then

        isSameADFSha=$(node $BUILD_PIPELINE_DIR/adf-same-commit-verify.js --token=$TOKEN --head=$BRANCH_TO_CREATE --repo=$NAME_REPO --commit=$COMMIT )
        if [ "$isSameADFSha" = 'true' ]; then
                echo 'ADF sha is the same. No need to publish again on NPM'
            else
                echo "Replace NPM version with new Alpha tag"
                NEXT_VERSION=-nextalpha
                ./scripts/update-version.sh -gnu $NEXT_VERSION || exit 1;
        fi
    fi

     if [[ $TRAVIS_BRANCH =~ angular-upgrade-v13 ]]
    then
        ./scripts/update-version.sh -gnu -nextalpha -major || exit 1;
    fi

    if [[ $TRAVIS_BRANCH =~ angular-upgrade-v14 ]]
    then
      ./scripts/update-version.sh -gnu -nextalpha -major || exit 1;
    fi

    node ./scripts/pre-publish.js
fi;

./scripts/build/build-all-lib.sh
