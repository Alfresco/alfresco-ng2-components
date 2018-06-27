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
import TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');
import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');
import UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
import Tenant = require('./models/APS/Tenant');
import User = require('./models/APS/User');

describe('Create smoke test for analytics', () => {

    let adfLoginPage = new AdfLoginPage();
    let adfNavigationBarPage = new AdfNavigationBarPage();
    let adfAppNavigationBarPage = new AdfAppNavigationBarPage();
    let adfAnalyticsPage = new AdfAnalyticsPage();
    let adfProcessServicesPage = new AdfProcessServicesPage();
    let tenantsAPI = new TenantsAPI();
    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let tenantId, procUserModel;
    let reportTitle = 'New Title';

    beforeAll((done) => {
        protractor.promise.all([
            tenantsAPI.createTenant(basicAuthAdmin, new Tenant())
                .then(function (result) {
                    tenantId = JSON.parse(result.responseBody).id;
                    procUserModel = new User({ tenantId: tenantId });
                    return new UserAPI().createUser(basicAuthAdmin, procUserModel);
                })
        ]).then(() => {
            adfLoginPage.loginToProcessServicesUsingUserModel(procUserModel);
        }).then(() => {
            done();
        });
    });

    afterAll((done) => {
        tenantsAPI.deleteTenant(basicAuthAdmin, tenantId.toString())
            .then(() => {
                done();
            });
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
