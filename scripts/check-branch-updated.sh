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

hash1=$(git show-ref --heads -s development)
hash2=$(git merge-base development $BRANCH_NAME)
[ "${hash1}" = "${hash2}" ] && echo "Branch up to date" || { echo "Branch needs to be rebeased"; exit 1; }

echo "Development branch HEAD sha " $hash1
echo "$BRANCH_NAME branch HEAD sha " $hash2
