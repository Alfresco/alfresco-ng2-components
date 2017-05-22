#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false
eval EXEC_FAST_TEST=false
eval EXEC_CLEAN=false
eval EXEC_BUILD=true
eval EXEC_INSTALL=true
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval GIT_ISH=""

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
    echo "-c or -clean the node_modules folder before to start the build"
    echo "-si or -skipinstall skip the install node_modules folder before to start the build"
    echo "-sb or skip build"
    echo "-ft or -fast test build all your local component and run also the test in one single karma-test-shim (high memory consuming and less details)"
    echo "-gitjsapi to build all the components against a commit-ish version of the JS-API"
}

enable_test(){
    RUN_TEST=true
}

test_project() {
    echo "====== test project: $1 ====="
    npm run test -- --component $1 || exit 1
}

enable_fast_test() {
    EXEC_FAST_TEST=true
}

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

clean() {
    EXEC_CLEAN=true
}

exclude_build(){
    EXEC_BUILD=false
}

exec_install(){
    EXEC_INSTALL=false
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--test)  enable_test; shift;;
      -ft|--fasttest)  enable_fast_test; shift;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -c|--clean)  clean; shift;;
      -si|--skipinstall)  exec_install; shift;;
      -sb|--skipbuild)  exclude_build; shift;;
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

if $EXEC_INSTALL == true; then
    echo "====== Install ng2-components dependencies ====="
    npm install
fi

if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
  echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
  npm install $GIT_ISH
  cd "$DIR/../ng2-components/node_modules/alfresco-js-api"
  npm install
  cd "$DIR/../ng2-components/"
fi

if $EXEC_BUILD == true; then
    echo "====== Build ng2-components ====="
    npm run build || exit 1
fi

if $EXEC_FAST_TEST == true; then
    echo "====== Test all ng2-components (fast option) ====="
    npm run test || exit 1
fi

for PACKAGE in ${projects[@]}
do
  DESTDIR="$DIR/../ng2-components/"
  cd $DESTDIR
  if $RUN_TEST == true; then
      test_project $PACKAGE
  fi
done
