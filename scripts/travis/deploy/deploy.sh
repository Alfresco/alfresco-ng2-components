#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

# Get Tag Image
TAG_VERSION=$(./scripts/travis/deploy/get-docker-image-tag-name.sh)
echo "Running the docker with tag" $TAG_VERSION

# Publish Image to docker
./node_modules/@alfresco/adf-cli/bin/adf-cli docker-publish --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --dockerTags "$TAG_VERSION,$TRAVIS_BRANCH" --pathProject "$(pwd)"

echo "Update rancher with docker tag" $TAG_VERSION  --url $REPO_RANCHER --environment_name $REPO_RANCHER_ADF_NAME

# Deploy PR in Rancher env
./scripts/travis/deploy/rancher-update.sh --access_key $RANCHER_TOKEN --secret_key $RANCHER_SECRET --url $REPO_RANCHER --environment_name $REPO_RANCHER_ADF_NAME --image docker:$DOCKER_REPOSITORY:$TAG_VERSION
