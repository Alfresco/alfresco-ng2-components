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

import { LoginPage, Widget, DatePickerPage, DateUtil } from '@alfresco/adf-testing';
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

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        apps = new AppsActions();
        users = new UsersActions();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

    });

    describe('Date Picker', () => {
        const app = resources.Files.DYNAMIC_TABLE_APP;

        const randomText = {
            date: '12/12/2012',
            wrongDate: 'HELLO WORLD',
            wrongDateTime: 'Test',
            dateTime: '15/07/2019 23:55',
            error: `Invalid 'columnDate' format.`,
            requiredError: `Field 'columnDate' is required.`
        };
        const currentDate = DateUtil.formatDate('DD-MM-YYYY');
        const rowPosition = 0;

        beforeAll(async () => {
            await this.alfrescoJsApi.login(user.email, user.password);

            const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
            appId = importedApp.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);
        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(user.email, user.password);

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);
        });

        beforeEach(async () => {
            await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickProcessButton();

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286277] Should have a datepicker and a mask for DateTime field', async () => {
            await widget.dynamicTable().clickAddButton();
            await widget.dynamicTable().clickColumnDateTime();

            await expect(await widget.dynamicTable().addRandomStringOnDateTime(randomText.wrongDateTime)).toBe('');
        });

        it('[C286279] Should be able to save row with Date field', async () => {
            await widget.dynamicTable().clickAddButton();
            await widget.dynamicTable().addRandomStringOnDate(randomText.wrongDate);
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().checkErrorMessage()).toBe(randomText.error);

            await widget.dynamicTable().clickDateWidget();
            await datePicker.selectTodayDate();
            await datePicker.checkDatePickerIsNotDisplayed();
            await widget.dynamicTable().clickSaveButton();
            await widget.dynamicTable().getTableRow(rowPosition);
            await expect(await widget.dynamicTable().getTableCellText(rowPosition, 1)).toBe(currentDate);
        });

        it('[C311456] Should be able to delete date that is not mandatory and save the Dynamic Table', async () => {
            await widget.dynamicTable().clickAddButton();
            await widget.dynamicTable().clickSaveButton();
            await expect(await widget.dynamicTable().checkErrorMessage()).toBe(randomText.requiredError);

            await widget.dynamicTable().clickDateWidget();
            await datePicker.selectTodayDate();
            await datePicker.checkDatePickerIsNotDisplayed();
            await widget.dynamicTable().clickSaveButton();
            await widget.dynamicTable().getTableRow(rowPosition);
            await expect(await widget.dynamicTable().getTableCellText(rowPosition, 1)).toBe(currentDate);
            await expect(await widget.dynamicTable().getTableCellText(rowPosition, 2)).toBe('');
        });
    });

    describe('Required Dropdown', () => {
        const app = resources.Files.APP_DYNAMIC_TABLE_DROPDOWN;
        const dropdown = widget.dropdown();

        beforeAll(async () => {

            await this.alfrescoJsApi.login(user.email, user.password);

            const importedApp = await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);
            appId = importedApp.id;

            await loginPage.loginToProcessServicesUsingUserModel(user);

        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(user.email, user.password);

            await this.alfrescoJsApi.activiti.modelsApi.deleteModel(appId);

        });

        beforeEach(async () => {
            await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickProcessButton();

            await processServiceTabBarPage.clickProcessButton();

            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286519] Should be able to save row with required dropdown column', async () => {
            const dropdownOption = 'Option 1';
            await widget.dynamicTable().clickAddButton();
            await dropdown.selectOption(dropdownOption);
            await widget.dynamicTable().clickSaveButton();
            await widget.dynamicTable().checkItemIsPresent(dropdownOption);
        });
    });

});
