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
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Text widget', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP.TEXT;

    const loginPage = new LoginPage();
    const taskPage = new TasksPage();
    const widget = new Widget();
    const navigationBarPage = new NavigationBarPage();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);
    const processUtil = new ProcessUtil(apiService);

    let appModel;
    let deployedAppId; let process;
    let processUserModel;

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
        await navigationBarPage.clickHomeButton();
        await (new ProcessServicesPage()).goToAppByAppId(deployedAppId);

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await processUtil.cancelProcessInstance(process.id);
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(processUserModel.tenantId);
   });

    it('[C268157] Should be able to set general properties for Text widget', async () => {
        const label = await widget.textWidget().getFieldLabel(app.FIELD.simpleText);
        await expect(label).toBe('textSimple*');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        const placeHolder = await widget.textWidget().getFieldPlaceHolder(app.FIELD.simpleText);
        await expect(placeHolder).toBe('Type something...');
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C268170] Min-max length properties', async () => {
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await widget.textWidget().setValue(app.FIELD.textMinMax, 'A');
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toContain('Enter at least 4 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.textWidget().setValue(app.FIELD.textMinMax, '01234567890');
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textMinMax)).toContain('Enter no more than 10 characters');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await widget.textWidget().setValue(app.FIELD.textMinMax, '123456789');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C268171] Input mask reversed checkbox properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMask, '18951523');
        await expect(await widget.textWidget().getFieldValue(app.FIELD.textMask)).toBe('1895-1523');
    });

    it('[C268171] Input mask reversed checkbox properties', async () => {
        await widget.textWidget().setValue(app.FIELD.textMaskReversed, '1234567899');
        await expect(await widget.textWidget().getFieldValue(app.FIELD.textMaskReversed)).toBe('3456-7899');
    });

    it('[C268177] Should be able to set Regex Pattern property for Text widget', async () => {
        await widget.textWidget().setValue(app.FIELD.simpleText, 'TEST');
        await widget.textWidget().setValue(app.FIELD.textRegexp, 'T');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(false);
        await expect(await widget.textWidget().getErrorMessage(app.FIELD.textRegexp)).toContain('Enter a different value');
        await widget.textWidget().setValue(app.FIELD.textRegexp, 'TE');
        await expect(await taskPage.formFields().isCompleteFormButtonEnabled()).toEqual(true);
    });

    it('[C274712] Should be able to set visibility properties for Text widget ', async () => {
        await widget.textWidget().isWidgetNotVisible(app.FIELD.textHidden);
        await widget.textWidget().setValue(app.FIELD.showHiddenText, '1');
        await widget.textWidget().isWidgetVisible(app.FIELD.textHidden);
    });
});
