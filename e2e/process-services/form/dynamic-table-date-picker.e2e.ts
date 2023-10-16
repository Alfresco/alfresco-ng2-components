/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService, ApplicationsUtil, LoginPage, ModelsActions, UsersActions, Widget, UserModel } from '@alfresco/adf-testing';
import { ProcessFiltersPage } from '../pages/process-filters.page';
import { ProcessServiceTabBarPage } from '../pages/process-service-tab-bar.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { browser } from 'protractor';

describe('Dynamic Table', () => {
    const loginPage = new LoginPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const navigationBarPage = new NavigationBarPage();
    const widget = new Widget();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const modelsActions = new ModelsActions(apiService);

    let user: UserModel;
    let tenantId: number;
    let appId: number;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();
        tenantId = user.tenantId;
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(tenantId);
    });

    describe('Required Dropdown', () => {
        const app = browser.params.resources.Files.APP_DYNAMIC_TABLE_DROPDOWN;
        const dropdown = widget.dropdown();

        beforeAll(async () => {
            await apiService.login(user.username, user.password);
            const applicationsService = new ApplicationsUtil(apiService);

            const importedApp = await applicationsService.importPublishDeployApp(app.file_path);
            appId = importedApp.id;
            await loginPage.login(user.username, user.password);
        });

        afterAll(async () => {
            await apiService.login(user.username, user.password);
            await modelsActions.deleteModel(appId);
        });

        beforeEach(async () => {
            await (await (await navigationBarPage.navigateToProcessServicesPage()).goToApp(app.title)).clickProcessButton();

            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCreateProcessButton();
            await processFiltersPage.clickNewProcessDropdown();
        });

        it('[C286519] Should be able to save row with required dropdown column', async () => {
            const dropdownOption = 'Option 1';
            await widget.dynamicTable().clickAddRow();
            await dropdown.selectOption(dropdownOption);
            await widget.dynamicTable().clickSaveButton();
            await widget.dynamicTable().checkItemIsPresent(dropdownOption);
        });
    });
});
