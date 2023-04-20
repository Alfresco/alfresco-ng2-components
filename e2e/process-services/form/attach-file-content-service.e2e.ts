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
    ContentNodeSelectorDialogPage,
    IntegrationService,
    LocalStorageUtil,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions,
    Widget,
    SearchService
} from '@alfresco/adf-testing';
import { TasksPage } from './../pages/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import CONSTANTS = require('../../util/constants');

describe('Attach File - Content service', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP;

    const loginPage = new LoginPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();

    const apiServiceExternal = createApiService({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_external_acs.host,
        authType: 'BASIC'
    });
    const usersActionsExternal = new UsersActions(apiServiceExternal);

    const apiService = createApiService({ provider: 'ALL' });
    const integrationService = new IntegrationService(apiService);
    const applicationService = new ApplicationsUtil(apiService);
    const searchService = new SearchService(apiService);
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const pdfFileOne = {
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    };

    const pdfFileTwo = {
        name: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PDF_B.file_path
    };

    const externalFile = 'Project Overview.ppt';
    const csIntegrations = ['adf dev', 'adf master'];
    let user: UserModel;

    beforeAll(async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ALL');
        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();

        await apiServiceExternal.loginWithProfile('admin');
        await usersActionsExternal.createUser(user);

        await integrationService.addCSIntegration({
            tenantId: user.tenantId,
            name: csIntegrations[0],
            host: browser.params.testConfig.appConfig.ecmHost
        });
        await integrationService.addCSIntegration({
            tenantId: user.tenantId,
            name: csIntegrations[1],
            host: browser.params.testConfig.adf_external_acs.host
        });

        await apiService.login(user.username, user.password);
        await uploadActions.uploadFile(pdfFileTwo.location, pdfFileTwo.name, '-my-');
        await applicationService.importPublishDeployApp(app.file_path);

        await searchService.isSearchable(pdfFileTwo.name);
        await searchService.isSearchable(externalFile);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        await loginPage.login(user.username, user.password);
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
    });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C315268] Attach file - Able to upload more than one file (both ACS and local)', async () => {
        const name = 'Attach local and acs file';
        await taskPage.createTask({ name, formName: app.UPLOAD_FILE_FORM_CS.formName });

        await widget.attachFileWidget().attachFile(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.location);
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.name);

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
        await widget.attachFileWidget().selectUploadSource(csIntegrations[0]);

        await contentNodeSelector.checkDialogIsDisplayed();
        await searchService.isSearchable(pdfFileTwo.name);
        await contentNodeSelector.searchAndSelectResult(pdfFileTwo.name, pdfFileTwo.name);

        await contentNodeSelector.clickMoveCopyButton();
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
    });

    it('[C246522] Attach file - Local file', async () => {
        const name = 'Attach local file';
        await taskPage.createTask({ name, formName: app.UPLOAD_FILE_FORM_CS.formName });

        await widget.attachFileWidget().attachFile(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.location);
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.name);

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
    });
});
