#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../demo-shell-ng2"

show_help() {
    echo "Usage: start.sh"
    echo ""
    echo "-i or -install start the demo shell and install the dependencies"
    echo "-u or -update start the demo shell and update the dependencies"
    echo "-c or -cleanInstall clean the demo shell install the dependencies and start the the demo shell"
}

install() {
    npm install
}

update() {
    echo "update"
    npm run update
}

cleanInstall() {
    npm run clean
    npm install
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -i|--install) install; shift;;
      -u|--update) update; shift;;
      -c|--cleanInstall) cleanInstall; shift;;
      -*) shift;;
    esac
done

npm run start
