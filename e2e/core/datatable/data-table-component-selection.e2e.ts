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

import { LoginPage } from '../../pages/adf/loginPage';
import { DataTablePage } from '../../pages/adf/demo-shell/dataTablePage';
import { DataTableComponentPage } from '../../pages/adf/dataTableComponentPage';
import TestConfig = require('../../test.config');

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import AlfrescoApi = require('alfresco-js-api-node');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Datatable component - selection', () => {

    let dataTablePage = new DataTablePage();
    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();
    let navigationBarPage = new NavigationBarPage();
    let dataTableComponent = new DataTableComponentPage();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBarPage.navigateToDatatable();

        done();
    });

    it('[C213258] Should be possible change the selection modes when change the selectionMode property', () => {
        dataTablePage.selectRow('2');
        dataTableComponent.checkRowIsSelected('Id', '2');
        dataTablePage.getNumberOfSelectedRows().then((result) => {
            expect(result).toEqual(1);
        });
        dataTablePage.selectRow('3');
        dataTableComponent.checkRowIsSelected('Id', '3');
        dataTablePage.getNumberOfSelectedRows().then((result) => {
            expect(result).toEqual(1);
        });
        dataTablePage.selectSelectionMode('Multiple');
        dataTablePage.selectRow('1');
        dataTableComponent.checkRowIsSelected('Id', '1');
        dataTablePage.selectRowWithKeyboard('3');
        dataTableComponent.checkRowIsSelected('Id', '1');
        dataTableComponent.checkRowIsSelected('Id', '3');
        dataTablePage.checkRowIsNotSelected('2');
        dataTablePage.checkRowIsNotSelected('4');
        dataTablePage.selectSelectionMode('None');
        dataTablePage.selectRow('1');
        dataTablePage.checkNoRowIsSelected();
    });

    it('[C260059] Should be possible select multiple row when multiselect is true', () => {
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

    it('[C260058] Should be possible select all the rows when multiselect is true', () => {
        dataTablePage.checkAllRows();
        dataTablePage.checkRowIsChecked('1');
        dataTablePage.checkRowIsChecked('2');
        dataTablePage.checkRowIsChecked('3');
        dataTablePage.checkRowIsChecked('4');
    });

    it('[C277262] Should be possible reset the selected row when click on the reset button', () => {
        dataTablePage.checkRowIsChecked('1');
        dataTablePage.checkRowIsChecked('2');
        dataTablePage.checkRowIsChecked('3');
        dataTablePage.checkRowIsChecked('4');
        dataTablePage.clickReset();
        dataTablePage.checkNoRowIsSelected();
    });
});
