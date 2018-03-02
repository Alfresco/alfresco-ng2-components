#!/usr/bin/env bash

set -e
TEMP_GENERATOR_DIR=".tmp-generator";

show_help() {
    echo "Usage: update-generator.sh"
    echo ""
    echo "-v or -version  version to update"
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf $TEMP_GENERATOR_DIR;
git clone git@github.com:Alfresco/generator-ng2-alfresco-app.git $TEMP_GENERATOR_DIR
cd $TEMP_GENERATOR_DIR
git checkout development

BRANCH="generator-update-beta-$VERSION"
git checkout -b $BRANCH

./scripts/update-version.sh -gnu -v $VERSION

git add .
git commit -m "Update generator to use packages version $VERSION"
git push -u origin $BRANCH

rm -rf $TEMP_GENERATOR_DIR;
