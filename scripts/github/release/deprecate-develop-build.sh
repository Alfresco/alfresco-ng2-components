#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval VERSION=""

eval projects=( "adf-core"
    "adf-insights"
    "adf-content-services"
    "adf-extensions"
    "adf-testing"
    "adf-process-services"
    "adf-process-services-cloud" )

show_help() {
    echo "Usage: deprecate-develop-build.sh"
    echo "-v or -version to check  -v 1.4.0 "
    echo ""
}

set_npm_registry() {
    npm set registry https://registry.npmjs.org/
}

version() {
    if [[ $1 == "" ]];
    then
        echo "You need to add a version"
        exit 1
    fi

   VERSION=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|--version)  version $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done


if [[ $VERSION == "" ]];
then
    echo "You need to add a version"
fi

for PACKAGE in ${projects[@]}
do
echo "@alfresco/$PACKAGE"

    for VERSION_TO_DEPRECATE in $(npm view "@alfresco/$PACKAGE" versions --json | jq -r '.[] | select( . | match("-[0-9].*$") ) | select( . | contains("'$VERSION'"))')
    do
        deprecated=$(npm view "@alfresco/$PACKAGE@$VERSION_TO_DEPRECATE" -json | jq '.deprecated')

        if [[ $deprecated != null ]];
        then
            echo "Already deprecated @alfresco/$PACKAGE@$VERSION_TO_DEPRECATE"
        else
            echo "Deprecate alpha/beta version @alfresco/$PACKAGE@$VERSION_TO_DEPRECATE"
            npm deprecate "@alfresco/$PACKAGE@$VERSION_TO_DEPRECATE" "Upgrade to @latest or $VERSION"
        fi

    done

done

