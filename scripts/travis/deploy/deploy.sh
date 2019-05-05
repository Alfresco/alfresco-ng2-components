#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

#if [ "$TRAVIS_PULL_REQUEST" != "false" ];
#then
 node ./scripts/move-dist-folder.js --base-href $TRAVIS_BUILD_NUMBER && (./scripts/pr-publish.sh -n $TRAVIS_BUILD_NUMBER -r $REPO_DOCKER -u $USERNAME_DOCKER -p $PASSWORD_DOCKER || exit 1);
#fi;

#if [ "$TRAVIS_PULL_REQUEST" != "false" ];
#then
 (node --no-deprecation ./scripts/pr-deploy.js -n $TRAVIS_BUILD_NUMBER -u $RANCHER_TOKEN -p $RANCHER_SECRET -s $REPO_RANCHER --image "docker:$REPO_DOCKER/adf/demo-shell:$TRAVIS_BUILD_NUMBER" --env $ENVIRONMENT_NAME -r $ENVIRONMENT_URL || exit 1);
#fi;
