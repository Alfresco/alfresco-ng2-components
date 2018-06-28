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

import AdfLoginPage = require('./pages/adf/loginPage.js');
import AdfNavigationBarPage = require('./pages/adf/navigationBarPage.js');
import AdfAnalyticsPage = require('./pages/adf/process_services/analyticsPage');
import AdfProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
import AdfAppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage.js');
import TestConfig = require('./test.config.js');
import Tenant = require('./models/APS/Tenant');
import User = require('./models/APS/User');

import AlfrescoApi = require('alfresco-js-api-node');

fdescribe('Create smoke test for analytics', () => {

    let adfLoginPage = new AdfLoginPage();
    let adfNavigationBarPage = new AdfNavigationBarPage();
    let adfAppNavigationBarPage = new AdfAppNavigationBarPage();
    let adfAnalyticsPage = new AdfAnalyticsPage();
    let adfProcessServicesPage = new AdfProcessServicesPage();
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

        let userOne = await this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel);

        adfLoginPage.loginToProcessServicesUsingUserModel(procUserModel);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('Change name from Process Definition Heat Map', () => {
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfProcessServicesPage.goToApp('Task App');
        adfAppNavigationBarPage.clickReportsButton();
        adfAnalyticsPage.checkNoReportMessage();
        adfAnalyticsPage.getReport('Process definition heat map');
        adfAnalyticsPage.changeReportTitle(reportTitle);
        expect(adfAnalyticsPage.getReportTitle()).toEqual(reportTitle);
    });
});
