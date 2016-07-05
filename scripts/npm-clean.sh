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
  echo "====== clean component: ${PACKAGE} ====="
  cd ../ng2-components/${PACKAGE}
  npm run clean
  cd ../../scripts/
done

cd ./../demo-shell-ng2
npm run clean