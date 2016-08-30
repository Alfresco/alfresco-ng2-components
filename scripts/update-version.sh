#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -ex

cd `dirname $0`

VERSION=$1

if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

for PACKAGE in \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== UPDATE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
  find ././../ -type f -name package.json -print0 | xargs -0 sed -i '' "s/\"${PACKAGE}\": \"0\\.2\\.0\"/\"${PACKAGE}\": \"${VERSION}\"/g"
done

for PACKAGE in \
  ng2-activiti-form \
  ng2-activiti-processlist \
  ng2-activiti-tasklist \
  ng2-alfresco-core \
  ng2-alfresco-datatable \
  ng2-alfresco-documentlist \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-upload \
  ng2-alfresco-viewer \
  ng2-alfresco-webscript
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== UPDATE VERSION OF ${PACKAGE} to ${VERSION} version ======"
  sed -i '' "s/\"version\": \"0\\.2\\.0\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
done

echo "====== UPDATE VERSION OF DEMO-SHELL to ${VERSION} version ======"

sed -i '' "s/\"version\": \"0\\.2\\.0\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell-ng2/package.json
