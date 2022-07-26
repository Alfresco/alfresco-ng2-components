#!/usr/bin/env bash

BUILD_PIPELINE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$BUILD_PIPELINE_DIR/../.."

TEMP_GENERATOR_DIR=".tmp-generator";
BRANCH_TO_CREATE="update-alfresco-dependencies"
TOKEN=""
PR_NUMBER=""

show_help() {
    echo "Usage: create-updatebranch.sh"
    echo ""
    echo "-t or --token: Github ouath token"
    echo "-p or --pr: Originating jsapi PR number"
    echo "-v or --version version to update"
    echo "-c or --commit The commit that the current build is testing"
}

set_token() {
    TOKEN=$1
}

set_pr() {
    PR_NUMBER=$1
}

version() {
    VERSION=$1
}

set_commit() {
    COMMIT=$1
}

update_dependency() {
    PKG=$1
    PKG_VERSION=$(npm view $PKG@$VERSION version)
    echo "Update $PKG to $PKG_VERSION in $NAME_REPO"

    for i in $(find . ! -path "*/node_modules/*" -name "package-lock.json" | xargs grep -l $PKG); do
        directory=$(dirname $i)
        echo "Update $PKG in  $directory"
        ( cd $directory ; npm i --ignore-scripts $PKG@$PKG_VERSION --save-exact)
    done

    git add .
    git commit -n -m "[ci:force][auto-commit] Update $PKG to $PKG_VERSION for branch: $BRANCH_TO_CREATE originated from $PKG PR: $PR_NUMBER"
}

update_js_dependency() {
    PKG=$1
    PKG_VERSION=$2
    echo "Update $PKG to $PKG_VERSION in $NAME_REPO"

    for i in $(find . ! -path "*/node_modules/*" -name "package-lock.json" | xargs grep -l $PKG); do
        directory=$(dirname $i)
        echo "Update $PKG in  $directory"
        ( cd $directory ; npm i --ignore-scripts $PKG@$PKG_VERSION --save-exact)
    done

    git add .
    git commit -n -m "[ci:force][auto-commit] Update $PKG to $PKG_VERSION for branch: $BRANCH_TO_CREATE originated from $PKG PR: $PR_NUMBER"
}

update() {
    NAME_REPO=$1
    echo "Update dependencies $NAME_REPO"

    git clone https://$TOKEN@github.com/Alfresco/$NAME_REPO.git $TEMP_GENERATOR_DIR
    cd $TEMP_GENERATOR_DIR

    git fetch

    # Checkout branch if exist, otherwise create it
    BRANCH_CREATED=false
    if git checkout $BRANCH_TO_CREATE 2>/dev/null ; then
        git reset --hard origin/develop
    else
        BRANCH_CREATED=true
        git checkout -b $BRANCH_TO_CREATE origin/develop
    fi

    update_js_dependency "@alfresco/js-api" $JS_API_INSTALLED
    update_dependency "@alfresco/adf-extensions"
    update_dependency "@alfresco/adf-core"
    update_dependency "@alfresco/adf-content-services"
    update_dependency "@alfresco/adf-process-services"
    update_dependency "@alfresco/adf-process-services-cloud"
    update_dependency "@alfresco/adf-cli"
    update_dependency "@alfresco/adf-testing"

    if [ "$BRANCH_CREATED" = true ]; then
        git push origin $BRANCH_TO_CREATE
    else
        git push --force origin $BRANCH_TO_CREATE
    fi

    node $BUILD_PIPELINE_DIR/pr-creator.js --token=$TOKEN --title="Update branch for ADF ${PR_NUMBER} and JS-API ${JS_API_INSTALLED} [ci:force]" --head=$BRANCH_TO_CREATE --repo=$NAME_REPO --commit=$COMMIT

    cd ..
    rm -rf $TEMP_GENERATOR_DIR
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--token) set_token $2; shift; shift;;
      -p|--pr) set_pr $2; shift; shift;;
      -v|--version)  version $2; shift 2;;
      -c|--commit) set_commit $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

JS_API_INSTALLED=$(cat package.json | jq -r '.dependencies["@alfresco/js-api"]')
echo "Current installed JS-API $JS_API_INSTALLED"

cd "$REPO_DIR"

if [[ (-z "$TOKEN") || (-z "$VERSION") ]]
  then
    echo "Each of 'branch name' (-b)  token (-t) and pr number (-p) have to be set. See -help."
    exit 1;
fi

rm -rf $TEMP_GENERATOR_DIR

isSameADFSha=$(node $BUILD_PIPELINE_DIR/adf-same-commit-verify.js --token=$TOKEN --head=$BRANCH_TO_CREATE --repo=$NAME_REPO --commit=$COMMIT )
if [ "$isSameADFSha" = 'true' ]; then
        echo 'ADF sha is the same. No need to create another pr'
    else
        update "generator-alfresco-adf-app"
        update "alfresco-content-app"
        update "alfresco-apps"
fi


exit $?
