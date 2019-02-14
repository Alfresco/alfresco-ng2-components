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
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Datatable component', () => {

    const dataTablePage = new DataTablePage();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();
    const dataTableComponent = new DataTableComponentPage();

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

    it('[C91314] Should be possible add new row to the table', () => {
        dataTableComponent.numberOfRows().then((result) => {
            dataTablePage.addRow();
            expect(dataTableComponent.numberOfRows()).toEqual(result + 1);
            dataTablePage.addRow();
            expect(dataTableComponent.numberOfRows()).toEqual(result + 2);
        });
    });

    it('[C260039] Should be possible replace rows', () => {
        dataTablePage.replaceRows(1);
    });

    it('[C260041] Should be possible replace columns', () => {
        dataTablePage.replaceColumns();
    });

    it('[C277314] Should filter the table rows when the input filter is passed', () => {
        expect(dataTableComponent.numberOfRows()).toEqual(4);
        dataTablePage.insertFilter('Name');
        expect(dataTableComponent.numberOfRows()).toEqual(3);
        dataTablePage.insertFilter('I');
        expect(dataTableComponent.numberOfRows()).toEqual(1);
    });

});
