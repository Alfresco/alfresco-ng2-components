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
import { LoginPage } from '../pages/adf/loginPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import CONSTANTS = require('../util/constants');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { ModelsActions } from '../actions/APS/models.actions';

describe('Modify applications', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let app = resources.Files.APP_WITH_PROCESSES;
    let appToBeDeleted = resources.Files.SIMPLE_APP_WITH_USER_FORM;
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
        appVersionToBeDeleted = await apps.importPublishDeployApp(this.alfrescoJsApi, appToBeDeleted.file_location);

        loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    it('[C260198] Should the app be displayed on dashboard when is deployed on APS', () => {
        navigationBarPage.navigateToProcessServicesPage();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260213] Should a new version of the app be displayed on dashboard when is replaced by importing another app in APS', async () => {
        navigationBarPage.navigateToProcessServicesPage();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.UNIT);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.BLUE);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);

        browser.controlFlow().execute(() => {
            return apps.importNewVersionAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, firstApp.id);
        });

        browser.refresh();

        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(app.title)).toEqual(CONSTANTS.APP_ICON.FAVORITE);
        expect(processServicesPage.getBackgroundColor(app.title)).toEqual(CONSTANTS.APP_COLOR.GREY);
        expect(processServicesPage.getDescription(app.title)).toEqual(app.description);
    });

    it('[C260220] Should the app not be displayed on dashboard after it was deleted in APS', async () => {
        navigationBarPage.navigateToProcessServicesPage();

        processServicesPage.checkApsContainer();

        processServicesPage.checkAppIsDisplayed(app.title);

        browser.controlFlow().execute(() => {
            return modelActions.deleteEntireModel(this.alfrescoJsApi, firstApp.id);
        });

        browser.refresh();

        processServicesPage.checkApsContainer();
        processServicesPage.checkAppIsNotDisplayed(app.title);
    });

    it('[C260215] Should the penultimate version of an app be displayed on dashboard when the last version is deleted in APS', async () => {
        navigationBarPage.navigateToProcessServicesPage();

        processServicesPage.checkApsContainer();

        processServicesPage.checkAppIsDisplayed(appToBeDeleted.title);
        expect(processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);

        browser.controlFlow().execute(() => {
            return apps.importNewVersionAppDefinitionPublishDeployApp(this.alfrescoJsApi, replacingApp.file_location, appVersionToBeDeleted.id);
        });

        browser.refresh();

        processServicesPage.getBackgroundColor(appToBeDeleted.title);

        expect(processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.GREY);

        browser.controlFlow().execute(async () => {
            await modelActions.deleteVersionModel(this.alfrescoJsApi, appVersionToBeDeleted.id);
            await modelActions.deleteVersionModel(this.alfrescoJsApi, appVersionToBeDeleted.id);
            await apps.publishDeployApp(this.alfrescoJsApi, appVersionToBeDeleted.id);
        });

        browser.refresh();

        processServicesPage.checkApsContainer();
        processServicesPage.checkAppIsDisplayed(appToBeDeleted.title);
        expect(processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);
    });

    it('[C260207] Should the app be updated when is edited in APS', async () => {
        let newDescription = 'new description';

        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();

        expect(processServicesPage.getAppIconType(appToBeDeleted.title)).toEqual(CONSTANTS.APP_ICON.USER);
        expect(processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.ORANGE);
        expect(processServicesPage.getDescription(appToBeDeleted.title)).toEqual(appToBeDeleted.description);

        let appDefinition = {'appDefinition': {'id': appVersionToBeDeleted.id, 'name': appToBeDeleted.title,
            'description': newDescription, 'definition': {'models': [firstApp.definition.models[0]], 'theme': 'theme-4',
                'icon': 'glyphicon-user'}}, 'publish': true};

        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.appsApi.updateAppDefinition(appVersionToBeDeleted.id, appDefinition);
        });

        browser.refresh();

        expect(processServicesPage.getDescription(appToBeDeleted.title)).toEqual(newDescription);
        expect(processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.RED);
        expect(processServicesPage.getAppIconType(appToBeDeleted.title)).toEqual(CONSTANTS.APP_ICON.USER);
    });

});
