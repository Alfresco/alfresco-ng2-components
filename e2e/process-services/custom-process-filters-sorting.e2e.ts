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
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { FiltersPage } from '../pages/adf/process-services/filtersPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { AppsActions } from '../actions/APS/apps.actions';

describe('Sorting for process filters', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processFiltersPage = new ProcessFiltersPage();
    let filtersPage = new FiltersPage();

    let apps = new AppsActions();

    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let tenantId, appId, user, processesQuery;

    let processFilter = {
        running_old_first: 'Running - Oldest first',
        completed_old_first: 'Completed - Oldest first',
        all_old_first: 'All - Oldest first',
        running_new_first: 'Running - Newest first',
        completed_new_first: 'Completed - Newest first',
        all_new_first: 'All - Newest first',
        completed_most_recently: 'Completed - Most recently',
        completed_least_recently: 'Completed - Least recently'
    };

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        done();
    });

    beforeEach(async(done) => {
        let users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);
        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        let importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
        appId = importedApp.id;

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        done();
    });

    afterEach(async(done) => {
        await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C260476] Should be able to create a filter on APS for running processes - Oldest first and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.running_old_first,  'icon': 'glyphicon-random',
                'filter': {'sort': 'created-asc', 'name': '', 'state': 'running'}
            });
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');
        });          loginPage.loginToProcessServicesUsingUserModel(user);          navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();          processFiltersPage.checkFilterIsDisplayed(processFilter.running_old_first);          filtersPage.goToFilter(processFilter.running_old_first);          browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'running', 'sort': 'created-asc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 1');
            expect(processesQuery.data[1].name).toEqual('Process 2');
            expect(processesQuery.data[2].name).toEqual('Process 3');
        });      });

    it('[C260477] Should be able to create a filter on APS for completed processes - Oldest first and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.completed_old_first,  'icon': 'glyphicon-random',
                'filter': {'sort': 'created-asc', 'name': '', 'state': 'completed'}
            });

            let firstProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            let secondProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            let thirdProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');

            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.completed_old_first);

        filtersPage.goToFilter(processFilter.completed_old_first);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'created-asc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 1');
            expect(processesQuery.data[1].name).toEqual('Process 2');
            expect(processesQuery.data[2].name).toEqual('Process 3');
        });
    });

    it('[C260478] Should be able to create a filter on APS for all processes - Oldest first and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.all_old_first,  'icon': 'glyphicon-random',
                'filter': {'sort': 'created-asc', 'name': '', 'state': 'all'}
            });

            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');

            let firstProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 4');
            let secondProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 5');
            let thirdProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 6');

            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.all_old_first);

        filtersPage.goToFilter(processFilter.all_old_first);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'all', 'sort': 'created-asc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 1');
            expect(processesQuery.data[1].name).toEqual('Process 2');
            expect(processesQuery.data[2].name).toEqual('Process 3');
            expect(processesQuery.data[3].name).toEqual('Process 4');
            expect(processesQuery.data[4].name).toEqual('Process 5');
            expect(processesQuery.data[5].name).toEqual('Process 6');
        });
    });

    it('[C260479] Should be able to create a filter on APS for running processes - Newest first and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.running_new_first,  'icon': 'glyphicon-random',
                'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
            });

            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.running_new_first);

        filtersPage.goToFilter(processFilter.running_new_first);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'running', 'sort': 'created-desc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 3');
            expect(processesQuery.data[1].name).toEqual('Process 2');
            expect(processesQuery.data[2].name).toEqual('Process 1');
        });
    });

    it('[C260480] Should be able to create a filter on APS for completed processes - Newest first and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.completed_new_first,  'icon': 'glyphicon-random',
                'filter': {'sort': 'created-desc', 'name': '', 'state': 'completed'}
            });

            let firstProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            let secondProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            let thirdProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');

            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.completed_new_first);

        filtersPage.goToFilter(processFilter.completed_new_first);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'created-desc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 3');
            expect(processesQuery.data[1].name).toEqual('Process 2');
            expect(processesQuery.data[2].name).toEqual('Process 1');
        });
    });

    it('[C260481] Should be able to create a filter on APS for all processes - Newest first and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.all_new_first,  'icon': 'glyphicon-random',
                'filter': {'sort': 'created-desc', 'name': '', 'state': 'all'}
            });

            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');

            let firstProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 4');
            let secondProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 5');
            let thirdProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 6');

            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.all_new_first);

        filtersPage.goToFilter(processFilter.all_new_first);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'all', 'sort': 'created-desc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 6');
            expect(processesQuery.data[1].name).toEqual('Process 5');
            expect(processesQuery.data[2].name).toEqual('Process 4');
            expect(processesQuery.data[3].name).toEqual('Process 3');
            expect(processesQuery.data[4].name).toEqual('Process 2');
            expect(processesQuery.data[5].name).toEqual('Process 1');
        });
    });

    it('[C272815] Should be able to create a filter on APS for completed processes - Completed most recently and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.completed_most_recently,  'icon': 'glyphicon-random',
                'filter': {'sort': 'ended-asc', 'name': '', 'state': 'completed'}
            });

            let firstProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            let secondProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            let thirdProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');

            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.completed_most_recently);

        filtersPage.goToFilter(processFilter.completed_most_recently);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'ended-asc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 2');
            expect(processesQuery.data[1].name).toEqual('Process 1');
            expect(processesQuery.data[2].name).toEqual('Process 3');
        });
    });

    it('[C272816] Should be able to create a filter on APS for completed processes - Completed least recently and check on ADF', () => {
        browser.controlFlow().execute(async () => {
            await this.alfrescoJsApi.activiti.userFiltersApi.createUserProcessInstanceFilter({
                'appId': null,  'name': processFilter.completed_least_recently,  'icon': 'glyphicon-random',
                'filter': {'sort': 'ended-desc', 'name': '', 'state': 'completed'}
            });

            let firstProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 1');
            let secondProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 2');
            let thirdProc = await apps.startProcess(this.alfrescoJsApi, 'Task App', 'Process 3');

            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(secondProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(firstProc.id);
            await this.alfrescoJsApi.activiti.processInstancesApi.deleteProcessInstance(thirdProc.id);
        });

        loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage
            .navigateToProcessServicesPage()
            .goToTaskApp()
            .clickProcessButton();

        processFiltersPage.checkFilterIsDisplayed(processFilter.completed_least_recently);

        filtersPage.goToFilter(processFilter.completed_least_recently);

        browser.controlFlow().execute(async () => {
            processesQuery = await this.alfrescoJsApi.activiti.processApi.getProcessInstances({
                'processDefinitionId': null, 'appDefinitionId': null, 'state': 'completed', 'sort': 'ended-desc'
            });
            expect(processesQuery.data[0].name).toEqual('Process 3');
            expect(processesQuery.data[1].name).toEqual('Process 1');
            expect(processesQuery.data[2].name).toEqual('Process 2');
        });
    });
});
