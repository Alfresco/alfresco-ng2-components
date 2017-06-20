#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval OPTIONS=""
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval GIT_ISH=""

cd "$DIR/../demo-shell-ng2"

show_help() {
    echo "Usage: npm-prepublish.sh"
    echo ""
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
}

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

for PACKAGE in \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-activiti-diagrams \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-tasklist \
  ng2-activiti-processlist \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-tag \
  ng2-alfresco-social \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript \
  ng2-alfresco-userinfo
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== MOVE DIR: ${DESTDIR} ===== "
  cd ${DESTDIR}

  echo "====== INSTALL AND CLEAN ${PACKAGE} ===== "
  npm install rimraf
  npm run clean

  if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
    echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
    npm install $GIT_ISH
    cd  "${DESTDIR}/node_modules/alfresco-js-api"
    npm install
    cd ${DESTDIR}
  fi

  npm install

  echo "====== PREPUBLISHING: ${DESTDIR} ===== npm prepublish ${OPTIONS}"
  npm run prepublish || exit 1

  cd ${DIR}
done
