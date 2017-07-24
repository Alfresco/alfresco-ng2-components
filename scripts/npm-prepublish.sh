#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval OPTIONS=""
eval EXEC_CHANGE_REGISTRY=false
eval NPM_REGISTRY=false
eval TOKEN_REGISTRY=""
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval GIT_ISH=""
eval EXEC_VERSION_JSAPI=false
eval JSAPI_VERSION=""

cd "$DIR/../demo-shell-ng2"

show_help() {
    echo "Usage: npm-prepublish.sh"
    echo ""
    echo "-r or --registry to publish in an alternative npm registry -registry 'http://npm.local.me:8080/' "
    echo "-token auth token for publish in the npm registry"
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
    echo "-vjsapi install different version from npm of JS-API defined in the package.json"
}

enable_change_registry(){
    NPM_REGISTRY=$1
    EXEC_CHANGE_REGISTRY=true
}

get_token_registry(){
    TOKEN_REGISTRY=$1

    if [[ "${TOKEN_REGISTRY}" == "" ]]
    then
      echo "token missing -token"
      exit 0
    fi
}

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

version_js_api() {
    JSAPI_VERSION=$1

    if [[ "${JSAPI_VERSION}" == "" ]]
    then
      echo "JSAPI version required with -vJSApi"
      exit 0
    fi

    EXEC_VERSION_JSAPI=true
}

change_registry(){
    if [[ "${NPM_REGISTRY}" == "" ]]
    then
      echo "NPM registry required WITH OPTION -r | -registry"
      exit 0
    fi

    echo "====== CHANGE REGISTRY: ${NPM_REGISTRY} ====="
    touch .npmrc
    echo 'strict-ssl=false' >> .npmrc
    echo 'registry=http://'${NPM_REGISTRY} >> .npmrc
    echo '//'${NPM_REGISTRY}'/:_authToken="'${TOKEN_REGISTRY}'"' >> .npmrc
}


while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -token) get_token_registry $2; shift 2;;
      -r|--registry) enable_change_registry $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

npm install rimraf -g

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
  npm run clean

  if $EXEC_CHANGE_REGISTRY == true; then
    change_registry
  fi

  npm install

    if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
    echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
    npm install $GIT_ISH
    cd  "${DESTDIR}/node_modules/alfresco-js-api"
    npm install
    cd ${DESTDIR}
  fi

  if $EXEC_VERSION_JSAPI == true; then
    echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
    npm install alfresco-js-api@${JSAPI_VERSION}
  fi

  echo "====== PREPUBLISHING: ${DESTDIR} ===== npm prepublish ${OPTIONS}"
  npm run prepublishOnly || exit 1

  if $EXEC_CHANGE_REGISTRY == true; then
      npm run rimraf .npmrc
  fi

  cd ${DIR}
done
