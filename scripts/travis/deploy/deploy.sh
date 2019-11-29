#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

 node ./scripts/travis/deploy/move-dist-folder.js --base-href $TRAVIS_BUILD_NUMBER && (./scripts/travis/deploy/pr-publish.sh -n $TRAVIS_BUILD_NUMBER -r $REPO_DOCKER -u $DOCKER_REPOSITORY_USER -p $DOCKER_REPOSITORY_PASSWORD || exit 1);

 (node --no-deprecation ./scripts/travis/deploy/pr-deploy.js -n $TRAVIS_BUILD_NUMBER -u $RANCHER_TOKEN -p $RANCHER_SECRET -s $REPO_RANCHER --image "docker:$REPO_DOCKER/adf/demo-shell:$TRAVIS_BUILD_NUMBER" --env $ENVIRONMENT_NAME -r $ENVIRONMENT_URL || exit 1);
