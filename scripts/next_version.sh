#!/usr/bin/env bash

#!/usr/bin/env bash
set -f

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


show_help() {
    echo "Usage: next_version.sh"
    echo ""
    echo "-major increase the major number and reset minor and patch"
    echo "-minor increase the minor number and reset the patch number"
    echo "-patch increase the patch number "
}

major() {
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[0]++))
    NEXT_VERSION[1]=0
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"

    echo $NEXT_VERSION
}

minor() {
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[1]++))
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"

    echo $NEXT_VERSION
}

patch() {
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[2]++))
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"

    echo $NEXT_VERSION
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -major)  major; shift;;
      -minor)  minor; shift;;
      -patch)  patch; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done
