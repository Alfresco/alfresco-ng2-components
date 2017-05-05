#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false

eval projects=( "ng2-alfresco-core"
    "ng2-alfresco-datatable"
    "ng2-activiti-diagrams"
    "ng2-activiti-analytics"
    "ng2-activiti-form"
    "ng2-activiti-tasklist"
    "ng2-activiti-processlist"
    "ng2-alfresco-documentlist"
    "ng2-alfresco-login"
    "ng2-alfresco-search"
    "ng2-alfresco-social"
    "ng2-alfresco-tag"
    "ng2-alfresco-social"
    "ng2-alfresco-upload"
    "ng2-alfresco-viewer"
    "ng2-alfresco-webscript"
    "ng2-alfresco-userinfo" )

show_help() {
    echo "Usage: npm-build-all.sh"
    echo ""
    echo "-t or -test build all your local component and run also the test on them"
}

enable_test(){
    RUN_TEST=true
}

test_project() {
    echo "====== test project: $1 ====="
    npm run test || exit 1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--test)  enable_test; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

cd "$DIR/../ng2-components/"
npm install package-json-merge -g
npm install rimraf -g
npm run pkg-build
npm install && npm run build || exit 1

for PACKAGE in ${projects[@]}
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  cd $DESTDIR
  if $RUN_TEST == true; then
      test_project $PACKAGE
  fi
done


