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

import { LoginPage, SettingsPage } from '@alfresco/adf-testing';

describe('Login component - Remember Me', () => {

    const settingsPage = new SettingsPage();
    const loginPage = new LoginPage();

    beforeAll(async () => {
        await loginPage.goToLoginPage();
        await loginPage.clickSettingsIcon();
        await settingsPage.setProviderEcmBpm();
    });

    it('[C260501] Should Remember me checkbox not be present in the login if the property showRememberMe is false', async () => {
        await loginPage.checkRememberIsDisplayed();
        await loginPage.disableRememberMe();
        await loginPage.checkRememberIsNotDisplayed();
    });
});
