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

import { createApiService,
    ApplicationsUtil,
    LoginPage,
    ProcessUtil,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/tasks.page';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');
import { ProcessServicesPage } from '../pages/process-services.page';

describe('Checkbox Widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.CHECKBOX;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    let processUserModel;
    let appModel;
    let deployedAppId; let process;

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const processUtil = new ProcessUtil(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        processUserModel = await usersActions.createUser();

        await apiService.login(processUserModel.username, processUserModel.password);
        appModel = await applicationsService.importPublishDeployApp(browser.params.resources.Files.WIDGET_CHECK_APP.file_path);

        deployedAppId = await applicationsService.getAppDefinitionId(appModel.id);

        process = await processUtil.startProcessByDefinitionName(appModel.name, app.processName);
        await loginPage.login(processUserModel.username, processUserModel.password);
   });

    beforeEach(async () => {
        await (new ProcessServicesPage()).goToAppByAppId(deployedAppId);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
   });

    it('[C268554] Should be able to set general settings for Checkbox widget ', async () => {
        await taskPage.formFields().setValueInInputById(app.FIELD.number_input_id, '2');
        await expect(await widget.checkboxWidget().getCheckboxLabel()).toContain(app.FIELD.checkbox_label);
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_input_id);
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C272812] Should be able to set visibility settings for Checkbox widget', async () => {
        await widget.checkboxWidget().isCheckboxHidden(app.FIELD.checkbox_field_id);
        await taskPage.formFields().setValueInInputById(app.FIELD.number_input_id, '2');
        await widget.checkboxWidget().isCheckboxDisplayed(app.FIELD.checkbox_field_id);
    });
});
