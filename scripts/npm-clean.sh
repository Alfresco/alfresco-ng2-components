#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

for PACKAGE in \
  ng2-activiti-analytics \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-activiti-form \
  ng2-alfresco-login \
  ng2-activiti-processlist \
  ng2-alfresco-search \
  ng2-activiti-tasklist \
  ng2-alfresco-tag \
  ng2-alfresco-upload \
  ng2-alfresco-userinfo \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript
do
  echo "====== clean component: ${PACKAGE} ====="
  cd "$DIR/../ng2-components/${PACKAGE}"
  npm run clean
done

cd "$DIR/../demo-shell-ng2"
npm run clean

cd ${DIR}
