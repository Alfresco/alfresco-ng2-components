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

/* tslint:disable */

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
import { ModelsActions } from './actions/APS/models.actions';
import AppPublish = require('./models/APS/AppPublish');

describe('Modify applications', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let app = resources.Files.APP_WITH_PROCESSES;
    let appTobeDeleted = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let replacingApp = resources.Files.WIDGETS_SMOKE_TEST;
    let apps = new AppsActions();
    let modelActions = new ModelsActions();
    let firstApp, appVersionToBeDeleted;

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
        appVersionToBeDeleted = await apps.importPublishDeployApp(this.alfrescoJsApi, appTobeDeleted.file_location);

        loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    it('[C260198] Publish app on ADF side', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260213] Replacing app on ADF side', async () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        expect(await processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);

        await apps.importNewVersionAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, firstApp.id);

        Util.refreshBrowser();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.FAVORITE);
        expect(await processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.GREY);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260220] Permanent delete app on ADF side', async () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        processServicesPage.checkAppIsDisplayed(app.title);

        console.log("Before deleting the app");

        await modelActions.deleteEntireModel(this.alfrescoJsApi, firstApp.id).then( () => console.log("Right after deleting the app"));

        Util.refreshBrowser();

        processServicesPage.checkApsContainer();
        processServicesPage.checkAppIsNotDisplayed(app.title);
    });

    it('[C260220] Delete version of an app on ADF side', async () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();

        processServicesPage.checkAppIsDisplayed(appTobeDeleted.title);
        expect(await processServicesPage.getBackgroundColor(appTobeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);

        await apps.importNewVersionAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, appVersionToBeDeleted.id);

        Util.refreshBrowser();

        expect(await processServicesPage.getBackgroundColor(appTobeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.GREY);

        await modelActions.deleteVersionModel(this.alfrescoJsApi, appVersionToBeDeleted.id);
        await modelActions.deleteVersionModel(this.alfrescoJsApi, appVersionToBeDeleted.id);
        await apps.publishDeployApp(this.alfrescoJsApi, appVersionToBeDeleted.id);

        Util.refreshBrowser();

        processServicesPage.checkApsContainer();
        processServicesPage.checkAppIsDisplayed(appTobeDeleted.title);
        expect(await processServicesPage.getBackgroundColor(appTobeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);
    });

});
