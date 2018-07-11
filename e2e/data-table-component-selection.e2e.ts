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

import LoginPage = require('./pages/adf/loginPage');
import DataTablePage = require('./pages/adf/dataTablePage');
import TestConfig = require('./test.config');

import AcsUserModel = require('./models/ACS/acsUserModel');
import AlfrescoApi = require('alfresco-js-api-node');

describe('Datatable component - selection', () => {

    let dataTablePage = new DataTablePage();
    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        dataTablePage.goToDatatable();

        done();
    });

    it('1. Data Table Selection Modes', () => {
        dataTablePage.selectRow('2');
        dataTablePage.checkRowIsSelected('2');
        dataTablePage.getNumberOfSelectedRows().then(function (result) {
            expect(result).toEqual(1);
        });
        dataTablePage.selectRow('3');
        dataTablePage.checkRowIsSelected('3');
        dataTablePage.getNumberOfSelectedRows().then(function (result) {
            expect(result).toEqual(1);
        });
        dataTablePage.selectSelectionMode('Multiple');
        dataTablePage.selectRow('1');
        dataTablePage.checkRowIsSelected('1');
        dataTablePage.selectRowWithKeyboard('3');
        dataTablePage.checkRowIsSelected('1');
        dataTablePage.checkRowIsSelected('3');
        dataTablePage.checkRowIsNotSelected('2');
        dataTablePage.checkRowIsNotSelected('4');
        dataTablePage.selectSelectionMode('None');
        dataTablePage.selectRow('1');
        dataTablePage.checkNoRowIsSelected();
    });

    it('2. Data Table allows the multiselection of rows', () => {
        dataTablePage.clickMultiSelect();
        dataTablePage.clickCheckbox('1');
        dataTablePage.checkRowIsChecked('1');
        dataTablePage.clickCheckbox('3');
        dataTablePage.checkRowIsChecked('3');
        dataTablePage.checkRowIsNotChecked('2');
        dataTablePage.checkRowIsNotChecked('4');
        dataTablePage.clickCheckbox('3');
        dataTablePage.checkRowIsNotChecked('3');
        dataTablePage.checkRowIsChecked('1');
    });

    it('3. Can select all in data table', () => {
        dataTablePage.checkAllRows();
        dataTablePage.checkRowIsChecked('1');
        dataTablePage.checkRowIsChecked('2');
        dataTablePage.checkRowIsChecked('3');
        dataTablePage.checkRowIsChecked('4');
    });
});
