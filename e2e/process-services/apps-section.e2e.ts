/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { browser } from 'protractor';
import { LoginPage } from '@alfresco/adf-testing';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { ModelsActions } from '../actions/APS/models.actions';

describe('Modify applications', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const app = resources.Files.APP_WITH_PROCESSES;
    const appToBeDeleted = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const replacingApp = resources.Files.WIDGETS_SMOKE_TEST;
    const apps = new AppsActions();
    const modelActions = new ModelsActions();
    let firstApp, appVersionToBeDeleted;

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        firstApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appVersionToBeDeleted = await apps.importPublishDeployApp(this.alfrescoJsApi, appToBeDeleted.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);

    });

    it('[C260198] Should the app be displayed on dashboard when is deployed on APS', async () => {
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();

        await expect(await processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        await expect(await processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        await expect(await processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260213] Should a new version of the app be displayed on dashboard when is replaced by importing another app in APS', async () => {
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();

        await expect(await processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        await expect(await processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        await expect(await processServicesPage.getDescription(app.title)).toEqual(app.description);

        await apps.importNewVersionAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, firstApp.id);

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();

        await expect(await processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.FAVORITE);
        await expect(await processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.GREY);
        await expect(await processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260220] Should the app not be displayed on dashboard after it was deleted in APS', async () => {
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();

        await processServicesPage.checkAppIsDisplayed(app.title);

        await modelActions.deleteEntireModel(this.alfrescoJsApi, firstApp.id);
        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();
        await processServicesPage.checkAppIsNotDisplayed(app.title);
    });

    it('[C260215] Should the penultimate version of an app be displayed on dashboard when the last version is deleted in APS', async () => {
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();

        await processServicesPage.checkAppIsDisplayed(appToBeDeleted.title);
        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);

        await apps.importNewVersionAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, appVersionToBeDeleted.id);

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.getBackgroundColor(appToBeDeleted.title);

        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.GREY);

        await modelActions.deleteVersionModel(this.alfrescoJsApi, appVersionToBeDeleted.id);
        await modelActions.deleteVersionModel(this.alfrescoJsApi, appVersionToBeDeleted.id);
        await apps.publishDeployApp(this.alfrescoJsApi, appVersionToBeDeleted.id);

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.checkApsContainer();
        await processServicesPage.checkAppIsDisplayed(appToBeDeleted.title);
        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);
    });

    it('[C260207] Should the app be updated when is edited in APS', async () => {
        const newDescription = 'new description';

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();

        await expect(await processServicesPage.getAppIconType(appToBeDeleted.title)).toEqual(CONSTANTS.APP_ICON.USER);
        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);
        await expect(await processServicesPage.getDescription(appToBeDeleted.title)).toEqual(appToBeDeleted.description);

        const appDefinition = {
            'appDefinition': {
                'id': appVersionToBeDeleted.id, 'name': appToBeDeleted.title,
                'description': newDescription, 'definition': {
                    'models': [firstApp.definition.models[0]], 'theme': 'theme-4',
                    'icon': 'glyphicon-user'
                }
            }, 'publish': true
        };

        await this.alfrescoJsApi.activiti.appsApi.updateAppDefinition(appVersionToBeDeleted.id, appDefinition);

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await expect(await processServicesPage.getDescription(appToBeDeleted.title)).toEqual(newDescription);
        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.RED);
        await expect(await processServicesPage.getAppIconType(appToBeDeleted.title)).toEqual(CONSTANTS.APP_ICON.USER);
    });

});
