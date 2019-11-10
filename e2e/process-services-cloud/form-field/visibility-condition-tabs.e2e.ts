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

import { LoginSSOPage, Widget } from '@alfresco/adf-testing';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { FormCloudDemoPage } from '../../pages/adf/demo-shell/process-services-cloud/cloudFormDemoPage';
import { tabFieldValueVisibilityJson, tabVarValueVisibilityJson, tabVarFieldVisibilityJson,
    tabFieldFieldVisibilityJson, tabFieldVarVisibilityJson, tabVarVarVisibilityJson,
    tabNextOperatorsVisibilityJson } from '../../resources/forms/tab-visibility-conditions';

describe('Visibility conditions on tabs - cloud', () => {

    const loginSSOPage = new LoginSSOPage();

    const navigationBarPage = new NavigationBarPage();
    const formCloudDemoPage = new FormCloudDemoPage();
    const widget = new Widget();

    const widgets = {
        textOneId: 'TextOne',
        textTwoId: 'TextTwo',
        textThreeId: 'TextThree'
    };

    const value = {
        displayTab: 'showTab',
        notDisplayTab: 'anythingElse'
    };

    const tab = {
        tabWithFields: 'tabWithFields',
        tabFieldValue: 'tabBasicFieldValue',
        tabVarValue: 'tabBasicVarValue',
        tabVarField: 'tabBasicVarField',
        tabFieldField: 'tabBasicFieldField',
        tabVarVar: 'tabBasicVarVar',
        tabNextOperators: 'tabNextOperators'
    };

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);

        await navigationBarPage.navigateToFormCloudPage();
    });

    it('[C309647] Should be able to see tab when visibility condition refers to a field with specific value', async () => {
        await formCloudDemoPage.setConfigToEditor(tabFieldValueVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
        await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldValue);

        await widget.tab().clickTabByLabel(tab.tabFieldValue);
        await widget.textWidget().isWidgetVisible(widgets.textTwoId);

        await widget.tab().clickTabByLabel(tab.tabWithFields);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldValue);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
    });

    it('[C315148] Should be able to see tab when visibility condition refers to a variable with specific value', async () => {
        await formCloudDemoPage.setConfigToEditor(tabVarValueVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarValue);
        await widget.textWidget().isWidgetVisible(widgets.textTwoId);

        const visibleTab = tabVarValueVisibilityJson;
        visibleTab.formRepresentation.formDefinition.variables[0].value = value.notDisplayTab;
        await formCloudDemoPage.setConfigToEditor(visibleTab);

        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarValue);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
    });

    it('[C315149] Should be able to see tab when visibility condition refers to a form variable and a field', async () => {
        await formCloudDemoPage.setConfigToEditor(tabVarFieldVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarField);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
        await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarField);

        await widget.tab().clickTabByLabel(tab.tabVarField);
        await widget.textWidget().isWidgetVisible(widgets.textTwoId);

        await widget.tab().clickTabByLabel(tab.tabWithFields);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarField);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
    });

    it('[C315150] Should be able to see tab when visibility condition refers to a field and another field', async () => {
        await formCloudDemoPage.setConfigToEditor(tabFieldFieldVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

        await widget.tab().clickTabByLabel(tab.tabWithFields);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetVisible(widgets.textThreeId);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);

        await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);

        await widget.textWidget().setValue(widgets.textThreeId, value.displayTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabFieldField);

        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabFieldField);
    });

    it('[C315151] Should be able to see tab when visibility condition refers to a field and form variable', async () => {
        await formCloudDemoPage.setConfigToEditor(tabFieldVarVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarField);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
        await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarField);

        await widget.tab().clickTabByLabel(tab.tabVarField);
        await widget.textWidget().isWidgetVisible(widgets.textTwoId);

        await widget.tab().clickTabByLabel(tab.tabWithFields);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarField);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);
    });

    it('[C315152] Should be able to see tab when visibility condition refers to form variable and another form variable', async () => {
        await formCloudDemoPage.setConfigToEditor(tabVarVarVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarVar);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);

        const visibleTab = tabVarVarVisibilityJson;
        visibleTab.formRepresentation.formDefinition.variables[0].value = value.notDisplayTab;
        await formCloudDemoPage.setConfigToEditor(visibleTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarVar);
        await widget.textWidget().isWidgetNotVisible(widgets.textOneId);

        visibleTab.formRepresentation.formDefinition.variables[1].value = value.notDisplayTab;
        await formCloudDemoPage.setConfigToEditor(visibleTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabVarVar);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);

        visibleTab.formRepresentation.formDefinition.variables[0].value = value.displayTab;
        await formCloudDemoPage.setConfigToEditor(visibleTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabVarVar);
        await widget.textWidget().isWidgetNotVisible(widgets.textOneId);
    });

    it('[C315153] Should be able to see tab when has multiple visibility conditions and next condition operators', async () => {
        await formCloudDemoPage.setConfigToEditor(tabNextOperatorsVisibilityJson);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabWithFields);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabNextOperators);

        await widget.tab().clickTabByLabel(tab.tabWithFields);
        await widget.textWidget().isWidgetVisible(widgets.textOneId);
        await widget.textWidget().isWidgetVisible(widgets.textThreeId);
        await widget.textWidget().isWidgetNotVisible(widgets.textTwoId);

        await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabNextOperators);

        await widget.tab().clickTabByLabel(tab.tabWithFields);
        await widget.textWidget().setValue(widgets.textOneId, value.notDisplayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabNextOperators);

        await widget.textWidget().setValue(widgets.textThreeId, value.displayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabNextOperators);

        await widget.textWidget().setValue(widgets.textOneId, value.displayTab);
        await widget.tab().checkTabIsNotDisplayedByLabel(tab.tabNextOperators);

        await widget.textWidget().setValue(widgets.textThreeId, value.notDisplayTab);
        await widget.tab().checkTabIsDisplayedByLabel(tab.tabNextOperators);
    });

});
