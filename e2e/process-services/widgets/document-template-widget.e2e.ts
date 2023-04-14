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

describe('Document Template widget', () => {

    const app = browser.params.resources.Files.FILE_FORM_ADF;

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
       appModel = await applicationsService.importPublishDeployApp( app.file_path);

       deployedAppId = await applicationsService.getAppDefinitionId(appModel.id);

       process = await processUtil.startProcessOfApp(appModel.name);
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

    it('[C260406] should check that the template contains assigned file ', async () => {
        await expect(await widget.containerWidget().getFieldText(app.form_fields.container_id))
            .toEqual(app.attached_file);
    });
});
