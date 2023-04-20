/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService,
    ApplicationsUtil,
    LoginPage,
    ProcessUtil,
    StartProcessPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServicesPage } from './../pages/process-services.page';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { ProcessServiceTabBarPage } from './../pages/process-service-tab-bar.page';
import { ProcessDetailsPage } from './../pages/process-details.page';
import { ProcessListPage } from './../pages/process-list.page';
import { browser } from 'protractor';
import { TasksPage } from './../pages/tasks.page';
import CONSTANTS = require('../../util/constants');
import { AdminGroupsApi } from '@alfresco/js-api';

describe('Task Assignee', () => {

    const app = browser.params.resources.Files.TEST_ASSIGNEE;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processListPage = new ProcessListPage();
    const processFiltersPage = new ProcessFiltersPage();
    const startProcessPage = new StartProcessPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processDetailsPage = new ProcessDetailsPage();
    const taskPage = new TasksPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const adminGroupsApi = new AdminGroupsApi(apiService.getInstance());

    describe('Candidate User Assignee', () => {

        let user: UserModel;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            user = await usersActions.createUser(new UserModel({
                firstName: app.candidate.firstName,
                lastName: app.candidate.lastName
            }));

            try {// creates group if not available
                await adminGroupsApi.createNewGroup({
                    name: app.candidateGroup,
                    tenantId: user.tenantId,
                    type: 1
                });
            } catch (e) {
            }

            await apiService.login(user.username, user.password);
            await applicationsService.importPublishDeployApp(app.file_path, { renewIdmEntries: true });

            await loginPage.login(user.username, user.password);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await usersActions.deleteTenant(user.tenantId);
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
        });

        it('[C260387] Should the running process be displayed when clicking on Running filter', async () => {
            const name = 'sample-process-one';
            await processServicesPage.goToApp(app.title);
            await processServiceTabBarPage.clickProcessButton();
            await expect(await processListPage.isProcessListDisplayed()).toEqual(true);
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
            await startProcessPage.startProcess(name, app.processNames[0]);
            await processFiltersPage.selectFromProcessList(name);
            await processDetailsPage.activeTask.click();

            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.simple.one);
            await taskPage.tasksListPage().selectRow(app.userTasks.simple.one);
            await taskPage.taskDetails().clickCompleteFormTask();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.one);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.one);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.one);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.taskDetails().clickCompleteFormTask();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.simple.two);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.simple.two);
        });
    });

    describe('Candidate Group Assignee', () => {
        let user: UserModel;
        let candidate1: UserModel;
        let candidate2: UserModel;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');
            user = await usersActions.createUser();
            candidate1 = await usersActions.createUser(new UserModel({ tenantId: user.tenantId }));
            candidate2 = await usersActions.createUser(new UserModel({ tenantId: user.tenantId }));

            const adminGroup = await adminGroupsApi.createNewGroup(
                { name: app.adminGroup, tenantId: user.tenantId }
            );

            await adminGroupsApi.addGroupMember(adminGroup.id, user.id);

            await adminGroupsApi.addGroupCapabilities(adminGroup.id, { capabilities: app.adminCapabilities });

            const candidateGroup = await adminGroupsApi.createNewGroup(
                { name: app.candidateGroup, tenantId: user.tenantId, type: 1 }
            );

            await adminGroupsApi.addGroupMember(candidateGroup.id, candidate1.id);
            await adminGroupsApi.addGroupMember(candidateGroup.id, candidate2.id);
            await adminGroupsApi.addGroupMember(candidateGroup.id, user.id);

            try {// for creates user if not available
                await usersActions.createUser(new UserModel({
                    tenantId: user.tenantId,
                    firstName: app.candidate.firstName,
                    lastName: app.candidate.lastName
                }));
            } catch (e) {
            }

            await apiService.login(user.username, user.password);
            const appModel = await applicationsService.importPublishDeployApp(app.file_path, { renewIdmEntries: true });

            await new ProcessUtil(apiService).startProcessByDefinitionName(appModel.name, app.processNames[1]);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await usersActions.deleteTenant(user.tenantId);
        });

        it('[C216430] Start Task - Claim and Requeue a task', async () => {
            await loginPage.login(candidate1.username, candidate1.password);
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp('Task App');
            await taskPage.tasksListPage().checkTaskListIsLoaded();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.tasksListPage().selectRow(app.userTasks.candidateTask);
            await taskPage.taskDetails().checkClaimEnabled();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.candidateTask);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.candidateTask);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.tasksListPage().selectRow(app.userTasks.candidateTask);
            await taskPage.taskDetails().claimTask();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.taskDetails().checkReleaseEnabled();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.taskDetails().checkReleaseEnabled();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.candidateTask);

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(candidate2.username, candidate2.password);
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp('Task App');
            await taskPage.tasksListPage().checkTaskListIsLoaded();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.candidateTask);

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(candidate1.username, candidate1.password);
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp('Task App');
            await taskPage.tasksListPage().checkTaskListIsLoaded();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.tasksListPage().selectRow(app.userTasks.candidateTask);
            await taskPage.taskDetails().releaseTask();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.INV_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.candidateTask);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.MY_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.candidateTask);

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.taskDetails().checkClaimEnabled();

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(candidate2.username, candidate2.password);
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp('Task App');
            await taskPage.tasksListPage().checkTaskListIsLoaded();

            await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.filtersPage().checkFilterIsHighlighted(CONSTANTS.TASK_FILTERS.QUE_TASKS);
            await taskPage.tasksListPage().checkTaskListIsLoaded();
            await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.candidateTask);
            await taskPage.taskDetails().checkClaimEnabled();
        });
    });
});
