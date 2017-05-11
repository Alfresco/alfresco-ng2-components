#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false
eval EXEC_CLEAN=false

eval projects=( "ng2-alfresco-core"
    "ng2-alfresco-datatable"
    "ng2-activiti-diagrams"
    "ng2-activiti-analytics"
    "ng2-activiti-form"
    "ng2-activiti-tasklist"
    "ng2-activiti-processlist"
    "ng2-alfresco-documentlist"
    "ng2-alfresco-login"
    "ng2-alfresco-search"
    "ng2-alfresco-social"
    "ng2-alfresco-tag"
    "ng2-alfresco-social"
    "ng2-alfresco-upload"
    "ng2-alfresco-viewer"
    "ng2-alfresco-webscript"
    "ng2-alfresco-userinfo" )
show_help() {
    echo "Usage: npm-build-all.sh"
    echo ""
    echo "-t or -test build all your local component and run also the test on them"
    echo "-c or -clean the ndode_moduels folder before to start the build"
}

enable_test(){
    RUN_TEST=true
}

test_project() {
    echo "====== test project: $1 ====="
    npm run test -- --component $1 || exit 1
}

clean() {
    EXEC_CLEAN=true
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--test)  enable_test; shift;;
      -c|--clean)  clean; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

cd "$DIR/../ng2-components/"

if $EXEC_CLEAN == true; then
  echo "====== Clean ng2-components ====="
  npm install rimraf
  npm run clean
fi

echo "====== Regenerate global ng2-components package.json ====="
npm install package-json-merge
npm run pkg-build

echo "====== Install ng2-components dependencies ====="
npm install

echo "====== Build ng2-components ====="
npm run build || exit 1

for PACKAGE in ${projects[@]}
do
  DESTDIR="$DIR/../ng2-components/"
  cd $DESTDIR
  if $RUN_TEST == true; then
      test_project $PACKAGE
  fi
done
