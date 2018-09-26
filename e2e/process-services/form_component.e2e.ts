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
import { FormPage } from '../pages/adf/process_services/formPage';

import TestConfig = require('../test.config');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';

describe('Form Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formPage = new FormPage();

    let tenantId, user;

    let message = {
        test: 'Text Test',
        warningNumberAndAmount: 'Use a different number format',
        warningDate: 'D-M-YYYY',
        errorLogNumber: 'Error Label4 Use a different number format',
        errorLogDate: 'Error Label7 D-M-YYYY',
        errorLogAmount: 'Error Label11 Use a different number format',
        errorLabel: 'Error Label4'
    };

    beforeAll(async(done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        let users = new UsersActions();

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage.clickFormButton();

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C286505] Should be able to display errors under the Error Log section', () => {
        formPage.checkLabel4IsDisplayed();
        formPage.addIntoNumberWidget(message.test);
        formPage.checkErrorMessageForWidgetIsDisplayed(message.warningNumberAndAmount);
        formPage.checkErrorLogMessage(message.errorLogNumber);

        formPage.checkLabel7IsDisplayed();
        formPage.addIntoDateWidget(message.test);
        formPage.checkErrorMessageForWidgetIsDisplayed(message.warningDate);
        formPage.checkErrorLogMessage(message.errorLogDate);

        formPage.checkLabe11IsDisplayed();
        formPage.addIntoAmountWidget(message.test);
        formPage.checkErrorMessageForWidgetIsDisplayed(message.warningNumberAndAmount);
        formPage.checkErrorLogMessage(message.errorLogAmount);

        formPage.removeFromAmountWidget();
        formPage.checkErrorMessageIsNotDisplayed(message.errorLogAmount);

        formPage.removeFromDateWidget();
        formPage.removeFromNumberWidget();
        formPage.checkErrorMessageIsNotDisplayed(message.errorLogDate);
        formPage.checkErrorLogMessage(message.errorLabel);
    });
});
