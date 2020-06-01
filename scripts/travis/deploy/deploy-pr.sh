#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

# Get Tag Image
TAG_VERSION=$(./scripts/travis/deploy/get-docker-image-tag-name.sh)
echo "Running the docker with tag" $TAG_VERSION

# Publish Image to docker

sed s%href=\".\"%href=\".\"%g \
-i ./dist/demo-shell/index.html

mkdir  "./demo-shell/tmp/"
mv ./dist/demo-shell/* ./demo-shell/tmp

mkdir  -p "./dist/demo-shell/${TRAVIS_BUILD_NUMBER}"
mv ./demo-shell/tmp/* ./dist/demo-shell/${TRAVIS_BUILD_NUMBER}

./node_modules/@alfresco/adf-cli/bin/adf-cli docker-publish --loginCheck --loginUsername "$DOCKER_REPOSITORY_USER" --loginPassword "$DOCKER_REPOSITORY_PASSWORD" --loginRepo "$DOCKER_REPOSITORY_DOMAIN" --dockerRepo "$DOCKER_REPOSITORY" --dockerTags "$TAG_VERSION" --pathProject "$(pwd)"

echo "Update rancher with docker tag" $TAG_VERSION  --url $REPO_RANCHER --environment_name $REPO_RANCHER_ADF_NAME

# Deploy PR in Rancher env
(node --no-deprecation ./scripts/travis/deploy/rancher-pr-deploy.js -n $TRAVIS_BUILD_NUMBER -u $RANCHER_TOKEN -p $RANCHER_SECRET -s $REPO_RANCHER --image "alfresco/demo-shell:develop-$TRAVIS_BUILD_NUMBER" --env $ENVIRONMENT_NAME -r $ENVIRONMENT_URL || exit 1);

# Restore the app in the main run the unit test
mv ./dist/demo-shell/${TRAVIS_BUILD_NUMBER} "./demo-shell/tmp/"
mv "./dist/demo-shell/" "./dist/demo-shell/"
