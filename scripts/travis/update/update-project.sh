#!/usr/bin/env bash

eval GNU=false

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
    echo "-gnu for gnu"
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
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
      -gnu) gnu_mode; shift;;
      -t|--token)  token $2; shift 2;;
      -v|--version)  version $2; shift 2;;
      -vjs|--vjs)  vjs $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf $TEMP_GENERATOR_DIR;

git clone https://$TOKEN@github.com/$NAME_REPO.git $TEMP_GENERATOR_DIR
cd $TEMP_GENERATOR_DIR
git checkout development

BRANCH="ADF-update-beta-$VERSION"
git checkout -b $BRANCH

if $GNU; then
    if [ $NAME_REPO == 'Alfresco/generator-ng2-alfresco-app' ] || [ $NAME_REPO == 'Alfresco/alfresco-modeler-app' ]; then
        ./scripts/update-version.sh -gnu -v $VERSION -vj $JS_VERSION
    else
        npm install @alfresco/adf-cli@alpha
        npx adf-cli update-version --pathPackage "$(pwd)" --version $VERSION --vjs $JS_VERSION
    fi
else
    npx adf-cli update-version --pathPackage "$(pwd)" --version $VERSION --vjs $JS_VERSION --skipGnu
fi

git add .
git commit -m "Update ADF packages version $VERSION"
git push -u origin $BRANCH

curl -H "Authorization: token $TOKEN" -X POST -d '{"body":"Update ADF packages version '$VERSION'","head":"'$BRANCH'","base":"development","title":"Update ADF packages version '$VERSION'"}' https://api.github.com/repos/$NAME_REPO/pulls

rm -rf $TEMP_GENERATOR_DIR;
