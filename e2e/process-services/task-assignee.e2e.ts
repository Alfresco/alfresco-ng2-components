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
import { StartProcessPage } from '../pages/adf/process-services/startProcessPage';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { ProcessDetailsPage } from '../pages/adf/process-services/processDetailsPage';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';
import { User } from '../models/APS/user';
import { TasksPage } from '../pages/adf/process-services/tasksPage';
import CONSTANTS = require('../util/constants');

describe('Task Assignee', () => {

    const loginPage = new LoginPage();
    const processListPage = new ProcessListPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const startProcessPage = new StartProcessPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processDetailsPage = new ProcessDetailsPage();
    const taskPage = new TasksPage();
    const app = browser.params.resources.Files.TEST_ASSIGNEE;

    let user: User;

    beforeAll(async () => {
        const apps = new AppsActions();
        const users = new UsersActions();
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);
        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location, { renewIdmEntries: true  });
        await loginPage.loginToProcessServicesUsingUserModel(user);
    });

    afterAll( async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
    });

    it('[C260387] Should the running process be displayed when clicking on Running filter', async () => {
        await processServicesPage.goToApp(app.title);
        await processServiceTabBarPage.clickProcessButton();
        await processListPage.checkProcessListIsDisplayed();
        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();

        await startProcessPage.startProcess({name: 'sample-process-one', processName: app.processName });
        await processFiltersPage.selectFromProcessList('sample-process-one');
        await processDetailsPage.clickOnActiveTask();

        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.one);
        await taskPage.tasksListPage().selectRow(app.userTasks.one);
        await taskPage.taskDetails().clickCompleteFormTask();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.one);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.one);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.one);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.taskDetails().clickCompleteFormTask();
        await taskPage.tasksListPage().checkContentIsNotDisplayed(app.userTasks.two);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkContentIsDisplayed(app.userTasks.two);

        await processServiceTabBarPage.clickProcessButton();
        await processListPage.checkProcessListIsDisplayed();
    });

});
