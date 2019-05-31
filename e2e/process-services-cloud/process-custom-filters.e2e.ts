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

import {
    TasksService, QueryService, ProcessDefinitionsService, ProcessInstancesService,
    LoginSSOPage, ApiService, SettingsPage, IdentityService, GroupIdentityService, RolesService
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { AppListCloudPage, LocalStorageUtil, BrowserActions } from '@alfresco/adf-testing';
import resources = require('../util/resources');
import { browser } from 'protractor';

describe('Process list cloud', () => {

    describe('Process List', () => {
        const loginSSOPage = new LoginSSOPage();
        const navigationBarPage = new NavigationBarPage();
        const appListCloudComponent = new AppListCloudPage();
        const processCloudDemoPage = new ProcessCloudDemoPage();
        const tasksCloudDemoPage = new TasksCloudDemoPage();
        const settingsPage = new SettingsPage();
        const apiService = new ApiService(
            browser.params.config.oauth2.clientId,
            browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
        );

        let tasksService: TasksService;
        let identityService: IdentityService;
        let groupIdentityService: GroupIdentityService;
        let rolesService: RolesService;
        let processDefinitionService: ProcessDefinitionsService;
        let processInstancesService: ProcessInstancesService;
        let queryService: QueryService;

        let completedProcess, runningProcessInstance, switchProcessInstance, noOfApps, testUser, apsUserRoleId, groupInfo;
        const candidateuserapp = resources.ACTIVITI7_APPS.CANDIDATE_USER_APP.name;

        beforeAll(async (done) => {

            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            identityService = new IdentityService(apiService);
            groupIdentityService = new GroupIdentityService(apiService);
            rolesService = new RolesService(apiService);
            testUser = await identityService.createIdentityUser();
            apsUserRoleId = await rolesService.getRoleIdByRoleName(identityService.roles.APS_USER);
            await identityService.assignRole(testUser.idIdentityService, apsUserRoleId, identityService.roles.APS_USER);

            groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
            await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
            await apiService.login(testUser.email, testUser.password);

            processDefinitionService = new ProcessDefinitionsService(apiService);
            const processDefinition = await processDefinitionService.getProcessDefinitions(candidateuserapp);

            processInstancesService = new ProcessInstancesService(apiService);
            await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);

            runningProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);
            switchProcessInstance = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);

            completedProcess = await processInstancesService.createProcessInstance(processDefinition.list.entries[0].entry.key, candidateuserapp);
            queryService = new QueryService(apiService);

            const task = await queryService.getProcessInstanceTasks(completedProcess.entry.id, candidateuserapp);
            tasksService = new TasksService(apiService);
            const claimedTask = await tasksService.claimTask(task.list.entries[0].entry.id, candidateuserapp);
            await tasksService.completeTask(claimedTask.entry.id, candidateuserapp);

            await settingsPage.setProviderBpmSso(
                browser.params.config.bpmHost,
                browser.params.config.oauth2.host,
                browser.params.config.identityHost);
            loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
            await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify({
                'filterProperties': [
                    'appName',
                    'status',
                    'processInstanceId',
                    'order',
                    'sort',
                    'order'
                ],
                'sortProperties': [
                    'id',
                    'name',
                    'status',
                    'startDate'
                ],
                'actions': [
                    'save',
                    'saveAs',
                    'delete'
                ]
            }));
            done();
        });

        afterAll(async(done) => {
            await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
            await identityService.deleteIdentityUser(testUser.idIdentityService);
            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesCloudPage();
            appListCloudComponent.checkApsContainer();
            appListCloudComponent.goToApp(candidateuserapp);
            tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
            processCloudDemoPage.clickOnProcessFilters();
        });

        it('[C290069] Should display processes ordered by name when Name is selected from sort dropdown', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING')
                .setSortFilterDropDown('Name').setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().getAllRowsNameColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.processListCloudComponent().getAllRowsNameColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort();
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C291783] Should display processes ordered by id when Id is selected from sort dropdown', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().setStatusFilterDropDown('RUNNING')
                .setSortFilterDropDown('Id').setOrderFilterDropDown('ASC');
            processCloudDemoPage.processListCloudComponent().getDataTable();
            browser.driver.sleep(1000);
            processCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });

            processCloudDemoPage.editProcessFilterCloudComponent().setOrderFilterDropDown('DESC');
            processCloudDemoPage.processListCloudComponent().getDataTable();
            browser.driver.sleep(1000);
            processCloudDemoPage.getAllRowsByIdColumn().then(function (list) {
                const initialList = list.slice(0);
                list.sort(function (firstStr, secondStr) {
                    return firstStr.localeCompare(secondStr);
                });
                list.reverse();
                expect(JSON.stringify(initialList) === JSON.stringify(list)).toEqual(true);
            });
        });

        it('[C297697] The value of the filter should be preserved when saving it', async () => {
            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()
                .setProcessInstanceId(completedProcess.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('New').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('New');

            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(completedProcess.entry.id);
            expect(processCloudDemoPage.processListCloudComponent().getDataTable().numberOfRows()).toBe(1);

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(completedProcess.entry.id);
        });

        it('[C297646] Should display the filter dropdown fine , after switching between saved filters', async () => {

            noOfApps = processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader().getNumberOfAppNameOptions();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            BrowserActions.closeMenuAndDialogs();
            processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')
                .setAppNameDropDown(candidateuserapp).setProcessInstanceId(runningProcessInstance.entry.id);

            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(runningProcessInstance.entry.id);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            BrowserActions.closeMenuAndDialogs();

            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SavedFilter').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('SavedFilter');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(runningProcessInstance.entry.id);

            processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING')
                .setAppNameDropDown(candidateuserapp).setProcessInstanceId(switchProcessInstance.entry.id);

            processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(switchProcessInstance.entry.id);
            processCloudDemoPage.editProcessFilterCloudComponent().clickSaveAsButton();
            processCloudDemoPage.editProcessFilterCloudComponent().editProcessFilterDialog().setFilterName('SwitchFilter').clickOnSaveButton();
            expect(processCloudDemoPage.getActiveFilterName()).toBe('SwitchFilter');

            processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader();
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getProcessInstanceId()).toEqual(switchProcessInstance.entry.id);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().getNumberOfAppNameOptions()).toBe(noOfApps);
            expect(processCloudDemoPage.editProcessFilterCloudComponent().checkAppNamesAreUnique()).toBe(true);
            BrowserActions.closeMenuAndDialogs();
        });

    });

});
