#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

show_help() {
    echo "Usage: test-e2e.bc.sh"
    echo ""
    echo "-b or --build build number"
}

build_number(){
    BUILD_NUMBER=$1
}

while [[ $1 == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -b|--build)  build_number $2; shift 2;;
    esac
done


cd $DIR/../integration/base_ver_2_app

ANGULAR_VERSION="5.1.1"
ANGULAR_CLI_VERSION="1.7.4"
MATERIAL_VERSION="5.1.1"
NGX_TRANSLATE_VERSION="10.0.2"
MOMENT_VERSION="2.20.1"
RXJS_VERSION="6.0.0"
TYPESCRIPT_VERSION=2.6.2

npm install

echo "====== Install New documented dependency ===== "

npm install --save-exact --save-dev @angular-devkit/core@0.0.28 @angular/compiler-cli@${ANGULAR_VERSION} @angular/cli@${ANGULAR_CLI_VERSION} typescript@${TYPESCRIPT_VERSION}
npm install --save  @mat-datetimepicker/core @mat-datetimepicker/moment
npm install --save-exact --save  @angular/animations@${ANGULAR_VERSION} @angular/common@${ANGULAR_VERSION}  @angular/compiler@${ANGULAR_VERSION} @angular/core@${ANGULAR_VERSION}  @angular/platform-browser@${ANGULAR_VERSION} @angular/router@${ANGULAR_VERSION} @angular/flex-layout@2.0.0-beta.12  @angular/forms@${ANGULAR_VERSION} @angular/forms@${ANGULAR_VERSION} @angular/http@${ANGULAR_VERSION}  @angular/platform-browser-dynamic@${ANGULAR_VERSION}
npm install --save-exact --save @angular/cdk@${MATERIAL_VERSION} @angular/material@${MATERIAL_VERSION}
npm install --save-exact --save @ngx-translate/core@${NGX_TRANSLATE_VERSION}
npm install --save-exact --save moment@${MOMENT_VERSION}
npm install --save-exact --save rxjs@${RXJS_VERSION}
npm install --save-exact --save @angular/material-moment-adapter@${MATERIAL_VERSION}
npm install --save-exact --save rxjs-compat@6.1.0

echo "====== Install JS-API alpha ===== "
npm install --save alfresco-js-api@alpha

echo "====== COPY new build in node_modules ===== "

rm -rf $DIR/../integration/base_ver_2_app/node_modules/@alfresco

node $DIR/scripts/download-build-in-cs.js --username "$E2E_USERNAME" --password "$E2E_PASSWORD" --host "$E2E_HOST" --folder $TRAVIS_BUILD_NUMBER;

mkdir -p $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-core/ && \
cp -R  $DIR/../node_modules/@alfresco/adf-core/*  $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-core/

mkdir -p $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-content-services/ && \
cp -R $DIR/../node_modules/@alfresco/adf-content-services/* $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-content-services/

mkdir -p $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-process-services/ && \
cp -R $DIR/../node_modules/@alfresco/adf-process-services/* $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-process-services/

mkdir -p $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-insights/ && \
cp -R $DIR/../node_modules/@alfresco/adf-insights/* $DIR/../integration/base_ver_2_app/node_modules/@alfresco/adf-insights/


rm -rf $DIR/../node_modules/@angular
rm -rf $DIR/../node_modules/@alfresco

npm run e2e
