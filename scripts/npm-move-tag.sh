#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval projects=( "@alfresco/adf-core"
    "@alfresco/adf-content-services"
    "@alfresco/adf-insights"
    "@alfresco/adf-process-services"
    "@alfresco/adf-process-services-cloud"
    "@alfresco/adf-extensions" )

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

for PACKAGE in ${projects[@]}
do
  echo "====== Move ${PACKAGE}@${PACKAGE_VERSION} to tag ${TAG}===== "
  echo "====== command npm dist-tag add ${PACKAGE}@${PACKAGE_VERSION} ${TAG}===== "
  npm dist-tag add ${PACKAGE}@${PACKAGE_VERSION} ${TAG}
done
