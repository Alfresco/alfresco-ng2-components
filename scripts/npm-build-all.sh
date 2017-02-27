#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false

show_help() {
    echo "Usage: npm-build-all.sh"
    echo ""
    echo "-t or -test build all your local component and run also the test on them"
}

enable_test(){
    RUN_TEST=true
}

build_project() {
    cd $1
    echo "====== build project: $2 ====="
    npm install
    npm build
    if $RUN_TEST == true; then
     npm run test
    fi
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--test)  enable_test; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

for PACKAGE in \
  ng2-alfresco-core \
  ng2-activiti-diagrams \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-tasklist \
  ng2-activiti-processlist \
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
