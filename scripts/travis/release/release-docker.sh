#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


if [[ "${TRAVIS_EVENT_TYPE}" == "push" ]];
then

    if [[ $TRAVIS_BRANCH == "develop" || $TRAVIS_BRANCH == "master" ]];
    then

        cd $DIR/../../../

        # Get Tag Image
        TAG_VERSION=$(./scripts/travis/release/get-docker-image-tag-name.sh)
        echo "Running the docker with tag" $TAG_VERSION

        DOCKER_PROJECT_ARGS="PROJECT_NAME=demo-shell"

        # Publish Image to docker
        ./node_modules/@alfresco/adf-cli/bin/adf-cli docker-publish --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --buildArgs $DOCKER_PROJECT_ARGS --dockerTags "$TAG_VERSION,$TRAVIS_BRANCH" --pathProject "$(pwd)"

    fi;

fi;

