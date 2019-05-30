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
import resources = require('../util/resources');
import { LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Empty Process List Test', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processDetailsPage = new ProcessDetailsPage();
    const processListPage = new ProcessListPage();
    const startProcessPage = new StartProcessPage();

    const appA = resources.Files.APP_WITH_PROCESSES;
    const appB = resources.Files.SIMPLE_APP_WITH_USER_FORM;

    let user;

    beforeAll(async (done) => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf.url
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, appA.file_location);
        await apps.importPublishDeployApp(this.alfrescoJsApi, appB.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);
        done();
    });

    it('[C260494] Should add process to list when a process is created', () => {
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(appA.title).clickProcessButton();
        expect(processListPage.checkProcessListTitleIsDisplayed()).toEqual('No Processes Found');
        expect(processDetailsPage.checkProcessDetailsMessage()).toEqual('No process details found');

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.selectFromProcessDropdown(appA.process_wse_name);
        startProcessPage.clickStartProcessButton();
        expect(processFiltersPage.numberOfProcessRows()).toEqual(1);

        processDetailsPage.checkProcessDetailsCard();
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(appB.title).clickProcessButton();
        expect(processListPage.checkProcessListTitleIsDisplayed()).toEqual('No Processes Found');
        expect(processDetailsPage.checkProcessDetailsMessage()).toEqual('No process details found');

        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();
        startProcessPage.selectFromProcessDropdown(appB.processName);
        startProcessPage.clickStartProcessButton();
        expect(processFiltersPage.numberOfProcessRows()).toEqual(1);
        processDetailsPage.checkProcessDetailsCard();
    });

});
