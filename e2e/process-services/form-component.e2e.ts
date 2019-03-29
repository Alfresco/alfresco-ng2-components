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

import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { FormPage } from '../pages/adf/process-services/formPage';
import { DateWidget } from '../pages/adf/process-services/widgets/dateWidget';
import { AmountWidget } from '../pages/adf/process-services/widgets/amountWidget';
import { NumberWidget } from '../pages/adf/process-services/widgets/numberWidget';
import TestConfig = require('../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';

describe('Form Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formPage = new FormPage();
    const dateWidget = new DateWidget();
    const amountWidget = new AmountWidget();
    const numberWidget = new NumberWidget();

    let tenantId, user;

    let fields = {
        dateWidgetId: 'label7',
        numberWidgetId: 'label4',
        amountWidgetId: 'label11'
    };

    let message = {
        test: 'Text Test',
        warningNumberAndAmount: 'Use a different number format',
        warningDate: 'D-M-YYYY',
        errorLogNumber: 'Error Label4 Use a different number format',
        errorLogDate: 'Error Label7 D-M-YYYY',
        errorLogAmount: 'Error Label11 Use a different number format',
        errorLabel: 'Error Label4'
    };

    beforeAll(async (done) => {
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

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);

        done();
    });

    it('[C286505] Should be able to display errors under the Error Log section', () => {
        numberWidget.getNumberFieldLabel(fields.numberWidgetId);
        numberWidget.setFieldValue(fields.numberWidgetId, message.test);
        formPage.checkErrorMessageForWidgetIsDisplayed(message.warningNumberAndAmount);
        formPage.checkErrorLogMessage(message.errorLogNumber);

        dateWidget.checkLabelIsVisible(fields.dateWidgetId);
        dateWidget.setDateInput(fields.dateWidgetId, message.test);
        dateWidget.clickOutsideWidget(fields.dateWidgetId);
        formPage.checkErrorMessageForWidgetIsDisplayed(message.warningDate);
        formPage.checkErrorLogMessage(message.errorLogDate);

        amountWidget.getAmountFieldLabel(fields.amountWidgetId);
        amountWidget.setFieldValue(fields.amountWidgetId, message.test);
        formPage.checkErrorMessageForWidgetIsDisplayed(message.warningNumberAndAmount);
        formPage.checkErrorLogMessage(message.errorLogAmount);

        amountWidget.removeFromAmountWidget(fields.amountWidgetId);
        formPage.checkErrorMessageIsNotDisplayed(message.errorLogAmount);

        dateWidget.clearDateInput(fields.dateWidgetId);
        numberWidget.clearFieldValue(fields.numberWidgetId);
        formPage.checkErrorMessageForWidgetIsNotDisplayed(message.warningDate);
        formPage.checkErrorMessageIsNotDisplayed(message.errorLogDate);
        formPage.checkErrorLogMessage(message.errorLabel);
    });
});
