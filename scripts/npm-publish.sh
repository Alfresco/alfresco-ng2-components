#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval FORCE_PUBLISH=false
eval EXEC_CHANGE_REGISTRY=false
eval NPM_REGISTRY=false
eval TOKEN_REGISTRY=""
eval OPTIONS=""

cd "$DIR/../demo-shell-ng2"

show_help() {
    echo "Usage: npm-publish.sh"
    echo ""
    echo "-f or -force publish the package with force"
    echo "-r or -registry to publish in an alternative npm registry -registry 'http://npm.local.me:8080/' "
    echo "-token auth token for publish in the npm registry"
    echo "-t or -tag to add a tag when publish a package"
}

enable_force(){
    OPTIONS="$OPTIONS -force"
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

add_tag(){
    eval TAG=$1

    if [[ "${TAG}" == "" ]]
    then
      echo "tag missing -t | -tag"
      exit 0
    fi

    echo "====== TAG WILL BE ADDED DURING THE PUBLISH: ${TAG} ====="
    OPTIONS="$OPTIONS -tag $1"
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
      -r|--registry) get_token_registry $2; shift 2;;
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
  echo "====== INSTALL AND CLEAN ===== "
  npm install rimraf
  npm run clean
  npm install

  if $EXEC_CHANGE_REGISTRY == true; then
    change_registry
  fi

  echo "====== PUBLISHING: ${DESTDIR} ===== npm publish ${OPTIONS}"
  npm publish ${OPTIONS}

  if $EXEC_CHANGE_REGISTRY == true; then
      npm run rimraf .npmrc
  fi

  cd ${DIR}
done
