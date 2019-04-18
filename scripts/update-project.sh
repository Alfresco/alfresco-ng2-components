#!/usr/bin/env bash

eval GNU=false

set -e
TEMP_GENERATOR_DIR=".tmp-generator";
VERSION=$(npm view @alfresco/adf-core@beta version)

show_help() {
    echo "Usage: update-generator.sh"
    echo ""
    echo "-t or --token  Github ouath token"
    echo "-n or --name  Github name of the project"
    echo "-gnu for gnu"
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

token() {
    TOKEN=$1
}

name_repo() {
    NAME_REPO=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -n|--name|-\?)  name_repo $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -t|--token)  token $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf $TEMP_GENERATOR_DIR;

git clone https://$TOKEN@github.com/Alfresco/$NAME_REPO.git $TEMP_GENERATOR_DIR
cd $TEMP_GENERATOR_DIR
git checkout development

BRANCH="generator-update-beta-$VERSION"
git checkout -b $BRANCH

if $GNU; then
    ./scripts/update-version.sh -gnu -v $VERSION
else
    ./scripts/update-version.sh -v $VERSION
fi

git add .
git commit -m "Update ADF packages version $VERSION"
git push -u origin $BRANCH

curl -H "Authorization: token $TOKEN" -X POST -d '{"body":"Update ADF packages version '$VERSION'","head":"'$BRANCH'","base":"development","title":"Update ADF packages version '$VERSION'"}' https://api.github.com/repos/$NAME_REPO/pulls

rm -rf $TEMP_GENERATOR_DIR;
