#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true

set -ex

cd `dirname $0`

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-v or -version  version to update"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -*) shift;;
    esac
done


if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

for PACKAGE in \
  ng2-activiti-diagrams \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-tag \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript \
  ng2-alfresco-userinfo \
  ng2-alfresco-social
do
  echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
  find ././../ -type f -maxdepth 4 -name package.json -print0 | xargs -0 sed -i '' "s/\"${PACKAGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGE}\": \"${VERSION}\"/g"
done


if $JS_API == true; then
    for PACKAGE in \
      alfresco-js-api
    do
      echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
      find ././../ -type f -maxdepth 4 -name package.json -print0 | xargs -0 sed -i '' "s/\"${PACKAGE}\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGE}\": \"${VERSION}\"/g"
    done
fi

for PACKAGE in \
  ng2-activiti-diagrams \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-tag \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript \
  ng2-alfresco-social \
  ng2-alfresco-userinfo
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== UPDATE VERSION OF ${PACKAGE} to ${VERSION} version ======"
  sed -i '' "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
done

echo "====== UPDATE VERSION OF DEMO-SHELL to ${VERSION} version ======"

sed -i '' "s/\"version\": \"[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell-ng2/package.json

for PACKAGE in \
  ng2-activiti-diagrams \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-tag \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript \
  ng2-alfresco-userinfo \
  ng2-alfresco-social
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ~${VERSION} version in all the package.json ======"
  find ././../ -type f -maxdepth 4 -name package.json -print0 | xargs -0 sed -i '' "s/\"${PACKAGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGE}\": \"~${VERSION}\"/g"
done


if $JS_API == true; then
    for PACKAGE in \
      alfresco-js-api
    do
        DESTDIR="$DIR/../ng2-components/${PACKAGE}"
        echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ~${VERSION} version in all the package.json ======"
        find ././../ -type f -maxdepth 4 -name package.json -print0 | xargs -0 sed -i '' "s/\"${PACKAGE}\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"${PACKAGE}\": \"~${VERSION}\"/g"
    done
fi

for PACKAGE in \
  ng2-activiti-diagrams \
  ng2-activiti-analytics \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-tag \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript \
  ng2-alfresco-social \
  ng2-alfresco-userinfo
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== UPDATE VERSION OF ${PACKAGE} to ~${VERSION} version ======"
  sed -i '' "s/\"version\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
done

echo "====== UPDATE VERSION OF DEMO-SHELL to ${VERSION} version ======"

sed -i '' "s/\"version\": \"~[0-9]\\.[0-9]\\.[0-9]\"/\"version\": \"~${VERSION}\"/g"  ${DIR}/../demo-shell-ng2/package.json
