#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../"
BROWSER_RUN=false
DEVELOPMENT=false
EXECLINT=true
LITESERVER=false
EXEC_VERSION_JSAPI=false
TIMEOUT=20000
SELENIUM_PROMISE_MANAGER=1

show_help() {
    echo "Usage: ./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin"
    echo ""
    echo "-u or --username"
    echo "-p or --password"
    echo "-e or --email"
    echo "-b or --browser run the test in the browser (No headless mode)"
    echo "-s or --spec run a single test file"
    echo "-f or --folder run a single folder test"
    echo "--seleniumServer configure a selenium server to use to run the e2e test"
    echo "-proxy or --proxy proxy Back end URL to use only possible to use with -dev option"
    echo "-dev or --dev run it against local development environment it will deploy on localhost:4200 the current version of your branch"
    echo "-host or --host URL of the Front end to test"
    echo "-host_bpm URL of the Back end to test"
    echo "-host_identity URL of the identity service backend to test"
    echo "-host_sso the entire path including the name of the realm"
    echo "-save  save the error screenshot in the remote env"
    echo "-timeout or --timeout override the timeout foe the wait utils"
    echo "-sl --skip-lint skip lint"
    echo "-m --maxInstances max instances parallel for tests"
    echo "-disable-control-flow disable control flow"
    echo "-vjsapi install different version from npm of JS-API defined in the package.json"
    echo "-h or --help"
}

set_username(){
    USERNAME=$1
}
set_password(){
    PASSWORD=$1
}
set_email(){
    EMAIL=$1
}
set_host(){
    HOST=$1
}

set_host_bpm(){
    HOST_BPM=$1
}

set_host_sso(){
    HOST_SSO=$1
}

set_host_identity(){
    HOST_IDENTITY=$1
}

set_test(){
    SINGLE_TEST=true
    NAME_TEST=$1
}

set_browser(){
    echo "====== BROWSER RUN ====="
    BROWSER_RUN=true
}

set_proxy(){
    PROXY=$1
}

set_timeout(){
    TIMEOUT=$1
}

set_save_screenshot(){
    SAVE_SCREENSHOT=true
}

set_development(){
    DEVELOPMENT=true
}

set_test_folder(){
    FOLDER=$1
}

set_selenium(){
    SELENIUM_SERVER=$1
}

skip_lint(){
    EXECLINT=false
}

lite_server(){
    LITESERVER=true
}

max_instances(){
    MAXINSTANCES=$1
}

disable_control_flow(){
    echo "====== disable control flow ====="
    SELENIUM_PROMISE_MANAGER=0
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

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -u|--username)  set_username $2; shift 2;;
      -p|--password)  set_password $2; shift 2;;
      -e|--email)  set_email $2; shift 2;;
      -f|--folder)  set_test_folder $2; shift 2;;
      -timeout|--timeout)  set_timeout $2; shift 2;;
      -b|--browser)  set_browser; shift;;
      -dev|--dev)  set_development; shift;;
      -s|--spec)  set_test $2; shift 2;;
      -ud|--use-dist)  lite_server; shift;;
      -save)   set_save_screenshot; shift;;
      -proxy|--proxy)  set_proxy $2; shift 2;;
      -s|--seleniumServer) set_selenium $2; shift 2;;
      -host|--host)  set_host $2; shift 2;;
      -host_bpm|--host_bpm) set_host_bpm $2; shift 2;;
      -host_sso|--host_sso) set_host_sso $2; shift 2;;
      -host_identity|--host_identity) set_host_identity $2; shift 2;;
      -sl|--skip-lint)  skip_lint; shift;;
      -m|--maxInstances)  max_instances $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -disable-control-flow|--disable-control-flow)  disable_control_flow; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf ./e2e/downloads/
rm -rf ./e2e-output/screenshots/

export URL_HOST_BPM_ADF=$HOST_BPM
export URL_HOST_SSO_ADF=$HOST_SSO
export URL_HOST_IDENTITY=$HOST_IDENTITY
export URL_HOST_ADF=$HOST
export USERNAME_ADF=$USERNAME
export PASSWORD_ADF=$PASSWORD
export EMAIL_ADF=$EMAIL
export BROWSER_RUN=$BROWSER_RUN
export PROXY_HOST_ADF=$PROXY
export SAVE_SCREENSHOT=$SAVE_SCREENSHOT
export TIMEOUT=$TIMEOUT
export FOLDER=$FOLDER'/'
export SELENIUM_SERVER=$SELENIUM_SERVER
export NAME_TEST=$NAME_TEST
export MAXINSTANCES=$MAXINSTANCES
export SELENIUM_PROMISE_MANAGER=$SELENIUM_PROMISE_MANAGER


if $EXEC_VERSION_JSAPI == true; then
  echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
  npm install alfresco-js-api@${JSAPI_VERSION}
fi

if [[  $EXECLINT == "true" ]]; then
    npm run lint-e2e || exit 1
fi

echo "====== Update webdriver-manager ====="
./node_modules/protractor/bin/webdriver-manager update --gecko=false

if [[  $DEVELOPMENT == "true" ]]; then
    echo "====== Run against local development  ====="
    npm run e2e-lib || exit 1
else
    if [[  $LITESERVER == "true" ]]; then
        echo "====== Run dist in lite-server ====="
        ls demo-shell/dist
        npm run lite-server-e2e>/dev/null & ./node_modules/protractor/bin/protractor protractor.conf.js || exit 1
    else
         ./node_modules/protractor/bin/protractor protractor.conf.js || exit 1
    fi
fi
