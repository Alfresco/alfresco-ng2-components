#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

VERSION="alpha"
while getopts "v:" opt; do
    case $opt in
        v)
            VERSION="$OPTARG"
            ;;
        \?)
            echo "Usage: $0 [-v version]" >&2
            echo "  -v    Specify package version (default: alpha)" >&2
            exit 1
            ;;
    esac
done

eval projects=( "js-api"
    "adf-core"
    "adf-insights"
    "adf-content-services"
    "adf-extensions"
    "adf-process-services"
    "adf-process-services-cloud"
    "eslint-plugin-eslint-angular" )

error_out() {
    printf '\033[%sm%s\033[m\n' "$@"
    # usage color "31;5" "string"
    # 0 default
    # 5 blink, 1 strong, 4 underlined
    # fg: 31 red,  32 green, 33 yellow, 34 blue, 35 purple, 36 cyan, 37 white
    # bg: 40 black, 41 red, 44 blue, 45 purple
}

rm -rf temp
mkdir temp
cd temp

for PACKAGE in ${projects[@]}
do
    mkdir $PACKAGE
    cd $PACKAGE

    # Handle js-api differently - increase major version by 1
    if [ $PACKAGE == 'js-api' ]; then
        if [ $VERSION == 'alpha' ] || [ $VERSION == 'beta' ] || [ $VERSION == 'latest' ]; then
            # For tag versions, we need to get the current version and increment
            CURRENT_VERSION=$(npm view @alfresco/$PACKAGE@$VERSION version)
            MAJOR_VERSION=$(echo $CURRENT_VERSION | cut -d'.' -f1)
            NEXT_MAJOR=$((MAJOR_VERSION + 1))
            # Keep the rest of the version string
            REST_VERSION=$(echo $CURRENT_VERSION | cut -d'.' -f2-)
            PACKAGE_VERSION="${NEXT_MAJOR}.${REST_VERSION}"
        else
            # For specific versions, just increment the major number
            MAJOR_VERSION=$(echo $VERSION | cut -d'.' -f1)
            NEXT_MAJOR=$((MAJOR_VERSION + 1))
            REST_VERSION=$(echo $VERSION | cut -d'.' -f2-)
            PACKAGE_VERSION="${NEXT_MAJOR}.${REST_VERSION}"
        fi
    else
        PACKAGE_VERSION=$VERSION
    fi

    # Try the calculated package version first
    PKG_VERSION=$(npm view @alfresco/$PACKAGE@$PACKAGE_VERSION version 2>/dev/null)

    # If that fails for js-api, try the original version
    if [ -z "$PKG_VERSION" ] && [ $PACKAGE == 'js-api' ]; then
        echo "Warning: js-api@$PACKAGE_VERSION not found, trying @$VERSION"
        PACKAGE_VERSION=$VERSION
        PKG_VERSION=$(npm view @alfresco/$PACKAGE@$PACKAGE_VERSION version 2>/dev/null)
    fi

    # If still no version found, exit with error
    if [ -z "$PKG_VERSION" ]; then
        error_out '31;1' "Package @alfresco/$PACKAGE@$PACKAGE_VERSION not found!" >&2
        exit 1
    fi

    echo "Inspecting: $PACKAGE@$PKG_VERSION"

    npm pack '@alfresco/'$PACKAGE@$PACKAGE_VERSION
    tar zxf 'alfresco-'$PACKAGE-$PKG_VERSION.tgz

    if [ $PACKAGE == 'js-api' ]; then
        if [ ! -f package/esm2015/'index.js' ]; then
            error_out '31;1' "esm2015/index.js not found!" >&2
            exit 1
        else
            echo "esm2020: ok"
        fi
    fi

    if [ $PACKAGE != 'js-api' ] && [ $PACKAGE != 'eslint-plugin-eslint-angular' ]; then
        if [ ! -f package/fesm2022/$PACKAGE'.mjs' ]; then
            error_out '31;1' "fesm2015/$PACKAGE.mjs not found!" >&2
            exit 1
        else
            echo "fesm2022: ok"
        fi

        if [ ! -f package/fesm2022/$PACKAGE'.mjs' ]; then
            error_out '31;1' "fesm2022/$PACKAGE.mjs not found!" >&2
            exit 1
        else
            echo "fesm2022: ok"
        fi

        if [ ! -f package/README.md ]; then
            error_out '31;1' "$PACKAGE readme not found!" >&2
            exit 1
        else
            echo "readme: ok"
        fi

        if [ ! -f package/bundles/assets/$PACKAGE/i18n/en.json ]; then
            if [ $PACKAGE == 'adf-extensions' ]; then
                echo "no i18n needed"
            else
                error_out '31;1' "$PACKAGE i18n not found!" >&2
                exit 1
            fi
        else
            echo "i18n: ok"
        fi
    fi

    cd ..
done

cd ..
rm -rf temp
