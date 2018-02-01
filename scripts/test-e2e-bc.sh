#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -rf "$DIR/../lib/node_modules/@angular"
cd "$DIR/../integration/base_ver_2_app"


#Use last js-api
npm install --save alfresco-js-api@alpha

#New documented dependency
npm install --save-exact --save @alfresco/adf-content-services@2.1.0 @alfresco/adf-core@2.1.0  @alfresco/adf-insights@2.0.1 @alfresco/adf-process-services@2.1.0
npm install --save-exact --save-dev @angular-devkit/core@0.0.28 @angular/compiler-cli@5.1.1 typescript@2.6.2
npm install --save  @mat-datetimepicker/core @mat-datetimepicker/moment
npm install --save-exact --save  @angular/animations@5.1.1 @angular/cdk@5.0.1 @angular/common@5.1.1  @angular/compiler@5.1.1 @angular/core@5.1.1  @angular/platform-browser@5.1.1 @angular/router@5.1.1 @angular/flex-layout@2.0.0-beta.12  @angular/forms@5.1.1 @angular/forms@5.1.1 @angular/http@5.1.1 @angular/material@5.0.1 @angular/platform-browser-dynamic@5.1.1
npm run e2e
