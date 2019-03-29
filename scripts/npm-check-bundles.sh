#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

eval VERSION=""

eval projects=( "adf-core"
    "adf-insights"
    "adf-content-services"
    "adf-extensions"
    "adf-testing"
    "adf-process-services"
    "adf-process-services-cloud" )

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


 if [ $PACKAGE == 'adf-core' ]; then
    if [ ! -f package/prebuilt-themes/'adf-blue-orange.css' ]; then
        error_out '31;1' "$PACKAGE prebuilt-theme not found!" >&2
        exit 1
     else
         echo "prebuilt-theme ok!"
    fi

    if [ ! -f package/'app.config.schema.json' ]; then
        error_out '31;1'  "$PACKAGE schema not found!" >&2
        exit 1
    else
         echo "schema ok!"
    fi

 fi

 if [ ! -f package/bundles/$PACKAGE'.umd.js' ]; then
    error_out '31;1' "$PACKAGE bundles not found!" >&2
    exit 1
 else
     echo "bundles ok!"
 fi

 if [ ! -f package/bundles/$PACKAGE'.umd.js.map' ]; then
    error_out '31;1' "$PACKAGE js.map not found!" >&2
    exit 1
 else
     echo "js.map ok!"
 fi

 if [ ! -f package/esm5/$PACKAGE'.js' ]; then
    error_out '31;1' "esm5/$PACKAGE.js not found!" >&2
    exit 1
 else
     echo "esm5 ok!"
 fi

 if [ ! -f package/esm2015/$PACKAGE'.js' ]; then
    error_out '31;1' "esm2015/$PACKAGE.js not found!" >&2
    exit 1
 else
     echo "esm2015 ok!"
 fi

  if [ ! -f package/_theming.scss ]; then
    if [ $PACKAGE == 'adf-extensions' ]; then
       echo "no style needed"
    elif [ $PACKAGE == 'adf-testing' ]; then
       echo "no style needed"
    else
       error_out '31;1' "$PACKAGE style not found!" >&2
       exit 1
    fi
 else
     echo "style ok!"
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

 cd ..
done
 cd ..

rm -rf temp

set_npm_registry

