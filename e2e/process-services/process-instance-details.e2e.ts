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
import { ApiService, ApplicationsUtil, LoginPage, ProcessUtil, UsersActions } from '@alfresco/adf-testing';
import { ProcessServicesPage } from './pages/process-services.page';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { ProcessServiceTabBarPage } from './pages/process-service-tab-bar.page';
import { ProcessListPage } from './pages/process-list.page';
import { ProcessDetailsPage } from './pages/process-details.page';
import moment = require('moment');

describe('Process Instance Details', () => {

    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processListPage = new ProcessListPage();
    const processDetailsPage = new ProcessDetailsPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    let appModel, process, user;
    const PROCESS_DATE_FORMAT = 'll';

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        user = await usersActions.createUser();

        await apiService.login(user.email, user.password);

        appModel = await applicationsService.importPublishDeployApp(app.file_path);
        const processModel = await new ProcessUtil(apiService).startProcessOfApp(appModel.name);

        await loginPage.login(user.email, user.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp(app.title);
        await processServiceTabBarPage.clickProcessButton();
        await expect(await processListPage.isProcessListDisplayed()).toEqual(true);

        process = await apiService.getInstance().activiti.processApi.getProcessInstance(processModel.id);
   });

    afterAll(async () => {
        await apiService.getInstance().activiti.modelsApi.deleteModel(appModel.id);
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(user.tenantId);
   });

    it('[C307031] Should display the created date in the default format', async () => {
        await processDetailsPage.checkProcessHeaderDetailsAreVisible();
        await expect(await processDetailsPage.getCreated()).toEqual(moment(process.started).format(PROCESS_DATE_FORMAT));
    });
});
