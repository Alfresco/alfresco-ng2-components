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

import { LoginSSOPage, ProcessCloudWidgetPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FormCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/cloudFormDemoPage';
import { checkboxVisibilityFormJson, multipleCheckboxVisibilityFormJson } from '../../resources/forms/checkbox-visibility-condition';
import { multipleVisibilityFormJson } from '../../resources/forms/multiple-visibility-conditions';
import { displayValueTextJson } from '../../resources/forms/displayValue-visibilityConditions';

describe('Visibility conditions - cloud', () => {

    const loginSSOPage = new LoginSSOPage();

    const navigationBarPage = new NavigationBarPage();
    const formCloudDemoPage = new FormCloudDemoPage();
    const widget = new ProcessCloudWidgetPage();

    let visibleCheckbox;

    const widgets = {
        textOneId: 'textOne',
        textTwoId: 'textTwo',
        textThreeId: 'textThree',
        checkboxBasicVariable: 'CheckboxBasicVariableField',
        checkboxBasicField: 'CheckboxBasicFieldValue',
        textOneDisplay: 'TextOne',
        textTwoDisplay: 'TextTwo'
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
        checkboxVariableVariable: 'CheckboxVariableVariable',
        checkbox1: 'Checkbox1'
    };
    const displayValueString = {
        displayValueNoConditionField: 'DisplayValueNoCondition',
        displayValueSingleConditionField: 'DisplayValueSingleCondition',
        displayValueMultipleConditionsField: 'DisplayValueMultipleCondition'
    };

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

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

    it('[C312400] Should be able to see Checkbox widget when has visibility condition related to checkbox', async () => {
        await formCloudDemoPage.setConfigToEditor(multipleCheckboxVisibilityFormJson);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().clickCheckboxInput('Checkbox3');
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkbox1);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkbox1);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().clickCheckboxInput('Checkbox3');
        await widget.checkboxWidget().isCheckboxDisplayed(checkbox.checkbox1);

        await widget.checkboxWidget().clickCheckboxInput('Checkbox2');
        await widget.checkboxWidget().isCheckboxHidden(checkbox.checkbox1);

    });

    it('[C309650] Should be able to see Checkbox widget when has multiple visibility conditions and next condition operators', async () => {
        let text1, text2;

        await formCloudDemoPage.setConfigToEditor(multipleVisibilityFormJson);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('');
        await expect(text2).toEqual('');

        await widget.textWidget().setValue(widgets.textOneId, 'aaa');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('aaa');
        await expect(text2).toEqual('');
        await widget.textWidget().isWidgetVisible(widgets.checkboxBasicVariable);

        await widget.textWidget().setValue(widgets.textOneId, 'bbb');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('bbb');
        await expect(text2).toEqual('');
        await widget.textWidget().isWidgetVisible(widgets.checkboxBasicField);

        await widget.textWidget().setValue(widgets.textTwoId, 'aaa');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('bbb');
        await expect(text2).toEqual('aaa');
        await widget.textWidget().isWidgetNotVisible(widgets.checkboxBasicField);

        await widget.textWidget().setValue(widgets.textOneId, 'aaa');
        text1 = await widget.textWidget().getFieldValue(widgets.textOneId);
        text2 = await widget.textWidget().getFieldValue(widgets.textTwoId);

        await expect(text1).toEqual('aaa');
        await expect(text2).toEqual('aaa');
        await widget.textWidget().isWidgetNotVisible(widgets.checkboxBasicField);
    });

    it('[C312443] Should be able to see Checkbox widget when has multiple visibility conditions and OR NOT next condition operators', async () => {
        await formCloudDemoPage.setConfigToEditor(multipleVisibilityFormJson);

        await widget.textWidget().setValue(widgets.textTwoId, 'test');
        await widget.textWidget().setValue(widgets.textThreeId, 'test');
        await widget.textWidget().isWidgetNotVisible(widgets.textOneId);

        await widget.textWidget().setValue(widgets.textTwoId, 'test');
        await widget.textWidget().setValue(widgets.textThreeId, 'something');
        await widget.textWidget().isWidgetVisible(widgets.textOneId);

        await widget.textWidget().setValue(widgets.textTwoId, 'something');
        await widget.textWidget().setValue(widgets.textThreeId, 'test');
        await widget.textWidget().isWidgetVisible(widgets.textOneId);

        await widget.textWidget().setValue(widgets.textTwoId, 'something');
        await widget.textWidget().setValue(widgets.textThreeId, 'something');
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
    });

    it('[C309867] Should be able to see the value of a form variable in the Display Value Widget when no visibility conditions are added', async () => {
        await formCloudDemoPage.setConfigToEditor(displayValueTextJson);

        await widget.displayValueWidget().isDisplayValueWidgetVisible(displayValueString.displayValueNoConditionField);

        const textDisplayWidgetNoCondition = await widget.displayValueWidget().getFieldValue(displayValueString.displayValueNoConditionField);
        await expect(textDisplayWidgetNoCondition).toEqual('No cats');

    });

    it('[C309869] Should be able to see Display text widget when visibility condition refers to a form variable and a field', async () => {
        await formCloudDemoPage.setConfigToEditor(displayValueTextJson);

        await widget.textWidget().isWidgetVisible(widgets.textOneDisplay);
        let textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('');
        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueSingleConditionField);

        await widget.textWidget().setValue(widgets.textOneDisplay, 'cat');
        textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('cat');
        await widget.displayValueWidget().isDisplayValueWidgetVisible(displayValueString.displayValueSingleConditionField);
        const textDisplayWidgetSingleCondition = await widget.displayValueWidget().getFieldValue(displayValueString.displayValueSingleConditionField);
        await expect(textDisplayWidgetSingleCondition).toEqual('cat');

        await widget.textWidget().setValue(widgets.textOneDisplay, 'dog');
        textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('dog');
        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueSingleConditionField);

    });
    it('[C309871] Should be able to see Display text widget when has multiple visibility conditions and next condition operators', async () => {
        await formCloudDemoPage.setConfigToEditor(displayValueTextJson);

        await widget.textWidget().isWidgetVisible(widgets.textOneDisplay);
        let textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('');

        await widget.textWidget().isWidgetVisible(widgets.textTwoDisplay);
        let textTwoField = await widget.textWidget().getFieldValue(widgets.textTwoDisplay);
        await expect(textTwoField).toEqual('');

        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueSingleConditionField);
        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueMultipleConditionsField);

        await widget.textWidget().setValue(widgets.textOneDisplay, 'cat');
        textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('cat');
        await widget.displayValueWidget().isDisplayValueWidgetVisible(displayValueString.displayValueMultipleConditionsField);
        const textDisplayWidgetMultipleCondition = await widget.displayValueWidget().getFieldValue(displayValueString.displayValueMultipleConditionsField);
        await expect(textDisplayWidgetMultipleCondition).toEqual('more cats');

        await widget.textWidget().setValue(widgets.textOneDisplay, 'dog');
        textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('dog');
        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueMultipleConditionsField);

        await widget.textWidget().setValue(widgets.textTwoDisplay, 'cat');
        textTwoField = await widget.textWidget().getFieldValue(widgets.textTwoDisplay);
        await expect(textTwoField).toEqual('cat');
        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueMultipleConditionsField);

        await widget.textWidget().setValue(widgets.textOneDisplay, 'cat');
        textOneField = await widget.textWidget().getFieldValue(widgets.textOneDisplay);
        await expect(textOneField).toEqual('cat');
        await widget.displayValueWidget().checkDisplayValueWidgetIsHidden(displayValueString.displayValueMultipleConditionsField);

        await widget.textWidget().setValue(widgets.textTwoDisplay, 'dog');
        textTwoField = await widget.textWidget().getFieldValue(widgets.textTwoDisplay);
        await expect(textTwoField).toEqual('dog');
        await widget.displayValueWidget().isDisplayValueWidgetVisible(displayValueString.displayValueMultipleConditionsField);
        await expect(textDisplayWidgetMultipleCondition).toEqual('more cats');

    });
});
