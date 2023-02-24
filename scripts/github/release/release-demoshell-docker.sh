#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../../../

echo "ℹ️ demo-shell: Running the docker with tag" $TAGS

DOCKER_PROJECT_ARGS="PROJECT_NAME=demo-shell"

# Publish Image to docker
./node_modules/@alfresco/adf-cli/bin/adf-cli docker \
    --loginCheck \
    --loginUsername "$DOCKER_REPOSITORY_USER" \
    --loginPassword "$DOCKER_REPOSITORY_PASSWORD" \
    --loginRepo "$DOCKER_REPOSITORY_DOMAIN" \
    --dockerRepo "$DOCKER_REPOSITORY" \
    --buildArgs "$DOCKER_PROJECT_ARGS" \
    --dockerTags "$TAGS" \
    --pathProject "$(pwd)" \
    "$@"
