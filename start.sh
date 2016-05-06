#!/usr/bin/env bash
cd demo-shell-ng2

npm install
npm install ../ng2-components/ng2-alfresco-core
npm install ../ng2-components/ng2-alfresco-documentlist
npm install ../ng2-components/ng2-alfresco-login
npm install ../ng2-components/ng2-alfresco-upload

npm run build.dev
