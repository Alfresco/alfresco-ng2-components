#!/usr/bin/env bash

BUILD_PIPELINE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_DIR="$BUILD_PIPELINE_DIR/../.."
BRANCH_TO_CREATE="update-alfresco-dependencies"
NAME_REPO="alfresco-apps"


show_help() {
    echo "Usage: create-updatebranch.sh"
    echo ""
    echo "-t or --token: Github ouath token"
    echo "-p or --pr: Originating jsapi PR number"
    echo "-v or --version version to update"
    echo "-c or --commit The commit that the current build is testing"
}

set_commit() {
    COMMIT=$1
}

set_token() {
    TOKEN=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--token) set_token $2; shift; shift;;
      -c|--commit) set_commit $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done


isNewADF=$(node $BUILD_PIPELINE_DIR/adf-same-commit-verify.js --token=$TOKEN --head=$BRANCH_TO_CREATE --repo=$NAME_REPO --commit=$COMMIT )
if [ "$isNewADF" = 'true' ]; then
        echo 'stop'
    else
        echo 'go ahead'
fi

