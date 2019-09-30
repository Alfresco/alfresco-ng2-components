#!/bin/bash

VERSION=$(npm view @alfresco/adf-core@beta version)

echo "git tag -a ${VERSION} -m ${VERSION}"
git config --local user.name "alfresco-build"
git config --local user.email "build@alfresco.com"
git tag -a ${VERSION} -m "${VERSION} [ci skip] "
git remote rm origin
GITHUB_REPO=https://$GITHUB_TOKEN:x-oauth-basic@github.com/Alfresco/alfresco-ng2-components.git
git remote add origin $GITHUB_REPO
git push origin --tags
