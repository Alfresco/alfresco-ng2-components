#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_DEMO=true
eval NAME_PKG=''
eval SAVE_OPT=false
eval SAVE_DEV_OPT=false

show_help() {
    echo "Usage: npm-clean.sh"
    echo "--save"
    echo "--save-dev"
    echo "-p name of the package"
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
    EXEC_DEMO=false
}

name_pkg(){
    NAME_PKG=$1
}

save(){
    SAVE_OPT=true
}

save_dev(){
    SAVE_DEV_OPT=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -p)  name_pkg $2; shift 2;;
      --save)  save; shift;;
      --save-dev)  save_dev; shift;;
      -sd|--skipDemo) clea_demo; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

for PACKAGE in ${projects[@]}
do
    echo "====== install package ${NAME_PKG} in component ${PACKAGE} ====="
    cd "$DIR/../ng2-components/${PACKAGE}"

    if $SAVE_OPT == true; then
      npm install --save ${NAME_PKG}
    fi

    if $SAVE_DEV_OPT == true; then
      npm install --save-dev ${NAME_PKG}
    fi
done

cd "$DIR/../demo-shell-ng2"
if $SAVE_OPT == true; then
  npm install --save ${NAME_PKG}
fi

if $SAVE_DEV_OPT == true; then
  npm install --save-dev ${NAME_PKG}
fi


cd "$DIR/../ng2-components"
if $SAVE_OPT == true; then
  npm install --save ${NAME_PKG}
fi

if $SAVE_DEV_OPT == true; then
  npm install --save-dev ${NAME_PKG}
fi

