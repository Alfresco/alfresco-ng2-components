#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../"
BROWSER_RUN=false
DEVELOPMENT=false

show_help() {
    echo "Usage: ./scripts/test-e2e-lib.sh -host adf.domain.com -u admin -p admin -e admin"
    echo ""
    echo "-u or --username"
    echo "-p or --password"
    echo "-e or --email"
    echo "-b or --browser run the test in the browsrwer (No headless mode)"
    echo "-s or --spec run a single test file"
    echo "-f or --folder run a single folder test"
    echo "--seleniumServer configure a selenium server to use to run the e2e test"
    echo "-proxy or --proxy proxy Back end URL to use only possibel to use with -dev option"
    echo "-dev or --dev run it against local development environment it will deploy on localhost:4200 the current version of your branch"
    echo "-host or --host URL of the Front end to test"
    echo "-save  save the error screenshot in the remote env"
    echo "-timeout or --timeout override the timeout foe the wait utils"
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
      -save)   set_save_screenshot; shift;;
      -proxy|--proxy)  set_proxy $2; shift 2;;
      -s|--seleniumServer) set_selenium $2; shift 2;;
      -host|--host)  set_host $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf ./e2e/downloads/
rm -rf ./e2e-output/screenshots/

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

npm run lint-e2e || exit 1

if [[  $DEVELOPMENT == "true" ]]; then
  echo "====== Run against local development  ====="
    npm run e2e-lib || exit 1
else
     webdriver-manager update --gecko=false --versions.chrome=2.38
     ./node_modules/protractor/bin/protractor protractor.conf.js || exit 1
fi





