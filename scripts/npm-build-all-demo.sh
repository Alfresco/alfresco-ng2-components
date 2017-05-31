#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval EXEC_BUILD=true
eval EXEC_INSTALL=true

eval projects=(
    "ng2-alfresco-core"
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

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

show_help() {
    echo "Usage: npm-build-all-demo.sh"
    echo ""
    echo "-t or -test build all your local component and run also the test on them , this parameter accept also a wildecard to execute test for example -t "ng2-alfresco-core" "
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
}

exclude_build(){
    EXEC_BUILD=false
}

exec_install(){
    EXEC_INSTALL=false
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -si|--skipinstall)  exec_install; shift;;
      -sb|--skipbuild)  exclude_build; shift;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

cd "$DIR/../ng2-components/"

for PACKAGE in ${projects[@]}
do
  DESTDIR="$DIR/../ng2-components/$PACKAGE/demo"
  if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
      echo "====== Use the alfresco JS-API  '$GIT_ISH' in $PACKAGE demo ====="
      cd $DESTDIR
      npm install $GIT_ISH
      cd "$DIR/../ng2-components/$PACKAGE/demo/node_modules/alfresco-js-api"
      npm install
  fi
  cd $DESTDIR
  npm run buil:dev

done

