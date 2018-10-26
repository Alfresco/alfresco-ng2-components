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
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import ProcessFiltersPage = require('../pages/adf/process_services/processFiltersPage');
import { AppNavigationBarPage } from '../pages/adf/process_services/appNavigationBarPage';
import { DynamicTableWidget } from '../pages/adf/process_services/widgets/dynamicTableWidget';
import { DropdownWidget } from '../pages/adf/process_services/widgets/dropdownWidget';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Dynamic Table', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processFiltersPage = new ProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let dynamicTable = new DynamicTableWidget();
    let user, tenantId, appId, apps, users;

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        apps = new AppsActions();
        users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    describe('Date Picker', () => {
        let app = resources.Files.DYNAMIC_TABLE_APP;

        let randomText = {
            date: 'HELLO WORLD',
            dateTime: 'Test',
            error: `Field 'columnDate' is required.`
        };

        let datePosition = 15;
        let rowPosition = 0;

        beforeAll(async(done) => {
            await this.alfrescoJsApi.login(user.email, user.password);

            let importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
            appId = importedApp.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();
        });

        afterAll(async(done) => {
            await this.alfrescoJsApi.login(user.email, user.password);

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            done();
        });

        beforeEach(() => {
            processServicesPage.goToProcessServices().goToTaskApp().clickProcessButton();

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286277] Should have a datepicker and a mask for DateTime field', () => {
            dynamicTable.clickAddButton();
            dynamicTable.clickColumnDateTime();

            expect(dynamicTable.addRandomStringOnDateTime(randomText.dateTime)).toBe('');
        });

        it('[C286279] Should be able to save row with Date field', () => {
            dynamicTable.clickAddButton();
            dynamicTable.addRandomStringOnDate(randomText.date);
            dynamicTable.clickSaveButton();

            expect(dynamicTable.checkErrorMessage()).toBe(randomText.error);

            dynamicTable.clickDateWidget();
            dynamicTable.getDateCalendarNumber(datePosition);
            dynamicTable.waitForCalendarToDisappear();
            dynamicTable.clickSaveButton();
            dynamicTable.getTableRow(rowPosition);
        });
    });

    describe('Required Dropdown', () => {
        let app = resources.Files.APP_DYNAMIC_TABLE_DROPDOWN;
        let dropdown = new DropdownWidget();

        beforeAll(async(done) => {

            await this.alfrescoJsApi.login(user.email, user.password);

            let importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
            appId = importedApp.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();
        });

        afterAll(async(done) => {
            await this.alfrescoJsApi.login(user.email, user.password);

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            done();
        });

        beforeEach(() => {
            processServicesPage.goToProcessServices().goToApp(app.title).clickProcessButton();

            appNavigationBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286519] Should be able to save row with required dropdown column', () => {
            let dropdownOption = 'Option 1';
            dynamicTable.clickAddButton();
            dropdown.selectOption(dropdownOption);
            dynamicTable.clickSaveButton();
            dynamicTable.checkItemIsPresent(dropdownOption);
        });
    });

});
