#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_INSTALL=false
eval EXEC_UPDATE=false
eval EXEC_CLEAN=false
eval EXEC_DEVELOP=false
eval EXEC_VERSION=false
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval JSAPI_VERSION=""
eval NG2_COMPONENTS_VERSION=""
eval GIT_ISH=""

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
    echo "Usage: start.sh"
    echo ""
    echo "-d or -develop start the demo shell using the relative ng2-components folder to link the components"
    echo "-i or -install start the demo shell and install the dependencies"
    echo "-u or -update start the demo shell and update the dependencies"
    echo "-v or -version install different version of ng2_components from npm defined in the package.json this option is not compatible with -d"
    echo "-c or -clean  clean the demo shell and reinstall the dependencies"
    echo "-r or -registry to download the packages from an alternative npm registry example -registry 'http://npm.local.me:8080/' "
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
    echo "-vjsapi install different version from npm of JS-API defined in the package.json"
}

install() {
    EXEC_INSTALL=true
}

update() {
    EXEC_UPDATE=true
}

develop() {
    EXEC_DEVELOP=true
}

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

version_component() {
    NG2_COMPONENTS_VERSION=$1

    if [[ "${NG2_COMPONENTS_VERSION}" == "" ]]
    then
      echo "NG2 components version required with -v | -version"
      exit 0
    fi

    EXEC_VERSION=true
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
    NPM_REGISTRY=$1

    if [[ "${NPM_REGISTRY}" == "" ]]
    then
      echo "NPM registry required WITH OPTION -r | -registry"
      exit 0
    fi

    echo "====== CHANGE REGISTRY: ${NPM_REGISTRY} ====="
    npm config set registry ${NPM_REGISTRY}
}

clean() {
    EXEC_CLEAN=true
    EXEC_INSTALL=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -i|--install) install; shift;;
      -u|--update) update; shift;;
      -c|--clean) clean; shift;;
      -d|--develop) develop; shift;;
      -r|--registry)  change_registry $2; shift 2;;
      -r|--version)  version_component $2; shift 2;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -*) shift;;
    esac
done

if $EXEC_CLEAN == true; then
  echo "====== Clean Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm install rimraf
  npm run clean
fi

if $EXEC_DEVELOP == true; then
  echo "====== Build ng2-components folder====="
  cd "$DIR/../scripts"
  sh npm-build-all.sh
fi

if $EXEC_INSTALL == true; then
  echo "====== Install Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm install
fi

if $EXEC_INSTALL == true; then
  echo "====== Install Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm install
fi

if $EXEC_VERSION == true; then
  echo "====== Install version "${NG2_COMPONENTS_VERSION}" of ng2-components ====="
  cd "$DIR/../demo-shell-ng2"

    if [[ "${EXEC_DEVELOP}" == "" ]]
    then
      echo "Option -v is not compatible with -d see the help"
      exit 0
    fi

    for PACKAGE in ${projects[@]}
    do
      npm install ${PACKAGE}@${NG2_COMPONENTS_VERSION}
    done
fi

if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
  echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
  npm install $GIT_ISH
  cd "$DIR/../ng2-components/node_modules/alfresco-js-api"
  npm install
  cd "$DIR/../ng2-components/"
fi

if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
  echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
  npm install $GIT_ISH
  cd "$DIR/../ng2-components/node_modules/alfresco-js-api"
  npm install
fi

if $EXEC_VERSION_JSAPI == true; then
  echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
  cd "$DIR/../demo-shell-ng2"
  npm install alfresco-js-api@${JSAPI_VERSION}
fi

if $EXEC_DEVELOP == false; then
  echo "====== Start Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm run start
fi

