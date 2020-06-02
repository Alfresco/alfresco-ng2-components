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

import { ApiService, LoginSSOPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { AnalyticsPage } from '../pages/adf/process-services/analytics.page';
import { ProcessServicesPage } from '../pages/adf/process-services/process-services.page';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/process-service-tab-bar.page';
import { browser } from 'protractor';
import { Tenant } from '../models/APS/tenant';
import { User } from '../models/APS/user';

describe('Analytics Smoke Test', () => {

    const loginPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const analyticsPage = new AnalyticsPage();
    const processServicesPage = new ProcessServicesPage();
    let tenantId;
    const reportTitle = 'New Title';
    const alfrescoJsApi = new ApiService().apiService;

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        const newTenant = await alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        tenantId = newTenant.id;
        const procUserModel = new User({ tenantId: tenantId });

        await alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);

        await loginPage.login(procUserModel.email, procUserModel.password);
   });

    afterAll(async () => {
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
   });

    it('[C260346] Should be able to change title of a report', async () => {
        await navigationBarPage.navigateToProcessServicesPage();
        await processServicesPage.checkApsContainer();
        await processServicesPage.goToApp('Task App');
        await processServiceTabBarPage.clickReportsButton();
        await analyticsPage.checkNoReportMessage();
        await analyticsPage.getReport('Process definition heat map');
        await analyticsPage.changeReportTitle(reportTitle);
        await expect(await analyticsPage.getReportTitle()).toEqual(reportTitle);
    });
});
