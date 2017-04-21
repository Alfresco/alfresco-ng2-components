#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval projects=( "ng2-activiti-diagrams"
      "ng2-activiti-analytics"
      "ng2-activiti-form"
      "ng2-activiti-processlist"
      "ng2-activiti-tasklist"
      "ng2-alfresco-core"
      "ng2-alfresco-datatable"
      "ng2-alfresco-documentlist"
      "ng2-alfresco-login"
      "ng2-alfresco-search"
      "ng2-alfresco-tag"
      "ng2-alfresco-social"
      "ng2-alfresco-upload"
      "ng2-alfresco-viewer"
      "ng2-alfresco-webscript"
      "ng2-alfresco-userinfo" )

for PACKAGE in ${projects[@]}
do
  echo "====== clean component: ${PACKAGE} ====="
  cd "$DIR/../ng2-components/${PACKAGE}"
  npm run clean

  if [ -d "$DIR/../ng2-components/${PACKAGE}/demo" ]; then
    echo "====== clean component demo: ${PACKAGE} ====="
    cd "$DIR/../ng2-components/${PACKAGE}/demo"
    npm run clean
  fi
done

cd "$DIR/../demo-shell-ng2"
npm run clean

cd ${DIR}
