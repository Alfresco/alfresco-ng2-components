#!/usr/bin/env bash

# ===================================================================
# In this hook-file define only dynamic-ish environmental variables.
# Put the static environment variables into the env.yml file
# Command executions or any other installation logic
# is supposed to be in the "install.sh" hook script.
# ===================================================================
PARENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

# Settings for protractor-smartrunner -------------------------------------------------
export GIT_HASH=`git rev-parse HEAD`

# Node settings
export NODE_OPTIONS="--max_old_space_size=30000"

# Settings for Nx ---------------------------------------------------------------------
export BASE_HASH="$(git wmerge-base origin/$BRANCH_NAME HEAD)"
export HEAD_HASH=${TRAVIS_PULL_REQUEST_SHA:-${TRAVIS_COMMIT}}

if [ "${TRAVIS_EVENT_TYPE}" == "push" ]; then
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/$TRAVIS_BRANCH"
elif [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/$TRAVIS_PULL_REQUEST"
    export BASE_HASH="origin/$TRAVIS_BRANCH"
elif [ "${TRAVIS_EVENT_TYPE}" == "cron" ]; then
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/cron"
else
    export S3_DBP_ROOT_FOLDER="$S3_DBP_PATH/api"
fi

export S3_DBP_FOLDER="$S3_DBP_ROOT_FOLDER/$TRAVIS_BUILD_ID"

# Cache for node_modules
export NODE_VERSION=`node -v`
export PACKAGE_LOCK_SHASUM=`shasum ./package-lock.json | cut -f 1 -d " "`
# This can change regardless of package-lock.json, so we need to calculate with this one as well
export S3_NODE_MODULES_CACHE_ID=`echo $NODE_VERSION-$PACKAGE_LOCK_SHASUM | shasum  | cut -f 1 -d " "`
export S3_NODE_MODULES_CACHE_PATH="$S3_DBP_PATH/cache/node_modules/$S3_NODE_MODULES_CACHE_ID.tar.bz2"

echo "S3 DBP root folder: $S3_DBP_ROOT_FOLDER"
echo "S3 DBP destination: $S3_DBP_FOLDER"
echo "========== Caching settings =========="
echo "PACKAGE_LOCK_SHASUM: $PACKAGE_LOCK_SHASUM"
echo "NODE_VERSION: $NODE_VERSION"
echo "S3_NODE_MODULES_CACHE_ID: $S3_NODE_MODULES_CACHE_ID"
echo "S3_NODE_MODULES_CACHE_PATH: $S3_NODE_MODULES_CACHE_PATH"
echo "========== Nx settings =========="
echo "GIT_HASH: $GIT_HASH"
echo "BASE_HASH: $BASE_HASH"
echo "HEAD_HASH: $HEAD_HASH"

