#!/usr/bin/env bash

#!/usr/bin/env bash
set -f

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_PATCH=false
eval EXEC_MAJOR=false
eval EXEC_MINOR=false
eval EXEC_BETA=false
eval EXEC_ALPHA=false

show_help() {
    echo "Usage: next_version.sh"
    echo ""
    echo "-major increase the major number and reset minor and patch"
    echo "-minor increase the minor number and reset the patch number"
    echo "-patch increase the patch number"
    echo "-beta create beta name"
    echo "-alpha create beta name"
}

major() {
    EXEC_MAJOR=TRUE
}

minor() {
    EXEC_MINOR=TRUE
}

patch() {
    EXEC_PATCH=TRUE
}

alpha() {
    EXEC_ALPHA=TRUE
}

beta() {
    EXEC_BETA=TRUE
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -major)  major; shift;;
      -minor)  minor; shift;;
      -patch)  patch; shift;;
      -alpha)  alpha; shift;;
      -beta)  beta; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done


if $EXEC_MINOR == true; then
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[1]++))
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi

if $EXEC_MAJOR == true; then
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[0]++))
    NEXT_VERSION[1]=0
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi

if $EXEC_PATCH == true; then
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[2]++))
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi


if $EXEC_ALPHA == true; then
    ISH_KEY=$(git rev-parse HEAD)
    NEXT_VERSION=${NEXT_VERSION}-${ISH_KEY}
fi

if $EXEC_BETA == true; then
	BETA_VERSION=$(npm view ng2-alfresco-core@beta version)

	if [[  $BETA_VERSION == "" ]]; then
	    NEXT_BETA_VERSION=1
	    NEXT_VERSION=${NEXT_VERSION}-beta${NEXT_BETA_VERSION}
	else
	    NEXT_BETA_VERSION=( ${BETA_VERSION//-beta/ } )

        # to reset the beta version in case of a new release
    	if [[ $NEXT_VERSION != ${NEXT_BETA_VERSION[0]} ]]; then
            NEXT_BETA_VERSION[1]=0
        fi

    	if [[  ${NEXT_BETA_VERSION[1]} == "" ]]; then
    	    NEXT_BETA_VERSION[1]=0
    	fi

	    ((NEXT_BETA_VERSION[1]++))
	    NEXT_VERSION=${NEXT_VERSION}-beta${NEXT_BETA_VERSION[1]}
	fi
fi

echo $NEXT_VERSION


