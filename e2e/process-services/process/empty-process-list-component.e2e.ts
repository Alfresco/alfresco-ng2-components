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

import { browser } from 'protractor';
import { createApiService, ApplicationsUtil, LoginPage, StartProcessPage, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ProcessServicesPage } from './../pages/process-services.page';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { ProcessDetailsPage } from './../pages/process-details.page';
import { ProcessListPage } from './../pages/process-list.page';

describe('Empty Process List Test', () => {

    const appWithProcess = browser.params.resources.Files.APP_WITH_PROCESSES;
    const simpleAppWithUserForm = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processDetailsPage = new ProcessDetailsPage();
    const processListPage = new ProcessListPage();
    const startProcessPage = new StartProcessPage();
    const apiService = createApiService();

    let user;

    beforeAll(async () => {
        const usersActions = new UsersActions(apiService);

        await apiService.loginWithProfile('admin');

        const applicationsService = new ApplicationsUtil(apiService);

        user = await usersActions.createUser();

        await apiService.login(user.username, user.password);

        await applicationsService.importPublishDeployApp(appWithProcess.file_path);
        await applicationsService.importPublishDeployApp(simpleAppWithUserForm.file_path);

        await loginPage.login(user.username, user.password);
   });

    it('[C260494] Should add process to list when a process is created', async () => {
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await (await processServicesPage.goToApp(appWithProcess.title)).clickProcessButton();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
        await expect(await processDetailsPage.checkProcessDetailsMessage()).toEqual('No process details found');

        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();
        await processFiltersPage.checkStartProcessIsDisplay();
        await startProcessPage.selectFromProcessDropdown(appWithProcess.process_wse_name);
        await startProcessPage.clickStartProcessButton();

        await expect(await processFiltersPage.numberOfProcessRows()).toEqual(1);

        await processDetailsPage.propertiesList.waitVisible();
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await (await processServicesPage.goToApp(simpleAppWithUserForm.title)).clickProcessButton();
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
        await expect(await processDetailsPage.checkProcessDetailsMessage()).toEqual('No process details found');

        await processFiltersPage.clickCreateProcessButton();
        await processFiltersPage.clickNewProcessDropdown();
        await processFiltersPage.checkStartProcessIsDisplay();
        await startProcessPage.selectFromProcessDropdown(simpleAppWithUserForm.processName);
        await startProcessPage.clickStartProcessButton();

        await expect(await processFiltersPage.numberOfProcessRows()).toEqual(1);

        await processDetailsPage.propertiesList.waitVisible();
    });
});
