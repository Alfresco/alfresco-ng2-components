#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../demo-shell-ng2"

eval EXEC_INSTALL=false
eval EXEC_UPDATE=false
eval EXEC_CLEAN=false

show_help() {
    echo "Usage: start.sh"
    echo ""
    echo "-i or -install start the demo shell and install the dependencies"
    echo "-u or -update start the demo shell and update the dependencies"
    echo "-c or -clean  clean the demo shell"
    echo "-r or -registry to download the packages from an alternative npm registry example --registry 'http://npm.local.me:8080/' "
}

install() {
    EXEC_INSTALL=true
}

update() {
    EXEC_UPDATE=true
}

change_registry(){
    NPM_REGISTRY=$1

    if [[ "${NPM_REGISTRY}" == "" ]]
    then
      echo "NPM registry required WITH OPTION -r | -registry"
      exit 0
    fi

    echo "====== CHANGE REGISTRY: ${NPM_REGISTRY} ====="
    npm config set registry ${NPM_REGISTRY}
}

clean() {
    EXEC_CLEAN=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -i|--install) install; shift;;
      -u|--update) update; shift;;
      -c|--clean) clean; shift;;
      -*) shift;;
    esac
done

if $EXEC_CLEAN == true; then
  echo "====== Clean Demo shell ====="
  npm run clean
fi

if $EXEC_INSTALL == true; then
  echo "====== Install Demo shell ====="
  npm install
fi

if $EXEC_UPDATE == true; then
  echo "====== Update Demo shell ====="
  npm update
fi


npm run start
