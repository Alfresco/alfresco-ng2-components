/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import AdfLoginPage = require('./pages/adf/loginPage.js');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
import NavigationBarPage = require('./pages/adf/navigationBarPage.js');

import CONSTANTS = require('./util/constants');

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');
import apps = require('./restAPI/APS/reusableActions/apps');
import users = require('./restAPI/APS/reusableActions/users');

import AlfrescoApi = require('alfresco-js-api-node');

describe('Attachment list', () => {

    let adfLoginPage = new AdfLoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let app = resources.Files.APP_WITH_PROCESSES;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await adfLoginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    it('[C260198] Publish on ADF side', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual('ac_unit');
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual('Description for app');
    });

});
