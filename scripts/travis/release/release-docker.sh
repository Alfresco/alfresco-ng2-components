#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


if [[ $TRAVIS_EVENT_TYPE == "pull_request" ]];
then
    HEAD_COMMIT_HASH=${TRAVIS_PULL_REQUEST_SHA:-${TRAVIS_COMMIT}}
    COMMIT_MESSAGE=`git log --format=%B -n 1 $HEAD_COMMIT_HASH`
fi;

echo "ℹ️ Check Docker Image release for $COMMIT_MESSAGE type $TRAVIS_EVENT_TYPE on branch $TRAVIS_PULL_REQUEST_BRANCH"

if [[ $TRAVIS_EVENT_TYPE == "push" || $TRAVIS_EVENT_TYPE == "cron"  || ( $TRAVIS_EVENT_TYPE == "pull_request" && $COMMIT_MESSAGE == *"[create docker image]"* )]];
then

    if [[ $TRAVIS_BRANCH =~ ^develop(-patch.*)?$ || $TRAVIS_BRANCH =~ ^master(-patch.*)?$ ]];
    then

        cd $DIR/../../../

        if [[ $TRAVIS_BRANCH =~ ^master(-patch.*)?$ ]]; then
            TAGS=$(grep -m1 version package.json | awk '{ print $2 }' | sed 's/[", ]//g')
        else
            if [[ "${TRAVIS_PULL_REQUEST_BRANCH}" != "" ]];
            then
                TAGS=""$TRAVIS_PULL_REQUEST_BRANCH-$TRAVIS_BUILD_NUMBER""
            else
                TAGS="$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER,$TRAVIS_BRANCH"
            fi;

        fi;

        echo "ℹ️ demo-shell: Running the docker with tag" $TAGS

        DOCKER_PROJECT_ARGS="PROJECT_NAME=demo-shell"

        # Publish Image to docker
        ./node_modules/@alfresco/adf-cli/bin/adf-cli docker --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAGS" --pathProject "$(pwd)"

        echo "ℹ️ storybook-shell: Running the docker with tag" $TAGS

        DOCKER_PROJECT_ARGS="PROJECT_NAME=storybook/stories"

        # Publish Image to docker
        ./node_modules/@alfresco/adf-cli/bin/adf-cli docker --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY_STORYBOOK" --buildArgs "$DOCKER_PROJECT_ARGS" --dockerTags "$TAGS" --pathProject "$(pwd)"

    fi;
else
    echo "✅ No need to release a docker image"
fi;

