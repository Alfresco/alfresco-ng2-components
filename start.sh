#!/usr/bin/env bash
cd demo-shell-ng2

npm install
npm install ../ng2-components/ng2-alfresco-core
npm install ../ng2-components/ng2-alfresco-datatable
npm install ../ng2-components/ng2-alfresco-documentlist
npm install ../ng2-components/ng2-alfresco-login
npm install ../ng2-components/ng2-alfresco-upload
npm install ../../dev-platform-js-api

#npm run build.dev
npm start
