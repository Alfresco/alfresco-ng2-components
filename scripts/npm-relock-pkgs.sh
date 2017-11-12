#!/usr/bin/env bash
set -f

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval RUN_TEST=false
eval SELECTED_UNITS=""
eval SELECTED_UNITS_ONLY=false

eval projects=( "core"
    "content-services"
    "process-services" )

show_help() {
    echo "Usage: npm-relock-pkgs.sh [options] [packages...]"
    echo ""
    echo "Options:"
    echo "-t or -test run the test suites for every package after npm install"
}

enable_test(){
    RUN_TEST=true
}

test_project() {
    echo "====== test project: $1 ====="
    npm run test -- --component $1 || exit 1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -t|--test)  enable_test $2; shift;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

npm install rimraf -g

for PACKAGE in "$@"
do
    SELECTED_UNITS="$SELECTED_UNITS \"$PACKAGE\""
    SELECTED_UNITS_ONLY=true
done

if $SELECTED_UNITS_ONLY == true; then
    eval projects=($SELECTED_UNITS)
fi

echo "====== Regenerate package-lock.json ====="
for PACKAGE in ${projects[@]}
    do
        echo "====== $PACKAGE ====="
        DESTDIR="$DIR/../ng2-components/$PACKAGE"
        cd $DESTDIR

        npm run clean-lock
        npm run clean
        npm install

        if $RUN_TEST == true; then
            test_project $PACKAGE
        fi
    done

cd "$DIR/../demo-shell-ng2"
npm run clean-lock
npm run clean
npm install

cd "$DIR/../ng2-components"
npm run clean-lock
npm run clean
npm install

cd ${DIR}
