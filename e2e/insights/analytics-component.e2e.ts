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
import { AnalyticsPage } from '../pages/adf/process-services/analyticsPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { browser } from 'protractor';
import { Tenant } from '../models/APS/tenant';
import { User } from '../models/APS/user';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Analytics Smoke Test', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const analyticsPage = new AnalyticsPage();
    const processServicesPage = new ProcessServicesPage();
    let tenantId;
    const reportTitle = 'New Title';

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        const newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        tenantId = newTenant.id;
        const procUserModel = new User({ tenantId: tenantId });

        await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);

        await loginPage.loginToProcessServicesUsingUserModel(procUserModel);

    });

    afterAll(async () => {
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

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
