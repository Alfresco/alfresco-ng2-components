#!/usr/bin/env bash

eval BRANCH_NAME=""
eval DIRECTORY="tmp"
eval HEAD_SHA_BRANCH=""

show_help() {
    echo "Usage: affected-folder.sh"
    echo ""
    echo "-b branch name"
    echo "-folder"
}

branch_name(){
    BRANCH_NAME=$1
}

folder_name(){
    FOLDER_NAME=$1
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -f)  folder_name $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

if [[ "$FOLDER_NAME" == "" ]]
then
    echo "The folder name is mandatory"
    exit 0
fi

HEAD_SHA_BRANCH="$(git merge-base origin/$BRANCH_NAME HEAD)"
#echo "Branch name $BRANCH_NAME HEAD sha " $HEAD_SHA_BRANCH

if git diff --name-only $HEAD_SHA_BRANCH  HEAD | grep "^${FOLDER_NAME}" &> /dev/null
then
    echo ${FOLDER_NAME}
fi

