#!/usr/bin/env bash

eval BRANCH_NAME=""

branch_name(){
    BRANCH_NAME=$1
}

show_help() {
    echo "Usage: check-branch-updated.sh"
    echo ""
    echo "-b branch name"
}

while [[ $1  == -* ]]; do
    case "$1" in
      -b)  branch_name $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 0;;
    esac
done

if [[ "$BRANCH_NAME" == "" ]]
then
    echo "The branch name is mandatory"
    exit 0
fi

hash1=$(git show-ref --heads -s $BRANCH_NAME)
hash2=$(git merge-base $BRANCH_NAME HEAD)

echo "$BRANCH_NAME HEAD " $hash1
echo "PR starting from sha " $hash2

[ "${hash1}" = "${hash2}" ] && echo "Branch up to date" || { echo "Branch needs to be rebeased"; exit 1; }
