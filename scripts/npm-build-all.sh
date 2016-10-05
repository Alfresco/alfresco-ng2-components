#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

build_project() {
    cd $1
    echo "====== build project: $2 ====="
    npm update
    npm install --cache-min 9999999
    npm run build
}

for PACKAGE in \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-tag \
  ng2-alfresco-upload \
  ng2-alfresco-userinfo \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  build_project $DESTDIR $PACKAGE
done

build_project "$DIR/../demo-shell-ng2" "Demo Shell"
