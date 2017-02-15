#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

buildProjects=false;

if [ "$1" = "build" ]; then
    buildProjects=true
fi

link_project() {
    echo $1
    rm -rf node_modules/$1
    mkdir -p node_modules/$1

    if [ "$3" = true ]; then
        ( cd $2; npm run build )
    fi

    cp -R $2/assets node_modules/$1/assets
    cp -R $2/dist node_modules/$1/dist
    cp -R $2/src node_modules/$1/src
    cp $2/package.json node_modules/$1/package.json
}

link_project 'alfresco-js-api' '../../alfresco-js-api/'

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
  PACKAGE_DIR="$DIR/../ng2-components/${PACKAGE}"
  link_project $PACKAGE $PACKAGE_DIR $buildProjects
done
