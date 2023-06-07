#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval VERSION=""

eval projects=( "adf-core"
    "adf-insights"
    "adf-content-services"
    "adf-extensions"
    "adf-testing"
    "adf-process-services"
    "adf-process-services-cloud"
    "eslint-plugin-eslint-angular" )

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
 npm pack '@alfresco/'$PACKAGE@$VERSION
 tar zxf 'alfresco-'$PACKAGE-$VERSION.tgz


if [ $PACKAGE == 'adf-testing' ]; then
    if [ ! -f package/'main.js' ]; then
        error_out '31;1' "$PACKAGE testing not ok!" >&2
        exit 1
     else
         echo "testing ok!"
     fi
fi

if [ $PACKAGE == 'adf-core' ]; then
    if [ ! -f package/lib/prebuilt-themes/'adf-blue-orange.css' ]; then
        error_out '31;1' "$PACKAGE prebuilt-theme not found!" >&2
        exit 1
     else
         echo "prebuilt-theme ok!"
    fi

 fi

if [ $PACKAGE != 'adf-testing' ] && [ $PACKAGE != 'eslint-plugin-eslint-angular' ]; then

 if [ ! -f package/fesm2015/$PACKAGE'.mjs' ]; then
    error_out '31;1' "fesm2015/$PACKAGE.mjs not found!" >&2
    exit 1
 else
     echo "fesm2015 ok!"
 fi

 if [ ! -f package/esm2020/$PACKAGE'.mjs' ]; then
    error_out '31;1' "esm2020/$PACKAGE.mjs not found!" >&2
    exit 1
 else
     echo "esm2020 ok!"
 fi

 if [ ! -f package/fesm2020/$PACKAGE'.mjs' ]; then
    error_out '31;1' "fesm2020/$PACKAGE.mjs not found!" >&2
    exit 1
 else
     echo "fesm2020 ok!"
 fi

 if [ ! -f package/README.md ]; then
    error_out '31;1' "$PACKAGE readme not found!" >&2
    exit 1
 else
     echo "readme ok!"
 fi

 if [ ! -f package/bundles/assets/$PACKAGE/i18n/en.json ]; then
     if [ $PACKAGE == 'adf-extensions' ]; then
       echo "no i18n needed"
    elif [ $PACKAGE == 'adf-testing' ]; then
       echo "no i18n needed"
    else
        error_out '31;1' "$PACKAGE i18n not found!" >&2
        exit 1
    fi
 else
     echo "i18n ok!"
 fi
 fi

 cd ..
done
 cd ..

rm -rf temp

set_npm_registry

