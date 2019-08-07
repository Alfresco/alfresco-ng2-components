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

import { LoginPage, Widget } from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { UsersActions } from '../../actions/users.actions';
import { FormCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/cloudFormDemoPage';
import { checkboxVisibilityForm } from '../../resources/forms/checkbox-visibility-condition';

describe('Visibility conditions - cloud', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formCloudDemoPage = new FormCloudDemoPage();
    const checkboxVisibilityFormJson = JSON.parse(checkboxVisibilityForm);
    const widget = new Widget();

    let tenantId, user;
    let visibleCheckbox;

    const widgets = {
        textOneId: 'textOne',
        textTwoId: 'textTwo'
    };

    const value = {
        displayCheckbox: 'showCheckbox',
        notDisplayCheckbox: 'anythingElse'
    };

    const checkbox = {
        checkboxFieldValue : 'CheckboxFieldValue',
        checkboxVariableField: 'CheckboxVariableField',
        checkboxFieldVariable: 'CheckboxFieldVariable',
        checkboxFieldField: 'CheckboxFieldField',
        checkboxVariableValue: 'CheckboxVariableValue',
        checkboxVariableVariable: 'CheckboxVariableVariable'
    };

    beforeAll(async (done) => {
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

        navigationBarPage.clickFormCloudButton();

        formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId);
        done();
    });

    it('[C309647] Should be able to see Checkbox widget when visibility condition refers to another field with specific value', () => {

        widget.textWidget().isWidgetVisible(widgets.textOneId);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
        widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldValue);

        widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
    });

    it('[C309648] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', () => {

        widget.textWidget().isWidgetVisible(widgets.textOneId);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);

        widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableField);

        widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a field and a form variable', () => {

        widget.textWidget().isWidgetVisible(widgets.textOneId);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);

        widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        expect(widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldVariable)).toBe(true);

        widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);
    });

    it('[C311425] Should be able to see Checkbox widget when visibility condition refers to a field and another field', () => {

        widget.textWidget().isWidgetVisible(widgets.textOneId);
        widget.textWidget().isWidgetVisible(widgets.textTwoId);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        widget.textWidget().setValue(widgets.textTwoId, value.displayCheckbox);
        widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);

        widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);
    });

    it('[C311424] Should be able to see Checkbox widget when visibility condition refers to a variable with specific value', () => {
        formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableValue);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.notDisplayCheckbox;
        formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableValue);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.displayCheckbox;
        formCloudDemoPage.setConfigToEditor(visibleCheckbox);
    });

    it('[C311426] Should be able to see Checkbox widget when visibility condition refers to form variable and another form variable', () => {
        formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.notDisplayCheckbox;
        formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[1].value = value.notDisplayCheckbox;
        formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.displayCheckbox;
        visibleCheckbox.formRepresentation.formDefinition.variables[1].value = value.displayCheckbox;
        formCloudDemoPage.setConfigToEditor(visibleCheckbox);
    });
});
