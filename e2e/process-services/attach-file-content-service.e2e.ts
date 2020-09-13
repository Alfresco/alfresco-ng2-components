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

import {
    ApiService,
    ApplicationsUtil,
    ContentNodeSelectorDialogPage,
    ExternalNodeSelectorDialogPage,
    IntegrationService,
    LocalStorageUtil,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from './pages/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import CONSTANTS = require('../util/constants');

describe('Attach File - Content service', () => {

    const app = browser.params.resources.Files.WIDGET_CHECK_APP;

    const loginPage = new LoginPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const externalNodeSelector = new ExternalNodeSelectorDialogPage();

    const apiServiceExternal = new ApiService({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_external_acs.host,
        authType: 'BASIC'
    });
    const usersActionsExternal = new UsersActions(apiServiceExternal);

    const apiService = new ApiService({ provider: 'ALL' });
    const integrationService = new IntegrationService(apiService);
    const applicationService = new ApplicationsUtil(apiService);
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    const { email, password } = browser.params.testConfig.admin;

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

        await apiService.getInstance().login(email, password);
        user = await usersActions.createUser();

        await apiServiceExternal.login(email, password);
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

        await apiService.getInstance().login(user.email, user.password);
        await uploadActions.uploadFile(pdfFileTwo.location, pdfFileTwo.name, '-my-');
        await applicationService.importPublishDeployApp(app.file_path);

        await browser.sleep(browser.params.testConfig.timeouts.index_search); // wait search index previous file/folder uploaded
    });

    afterAll(async () => {
        await apiService.getInstance().login(email, password);
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    beforeEach(async () => {
        await loginPage.login(user.email, user.password);
    });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C315268] Attach file - Able to upload more than one file (both ACS and local)', async () => {
        const name = 'Attach local and acs file';
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.createTask({ name, formName: app.UPLOAD_FILE_FORM_CS.formName });

        await widget.attachFileWidget().attachFile(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.location);
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.name);

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
        await widget.attachFileWidget().selectUploadSource(csIntegrations[0]);

        await contentNodeSelector.checkDialogIsDisplayed();
        await contentNodeSelector.searchAndSelectResult(pdfFileTwo.name, pdfFileTwo.name);

        await contentNodeSelector.clickMoveCopyButton();
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
    });

    it('[C246522]  Attach file - Local file', async () => {
        const name = 'Attach local file';
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.createTask({ name, formName: app.UPLOAD_FILE_FORM_CS.formName });

        await widget.attachFileWidget().attachFile(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.location);
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileOne.name);

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
    });

    it('[C299040] Should display the login screen right, when user has access to 2 alfresco repositiories', async () => {
        const name = 'Attach file';
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);

        await taskPage.createTask({ name, formName: app.UPLOAD_FILE_FORM_CS.formName });

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
        await widget.attachFileWidget().selectUploadSource(csIntegrations[1]);

        await expect(await externalNodeSelector.getTitle()).toEqual(`Sign into '${browser.params.testConfig.adf_external_acs.host}'`);
        await externalNodeSelector.login(user.email, user.password);

        await externalNodeSelector.checkDialogIsDisplayed();
        await externalNodeSelector.searchAndSelectResult(externalFile, externalFile);
        await externalNodeSelector.clickMoveCopyButton();
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, externalFile);
    });

    it('[C286516] Able to upload a file when user has more than two alfresco repositories', async () => {
        const name = 'Attach file - multiple repo';
        await (await (await navigationBarPage.navigateToProcessServicesPage()).goToTaskApp()).clickTasksButton();
        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS);
        await taskPage.createTask({ name, formName: app.UPLOAD_FILE_FORM_CS.formName });

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
        await widget.attachFileWidget().selectUploadSource(csIntegrations[0]);

        await contentNodeSelector.checkDialogIsDisplayed();
        await contentNodeSelector.searchAndSelectResult(pdfFileTwo.name, pdfFileTwo.name);
        await contentNodeSelector.clickMoveCopyButton();

        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);

        await widget.attachFileWidget().toggleAttachedFileMenu(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
        await expect(await widget.attachFileWidget().viewFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().downloadFileEnabled()).toBe(true);
        await expect(await widget.attachFileWidget().removeFileEnabled()).toBe(true);

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
        await widget.attachFileWidget().selectUploadSource(csIntegrations[1]);

        await externalNodeSelector.checkDialogIsDisplayed();
        await externalNodeSelector.searchAndSelectResult(externalFile, externalFile);
        await externalNodeSelector.clickMoveCopyButton();
        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, externalFile);

        await widget.attachFileWidget().toggleAttachedFileMenu(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
        await expect(await widget.attachFileWidget().viewFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().downloadFileEnabled()).toBe(true);
        await expect(await widget.attachFileWidget().removeFileEnabled()).toBe(true);

        await widget.attachFileWidget().toggleAttachedFileMenu(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, externalFile);
        await expect(await widget.attachFileWidget().viewFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().downloadFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().removeFileEnabled()).toBe(true);

        await taskPage.taskDetails().clickCompleteFormTask();

        await taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS);
        await taskPage.tasksListPage().selectRow(name);

        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
        await widget.attachFileWidget().toggleAttachedFileMenu(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
        await expect(await widget.attachFileWidget().viewFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().downloadFileEnabled()).toBe(true);

        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, externalFile);
        await widget.attachFileWidget().toggleAttachedFileMenu(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, externalFile);
        await expect(await widget.attachFileWidget().viewFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().downloadFileEnabled()).toBe(true);
    });
});
