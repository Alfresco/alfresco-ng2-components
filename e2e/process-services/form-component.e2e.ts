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

import { LoginPage, Widget, FormPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';

describe('Form Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formPage = new FormPage();
    const widget = new Widget();

    let tenantId, user;

    const fields = {
        dateWidgetId: 'label7',
        numberWidgetId: 'label4',
        amountWidgetId: 'label11'
    };

    const message = {
        test: 'Text Test',
        warningNumberAndAmount: 'Use a different number format',
        warningDate: 'D-M-YYYY',
        errorLogNumber: 'Error Label4 Use a different number format',
        errorLogDate: 'Error Label7 D-M-YYYY',
        errorLogAmount: 'Error Label11 Use a different number format',
        errorLabel: 'Error Label4'
    };

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        const users = new UsersActions();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        await navigationBarPage.navigateToProcessServicesFormPage();
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
    });

    it('[C286505] Should be able to display errors under the Error Log section', async () => {
        await widget.numberWidget().getNumberFieldLabel(fields.numberWidgetId);
        await widget.numberWidget().setFieldValue(fields.numberWidgetId, message.test);
        await formPage.checkErrorMessageForWidgetIsDisplayed(message.warningNumberAndAmount);
        await formPage.checkErrorLogMessage(message.errorLogNumber);

        await widget.dateWidget().checkLabelIsVisible(fields.dateWidgetId);
        await widget.dateWidget().setDateInput(fields.dateWidgetId, message.test);

        await formPage.saveForm();
        await formPage.checkErrorMessageForWidgetIsDisplayed(message.warningDate);
        await formPage.checkErrorLogMessage(message.errorLogDate);

        await widget.amountWidget().getAmountFieldLabel(fields.amountWidgetId);
        await widget.amountWidget().setFieldValue(fields.amountWidgetId, message.test);
        await formPage.checkErrorMessageForWidgetIsDisplayed(message.warningNumberAndAmount);
        await formPage.checkErrorLogMessage(message.errorLogAmount);

        await widget.amountWidget().removeFromAmountWidget(fields.amountWidgetId);
        await formPage.checkErrorMessageIsNotDisplayed(message.errorLogAmount);

        await widget.dateWidget().clearDateInput(fields.dateWidgetId);
        await widget.numberWidget().clearFieldValue(fields.numberWidgetId);
        await formPage.checkErrorMessageForWidgetIsNotDisplayed(message.warningDate);
        await formPage.checkErrorMessageIsNotDisplayed(message.errorLogDate);
        await formPage.checkErrorLogMessage(message.errorLabel);

    });
});
