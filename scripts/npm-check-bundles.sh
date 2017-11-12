#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval VERSION=""

eval projects=( "@alfresco/core"
    "@alfresco/content-services"
    "@alfresco/process-services" )

show_help() {
    echo "Usage: npm-check-bundles.sh"
    echo "-r or -registry to check  -r 'http://npm.local.me:8080/' "
    echo "-v or -version to check  -v 1.4.0 "
    echo ""
}

change_registry() {
    echo $1
    npm set registry $1
}

set_npm_registry() {
    npm set registry https://registry.npmjs.org/
}

version() {
   VERSION=$1
}

error_out() {
      printf '\033[%sm%s\033[m\n' "$@"
      # usage color "31;5" "string"
      # 0 default
      # 5 blink, 1 strong, 4 underlined
      # fg: 31 red,  32 green, 33 yellow, 34 blue, 35 purple, 36 cyan, 37 white
      # bg: 40 black, 41 red, 44 blue, 45 purple
      }

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -r)  change_registry $2; shift 2;;
      -v|--version)  version $2; shift 2;;
      -*) echo "invalid option: $1" 1>&2; show_help; exit 1;;
    esac
done

rm -rf temp
mkdir temp
cd temp

for PACKAGE in ${projects[@]}
do
 mkdir $PACKAGE
 cd  $PACKAGE
 npm pack $PACKAGE@$VERSION
 tar zxf $PACKAGE-$VERSION.tgz
 if [ ! -f package/bundles/$PACKAGE.js ]; then
    error_out '31;1' "$PACKAGE bundles not found!" >&2
    cd $DIR
    rm -rf temp
    exit 1
 else
     echo "bundles ok!"
 fi
 cd ..
done

cd $DIR
rm -rf temp

set_npm_registry

