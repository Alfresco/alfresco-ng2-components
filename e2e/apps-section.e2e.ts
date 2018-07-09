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

import LoginPage = require('./pages/adf/loginPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');

import CONSTANTS = require('./util/constants');
import Util = require('./util/util');

import TestConfig = require('./test.config');
import resources = require('./util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from './actions/users.actions';
import { AppsActions } from './actions/APS/apps.actions';

describe('Modify applications', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let app = resources.Files.APP_WITH_PROCESSES;
    let replacingApp = resources.Files.WIDGETS_SMOKE_TEST;
    let apps = new AppsActions();
    let firstApp;

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        firstApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    it('[C260198] Publish on ADF side', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260213] Replacing on ADF side', async () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);

        await apps.importNewAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, firstApp.id);

        Util.refreshBrowser();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.FAVORITE);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.GREY);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

});
