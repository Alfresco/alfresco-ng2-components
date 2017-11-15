#!/usr/bin/env bash
set -f

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false
eval RUN_TESTBROWSER=false
eval EXEC_FAST_TEST=false
eval EXEC_CLEAN=false
eval EXEC_BUILD=true
eval EXEC_INSTALL=true
eval EXEC_SINGLE_TEST=false
eval EXEC_GIT_NPM_INSTALL_JSAPI=false
eval GIT_ISH=""
eval SINGLE_TEST=""
eval EXEC_VERSION_JSAPI=false
eval JSAPI_VERSION=""

eval projects=( "core"
    "content-services"
    "process-services" )

show_help() {
    echo "Usage: npm-build-all.sh"
    echo ""
    echo "-t or --test <pkg>        Build your local components and run their tests, this parameter also accept a wildecard to execute test e.g: -t "ng2-alfresco-core"."
    echo "-d or --debug <pkg>       Build your local components and run their tests IN THE BROWSER, this parameter also accept a wildecard to execute test e.g: -t "ng2-alfresco-core"."
    echo "-c or --clean             Clean the node_modules before starting the build."
    echo "-si or --skipinstall      Skip the install of node_modules before starting the build."
    echo "-sb or --skipbuild        Skip the build of ng-components."
    echo "-ft or --fasttest         Build all your local component and run also the test in one single karma-test-shim (high memory consuming and less details)"
    echo "-gitjsapi <commit-ish>    Build all the components against a commit-ish version of the JS-API"
    echo "-vjsapi <commit-ish>      Install different version from npm of JS-API defined in the package.json"
}

enable_test(){
    if [[ ! -z $1 ]]; then
        if [[  $1 != "-"* ]]; then
            EXEC_SINGLE_TEST=true
            SINGLE_TEST=$1
        fi
    fi
    RUN_TEST=true
}

enable_testbrowser(){
    if [[ ! -z $1 ]]; then
        if [[  $1 != "-"* ]]; then
            SINGLE_TEST=$1
        fi
    fi
    RUN_TESTBROWSER=true
}

test_project() {
    echo "====== test project: $1 ====="
    npm run test -- --component $1 || exit 1
}

debug_project() {
    echo "====== debug project: $1 ====="
    npm run test-browser -- --component $1 || exit 1
}

enable_fast_test() {
    EXEC_FAST_TEST=true
}

enable_js_api_git_link() {
    GIT_ISH='git://github.com/Alfresco/alfresco-js-api.git#'$1
    EXEC_GIT_NPM_INSTALL_JSAPI=true
}

version_js_api() {
    JSAPI_VERSION=$1

    if [[ "${JSAPI_VERSION}" == "" ]]
    then
      echo "JSAPI version required with -vJSApi"
      exit 0
    fi

    EXEC_VERSION_JSAPI=true
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
      -t|--test)  enable_test $2;
                       shift;
                       if $EXEC_SINGLE_TEST == true; then
                        shift;
                       fi
                       ;;
      -d|--debug)  enable_testbrowser $2; shift; shift;;
      -ft|--fasttest)  enable_fast_test; shift;;
      -gitjsapi)  enable_js_api_git_link $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -c|--clean)  clean; shift;;
      -si|--skipinstall)  exec_install; shift;;
      -sb|--skipbuild)  exclude_build; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

cd "$DIR/../ng2-components/"

if $EXEC_CLEAN == true; then
  echo "====== Clean ng2-components ====="
  npm install rimraf -g
  npm run clean
fi

if $EXEC_INSTALL == true; then
    echo "====== Install ng2-components dependencies ====="
    npm install
fi

if $EXEC_GIT_NPM_INSTALL_JSAPI == true; then
  echo "====== Use the alfresco JS-API  '$GIT_ISH'====="
  npm install $GIT_ISH --no-save
  cd "$DIR/../ng2-components/node_modules/alfresco-js-api"
  npm install
  cd "$DIR/../ng2-components/"
fi

if $EXEC_VERSION_JSAPI == true; then
  echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
  npm install alfresco-js-api@${JSAPI_VERSION} --no-save
fi

if $EXEC_BUILD == true; then
    echo "====== Build ng2-components ====="
    npm run build || exit 1
fi

if $EXEC_FAST_TEST == true; then
    echo "====== Test all ng2-components (fast option) ====="
    npm run test || exit 1
fi

if $RUN_TEST == true; then
      DESTDIR="$DIR/../ng2-components/"
      cd $DESTDIR
      if $EXEC_SINGLE_TEST == true; then
            cp -n "$DESTDIR/config/karma-test-shim.js" "$DESTDIR/$SINGLE_TEST/"
            test_project $SINGLE_TEST
      else
       for PACKAGE in ${projects[@]}
        do
            test_project $PACKAGE
        done
      fi
fi

if $RUN_TESTBROWSER == true; then
    for PACKAGE in ${projects[@]}
    do
        DESTDIR="$DIR/../ng2-components/"
        cd $DESTDIR
        if [[ $PACKAGE == $SINGLE_TEST ]]; then
            debug_project $PACKAGE
        fi
    done
fi

