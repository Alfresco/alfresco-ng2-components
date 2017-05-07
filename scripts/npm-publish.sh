#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"$DIR/npm-clean.sh"
eval FORCE_PUBLISH=false

show_help() {
    echo "Usage: npm-publish.sh"
    echo ""
    echo "-f or -force publish the package with force"
}

enable_force(){
    FORCE_PUBLISH=true
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -f|--force)  enable_force; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
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
  echo "====== PUBLISHING: ${DESTDIR} ====="
  cd ${DESTDIR}
  npm run clean
  npm install
  if FORCE_PUBLISH == false; then
     npm run publish
  fi
  if FORCE_PUBLISH == true; then
     npm run publish --force || exit 1
  fi
  cd ${DIR}
done
