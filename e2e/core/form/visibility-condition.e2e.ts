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
import { fieldVariablesForm } from '../../resources/forms/field-variable-visibility';
import { variableVisibilityForm } from '../../resources/forms/variable-visibility-condition';
import { fieldVisibilityForm } from '../../resources/forms/field-visibility-condition';

describe('Form Component', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const formCloudDemoPage = new FormCloudDemoPage();
    const fieldVisibilityFormJson = JSON.parse(fieldVisibilityForm);
    const variableVisibilityFormJson = JSON.parse(variableVisibilityForm);
    const fieldVariablesFormJson = JSON.parse(fieldVariablesForm);
    const widget = new Widget();

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
        formCloudDemoPage.setConfigToEditor(fieldVisibilityFormJson);

        widget.textWidget().isWidgetVisible('Text0zfcc0');
        widget.checkboxWidget().isCheckboxHidden('Checkbox0clbgk');
        widget.textWidget().setValue('Text0zfcc0', 'showCheck');
        widget.checkboxWidget().isCheckboxDisplayed('Checkbox0clbgk');

        widget.textWidget().setValue('Text0zfcc0', 'anythingElse');
        widget.checkboxWidget().isCheckboxHidden('Checkbox0clbgk');
    });

    it('[C309648] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', () => {
        formCloudDemoPage.setConfigToEditor(fieldVariablesFormJson);

        widget.textWidget().isWidgetVisible('Text01kr9j');
        widget.checkboxWidget().isCheckboxHidden('Checkbox00z50n');

        widget.textWidget().setValue('Text01kr9j', 'showCheckbox');
        widget.checkboxWidget().isCheckboxDisplayed('Checkbox00z50n');

        widget.textWidget().setValue('Text01kr9j', 'anythingElse');
        widget.checkboxWidget().isCheckboxHidden('Checkbox00z50n');
    });

    it('[C309649] Should be able to see Checkbox widget when visibility condition refers to a form variable and a field', () => {
        formCloudDemoPage.setConfigToEditor(variableVisibilityFormJson);

        widget.textWidget().isWidgetVisible('Text01kr9j');
        widget.checkboxWidget().isCheckboxHidden('Checkbox00z50n');

        widget.textWidget().setValue('Text01kr9j', 'showCheckbox');
        expect(widget.checkboxWidget().isCheckboxDisplayed('Checkbox00z50n')).toBe(true);

        widget.textWidget().setValue('Text01kr9j', 'anythingElse');
        widget.checkboxWidget().isCheckboxHidden('Checkbox00z50n');
    });
});
