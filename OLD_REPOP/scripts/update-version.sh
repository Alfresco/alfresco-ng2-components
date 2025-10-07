#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval JS_API=false
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

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-v or -version  version to update"
    echo "-gnu for gnu"
}

get_next_version() {
    PKG_VERSION=`node -p "require('$1/package.json')".version;`;

    if [[ $PKG_VERSION =~ [0-9]*\.[0-9]*\.[0-9]*-.* ]]; then
       PKG_VERSION=$PKG_VERSION
    else
        PKG_VERSION=( ${PKG_VERSION//./ } )
        ((PKG_VERSION[1]++))
        PKG_VERSION[2]=0
        PKG_VERSION="${PKG_VERSION[0]}.${PKG_VERSION[1]}.${PKG_VERSION[2]}"
    fi

    if [[ $GH_BUILD_NUMBER != "" ]]; then
        PKG_VERSION=$PKG_VERSION-$GH_BUILD_NUMBER
    fi

    echo $PKG_VERSION
}

VERSION=`get_next_version $DIR/..`
JS_API_VERSION=`get_next_version $DIR/../lib/js-api`

echo RELEASE_VERSION=$VERSION >> $GITHUB_OUTPUT

echo "====== New libs version: $VERSION ====="
echo "====== New js-api version: $JS_API_VERSION ====="

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
    JS_API_VERSION=$1
    DIFFERENT_JS_API=true
}

update_library_version() {
    DESTDIR="$DIR/../lib/$1"
    cd $DESTDIR

    if [[ $1 == "js-api" ]]; then
        echo "====== $1@$JS_API_VERSION ======"
        npm version --allow-same-version --no-git-tag-version --force --loglevel=error $JS_API_VERSION
    else
        echo "====== $1@$VERSION ======"
        npm version --allow-same-version --no-git-tag-version --force --loglevel=error $VERSION
    fi
}

update_dependency_version() {
    sed "${sedi[@]}" "s/\"$1\": \".*\"/\"$1\": \">=$2\"/g" "package.json"
    sed "${sedi[@]}" "s/\"$1\": \"~.*\"/\"$1\": \"~$2\"/g" "package.json"
    sed "${sedi[@]}" "s/\"$1\": \"^.*\"/\"$1\": \"^$2\"/g" "package.json"
}

update_dependencies() {
    for PROJECT in ${projects[@]}
    do
        if [[ $PROJECT == "js-api" ]]; then
            PROJECT="@alfresco\/$PROJECT"
            echo "├─ $PROJECT@$JS_API_VERSION"
            update_dependency_version $PROJECT $JS_API_VERSION
        else
            PROJECT="@alfresco\/adf-$PROJECT"
            echo "├─ $PROJECT@$VERSION"
            update_dependency_version $PROJECT $VERSION
        fi
    done
}

update_library_dependencies() {
    DESTDIR="$DIR/../lib/$1"
    cd $DESTDIR
    update_dependencies $1
}

update_root_dependencies() {
    echo "====== Root package.json ======"
    DESTDIR="$DIR/../"
    cd $DESTDIR
    update_dependencies
}

update_root_js_api_version(){
    echo "====== $DESTDIR/@alfresco/js-api@$1 ======"
    DESTDIR="$DIR/../"
    cd $DESTDIR
    update_dependency_version "@alfresco\/js-api" $1
}

update_component_js_version(){
   echo "====== $1/@alfresco/js-api@$2 ======"
   DESTDIR="$DIR/../lib/$1"
   cd $DESTDIR
   update_dependency_version "@alfresco\/js-api" $2
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

echo "====== UPDATE COMPONENT LIBRARIES ======"
cd "$DIR/../"

for PROJECT in ${projects[@]}
do
    update_library_version $PROJECT
    update_library_dependencies $PROJECT

    if $JS_API == true; then
        if $DIFFERENT_JS_API == true; then
            update_component_js_version $PROJECT $JS_API_VERSION
        else
            update_component_js_version $PROJECT $VERSION
        fi
    fi
done

update_root_dependencies

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_root_js_api_version $JS_API_VERSION
    else
        update_root_js_api_version $VERSION
    fi
fi

# bump root package.json
npm version --allow-same-version --no-git-tag-version --force --loglevel=error $VERSION

