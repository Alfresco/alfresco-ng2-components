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
import { UsersActions } from '../actions/users.actions';
import { ProcessServicesPage } from '../pages/adf/process-services/process-services.page';
import { LoginSSOPage, ApplicationsUtil, ProcessUtil, ApiService } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/process-service-tab-bar.page';
import { ProcessListPage } from '../pages/adf/process-services/process-list.page';
import { ProcessDetailsPage } from '../pages/adf/process-services/process-details.page';
import moment = require('moment');

describe('Process Instance Details', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processListPage = new ProcessListPage();
    const processDetailsPage = new ProcessDetailsPage();
    const apiService = new ApiService();

    let appModel, process, user;
    const app = browser.params.resources.Files.SIMPLE_APP_WITH_USER_FORM;
    const PROCESS_DATE_FORMAT = 'll';

    beforeAll(async () => {
        const usersActions = new UsersActions(apiService);

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await usersActions.createUser();

        await apiService.getInstance().login(user.email, user.password);

        const applicationsService = new ApplicationsUtil(apiService);
        appModel = await applicationsService.importPublishDeployApp(app.file_path);
        const processModel = await new ProcessUtil(apiService).startProcessOfApp(appModel.name);

        await loginPage.login(user.email, user.password);

        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp(app.title);
        await processServiceTabBarPage.clickProcessButton();
        await processListPage.checkProcessListIsDisplayed();

        process = await apiService.getInstance().activiti.processApi.getProcessInstance(processModel.id);
   });

    afterAll(async () => {
        await apiService.getInstance().activiti.modelsApi.deleteModel(appModel.id);
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(user.tenantId);
   });

    it('[C307031] Should display the created date in the default format', async () => {
        await processDetailsPage.checkDetailsAreDisplayed();
        await expect(await processDetailsPage.getCreated()).toEqual(moment(process.started).format(PROCESS_DATE_FORMAT));
    });
});
