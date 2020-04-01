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

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { LoginPage, ApplicationService } from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { browser } from 'protractor';
import { User } from '../models/APS/user';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/process-service-tab-bar.page';
import { StartProcessPage } from '../pages/adf/process-services/start-process.page';
import { ProcessListDemoPage } from '../pages/adf/demo-shell/process-services/process-list-demo.page';
import { ProcessFiltersPage } from '../pages/adf/process-services/process-filters.page';
import { ProcessDetailsPage } from '../pages/adf/process-services/process-details.page';
import { ProcessListPage } from '../pages/adf/process-services/process-list.page';
import CONSTANTS = require('../util/constants');

describe('Stencil', () => {

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const startProcessPage = new StartProcessPage();
    const processListDemoPage = new ProcessListDemoPage();
    const processListPage = new ProcessListPage();
    const processDetailsPage = new ProcessDetailsPage();
    const processFiltersPage = new ProcessFiltersPage();
    const usersActions = new UsersActions();
    const alfrescoJsApi = new AlfrescoApi({
        provider: 'BPM',
        hostBpm: browser.params.testConfig.adf_aps.host
    });

    const app = browser.params.resources.Files.STENCIL_PROCESS;
    let user: User;

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        user = await usersActions.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(user.email, user.password);
        const applicationsService = new ApplicationService(alfrescoJsApi);
        await applicationsService.importPublishDeployApp(app.file_path);
        await loginPage.loginToProcessServicesUsingUserModel(user);
    });

    afterAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
    });

    it('[C245648] Can start an app with custom stencil included', async () => {
        const name = 'test stencil process';
        await processServiceTabBarPage.clickProcessButton();
        await processListPage.checkProcessListIsDisplayed();
        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();

        await startProcessPage.startProcess({ name, processName: app.processName });
        await processListDemoPage.checkProcessIsDisplayed(name);
        await processFiltersPage.selectFromProcessList(name);

        await processDetailsPage.clickOnActiveTask();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.taskDetails().clickCompleteTask();

        await processServiceTabBarPage.clickProcessButton();
        await processFiltersPage.checkNoContentMessage();

        await processFiltersPage.clickCompletedFilterButton();
        await processListDemoPage.checkProcessIsDisplayed(name);

        await processServiceTabBarPage.clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().checkTaskListIsLoaded();
        await taskPage.tasksListPage().checkContentIsDisplayed(app.taskName);
    });
});
