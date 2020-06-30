#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


if ([ "$TRAVIS_BRANCH" = "master" ]); then
   VERSION=$(npm view @alfresco/adf-core version)
   JS_VERSION=$(npm view @alfresco/js-api version)
else
   VERSION=$(npm view @alfresco/adf-core@beta version)
   JS_VERSION=$(npm view @alfresco/js-api@alpha version)
fi;

echo "Update Generator"
./scripts/travis/update/update-project.sh -t $GITHUB_TOKEN -n 'Alfresco/generator-alfresco-adf-app' -v $VERSION -vjs $JS_VERSION
echo "Update ACA"
./scripts/travis/update/update-project.sh -t $GITHUB_TOKEN -n 'Alfresco/alfresco-content-app' -v $VERSION -vjs $JS_VERSION
echo "Update AMA"
./scripts/travis/update/update-project.sh -t $GITHUB_ENTERPRISE_TOKEN -n 'Alfresco/alfresco-apps' -v $VERSION -vjs $JS_VERSION
echo "Update Workspace"
./scripts/travis/update/update-project.sh -t $GITHUB_ENTERPRISE_TOKEN -n 'Alfresco/alfresco-process-workspace-app' -v $VERSION -vjs $JS_VERSION
echo "Update Digital Workspace"
./scripts/travis/update/update-project.sh -t $GITHUB_ENTERPRISE_TOKEN -n 'Alfresco/alfresco-digital-workspace-app' -v $VERSION -vjs $JS_VERSION

