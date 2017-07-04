#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

show_help() {
    echo "Usage: npm-clean.sh"
    echo ""
    echo "-v version package to apply new tag"
    echo "-t new tag name to add"
}

new_tag(){
    eval TAG=$1
}

package_version(){
    eval PACKAGE_VERSION=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--tag)  new_tag $2; shift 2;;
      -v) package_version $2; shift 2;;
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
  echo "====== Move ${PACKAGE}@${PACKAGE_VERSION} to tag ${TAG}===== "
  echo "====== command npm dist-tag add ${PACKAGE}@${PACKAGE_VERSION} ${TAG}===== "
  npm dist-tag add ${PACKAGE}@${PACKAGE_VERSION} ${TAG}
done
