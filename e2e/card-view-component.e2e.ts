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

 import LoginPage = require('./pages/adf/loginPage');
 import NavigationBarPage = require('./pages/adf/navigationBarPage');
 import TestConfig = require('./test.config');
 import resources = require('./util/resources');
 import AlfrescoApi = require('alfresco-js-api-node');
 import { UsersActions } from './actions/users.actions';
 import { AppsActions } from './actions/APS/apps.actions';
 import CardViewPageComponent = require('./pages/adf/cardViewPageComponent');
 import Util = require('./util/util');

 describe('CardView Component', () => {
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const cardViewPageComponent = new CardViewPageComponent();
    const app = resources.Files.APP_WITH_PROCESSES;

    beforeAll(async (done) => {
        const apps = new AppsActions();
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    beforeEach(() => {
        Util.refreshBrowser();
    });

    it('[C279898] Register pairs values', () => {
        navigationBarPage.clickCardViewButton();
        cardViewPageComponent.clickOnAddButton();
        cardViewPageComponent.setName('testName');
        cardViewPageComponent.setValue('testValue');
        cardViewPageComponent.clickOnAddButton();
        cardViewPageComponent.waitForOutput();
        expect(cardViewPageComponent.getOutputText(0))
         .toBe('[CardView Key-Value Pairs Item] - [{"name":"testName","value":"testValue"}]');

    });

    it('[C279898] Delete pairs values', () => {
        navigationBarPage.clickCardViewButton();
        cardViewPageComponent.clickOnAddButton();
        cardViewPageComponent.setName('testName');
        cardViewPageComponent.setValue('testValue');
        cardViewPageComponent.clickOnAddButton();
        cardViewPageComponent.waitForOutput();
        expect(cardViewPageComponent.getOutputText(0))
         .toBe('[CardView Key-Value Pairs Item] - [{"name":"testName","value":"testValue"}]');
        cardViewPageComponent.deletePairsValues();
        expect(cardViewPageComponent.getOutputText(1))
        .toBe('[CardView Key-Value Pairs Item] - []');
        cardViewPageComponent.checkNameAndValueVisibility(0);
    });

    it('[C279899] Check default value ', () => {
        navigationBarPage.clickCardViewButton();
        cardViewPageComponent.clickComboBox();
        expect(cardViewPageComponent.getSelectionValue()).toBe('One');

    });

    it('[C279899] Select combobox values', () => {
        navigationBarPage.clickCardViewButton();
        cardViewPageComponent.clickComboBox();
        cardViewPageComponent.selectValueFromComboBox(1);
        expect(cardViewPageComponent.getOutputText(0))
         .toBe('[CardView Select Item] - two');

    });

  });
