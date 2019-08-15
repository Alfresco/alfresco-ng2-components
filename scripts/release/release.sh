#!/usr/bin/env bash

eval GNU=false

set -e
TEMP=".tmp";

show_help() {
    echo "Usage: update-generator.sh"
    echo ""
    echo "-t or --token  Github ouath token"
    echo "-v or --version version to bump"
    echo "-gnu for gnu"
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

token() {
    TOKEN=$1
}

version() {
    VERSION=$1
}

release() {
    rm -rf $TEMP;
    git clone https://$TOKEN@github.com/$1.git $TEMP
    cd $TEMP
    git checkout development

    if $GNU; then
        ./node_modules/@alfresco/adf-cli/bin/adf-cli update-version --pathPackage "$(pwd)" --version $VERSION
    else
        ./node_modules/@alfresco/adf-cli/bin/adf-cli update-version --pathPackage "$(pwd)" --version $VERSION --skipGnu=$GNU
    fi

    git add .
    git commit -m "Release $VERSION"
    git push -u origin development

    curl -H "Authorization: token $TOKEN" -X POST -d '{"body":"Release ADF version '$VERSION'","head":"'development'","base":"master","title":"Release ADF version '$VERSION'"}' https://api.github.com/repos/$1/pulls
    rm -rf $TEMP;
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|--version|-\?)  version $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -t|--token)  token $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

release 'Alfresco/alfresco-js-api'
release 'Alfresco/generator-ng2-alfresco-app'
release 'Alfresco/alfresco-ng2-components'
