#!/usr/bin/env bash

eval BRANCH_NAME=""
eval GNU=false

show_help() {
    echo "Usage: smart-build.sh"
    echo ""
    echo "-b branch name"
    echo "-gnu for gnu"
}

branch_name(){
    BRANCH_NAME=$1
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

if $GNU; then
 gnu='-gnu'
else
 gnu=''
fi

#reset the tmp folder
affected="$(./scripts/affected-libs.sh ${gnu[@]} -b "$BRANCH_NAME")"
echo $affected
node ./scripts/travis/build/smart-check.js --token "$GIT_TRAVIS_TOKEN" --buildId "$TRAVIS_BUILD_ID" --affected "$affected"
