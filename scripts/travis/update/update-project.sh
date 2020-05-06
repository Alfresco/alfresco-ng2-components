#!/usr/bin/env bash

set -e
TEMP_GENERATOR_DIR=".tmp-generator";
VERSION=$(npm view @alfresco/adf-core@beta version)
JS_VERSION=$(npm view @alfresco/js-api@beta version)

show_help() {
    echo "Usage: update-project.sh"
    echo ""
    echo "-t or --token  Github ouath token"
    echo "-n or --name  Github name of the project"
    echo "-v or --version  ADF version if not passed will use the beta"
    echo "-vjs or --vjs  JS API version if not passed will use the beta"
}

token() {
    TOKEN=$1
}

vjs() {
    JS_VERSION=$1
}

version() {
    VERSION=$1
}

name_repo() {
    NAME_REPO=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -n|--name|-\?)  name_repo $2; shift 2;;
      -t|--token)  token $2; shift 2;;
      -v|--version)  version $2; shift 2;;
      -vjs|--vjs)  vjs $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf $TEMP_GENERATOR_DIR;

git clone https://$TOKEN@github.com/$NAME_REPO.git $TEMP_GENERATOR_DIR
cd $TEMP_GENERATOR_DIR
git checkout develop

BRANCH="ADF-update-$VERSION"
git checkout -b $BRANCH

./scripts/update-version.sh -gnu -v $VERSION -vj $JS_VERSION

git add .
git commit -m "Update ADF packages version $VERSION"
git push -u origin $BRANCH

curl -H "Authorization: token $TOKEN" -X POST -d '{"body":"Update ADF packages version '$VERSION'","head":"'$BRANCH'","base":"develop","title":"Update ADF packages version '$VERSION'"}' https://api.github.com/repos/$NAME_REPO/pulls

rm -rf $TEMP_GENERATOR_DIR;
