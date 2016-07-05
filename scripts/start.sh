#!/usr/bin/env bash

for PACKAGE in \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-upload \
  ng2-alfresco-viewer
do
  cd ../ng2-components/${PACKAGE}; npm version patch ; cd ../../scripts/
done

./update-version.sh ^0.1.0

./npm-link-demo-shell.sh

cd ../demo-shell-ng2

#!/bin/sh
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