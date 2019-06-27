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

import { LoginPage, BrowserVisibility } from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { UsersActions } from '../../actions/users.actions';
import { FormFields } from '../../../lib/testing';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';
import { fieldVariablesForm } from '../../resources/forms/field-variable-visibility';
import { variableVisibilityForm } from '../../resources/forms/variable-visibility-condition';
import { fieldVisibilityForm } from '../../resources/forms/field-visibility-condition';
import { FormActions } from './formActions';

describe('Form Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formFields: FormFields = new FormFields();
    const configEditorPage = new ConfigEditorPage();
    const fieldVisibilityFormJson = JSON.parse(fieldVisibilityForm);
    const variableVisibilityFormJson = JSON.parse(variableVisibilityForm);
    const fieldVariablesFormJson = JSON.parse(fieldVariablesForm);
    const formActions = new FormActions();

    let tenantId, user;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf.url
        });

        const users = new UsersActions();

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        user = await users.createTenantAndUser(this.alfrescoJsApi);

        tenantId = user.tenantId;

        await this.alfrescoJsApi.login(user.email, user.password);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        navigationBarPage.clickFormCloudButton();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });
    it('[C309647] Should be able to see Checkbox widget when visibility condition refers to another field with specific value', () => {
        formFields.goToEditor();
        configEditorPage.clickClearButton();
        configEditorPage.enterBulkConfiguration(fieldVisibilityFormJson);
        configEditorPage.clickSaveButton();
        formFields.goToRenderedForm();
        const element = formActions.getElementById('Text0zfcc0');
        const checkbox = formActions.getElementById('Checkbox0clbgk');
        browser.sleep(2000);
        BrowserVisibility.waitUntilElementIsVisible(element);
        formActions.writeText(element, 'showCheck');
        BrowserVisibility.waitUntilElementIsVisible(checkbox);
    });

    it('[C309648] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', () => {
        formFields.goToEditor();
        configEditorPage.clickClearButton();
        configEditorPage.enterBulkConfiguration(variableVisibilityFormJson);
        configEditorPage.clickSaveButton();
        formFields.goToRenderedForm();
        let checkbox = formActions.getElementById('Checkbox0o7gb5');
        BrowserVisibility.waitUntilElementIsNotOnPage(checkbox);

        const visibileCheckbox = variableVisibilityFormJson;
        visibileCheckbox.formRepresentation.formDefinition.variables[0].value = true;

        formFields.goToEditor();
        configEditorPage.clickClearButton();
        configEditorPage.enterBulkConfiguration(JSON.stringify(visibileCheckbox));
        configEditorPage.clickSaveButton();

        formFields.goToRenderedForm();
        checkbox = formActions.getElementById('Checkbox0o7gb5');
        BrowserVisibility.waitUntilElementIsVisible(checkbox);
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a another field and form variable', () => {
        formFields.goToEditor();
        configEditorPage.clickClearButton();
        configEditorPage.enterBulkConfiguration(fieldVariablesFormJson);
        configEditorPage.clickSaveButton();
        formFields.goToRenderedForm();
        const element = formActions.getElementById('Text080j0t');
        let checkbox = formActions.getElementById('Checkbox0o7gb5');
        BrowserVisibility.waitUntilElementIsNotOnPage(checkbox);

        browser.sleep(1000);
        BrowserVisibility.waitUntilElementIsVisible(element);
        formActions.writeText(element, 'show');

        checkbox = formActions.getElementById('Checkbox0o7gb5');
        BrowserVisibility.waitUntilElementIsVisible(checkbox);
    });
});
