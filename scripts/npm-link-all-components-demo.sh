#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#LINK CORE
echo "====== linking component: ng2-alfresco-core ====="
cd "$DIR/../ng2-components/ng2-alfresco-core/demo"
npm install

#LINK FORM
echo "====== linking component: ng2-activiti-form ====="
cd "$DIR/../ng2-components/ng2-activiti-form/demo"
npm link ng2-alfresco-core
npm install

#LINK DATATABLE
echo "====== linking component: ng2-alfresco-datatable ====="
cd "$DIR/../ng2-components/ng2-alfresco-datatable/demo"
npm link ng2-alfresco-core
npm install

#LINK DOCUMENTLIST
echo "====== linking component: ng2-alfresco-documentlist ====="
cd "$DIR/../ng2-components/ng2-alfresco-documentlist/demo"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm install

#LINK WEBSCRIPT
echo "====== linking component: ng2-alfresco-webscript ====="
cd "$DIR/../ng2-components/ng2-alfresco-webscript/demo"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm install

#LINK TASKLIST
echo "====== linking component: ng2-activiti-tasklist ====="
cd "$DIR/../ng2-components/ng2-activiti-tasklist/demo"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link ng2-activiti-form
npm install

#LINK PROCESSLIST
echo "====== linking component: ng2-activiti-processlist ====="
cd "$DIR/../ng2-components/ng2-activiti-processlist/demo"
npm link ng2-alfresco-core
npm link ng2-alfresco-datatable
npm link ng2-activiti-form
npm link ng2-activiti-tasklist
npm install

#LINK DIAGRAMS
echo "====== linking component: ng2-activiti-diagrams ====="
cd "$DIR/../ng2-components/ng2-activiti-diagrams/demo"
npm link ng2-alfresco-core
npm install

#LINK ANALYTICS
echo "====== linking component: ng2-activiti-analytics ====="
cd "$DIR/../ng2-components/ng2-activiti-analytics/demo"
npm link ng2-alfresco-core
npm link ng2-activiti-diagrams
npm install

#LINK ALL THE OTHERS COMPONENTS
for PACKAGE in \
  ng2-alfresco-login \
  ng2-alfresco-search \
  ng2-alfresco-userinfo \
  ng2-alfresco-upload \
  ng2-alfresco-tag \
  ng2-alfresco-viewer
do
  DESTDIR="$DIR/../ng2-components/${PACKAGE}"
  echo "====== linking component: ${PACKAGE} ====="
  cd "$DESTDIR/demo"
  npm link ng2-alfresco-core
  npm install
done
