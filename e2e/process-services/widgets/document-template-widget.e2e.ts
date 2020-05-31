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

import { UsersActions } from '../../actions/users.actions';
import { LoginSSOPage, BrowserActions, Widget, ApplicationsUtil, ProcessUtil, ApiService } from '@alfresco/adf-testing';
import { TasksPage } from '../../pages/adf/process-services/tasks.page';
import CONSTANTS = require('../../util/constants');
import { browser } from 'protractor';

describe('Document Template widget', () => {

    const app = browser.params.resources.Files.FILE_FORM_ADF;

    const loginPage = new LoginSSOPage();
    const taskPage = new TasksPage();
    const widget = new Widget();

    let appModel;
    let deployedApp, process;
    let processUserModel;

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const applicationsService = new ApplicationsUtil(apiService);

    beforeAll(async () => {

        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        processUserModel = await usersActions.createUser();

        await apiService.getInstance().login(processUserModel.email, processUserModel.password);
        appModel = await applicationsService.importPublishDeployApp( app.file_path);

        const appDefinitions = await apiService.getInstance().activiti.appsApi.getAppDefinitions();
        deployedApp = appDefinitions.data.find((currentApp) => {
            return currentApp.modelId === appModel.id;
        });
        process = await new ProcessUtil(apiService).startProcessOfApp(appModel.name);
        await loginPage.login(processUserModel.email, processUserModel.password);
   });

    beforeEach(async () => {
        const urlToNavigateTo = `${browser.params.testConfig.adf.url}/activiti/apps/${deployedApp.id}/tasks/`;
        await BrowserActions.getUrl(urlToNavigateTo);
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.formFields().checkFormIsDisplayed();
    });

    afterAll(async () => {
        await apiService.getInstance().activiti.processApi.deleteProcessInstance(process.id);
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);
   });

    it('[C260406] should check that the template contains assigned file ', async () => {
        await expect(await widget.containerWidget().getFieldText(app.form_fields.container_id))
            .toEqual(app.attached_file);
    });
});
