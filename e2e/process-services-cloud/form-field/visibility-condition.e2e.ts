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

import { LoginSSOPage, SettingsPage, Widget } from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FormCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/cloudFormDemoPage';
import { checkboxVisibilityForm } from '../../resources/forms/checkbox-visibility-condition';

describe('Visibility conditions - cloud', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();

    const navigationBarPage = new NavigationBarPage();
    const formCloudDemoPage = new FormCloudDemoPage();
    const checkboxVisibilityFormJson = JSON.parse(checkboxVisibilityForm);
    const widget = new Widget();

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
        checkboxFieldValue: 'CheckboxFieldValue',
        checkboxVariableField: 'CheckboxVariableField',
        checkboxFieldVariable: 'CheckboxFieldVariable',
        checkboxFieldField: 'CheckboxFieldField',
        checkboxVariableValue: 'CheckboxVariableValue',
        checkboxVariableVariable: 'CheckboxVariableVariable'
    };

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await navigationBarPage.navigateToFormCloudPage();

        await formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);
    });

    it('[C309647] Should be able to see Checkbox widget when visibility condition refers to another field with specific value', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldValue);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldValue);
    });

    it('[C309648] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);

        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableField);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableField);
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a field and a form variable', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldVariable);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldVariable);
    });

    it('[C311425] Should be able to see Checkbox widget when visibility condition refers to a field and another field', async () => {

        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetVisible(widgets.textTwoId);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textOneId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textTwoId, value.displayCheckbox);
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxFieldField);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayCheckbox);
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxFieldField);
    });

    it('[C311424] Should be able to see Checkbox widget when visibility condition refers to a variable with specific value', async () => {
        await formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableValue);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.notDisplayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableValue);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.displayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);
    });

    it('[C311426] Should be able to see Checkbox widget when visibility condition refers to form variable and another form variable', async () => {
        await formCloudDemoPage.setConfigToEditor(checkboxVisibilityFormJson);

        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.notDisplayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[1].value = value.notDisplayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);

        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkboxVariableVariable);

        visibleCheckbox = checkboxVisibilityFormJson;
        visibleCheckbox.formRepresentation.formDefinition.variables[0].value = value.displayCheckbox;
        visibleCheckbox.formRepresentation.formDefinition.variables[1].value = value.displayCheckbox;
        await formCloudDemoPage.setConfigToEditor(visibleCheckbox);
    });
});
