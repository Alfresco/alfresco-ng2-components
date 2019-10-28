#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../"
BROWSER_RUN=false
DEVELOPMENT=false
EXECLINT=false
LITESERVER=false
EXEC_VERSION_JSAPI=false
TIMEOUT=120000
DEBUG=false

show_help() {
    echo "Usage: ./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin"
    echo ""
    echo "--env"
    echo "-u or --username"
    echo "-p or --password"
    echo "-identity_admin_email"
    echo "-identity_admin_password"
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
    echo "-save  save the error screenshot and report in the remote env"
    echo "-timeout or --timeout override the timeout foe the wait utils"
    echo "-l --lint enable lint"
    echo "-m --maxInstances max instances parallel for tests"
    echo "-log or --log print all the browser log"
    echo "-db or --debug run the debugger"
    echo "-vjsapi install different version from npm of JS-API defined in the package.json"
    echo "-h or --help"
}

set_log(){
    export LOG=true
}

set_username(){
    USERNAME=$1
    export USERNAME_ADF=$USERNAME
}
set_password(){
    PASSWORD=$1
    export PASSWORD_ADF=$PASSWORD
}
set_identity_admin_email(){
    IDENTITY_ADMIN_EMAIL=$1
    export IDENTITY_ADMIN_EMAIL=$IDENTITY_ADMIN_EMAIL
}
set_identity_admin_password(){
    IDENTITY_ADMIN_PASSWORD=$1
    export IDENTITY_ADMIN_PASSWORD=$IDENTITY_ADMIN_PASSWORD
}
set_email(){
    EMAIL=$1
    export EMAIL_ADF=$EMAIL
}
set_host(){
    HOST=$1
    export URL_HOST_ADF=$HOST
}

set_host_bpm(){
    HOST_BPM=$1
    export URL_HOST_BPM_ADF=$HOST_BPM
}

set_host_sso(){
    HOST_SSO=$1
    export URL_HOST_SSO_ADF=$HOST_SSO
}

set_host_identity(){
    HOST_IDENTITY=$1
    export URL_HOST_IDENTITY=$HOST_IDENTITY
}

set_specs(){
    LIST_SPECS=$1
    export LIST_SPECS=$LIST_SPECS
}

set_browser(){
    echo "====== BROWSER RUN ====="
    BROWSER_RUN=true
    export BROWSER_RUN=$BROWSER_RUN
}

set_proxy(){
    PROXY=$1
    export PROXY_HOST_ADF=$PROXY
}

set_timeout(){
    TIMEOUT=$1
}

set_save_screenshot(){
    mkdir -p ./e2e-output/junit-report
    export SAVE_SCREENSHOT=true
}

set_development(){
    DEVELOPMENT=true
}

set_test_folder(){
    FOLDER=$1
    export FOLDER=$FOLDER
}

set_selenium(){
    SELENIUM_SERVER=$1
    export SELENIUM_SERVER=$SELENIUM_SERVER
}

set_env(){
    export ENV_FILE=$1
}

set_prefix(){
    PREFIX=$1
    export PREFIX=$PREFIX
}

lint(){
    EXECLINT=true
}

debug(){
    export DEBUG=true;
}

lite_server(){
    LITESERVER=true
}

max_instances(){
    export MAXINSTANCES=$1
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
      -identity_admin_email)  set_identity_admin_email $2; shift 2;;
      -identity_admin_password)  set_identity_admin_password $2; shift 2;;
      -e|--email)  set_email $2; shift 2;;
      -f|--folder)  set_test_folder $2; shift 2;;
      -timeout|--timeout)  set_timeout $2; shift 2;;
      -b|--browser)  set_browser; shift;;
      -env|--env)   set_env $2; shift 2;;
      -dev|--dev)  set_development; shift;;
      -s|--specs)  set_specs $2; shift 2;;
      -prefix|--prefix)  set_prefix $2; shift 2;;
      -db|--debug) debug; shift;;
      -ud|--use-dist)  lite_server; shift;;
      -save)   set_save_screenshot; shift;;
      -proxy|--proxy)  set_proxy $2; shift 2;;
      -s|--seleniumServer) set_selenium $2; shift 2;;
      -host|--host)  set_host $2; shift 2;;
      -log|--log)  set_log; shift ;;
      -host_bpm|--host_bpm) set_host_bpm $2; shift 2;;
      -host_sso|--host_sso) set_host_sso $2; shift 2;;
      -host_identity|--host_identity) set_host_identity $2; shift 2;;
      -l|--lint)  lint; shift;;
      -m|--maxInstances)  max_instances $2; shift 2;;
      -vjsapi)  version_js_api $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf ./e2e/downloads/
rm -rf ./e2e-output/screenshots/

export TIMEOUT=$TIMEOUT

if $EXEC_VERSION_JSAPI == true; then
  echo "====== Use the alfresco JS-API '$JSAPI_VERSION'====="
  npm install alfresco-js-api@${JSAPI_VERSION}
fi

if [[  $EXECLINT == "true" ]]; then
    npm run lint-e2e || exit 1
fi

echo "====== Update webdriver-manager ====="
./node_modules/protractor/bin/webdriver-manager update --gecko=false

export DEBUG_OPTION=''
if [[  $DEBUG == "true" ]]; then
  DEBUG_OPTION=' node --inspect-brk '
fi

if [[  $DEVELOPMENT == "true" ]]; then
    echo "====== Run against local development  ====="
    npm run e2e-lib || exit 1
else
    if [[  $LITESERVER == "true" ]]; then
        echo "====== Run dist in lite-server ====="

        ls demo-shell/dist/ || exit 1

        npm run postbuild:ci

        npm run lite-server-e2e>/dev/null & $DEBUG_OPTION ./node_modules/protractor/bin/protractor protractor.conf.ts || exit 1
     else
        $DEBUG_OPTION  ./node_modules/protractor/bin/protractor protractor.conf.ts || exit 1
    fi
fi
