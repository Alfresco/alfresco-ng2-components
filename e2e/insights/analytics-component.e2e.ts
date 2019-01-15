/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { AnalyticsPage } from '../pages/adf/process-services/analyticsPage';
import { ProcessServicesPage } from '../pages/adf/process-services/processServicesPage';
import { AppNavigationBarPage } from '../pages/adf/process-services/appNavigationBarPage';
import TestConfig = require('../test.config');
import { Tenant } from '../models/APS/tenant';
import { User } from '../models/APS/user';

import AlfrescoApi = require('alfresco-js-api-node');
import { browser } from 'protractor';

describe('Analytics Smoke Test', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let analyticsPage = new AnalyticsPage();
    let processServicesPage = new ProcessServicesPage();
    let tenantId;
    let reportTitle = 'New Title';

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        tenantId = newTenant.id;
        let procUserModel = new User({ tenantId: tenantId });

        await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);

        loginPage.loginToProcessServicesUsingUserModel(procUserModel);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C260346] Should be able to change title of a report', () => {
        navigationBarPage.navigateToProcessServicesPage();
        processServicesPage.checkApsContainer();
        processServicesPage.goToApp('Task App');
        appNavigationBarPage.clickReportsButton();
        analyticsPage.checkNoReportMessage();
        analyticsPage.getReport('Process definition heat map');
        analyticsPage.changeReportTitle(reportTitle);
        expect(analyticsPage.getReportTitle()).toEqual(reportTitle);
    });
});
