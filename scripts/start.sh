#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval EXEC_INSTALL=false
eval EXEC_UPDATE=false
eval EXEC_CLEAN=false
eval EXEC_DEVELOP=false

show_help() {
    echo "Usage: start.sh"
    echo ""
    echo "-d or -develop start the demo shell using the relative ng2-components folder to link the components"
    echo "-i or -install start the demo shell and install the dependencies"
    echo "-u or -update start the demo shell and update the dependencies"
    echo "-c or -clean  clean the demo shell and reinstall the dependencies"
    echo "-r or -registry to download the packages from an alternative npm registry example -registry 'http://npm.local.me:8080/' "
}

install() {
    EXEC_INSTALL=true
}

update() {
    EXEC_UPDATE=true
}

develop() {
    EXEC_DEVELOP=true
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
    EXEC_INSTALL=true
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -i|--install) install; shift;;
      -u|--update) update; shift;;
      -c|--clean) clean; shift;;
      -d|--develop) develop; shift;;
      -r|--registry)  change_registry $2; shift 2;;
      -*) shift;;
    esac
done

if $EXEC_CLEAN == true; then
  echo "====== Clean Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm install rimraf
  npm run clean
fi

if $EXEC_DEVELOP == true; then
  echo "====== Build ng2-components folder====="
  cd "$DIR/../scripts"
  sh npm-build-all.sh
fi

if $EXEC_INSTALL == true; then
  echo "====== Install Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm install
fi

if $EXEC_UPDATE == true; then
  echo "====== Update Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm update
fi

if $EXEC_DEVELOP == true; then
  echo "====== Start Demo shell development mode====="
  cd "$DIR/../demo-shell-ng2"
  npm run start:dev
fi

if $EXEC_DEVELOP == false; then
  echo "====== Start Demo shell ====="
  cd "$DIR/../demo-shell-ng2"
  npm run start
fi

