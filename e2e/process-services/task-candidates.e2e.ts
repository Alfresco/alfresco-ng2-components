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

import { LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';
import { User } from '../models/APS/user';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import CONSTANTS = require('../util/constants');

describe('Task Candidate Assignee', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const taskPage = new TasksPage();
    const app = browser.params.resources.Files.TEST_ASSIGNEE;

    let user: User;
    let candidate1: User;
    let candidate2: User;

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        user = await users.createTenantAndUser(this.alfrescoJsApi);
        candidate1 = await users.createApsUser(this.alfrescoJsApi, user.tenantId);
        candidate2 = await users.createApsUser(this.alfrescoJsApi, user.tenantId);
        const adminGroup = await this.alfrescoJsApi.activiti.adminGroupsApi.createNewGroup(
            { 'name': app.adminGroup, 'tenantId': user.tenantId }
        );
        await this.alfrescoJsApi.activiti.adminGroupsApi.addGroupMember(adminGroup.id, user.id);
        await this.alfrescoJsApi.activiti.adminGroupsApi.addGroupCapabilities(adminGroup.id, { capabilities: app.adminCapabilities });

        const candidateGroup = await this.alfrescoJsApi.activiti.adminGroupsApi.createNewGroup(
            { 'name': app.candidateGroup, 'tenantId': user.tenantId, 'type': 1 }
        );
        await this.alfrescoJsApi.activiti.adminGroupsApi.addGroupMember(candidateGroup.id, candidate1.id);
        await this.alfrescoJsApi.activiti.adminGroupsApi.addGroupMember(candidateGroup.id, candidate2.id);
        await this.alfrescoJsApi.activiti.adminGroupsApi.addGroupMember(candidateGroup.id, user.id);

        await this.alfrescoJsApi.login(user.email, user.password);
        const appModel = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location, { renewIdmEntries: true });
        await apps.startProcess(this.alfrescoJsApi, appModel, app.processNames[1]);
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    it('[C216430] Start Task - Claim and Requeue a task', async () => {
        await loginPage.loginToProcessServicesUsingUserModel(candidate1);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp('Task App');
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.tasksListPage().selectRow(app.userTaskName.candidateTask);
        await taskPage.taskDetails().checkClaimEnabled();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTaskName.candidateTask);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTaskName.candidateTask);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.tasksListPage().selectRow(app.userTaskName.candidateTask);
        await taskPage.taskDetails().claimTask();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.taskDetails().checkReleaseEnabled();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.taskDetails().checkReleaseEnabled();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTaskName.candidateTask);

        await loginPage.loginToProcessServicesUsingUserModel(candidate2);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp('Task App');
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTaskName.candidateTask);

        await loginPage.loginToProcessServicesUsingUserModel(candidate1);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp('Task App');
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.tasksListPage().selectRow(app.userTaskName.candidateTask);
        await taskPage.taskDetails().releaseTask();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.INV_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTaskName.candidateTask);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTaskName.candidateTask);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.taskDetails().checkClaimEnabled();

        await loginPage.loginToProcessServicesUsingUserModel(candidate2);
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp('Task App');
        await taskPage.tasksListPage().checkTaskListIsLoaded();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTaskName.candidateTask);
        await taskPage.taskDetails().checkClaimEnabled();
    });
});
