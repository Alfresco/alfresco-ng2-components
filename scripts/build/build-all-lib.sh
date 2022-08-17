#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
cd ../../
rm -rf lib/dist
echo "====== Run lib ====="

export HEAD_HASH="HEAD"
#########################################################################################
# Settings based of Travis event type
#########################################################################################
if [ "${TRAVIS_EVENT_TYPE}" == "push" ]; then
    # Settings for merges ---------------------------------------------------------------
    if [[ "$TRAVIS_BRANCH" =~ ^master(-patch.*)?$ ]]; then
        # into master(-patch*)
        export NX_CALCULATION_FLAGS="--all"
        export BUILD_OPTS="--configuration production"
    elif [[ "$TRAVIS_BRANCH" =~ ^develop-patch.*$ ]]; then
        # into develop-patch*
        echo -e "\e[32mSetting up CI jobs for patch version creation.\e[0m"
        export NX_CALCULATION_FLAGS="--all"
        export BUILD_OPTS="--configuration production"
    else
        # into develop
        export NX_CALCULATION_FLAGS="--base=$(git describe --tags `git rev-list --tags --max-count=1`) --head=$HEAD_HASH"
        export BUILD_OPTS="--configuration production"
    fi
elif [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    # Settings for PRs ------------------------------------------------------------------
    export NX_CALCULATION_FLAGS="--base=origin/$TRAVIS_BRANCH --head=$HEAD_HASH"
    export BUILD_OPTS="--configuration production"
elif [ "${TRAVIS_EVENT_TYPE}" == "cron" ]; then
    # Settings for Cron -----------------------------------------------------------------
    export NX_CALCULATION_FLAGS="--all"
    export BUILD_OPTS="--configuration production"
else
    # Settings for API ------------------------------------------------------------------
    export NX_CALCULATION_FLAGS="--all"
    export BUILD_OPTS="--configuration production"
    # In case of manual Travis run use the commit message from travis and not the one from git
    COMMIT_MESSAGE=$TRAVIS_COMMIT_MESSAGE
fi

if [ "$CI" = "true" ]; then
    echo "Building libs for production with NX_FLAG $NX_CALCULATION_FLAGS"
    NODE_OPTIONS="--max-old-space-size=8192" $(npm bin)/nx affected:build $NX_CALCULATION_FLAGS --prod --exclude=demoshell || exit 1
else
    echo "Building libs for development with NX_FLAG $NX_CALCULATION_FLAGS"
    NODE_OPTIONS="--max-old-space-size=8192" $(npm bin)/nx affected:build $NX_CALCULATION_FLAGS --exclude=demoshell || exit 1
fi

echo "====== run core ====="
./scripts/build/build-core.sh || exit 1

echo "====== Run testing ====="
./scripts/build/build-testing.sh || exit 1

echo "====== Run Cli ====="
./scripts/build/build-cli.sh || exit 1

echo "====== Copy schema ====="
cp lib/core/src/lib/app-config/schema.json lib/dist/core/app.config.schema.json


