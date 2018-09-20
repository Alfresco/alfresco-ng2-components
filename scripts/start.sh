#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_INSTALL=true
eval EXEC_UPDATE=false
eval EXEC_CLEAN=false
eval EXEC_DEVELOP=false
eval EXEC_VERSION=false
eval EXEC_DIST=false
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval EXEC_VERSION_JSAPI=false
eval EXEC_START=true
eval EXEC_TEST=false
eval EXEC_E2E=false
eval JSAPI_VERSION=""
eval NG2_COMPONENTS_VERSION=""
eval GIT_ISH=""

eval projects=( "@alfresco/core"
    "@alfresco/content-service"
    "@alfresco/process-service"
    "@alfresco/process-service-cloud"
    "@alfresco/extensions" )

show_help() {
    echo "Usage: start.sh"
    echo ""
    echo "-ss or --skipstart build only the demo shell without start"
    echo "-si or --skipinstall start the demo shell and  skip the install the dependencies"
    echo "-dev or --develop start the demo shell using the relative lib folder to link the components"
    echo "-dist build or start the demo shell in dist mode"
    echo "-t or --test execute test"
    echo "--e2e execute e2e test"
    echo "-u or --update start the demo shell and update the dependencies"
    echo "-c or --clean  clean the demo shell and reinstall the dependencies"
    echo "-r or --registry to download the packages from an alternative npm registry example -registry 'http://npm.local.me:8080/' "
    echo "-v or --version install different version of ng2_components from npm defined in the package.json this option is not compatible with -d"
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
    echo "-vjsapi install different version from npm of JS-API defined in the package.json"
}

install() {
    EXEC_INSTALL=false
}

update() {
    EXEC_UPDATE=true
}

develop() {
    EXEC_DEVELOP=true
}

enable_dist() {
    EXEC_DIST=true
}

disable_start() {
    EXEC_START=false
}

enable_test() {
    EXEC_TEST=true
}

enable_e2e() {
    EXEC_E2E=true
}

enable_js_api_git_link() {
    GIT_ISH='git+https://github.com/Alfresco/alfresco-js-api.git#'$1
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
      -u|--update) update; shift;;
      -c|--clean) clean; shift;;
      -t|--test) enable_test; shift;;
      --e2e) enable_e2e; shift;;
      -r|--registry)  change_registry $2; shift 2;;
      -v|--version)  version_component $2; shift 2;;
      -si|--skipinstall) install; shift;;
      -ss|--skipstart)  disable_start; shift;;
      -dev|--develop) develop; shift;;
      -dist)  enable_dist; shift;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

cd "$DIR/.."

if $EXEC_CLEAN == true; then
  echo "====== Clean Demo shell ====="
  npm install rimraf
  npm run clean
fi

if $EXEC_INSTALL == true; then
  echo "====== Install Demo shell ====="
  npm install
fi

if $EXEC_VERSION == true; then
   echo "====== Install version "${NG2_COMPONENTS_VERSION}" of components ====="

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
  npm install $GIT_ISH --no-save
  cd "$DIR/../demo-shell/node_modules/alfresco-js-api"
  npm install
fi

if $EXEC_VERSION_JSAPI == true; then
  echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
  npm install alfresco-js-api@${JSAPI_VERSION}
fi

if $EXEC_TEST == true; then
  echo "====== Demo shell Test ====="
  npm run test || exit 1
  exit 0
fi

if $EXEC_E2E == true; then
  echo "====== Demo shell e2e ====="
  npm run e2e
  exit 0
fi

if $EXEC_START == true; then
    if $EXEC_DEVELOP == true; then
        echo "====== Start Demo shell dev mode ====="
        npm run start:dev
    elif $EXEC_DIST == true; then
        echo "====== Start Demo shell dist mode ====="
        npm run start:dist
    else
        echo "====== Start Demo shell ====="
        npm run start
    fi
else
    if $EXEC_DEVELOP == true; then
        echo "====== Build Demo shell dev mode ====="
        npm run build:dev
    else
        echo "====== Build Demo shell ====="
        npm run build
    fi
fi


