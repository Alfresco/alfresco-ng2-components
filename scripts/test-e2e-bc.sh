#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd "$DIR/../integration/base_ver_2_app"


#Use last js-api
npm install --save alfresco-js-api@alpha

#New documented dependency
npm install --save-dev @angular-devkit/core
npm install --save  @mat-datetimepicker/core @mat-datetimepicker/moment

npm run e2e
