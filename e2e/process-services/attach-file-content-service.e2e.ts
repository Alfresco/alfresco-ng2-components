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
    LoginSSOPage,
    UploadActions,
    Widget
} from '@alfresco/adf-testing';
import { TasksPage } from '../pages/adf/process-services/tasks.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { UsersActions } from '../actions/users.actions';
import { User } from '../models/APS/user';
import CONSTANTS = require('../util/constants');

describe('Attach File - Content service', () => {
    const alfrescoJsApi = new ApiService({ provider: 'ALL',
        hostEcm: browser.params.testConfig.adf_acs.host,
        hostBpm: browser.params.testConfig.adf_aps.host}).apiService;

    const alfrescoJsApiExternal = new ApiService({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_external_acs.host
    }).apiService;

    const loginPage = new LoginSSOPage();
    const widget = new Widget();
    const taskPage = new TasksPage();
    const navigationBarPage = new NavigationBarPage();
    const contentNodeSelector = new ContentNodeSelectorDialogPage();
    const externalNodeSelector = new ExternalNodeSelectorDialogPage();

    const app = browser.params.resources.Files.WIDGET_CHECK_APP;
    const { adminEmail, adminPassword } = browser.params.testConfig.adf;

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
    let user: User;

    beforeAll(async () => {
        const integrationService = new IntegrationService(alfrescoJsApi);
        const applicationService = new ApplicationsUtil(alfrescoJsApi);
        const uploadActions = new UploadActions(alfrescoJsApi);
        const users = new UsersActions();

        await alfrescoJsApi.login(adminEmail, adminPassword);
        user = await users.createTenantAndUser(alfrescoJsApi);
        const acsUser = { ...user, id: user.email }; delete acsUser.type; delete acsUser.tenantId;
        await alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await alfrescoJsApiExternal.login(adminEmail, adminPassword);
        await alfrescoJsApiExternal.core.peopleApi.addPerson(acsUser);

        await integrationService.addCSIntegration({ tenantId: user.tenantId, name: csIntegrations[0], host: browser.params.testConfig.adf_acs.host });
        await integrationService.addCSIntegration({ tenantId: user.tenantId, name: csIntegrations[1], host: browser.params.testConfig.adf_external_acs.host });

        await alfrescoJsApi.login(user.email, user.password);
        await uploadActions.uploadFile(pdfFileTwo.location, pdfFileTwo.name, '-my-');
        await applicationService.importPublishDeployApp(app.file_path);
    });

    afterAll(async () => {
        await alfrescoJsApi.login(adminEmail, adminPassword);
        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    beforeEach( async () => {
        await loginPage.login(user.email, user.password);
    });

    afterEach( async () => {
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

        await contentNodeSelector.searchAndSelectResult(pdfFileTwo.name, pdfFileTwo.name);
        await contentNodeSelector.clickMoveCopyButton();

        await widget.attachFileWidget().checkFileIsAttached(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);

        await widget.attachFileWidget().toggleAttachedFileMenu(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id, pdfFileTwo.name);
        await expect(await widget.attachFileWidget().viewFileEnabled()).toBe(false);
        await expect(await widget.attachFileWidget().downloadFileEnabled()).toBe(true);
        await expect(await widget.attachFileWidget().removeFileEnabled()).toBe(true);

        await widget.attachFileWidget().clickUploadButton(app.UPLOAD_FILE_FORM_CS.FIELD.widget_id);
        await widget.attachFileWidget().selectUploadSource(csIntegrations[1]);

        await expect(await externalNodeSelector.getTitle()).toEqual(`Sign into '${browser.params.testConfig.adf_external_acs.host}'`);
        await externalNodeSelector.login(user.email, user.password);

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
