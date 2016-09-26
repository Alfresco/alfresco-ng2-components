#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm install -g npm-check

echo 'start' > ../check-dependecies.log

for PACKAGE in \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript \
  ng2-alfresco-tag \
  ng2-activiti-analytics
do
  echo "====== Check component: ${PACKAGE} ====="
  cd "$DIR/../ng2-components/${PACKAGE}"
  echo "====== Check component: ${PACKAGE} =====" >> ../../check-dependecies.log
  npm-check >> ../../check-dependecies.log
done

cd "$DIR/../demo-shell-ng2"
echo "====== Check component: ${PACKAGE} =====" >> ../check-dependecies.log
npm-check >> ../check-dependecies.log

echo "====== You can find the log in the file  check-dependecies.log in the main root====="


cd ${DIR}
