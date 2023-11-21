#!/usr/bin/env bash
set -f

# By default NEXT_VERSION is set to the current version, so we can change only the aplha suffix as well
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NEXT_VERSION=`node -p "require('$DIR/../package.json')".version;`;

eval EXEC_MINOR=false
eval EXEC_ALPHA=false

show_help() {
    echo "Usage: next_version.sh"
    echo ""
    echo "-minor increase the minor number and reset the patch number"
    echo "-alpha create beta name"
}

minor() {
    EXEC_MINOR=true
}

alpha() {
    EXEC_ALPHA=true
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -minor)  minor; shift;;
      -alpha)  alpha; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

if [[ "${EXEC_MINOR}" == true ]]
then
    ADF_VERSION=$(npm view @alfresco/adf-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[1]++))
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi

if [[ "${EXEC_ALPHA}" == true ]]
then
    NEXT_VERSION=${NEXT_VERSION}-${GH_BUILD_NUMBER}
fi

echo $NEXT_VERSION
