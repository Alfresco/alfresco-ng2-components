#!/usr/bin/env bash

pip install --user awscli

export NODE_OPTIONS="--max_old_space_size=30000"
export GIT_HASH=`git rev-parse HEAD`
echo "GIT_HASH: $GIT_HASH"
S3_DBP_PATH="s3://alfresco-travis-builds/dbp"
export BASE_HASH="$(git describe --tags `git rev-list --tags --max-count=1`)"
export HEAD_HASH="HEAD"

if [ "${TRAVIS_EVENT_TYPE}" == "push" ]; then
    export S3_DBP_FOLDER="$S3_DBP_PATH/$TRAVIS_BRANCH/$TRAVIS_BUILD_ID"
elif [ "${TRAVIS_EVENT_TYPE}" == "pull_request" ]; then
    export S3_DBP_FOLDER="$S3_DBP_PATH/$TRAVIS_PULL_REQUEST/$TRAVIS_BUILD_ID"
    export BASE_HASH="origin/$TRAVIS_BRANCH"
elif [ "${TRAVIS_EVENT_TYPE}" == "cron" ]; then
    export S3_DBP_FOLDER="$S3_DBP_PATH/cron/$TRAVIS_BUILD_ID"
else
    export S3_DBP_FOLDER="$S3_DBP_PATH/api/$TRAVIS_BUILD_ID"
fi

echo "BASE_HASH: $BASE_HASH"
echo "S3 DBP destination: $S3_DBP_FOLDER"

export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start
sleep 3 # give xvfb some time to start
