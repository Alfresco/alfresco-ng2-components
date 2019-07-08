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

import { LoginPage, Widget, DatePickerPage } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/adf/process-services/processFiltersPage';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/processServiceTabBarPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';

describe('Dynamic Table', () => {

    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const datePicker = new DatePickerPage();
    const navigationBarPage = new NavigationBarPage();
    const widget = new Widget();
    let user, tenantId, appId, apps, users;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf.url
        });

        apps = new AppsActions();
        users = new UsersActions();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    describe('Date Picker', () => {
        const app = resources.Files.DYNAMIC_TABLE_APP;

        const randomText = {
            date: '12/12/2012',
            wrongDate: 'HELLO WORLD',
            dateTime: 'Test',
            error: `Invalid 'columnDate' format.`
        };

        const rowPosition = 0;

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(user.email, user.password);

            const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
            appId = importedApp.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(user.email, user.password);

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesPage().goToTaskApp().clickProcessButton();

            processServiceTabBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286277] Should have a datepicker and a mask for DateTime field', () => {
            widget.dynamicTable().clickAddButton();
            widget.dynamicTable().clickColumnDateTime();

            expect(widget.dynamicTable().addRandomStringOnDateTime(randomText.dateTime)).toBe('');
        });

        it('[C286279] Should be able to save row with Date field', () => {
            widget.dynamicTable().clickAddButton();
            widget.dynamicTable().addRandomStringOnDate(randomText.wrongDate);
            widget.dynamicTable().clickSaveButton();

            expect(widget.dynamicTable().checkErrorMessage()).toBe(randomText.error);

            widget.dynamicTable().clickDateWidget();
            datePicker.selectTodayDate()
                .checkDatePickerIsNotDisplayed();
            widget.dynamicTable().clickSaveButton();
            widget.dynamicTable().getTableRow(rowPosition);
        });
    });

    describe('Required Dropdown', () => {
        const app = resources.Files.APP_DYNAMIC_TABLE_DROPDOWN;
        const dropdown = widget.dropdown();

        beforeAll(async (done) => {

            await this.alfrescoJsApi.login(user.email, user.password);

            const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
            appId = importedApp.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(user.email, user.password);

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

            done();
        });

        beforeEach(() => {
            navigationBarPage.navigateToProcessServicesPage().goToApp(app.title).clickProcessButton();

            processServiceTabBarPage.clickProcessButton();

            processFiltersPage.clickCreateProcessButton();
            processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286519] Should be able to save row with required dropdown column', () => {
            const dropdownOption = 'Option 1';
            widget.dynamicTable().clickAddButton();
            dropdown.selectOption(dropdownOption);
            widget.dynamicTable().clickSaveButton();
            widget.dynamicTable().checkItemIsPresent(dropdownOption);
        });
    });

});
