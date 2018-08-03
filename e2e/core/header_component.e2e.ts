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
import LoginPage = require('../pages/adf/loginPage');
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import { HeaderPage } from '../pages/adf/core/headerPage';

import TestConfig = require('../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';

describe('Header Component', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let headerPage = new HeaderPage();
    let user, tenantId;
    let title = {
        default: 'ADF Demo Application',
        custom: 'New Test App'
    };

    let urlPath = {
        default: './assets/images/logo.png',
        custom: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flower_jtca001.jpg'
    };

    let color = {
        primary: 'primary',
        accent: 'accent'
    };

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        done();
    });

    beforeEach(async(done) => {
        let users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        await navigationBarPage.clickHeaderDataButton();

        done();
    });

    afterEach(async(done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C280002] Should be able to view Header component', () => {
        headerPage.checkShowMenuCheckBoxIsDisplayed();
        headerPage.checkChooseHeaderColourIsDisplayed();
        headerPage.checkChangeTitleIsDisplayed();
        headerPage.checkChangeUrlPathIsDisplayed();

    });

    it('[C279996] Should be able to show/hide menu button', () => {
        headerPage.clickShowMenuButton();

        navigationBarPage.checkMenuButtonIsNotDisplayed();

        headerPage.clickShowMenuButton();

        navigationBarPage.checkMenuButtonIsDisplayed();
    });

    it('[C279999]Should be able to change the colour between primary and accent', () => {
        headerPage.changeHeaderColor(color.accent);

        navigationBarPage.checkToolbarColor(color.accent);

        headerPage.changeHeaderColor(color.primary);

        navigationBarPage.checkToolbarColor(color.primary);
    });

    it('[C279997] Should be able to change the title of the app', () => {
        headerPage.checkAppTitle(title.default);
        headerPage.addTitle(title.custom);
        headerPage.checkAppTitle(title.custom);
    });

    it('[C279998] Should be able to change the default logo of the app', () => {
        headerPage.checkIconIsDisplayed(urlPath.default);
        headerPage.addIcon(urlPath.custom);
        headerPage.checkIconIsDisplayed(urlPath.custom);
    });
});
