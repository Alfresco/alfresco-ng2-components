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

var AdfLoginPage = require('./pages/adf/loginPage.js');
var AdfNavigationBarPage = require('./pages/adf/navigationBarPage.js');
var AdfAnalyticsPage = require('./pages/adf/process_services/analyticsPage');
var AdfProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
var AdfAppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage.js');
var TestConfig = require('./test.config.js');
var TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');
var BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');
var UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
var Tenant = require('./models/APS/Tenant');
var User = require('./models/APS/User');

describe('Create smoke test for analytics', () => {

    var adfLoginPage = new AdfLoginPage();
    var adfNavigationBarPage = new AdfNavigationBarPage();
    var adfAppNavigationBarPage = new AdfAppNavigationBarPage();
    var adfAnalyticsPage = new AdfAnalyticsPage();
    var adfProcessServicesPage = new AdfProcessServicesPage();
    var tenantsAPI = new TenantsAPI();
    var basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    var tenantId, procUserModel;
    var reportTitle = 'New Title';

    beforeAll(function (done) {
        protractor.promise.all([
            tenantsAPI.createTenant(basicAuthAdmin, new Tenant())
                .then(function (result) {
                    tenantId = JSON.parse(result.responseBody).id;
                    procUserModel = new User({ tenantId: tenantId });
                    return new UserAPI().createUser(basicAuthAdmin, procUserModel)
                })
        ]).then(() => {
            adfLoginPage.loginToProcessServicesUsingUserModel(procUserModel);
        }).then(() => {
            done();
        });
    });

    afterAll(function (done) {
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
