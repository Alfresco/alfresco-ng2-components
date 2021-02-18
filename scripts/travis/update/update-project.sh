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
    git commit -n -m "[auto-commit] Update $PKG to $PKG_VERSION for branch: $BRANCH_TO_CREATE originated from $PKG PR: $PR_NUMBER"
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
    git commit -n -m "[auto-commit] Update $PKG to $PKG_VERSION for branch: $BRANCH_TO_CREATE originated from $PKG PR: $PR_NUMBER"
}

update() {
    NAME_REPO=$1
    echo "Update dependencies $NAME_REPO"

    git clone https://$TOKEN@github.com/Alfresco/$NAME_REPO.git $TEMP_GENERATOR_DIR
    cd $TEMP_GENERATOR_DIR

    git fetch

    # Checkout branch if exist, otherwise create it
    git checkout $BRANCH_TO_CREATE 2>/dev/null || git checkout -b $BRANCH_TO_CREATE origin/develop

    update_js_dependency "@alfresco/js-api" $JS_API_INSTALLED
    update_dependency "@alfresco/adf-extensions"
    update_dependency "@alfresco/adf-core"
    update_dependency "@alfresco/adf-content-services"
    update_dependency "@alfresco/adf-process-services"
    update_dependency "@alfresco/adf-process-services-cloud"
    update_dependency "@alfresco/adf-cli"
    update_dependency "@alfresco/adf-testing"

    git push origin $BRANCH_TO_CREATE

    node $BUILD_PIPELINE_DIR/pr-creator.js --token=$TOKEN --title="Update branch for ADF and JS-API" --head=$BRANCH_TO_CREATE --repo=$NAME_REPO

    cd ..
    rm -rf $TEMP_GENERATOR_DIR
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--token) set_token $2; shift; shift;;
      -p|--pr) set_pr $2; shift; shift;;
      -v|--version)  version $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

cd "$REPO_DIR"

JS_API_INSTALLED=$(npm list @alfresco/js-api --depth=0 --json | jq -r '.dependencies["@alfresco/js-api"].version')

echo "Current installed JS-API $JS_API_INSTALLED"

if [[ (-z "$TOKEN") || (-z "$VERSION") ]]
  then
    echo "Each of 'branch name' (-b)  token (-t) and pr number (-p) have to be set. See -help."
    exit 1;
fi

rm -rf $TEMP_GENERATOR_DIR

update "generator-alfresco-adf-app"
update "alfresco-content-app"
update "alfresco-apps"
update "alfresco-digital-workspace-app"


exit $?
