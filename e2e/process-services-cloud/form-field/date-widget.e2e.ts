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

import {
    LoginSSOPage,
    Widget,
    BrowserActions, FormPage
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { customDateFormAPS2 } from '../../resources/forms/custom-date-form';
import { FormCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/cloudFormDemoPage';

describe('Form Field Component - Dropdown Widget', () => {
    const loginSSOPage = new LoginSSOPage();
    const widget = new Widget();
    const dateWidget = widget.dateWidget();

    const formDemoPage = new FormCloudDemoPage();
    const formJson = JSON.parse(customDateFormAPS2);
    const formPage = new FormPage();

    beforeAll(async () => {
        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
    });

    beforeEach(async () => {
        const urlFormDemoPage = `${browser.params.testConfig.adf.url}/form-cloud`;
        await BrowserActions.getUrl(urlFormDemoPage);
    });

    it('[C313199] Should display the validation for min and max date values with custom date format', async () => {
        await formDemoPage.setConfigToEditor(formJson);
        await dateWidget.setDateInput('datefield', '18-7-19');
        await formPage.saveForm();
        await expect(await dateWidget.getErrorMessage('datefield'))
            .toBe('Can\'t be less than 19-7-19', 'Min date validation is not working');
        await dateWidget.clearDateInput('datefield');
        await dateWidget.setDateInput('datefield', '20-7-19');
        await formPage.saveForm();
        await expect(await dateWidget.getErrorMessage('datefield'))
            .toBe('Can\'t be greater than 19-8-19', 'Max date validation is not working');
        await dateWidget.clearDateInput('datefield');
        await dateWidget.setDateInput('datefield', '19-7-19');
        await formPage.saveForm();
        await dateWidget.checkErrorMessageIsNotDisplayed('datefield');
    });

});
