#!/bin/bash

VERSION=$(npm view @alfresco/adf-core@beta version)

echo "git tag -a ${VERSION} -m ${VERSION}"
git tag -a ${VERSION} -m "${VERSION} [ci skip] "
git remote rm origin
git remote add origin 'git@github.com:Alfresco/alfresco-ng2-components.git'
git push origin --tags
