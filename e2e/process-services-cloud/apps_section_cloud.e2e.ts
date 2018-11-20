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

import { LoginAPSPage } from '../pages/adf/loginApsPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudComponent } from '../pages/adf/process_services_cloud/appListCloudComponent';
import TestConfig = require('../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/NavigationBarPage';

describe('Applications list', () => {

    const settingsPage = new SettingsPage();
    const loginApsPage = new LoginAPSPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudComponent();
    const path = '/auth/realms/springboot';
    const appName = 'task-app';

    it ('[C289910] Should the app be displayed on dashboard when is deployed on APS', async () => {

        await settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path);
        browser.ignoreSynchronization = true;
        await loginApsPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await navigationBarPage.clickProcessCloudButton();

        appListCloudComponent.checkApsContainer();

        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);

    });

});
