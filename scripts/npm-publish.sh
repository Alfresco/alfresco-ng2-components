#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval FORCE_PUBLISH=false
eval EXEC_CHANGE_REGISTRY=false
eval NPM_REGISTRY=false
eval TOKEN_REGISTRY=""
eval OPTIONS=""
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval GIT_ISH=""
eval EXEC_SLEEP=false
eval SLEEP_TIME="0"
eval EXEC_VERSION_JSAPI=false
eval JSAPI_VERSION=""
eval EXEC_BUILD=true

eval projects=(
    "core"
    "insights"
    "testing"
    "content-services"
    "process-services"
    "process-services-cloud"
    "extensions" )

cd "$DIR/../"

show_help() {
    echo "Usage: npm-publish.sh"
    echo ""
    echo "-f or --force publish the package with force"
    echo "-r or --registry to publish in an alternative npm registry -registry 'http://npm.local.me:8080/' "
    echo "-token auth token for publish in the npm registry"
    echo "-t or --tag to add a tag when publish a package"
    echo "-sb skip build"
    echo "--sleep add a sleep before any publish"
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
    echo "-vjsapi <commit-ish>      Install different version from npm of JS-API defined in the package.json"
}

enable_force(){
    OPTIONS="$OPTIONS -force"
}

enable_change_registry(){
    NPM_REGISTRY=$1
    EXEC_CHANGE_REGISTRY=true
}

set_sleep(){
    SLEEP_TIME=$1
    EXEC_SLEEP=true
}

skip_build(){
    EXEC_BUILD=false
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

add_tag(){
    eval TAG=$1

    if [[ "${TAG}" == "" ]]
    then
      echo "tag missing -t | -tag"
      exit 0
    fi

    echo "====== TAG WILL BE ADDED DURING THE PUBLISH: ${TAG} ====="
    OPTIONS="$OPTIONS --tag $1"
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
      -t|--tag)  add_tag $2; shift 2;;
      -f|--force)  enable_force; shift;;
      -token) get_token_registry $2; shift 2;;
      --sleep) set_sleep $2; shift 2;;
      -sb) skip_build; shift;;
      -r|--registry) enable_change_registry $2; shift 2;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

node ./scripts/pre-publish.js

if $EXEC_BUILD == true; then
echo "====== INSTALL AND CLEAN ${PACKAGE} ===== "
    npm install rimraf
    npm run clean
    npm install
fi

if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
    echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
    npm install $GIT_ISH
    cd  "${DESTDIR}/node_modules/alfresco-js-api"
    npm install
    cd ${DESTDIR}
fi

if $EXEC_VERSION_JSAPI == true; then
  echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
  npm install alfresco-js-api@${JSAPI_VERSION} --no-save
fi

if $EXEC_BUILD == true; then
    echo "====== Build ADF ===== "
    npm run build-lib
fi

for PACKAGE in ${projects[@]}
do

  DESTDIR="$DIR/../lib/dist/${PACKAGE}"
  echo "====== MOVE DIR: ${DESTDIR} ===== "
  cd ${DESTDIR}

  if $EXEC_CHANGE_REGISTRY == true; then
    change_registry
  fi

  echo "====== PUBLISHING: ${DESTDIR} ===== npm publish ${OPTIONS}"
  npm publish ${OPTIONS} --access=public || exit 1

  if $EXEC_CHANGE_REGISTRY == true; then
      rm .npmrc
  fi

  if $EXEC_SLEEP == true; then
      echo "====== SLEEP ${SLEEP_TIME}"
      sleep ${SLEEP_TIME}
  fi

  cd ${DIR}
done
