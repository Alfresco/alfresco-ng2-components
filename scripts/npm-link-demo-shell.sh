#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#LINK CORE
echo "====== linking component: ng2-alfresco-core ====="
cd "$DIR/../ng2-components/ng2-alfresco-core"
npm link
npm run build

#LINK FORM
echo "====== linking component: ng2-activiti-form ====="
cd "$DIR/../ng2-components/ng2-activiti-form"
npm link ng2-alfresco-core
npm link
npm run build

#LINK DATATABLE
echo "====== linking component: ng2-alfresco-datatable ====="
cd "$DIR/../ng2-components/ng2-alfresco-datatable"
npm link ng2-alfresco-core
npm link
npm run build

#LINK DOCUMENTLIST
echo "====== linking component: ng2-alfresco-documentlist ====="
cd "$DIR/../ng2-components/ng2-alfresco-documentlist"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link
npm run build

#LINK WEBSCRIPT
echo "====== linking component: ng2-alfresco-webscript ====="
cd "$DIR/../ng2-components/ng2-alfresco-webscript"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link
npm run build

#LINK TASKLIST
echo "====== linking component: ng2-activiti-tasklist ====="
cd "$DIR/../ng2-components/ng2-activiti-tasklist"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link ng2-activiti-form
npm link
npm run build

#LINK PROCESSLIST
echo "====== linking component: ng2-activiti-processlist ====="
cd "$DIR/../ng2-components/ng2-activiti-processlist"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link ng2-activiti-tasklist
npm link
npm run build

#LINK VIEWER
echo "====== linking component: ng2-alfresco-viewer ====="
cd "$DIR/../ng2-components/ng2-alfresco-viewer"
npm link ng2-alfresco-core
npm link
npm run build

#LINK TAG
echo "====== linking component: ng2-alfresco-tag ====="
cd "$DIR/../ng2-components/ng2-alfresco-tag"
npm link ng2-alfresco-core
npm link
npm run build

#LINK ALL THE OTHERS COMPONENTS
for PACKAGE in \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-upload \
  ng2-activiti-analytics
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== linking component: ${PACKAGE} ====="
  cd "$DESTDIR"
  npm link ng2-alfresco-core
  npm link
  npm run build
done


#LINK ALL THE COMPONENTS INSIDE THE DEMOSHELL
cd "$DIR/../demo-shell-ng2"
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
  ng2-alfresco-webscript \
  ng2-alfresco-tag \
  ng2-activiti-analytics
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== demo shell linking: ${PACKAGE} ====="
  npm link ${PACKAGE}
done
