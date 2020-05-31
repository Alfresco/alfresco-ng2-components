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
import { LoginSSOPage, ApplicationsUtil, ApiService } from '@alfresco/adf-testing';
import { ProcessServicesPage } from '../pages/adf/process-services/process-services.page';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import CONSTANTS = require('../util/constants');
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';
import { ModelsActions } from '../actions/APS/models.actions';

describe('Modify applications', () => {

    const app = browser.params.resources.Files.APP_WITH_PROCESSES;
    const appToBeDeleted = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const replacingApp = browser.params.resources.Files.WIDGETS_SMOKE_TEST;

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();

    const apiService = new ApiService();
    const modelActions = new ModelsActions(apiService);
    const apps = new AppsActions(apiService);
    const usersActions = new UsersActions(apiService);
    const applicationService = new ApplicationsUtil(apiService);

    let firstApp, appVersionToBeDeleted;

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        const user = await usersActions.createUser();

        await apiService.getInstance().login(user.email, user.password);

        firstApp = await applicationService.importPublishDeployApp(app.file_path);
        appVersionToBeDeleted = await applicationService.importPublishDeployApp(appToBeDeleted.file_path);

        await loginPage.login(user.email, user.password);
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

        await apps.importNewVersionAppDefinitionPublishDeployApp(replacingApp.file_location, firstApp.id);

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

        await modelActions.deleteEntireModel(firstApp.id);
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

        await apps.importNewVersionAppDefinitionPublishDeployApp(replacingApp.file_location, appVersionToBeDeleted.id);

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await processServicesPage.getBackgroundColor(appToBeDeleted.title);

        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.GREY);

        await modelActions.deleteVersionModel(appVersionToBeDeleted.id);
        await modelActions.deleteVersionModel(appVersionToBeDeleted.id);
        await apps.publishDeployApp(appVersionToBeDeleted.id);

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

        await apiService.getInstance().activiti.appsApi.updateAppDefinition(appVersionToBeDeleted.id, appDefinition);

        await navigationBarPage.clickHomeButton();
        await navigationBarPage.navigateToProcessServicesPage();

        await expect(await processServicesPage.getDescription(appToBeDeleted.title)).toEqual(newDescription);
        await expect(await processServicesPage.getBackgroundColor(appToBeDeleted.title)).toEqual(CONSTANTS.APP_COLOR.RED);
        await expect(await processServicesPage.getAppIconType(appToBeDeleted.title)).toEqual(CONSTANTS.APP_ICON.USER);
    });
});
