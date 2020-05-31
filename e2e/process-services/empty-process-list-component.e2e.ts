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
import { LoginSSOPage, ApplicationsUtil, StartProcessPage, ApiService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { ProcessServicesPage } from '../pages/adf/process-services/process-services.page';
import { ProcessFiltersPage } from '../pages/adf/process-services/process-filters.page';
import { ProcessDetailsPage } from '../pages/adf/process-services/process-details.page';
import { ProcessListPage } from '../pages/adf/process-services/process-list.page';
import { UsersActions } from '../actions/users.actions';

describe('Empty Process List Test', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processDetailsPage = new ProcessDetailsPage();
    const processListPage = new ProcessListPage();
    const startProcessPage = new StartProcessPage();
    const apiService = new ApiService();

    const appA = browser.params.resources.Files.APP_WITH_PROCESSES;
    const appB = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    let user;

    beforeAll(async () => {
        const usersActions = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        const applicationsService = new ApplicationsUtil(apiService);

        user = await usersActions.createUser();

        await apiService.getInstance().login(user.email, user.password);

        await applicationsService.importPublishDeployApp(appA.file_path);
        await applicationsService.importPublishDeployApp(appB.file_path);

        await loginPage.login(user.email, user.password);
   });

    it('[C260494] Should add process to list when a process is created', async () => {
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await (await processServicesPage.goToApp(appA.title)).clickProcessButton();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
        await expect(await processDetailsPage.checkProcessDetailsMessage()).toEqual('No process details found');

        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();
        await startProcessPage.selectFromProcessDropdown(appA.process_wse_name);
        await startProcessPage.clickStartProcessButton();
        await expect(await processFiltersPage.numberOfProcessRows()).toEqual(1);

        await processDetailsPage.checkProcessDetailsCard();
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await (await processServicesPage.goToApp(appB.title)).clickProcessButton();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
        await expect(await processDetailsPage.checkProcessDetailsMessage()).toEqual('No process details found');

        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();
        await startProcessPage.selectFromProcessDropdown(appB.processName);
        await startProcessPage.clickStartProcessButton();

        await expect(await processFiltersPage.numberOfProcessRows()).toEqual(1);

        await processDetailsPage.checkProcessDetailsCard();
    });
});
