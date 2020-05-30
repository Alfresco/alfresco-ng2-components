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

import { ApiService, LoginSSOPage, UserModel } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { IconsPage } from '../pages/adf/icons.page';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';

describe('Universal Icon component', () => {

    const loginPage = new LoginSSOPage();
    const acsUser = new UserModel();
    const navigationBarPage = new NavigationBarPage();
    const iconsPage = new IconsPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await usersActions.createUser(acsUser);
        await loginPage.login(acsUser.id, acsUser.password);
   });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await navigationBarPage.clickIconsButton();
   });

    it('[C291872] Should display the icons on the page', async () => {
        await expect(await iconsPage.isLigatureIconDisplayed('folder')).toBe(true, 'Ligature icon is not displayed');
        await expect(await iconsPage.isCustomIconDisplayed('adf:move_file')).toBe(true, 'Named icon is not displayed');
        await expect(await iconsPage.isCustomIconDisplayed('adf:folder')).toBe(true, 'Thumbnail service icon is not displayed');
    });
});
