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
import DataTablePage = require('./pages/adf/dataTablePage.js');
import AcsUserModel = require('./models/ACS/acsUserModel.js');
import PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
import TestConfig = require('./test.config.js');

xdescribe('Test Datatable component', () => {

    let dataTablePage = new DataTablePage();
    let adfLoginPage = new AdfLoginPage();
    let acsUser = new AcsUserModel();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });

    beforeAll( (done) => {
        PeopleAPI.createUserViaAPI(adminUserModel, acsUser);
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        dataTablePage.goToDatatable();
        done();
    });

    it('1. DataTable allows extra rows to be added', () => {
        dataTablePage.getNumberOfRows().then(function (result) {
            dataTablePage.addRow();
            expect(dataTablePage.getNumberOfRows()).toEqual(result + 1);
            dataTablePage.addRow();
            expect(dataTablePage.getNumberOfRows()).toEqual(result + 2);
        });
    });

    it('2. Data Table can replace rows', () => {
        dataTablePage.replaceRows(1);
    });

    it('3. Data Table can replace columns', () => {
        dataTablePage.replaceColumns();
    });

});
