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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudComponent } from '../pages/adf/process_cloud/appListCloudComponent';
import TestConfig = require('../test.config');
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

describe('Applications list', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudComponent();
    const path = '/auth/realms/springboot';
    const appName = 'task-app';

    it('[C289910] Should the app be displayed on dashboard when is deployed on APS', () => {

        settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path);
        loginSSOPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);

    });

});
