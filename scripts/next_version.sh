#!/usr/bin/env bash
set -f

# By default NEXT_VERSION is set to the current version, so we can change only the aplha suffix as well
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NEXT_VERSION=`node -p "require('$DIR/../package.json')".version;`;

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
    EXEC_MAJOR=true
}

minor() {
    EXEC_MINOR=true
}

patch() {
    EXEC_PATCH=true
}

alpha() {
    EXEC_ALPHA=true
}

beta() {
    EXEC_BETA=true
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

if [[ "${EXEC_MINOR}" == true ]]
then
    ADF_VERSION=$(npm view @alfresco/adf-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[1]++))
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi

if [[ "${EXEC_MAJOR}" == true ]]
then
    ADF_VERSION=$(npm view @alfresco/adf-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[0]++))
    NEXT_VERSION[1]=0
    NEXT_VERSION[2]=0
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi

if [[ "${EXEC_PATCH}" == true ]]
then
    ADF_VERSION=$(npm view ng2-alfresco-core version)
    NEXT_VERSION=( ${ADF_VERSION//./ } )
    ((NEXT_VERSION[2]++))
    NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
fi

if [[ "${EXEC_ALPHA}" == true ]]
then
    NEXT_VERSION=${NEXT_VERSION}.${GH_BUILD_NUMBER}
fi

if [[ "${EXEC_BETA}" == true ]]
then
	BETA_VERSION=$(npm view @alfresco/adf-core@beta version)

	if [[  $BETA_VERSION == "" ]]; then
	    NEXT_BETA_VERSION=0
	else
	    NEXT_BETA_VERSION=( ${BETA_VERSION//-beta/ } )

        # to reset the beta version in case of a new release
    	if [[ $NEXT_VERSION != ${NEXT_BETA_VERSION[0]} ]]; then
            NEXT_BETA_VERSION[1]=0
        fi

    	if [[  ${NEXT_BETA_VERSION[1]} == "" ]]; then
    	    NEXT_BETA_VERSION[1]=0
    	fi
	fi

	while
	   ((NEXT_BETA_VERSION[1]++))

	   NPM_VIEW="npm view @alfresco/adf-core@${NEXT_VERSION}-beta${NEXT_BETA_VERSION[1]} version"

	   NEXT_POSSIBLE_VERSION=$(${NPM_VIEW})
       [ "$NEXT_POSSIBLE_VERSION" != "" ]
    do :;  done

      NEXT_VERSION=${NEXT_VERSION}-beta${NEXT_BETA_VERSION[1]}
fi

echo $NEXT_VERSION
