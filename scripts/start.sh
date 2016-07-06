#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

for PACKAGE in \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-upload \
  ng2-alfresco-viewer
do
  cd "$DIR/../ng2-components/${PACKAGE}"; npm version patch
done

"$DIR/update-version.sh" ^0.1.0

"$DIR/npm-link-demo-shell.sh"

cd "$DIR/../demo-shell-ng2"

if  [[ $1 = "-install" ]]; then
    npm install
    npm run start
elif  [[ $1 = "-update " ]]; then
    npm run update
    npm run start
elif  [[ $1 = "-cleanInstall" ]]; then
    npm run clean
    npm install
    npm run start
else
    npm run start
fi
