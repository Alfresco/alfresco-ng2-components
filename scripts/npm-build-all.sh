#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false
eval RUN_LINK=false

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
    "ng2-alfresco-tag"
    "ng2-alfresco-upload"
    "ng2-alfresco-viewer"
    "ng2-alfresco-webscript"
    "ng2-alfresco-userinfo" )

show_help() {
    echo "Usage: npm-build-all.sh"
    echo ""
    echo "-t or -test build all your local component and run also the test on them"
    echo "-l or -link link together the local component and link it also in the demo shell"
}

enable_test(){
    RUN_TEST=true
}

enable_link(){
    RUN_LINK=true
}

build_project() {
    cd $1
    echo "====== build project: $2 ====="
    npm install

    if $RUN_TEST == true; then
     npm run test
    fi

    if $RUN_LINK == true; then
      npm run travis
    fi

    npm run tsc
    npm run build.umd

    if $RUN_LINK == true; then
      npm link
    fi
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -l|--link)  enable_link; shift;;
      -t|--test)  enable_test; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

for PACKAGE in ${projects[@]}
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  build_project $DESTDIR $PACKAGE
done

if $RUN_LINK == true; then
    #LINK ALL THE COMPONENTS INSIDE THE DEMO-SHELL
    cd "$DIR/../demo-shell-ng2"
    for PACKAGE in ${projects[@]}
    do
      DESTDIR="$DIR/../ng2-components/${PACKAGE}"
      echo "====== demo shell linking: ${PACKAGE} ====="
      npm link ${PACKAGE}
    done
fi
