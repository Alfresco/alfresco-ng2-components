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
    StartProcessPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { TasksPage } from './../pages/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServiceTabBarPage } from './../pages/process-service-tab-bar.page';
import { ProcessListDemoPage } from './../pages/process-list-demo.page';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { ProcessDetailsPage } from './../pages/process-details.page';
import { ProcessListPage } from './../pages/process-list.page';
import CONSTANTS = require('../../util/constants');

describe('Stencil', () => {

    const app = browser.params.resources.Files.STENCIL_PROCESS;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const startProcessPage = new StartProcessPage();
    const processListDemoPage = new ProcessListDemoPage();
    const processListPage = new ProcessListPage();
    const processDetailsPage = new ProcessDetailsPage();
    const processFiltersPage = new ProcessFiltersPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let user: UserModel;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();

        await apiService.login(user.username, user.password);
        const applicationsService = new ApplicationsUtil(apiService);
        await applicationsService.importPublishDeployApp(app.file_path);
        await loginPage.login(user.username, user.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp();
        await taskPage.tasksListPage().checkTaskListIsLoaded();
    });

    it('[C245648] Can start an app with custom stencil included', async () => {
        const name = 'test stencil process';
        await processServiceTabBarPage.clickProcessButton();
        await expect(await processListPage.isProcessListDisplayed()).toEqual(true);
        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();

        await startProcessPage.startProcess(name, app.processName);
        await processListDemoPage.checkProcessIsDisplayed(name);
        await processFiltersPage.selectFromProcessList(name);

        await processDetailsPage.activeTask.click();
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
