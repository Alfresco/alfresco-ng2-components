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

import { LoginPage } from '../../pages/adf/loginPage';
import { SettingsPage } from '../../pages/adf/settingsPage';

describe('Login component - Remember Me', () => {

    let settingsPage = new SettingsPage();
    let loginPage = new LoginPage();

    beforeAll((done) => {
        settingsPage.setProviderEcmBpm();
        done();
    });

    it('[C260501] Should Remember me checkbox not be present in the login if the property showRememberMe is false', () => {
        loginPage.checkRememberIsDisplayed();
        loginPage.disableRememberMe();
        loginPage.checkRememberIsNotDisplayed();
    });
});
