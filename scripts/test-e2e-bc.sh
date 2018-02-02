#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -rf "$DIR/../lib/node_modules/@angular"
cd "$DIR/../integration/base_ver_2_app"

ADF_VERSION=$(npm view @alfresco/adf-core version)
ANGULAR_VERSION="5.1.1"
MATERIAL_VERSION="5.0.1"

npm install

#Use last js-api
npm install --save alfresco-js-api@alpha

#New documented dependency
npm install --save-exact --save @alfresco/adf-content-services@${ADF_VERSION} @alfresco/adf-core@${ADF_VERSION}  @alfresco/adf-insights@${ADF_VERSION} @alfresco/adf-process-services@${ADF_VERSION}
npm install --save-exact --save-dev @angular-devkit/core@0.0.28 @angular/compiler-cli@${ANGULAR_VERSION} typescript@2.6.2
npm install --save  @mat-datetimepicker/core @mat-datetimepicker/moment
npm install --save-exact --save  @angular/animations@${ANGULAR_VERSION} @angular/common@${ANGULAR_VERSION}  @angular/compiler@${ANGULAR_VERSION} @angular/core@${ANGULAR_VERSION}  @angular/platform-browser@${ANGULAR_VERSION} @angular/router@${ANGULAR_VERSION} @angular/flex-layout@2.0.0-beta.12  @angular/forms@${ANGULAR_VERSION} @angular/forms@${ANGULAR_VERSION} @angular/http@${ANGULAR_VERSION}  @angular/platform-browser-dynamic@${ANGULAR_VERSION}
npm install --save-exact --save @angular/cdk@${MATERIAL_VERSION} @angular/material@${MATERIAL_VERSION}

pm run e2e
