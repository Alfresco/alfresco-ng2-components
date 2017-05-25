#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_CLEAN_DEMO=true

show_help() {
    echo "Usage: npm-clean.sh"
    echo ""
    echo "-sd or -skipDemo skip the clean of the demo folder of any components"
}

eval projects=( "ng2-activiti-diagrams"
      "ng2-activiti-analytics"
      "ng2-activiti-form"
      "ng2-activiti-processlist"
      "ng2-activiti-tasklist"
      "ng2-alfresco-core"
      "ng2-alfresco-datatable"
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

clea_demo() {
    EXEC_CLEAN_DEMO=false
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -sd|--skipDemo) update; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

for PACKAGE in ${projects[@]}
do
    echo "====== clean component: ${PACKAGE} ====="
    cd "$DIR/../ng2-components/${PACKAGE}"
    npm install rimraf
    npm run clean

    if $EXEC_CLEAN_DEMO == true; then
       if [ -d "$DIR/../ng2-components/${PACKAGE}/demo" ]; then
        echo "====== clean component demo: ${PACKAGE} ====="
        cd "$DIR/../ng2-components/${PACKAGE}/demo"
        npm install rimraf
        npm run clean
       fi
    fi
done

cd "$DIR/../demo-shell-ng2"
npm install rimraf
npm run clean


cd "$DIR/../ng2-components"
npm install rimraf
npm run clean

cd ${DIR}
