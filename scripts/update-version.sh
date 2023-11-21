#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
VERSION_IN_PACKAGE_JSON=`node -p "require('$DIR/../package.json')".version;`;

eval JS_API=true
eval GNU=false
eval DIFFERENT_JS_API=false

eval projects=( "cli"
    "core"
    "content-services"
    "process-services"
    "process-services-cloud"
    "insights"
    "testing"
    "extensions"
    "eslint-angular"
    "js-api" )

cd `dirname $0`

prefix="@alfresco\/adf-"

projectslength=${#projects[@]}

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-v or -version  version to update"
    echo "-nextalpha update next alpha version of js-api and lib automatically"
    echo "-gnu for gnu"
}

next_alpha_mode() {
    NEXT_VERSION=`node -p "require('$DIR/../package.json')".version;`;
    # If we are creating a new alpha for a prerelease, we need to simply call it with -alpha
    if [[ $VERSION_IN_PACKAGE_JSON =~ [0-9]*\.[0-9]*\.[0-9]*-.* ]]; then
        echo "No minor update needed"
    else
        echo "Running minor update"
        ADF_VERSION=$(npm view @alfresco/adf-core version)
        NEXT_VERSION=( ${ADF_VERSION//./ } )
        ((NEXT_VERSION[1]++))
        NEXT_VERSION[2]=0
        NEXT_VERSION="${NEXT_VERSION[0]}.${NEXT_VERSION[1]}.${NEXT_VERSION[2]}"
    fi

    if [[  $GH_BUILD_NUMBER != "" ]]; then
        echo "Adding build number"
        NEXT_VERSION=${NEXT_VERSION}-${GH_BUILD_NUMBER}
    fi

    VERSION=$NEXT_VERSION

    echo "====== version lib ${VERSION} ====="
    JS_API=false
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

version_js_change() {
    echo "====== Alfresco JS-API version $1 ====="
    VERSION_JS_API=$1
    DIFFERENT_JS_API=true
}

update_library_version() {
    echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
    DESTDIR="$DIR/../lib/${1}"
    if [[ $1 == "js-api" ]]; then
        DESTDIR="$DESTDIR/src"
    fi
    cd $DESTDIR
    npm version --allow-same-version --no-git-tag-version --force ${VERSION}
    cd -
}

update_library_dependencies() {
    echo "====== UPDATE DEPENDENCY VERSION of .* to ~${VERSION} in ${1}======"
    DESTDIR="$DIR/../lib/${1}"

    for (( j=0; j<${projectslength}; j++ ));
    do
        PROJECT=${prefix}${projects[$j]}
        sed "${sedi[@]}" "s/\"${PROJECT}\": \".*\"/\"${PROJECT}\": \">=${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"~.*\"/\"${PROJECT}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"^.*\"/\"${PROJECT}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
    done
}

update_root_package_json() {
    echo "====== UPDATE TOTAL BUILD DEPENDENCY VERSION of .* to ~${VERSION} ======"
    DESTDIR="$DIR/../"

    for (( j=0; j<${projectslength}; j++ ));
    do
        PROJECT=${prefix}${projects[$j]}
        sed "${sedi[@]}" "s/\"${PROJECT}\": \".*\"/\"${PROJECT}\": \">=${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"~.*\"/\"${PROJECT}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
        sed "${sedi[@]}" "s/\"${PROJECT}\": \"^.*\"/\"${PROJECT}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
    done
}

update_total_build_dependency_js_version(){
    echo "====== UPDATE DEPENDENCY VERSION @alfresco/js-api total build to ~${1} in ${DESTDIR}======"
    DESTDIR="$DIR/../"
    PACKAGETOCHANGE="@alfresco\/js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \">=${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"~${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"^${1}\"/g"  ${DESTDIR}/package.json
}

update_component_js_version(){
   echo "====== UPDATE DEPENDENCY VERSION of @alfresco/js-api in ${1} to ${2} ======"
   DESTDIR="$DIR/../lib/${1}"

   PACKAGETOCHANGE="@alfresco\/js-api"

   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \">=${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"~${2}\"/g"  ${DESTDIR}/package.json
   sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"^${2}\"/g"  ${DESTDIR}/package.json

}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -vj|versionjsapi)  version_js_change $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -nextalpha) next_alpha_mode; shift;;
      -*) shift;;
    esac
done

if $GNU; then
    sedi='-i'
else
    sedi=('-i' '')
fi

if [[ "${VERSION}" == "" ]]
then
    echo "Version number required"
    exit 1
fi

cd "$DIR/../"

echo "====== UPDATE COMPONENTS ======"

for PROJECT in ${projects[@]}
do
    echo "====== UPDATE $PROJECT ======"

    update_library_version $PROJECT
    update_library_dependencies $PROJECT

    if $JS_API == true; then
        if $DIFFERENT_JS_API == true; then
            update_component_js_version $PROJECT $VERSION_JS_API
        else
            update_component_js_version $PROJECT $VERSION
        fi
    fi
done

update_root_package_json

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_total_build_dependency_js_version ${VERSION_JS_API}
    else
        update_total_build_dependency_js_version ${VERSION}
    fi
fi

echo "====== UPDATE DEMO SHELL ======"

DESTDIR="$DIR/../demo-shell/"
npm version --allow-same-version --no-git-tag-version --force ${VERSION}

cd $DESTDIR
npm version --allow-same-version --no-git-tag-version --force ${VERSION}
cd -
