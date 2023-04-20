/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService, FormPage, LoginPage, UsersActions, Widget } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Form Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formPage = new FormPage();
    const widget = new Widget();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let tenantId; let user;

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
        await apiService.loginWithProfile('admin');

        user = await usersActions.createUser();

        tenantId = user.tenantId;

        await apiService.login(user.username, user.password);

        await loginPage.login(user.username, user.password);

        await navigationBarPage.navigateToProcessServicesFormPage();
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.deleteTenant(tenantId);
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
