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

import CONSTANTS = require('../../util/constants');
import { createApiService,
    ApplicationsUtil, BrowserActions,
    FileBrowserUtil,
    LocalStorageUtil,
    LoginPage, ModelsActions,
    ProcessInstanceTasksPage,
    SelectAppsDialog,
    StartProcessPage,
    StringUtil,
    UserModel,
    UsersActions,
    Widget
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { AttachmentListPage } from './../pages/attachment-list.page';
import { ProcessDetailsPage } from './../pages/process-details.page';
import { ProcessFiltersPage } from './../pages/process-filters.page';
import { ProcessServicesPage } from './../pages/process-services.page';
import { ProcessServiceTabBarPage } from './../pages/process-service-tab-bar.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { ProcessInstancesApi } from '@alfresco/js-api';

describe('Start Process Component', () => {

    const app = browser.params.resources.Files.APP_WITH_PROCESSES;
    const simpleApp = browser.params.resources.Files.WIDGETS_SMOKE_TEST;
    const dateFormApp = browser.params.resources.Files.APP_WITH_DATE_FIELD_FORM;
    const startProcessAttachFileApp = browser.params.resources.Files.START_PROCESS_ATTACH_FILE;

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const processServicesPage = new ProcessServicesPage();
    const startProcessPage = new StartProcessPage();
    const processFiltersPage = new ProcessFiltersPage();
    const processServiceTabBarPage = new ProcessServiceTabBarPage();
    const processDetailsPage = new ProcessDetailsPage();
    const attachmentListPage = new AttachmentListPage();
    const processInstanceTasksPage = new ProcessInstanceTasksPage();
    const contentServicesPage = new ContentServicesPage();
    const selectAppsDialog = new SelectAppsDialog();
    const widget = new Widget();

    const apiService = createApiService();
    const apiServiceUserTwo = createApiService();
    const modelsActions = new ModelsActions(apiService);
    const usersActions = new UsersActions(apiService);
    const processApi = new ProcessInstancesApi(apiService.getInstance());

    let procUserModel: UserModel;
    let secondProcUserModel: UserModel;
    let appCreated; let simpleAppCreated; let dateFormAppCreated;

    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);

    const lengthValidationError = 'Length exceeded, 255 characters max.';

    const auditLogFile = 'Audit.pdf';

    const jpgFile = new FileModel({
        location: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_location,
        name: browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    describe('Provider: BPM', () => {

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            procUserModel = await usersActions.createUser();
            secondProcUserModel = await usersActions.createUser(new UserModel({ tenantId: procUserModel.tenantId }));

            await apiServiceUserTwo.login(secondProcUserModel.username, secondProcUserModel.password);

            const applicationsService = new ApplicationsUtil(apiServiceUserTwo);
            appCreated = await applicationsService.importPublishDeployApp(app.file_path);
            simpleAppCreated = await applicationsService.importPublishDeployApp(simpleApp.file_path);
            dateFormAppCreated = await applicationsService.importPublishDeployApp(dateFormApp.file_path);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await modelsActions.deleteModel(appCreated.id);
            await modelsActions.deleteModel(simpleAppCreated.id);
            await modelsActions.deleteModel(dateFormAppCreated.id);
            await usersActions.deleteTenant(procUserModel.tenantId);
        });

        describe(' Once logged with user without apps', () => {
            beforeEach(async () => {
                await loginPage.login(procUserModel.username, procUserModel.password);
                await navigationBarPage.navigateToProcessServicesPage();
                await processServicesPage.checkApsContainer();
            });

            afterEach(async () => {
                await navigationBarPage.clickLogoutButton();
            });

            it('[C260458] Should NOT be able to start a process without process model', async () => {
                await processServicesPage.goToApp('Task App');
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.checkNoProcessMessage();
            });
        });

        describe(' Once logged with user with app', () => {

            beforeEach(async () => {
                await loginPage.login(secondProcUserModel.username, secondProcUserModel.password);
                await navigationBarPage.navigateToProcessServicesPage();
                await processServicesPage.checkApsContainer();
            });

            afterEach(async () => {
                await navigationBarPage.clickLogoutButton();
            });

            it('[C260441] Should display start process form and default name when creating a new process after selecting the process definition', async () => {
                await processServicesPage.goToApp('Task App');
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await expect(await startProcessPage.getDefaultName()).toEqual('My Default Name');
            });

            it('[C260445] Should require process definition and be possible to click cancel button', async () => {
                await processServicesPage.goToApp('Task App');
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('');
                await browser.actions().sendKeys('v\b\b').perform(); // clear doesn't trigger the validator
                await startProcessPage.checkStartProcessButtonIsDisabled();
                await startProcessPage.clickCancelProcessButton();
                await processFiltersPage.checkNoContentMessage();
            });

            it('[C260444] Should require process name', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.deleteDefaultName();

                await browser.sleep(1000);

                await startProcessPage.checkStartProcessButtonIsDisabled();
                await startProcessPage.clickProcessDropdownArrow();
                await startProcessPage.checkProcessOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.checkProcessOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
            });

            it('[C260443] Should be possible to start a process without start event', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await expect(await startProcessPage.checkSelectProcessPlaceholderIsDisplayed()).toBe('');

                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);

                await expect(await startProcessPage.getDefaultName()).toEqual('My Default Name');
                await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
            });

            it('[C260449] Should be possible to start a process with start event', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('Test');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();

                await processDetailsPage.checkProcessHeaderDetailsAreVisible();

                const processId = await processDetailsPage.getId();
                const response = await processApi.getProcessInstance(processId);

                await expect(await processDetailsPage.getProcessStatus()).toEqual(CONSTANTS.PROCESS_STATUS.RUNNING);
                await expect(await processDetailsPage.getEndDate()).toEqual(CONSTANTS.PROCESS_END_DATE);
                await expect(await processDetailsPage.getProcessCategory()).toEqual(CONSTANTS.PROCESS_CATEGORY);
                await expect(await processDetailsPage.getBusinessKey()).toEqual(CONSTANTS.PROCESS_BUSINESS_KEY);
                await expect(await processDetailsPage.getCreatedBy()).toEqual(`${response.startedBy.firstName} ${response.startedBy.lastName}`);
                await expect(await processDetailsPage.getId()).toEqual(response.id);
                await expect(await processDetailsPage.getProcessDescription()).toEqual(CONSTANTS.PROCESS_DESCRIPTION);
                await expect(await processDetailsPage.checkProcessTitleIsDisplayed()).toEqual(response.name);
            });

            it('[C286503] Should NOT display any process definition when typing a non-existent one', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition('nonexistent');
                await startProcessPage.checkNoProcessDefinitionOptionIsDisplayed();
                await startProcessPage.checkStartProcessButtonIsDisabled();
            });

            it('[C286504] Should display proper options when typing a part of existent process definitions', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition('process');
                await startProcessPage.checkProcessOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkProcessOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.selectProcessOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
            });

            it('[C286508] Should display only one option when typing an existent process definition', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkProcessOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkProcessOptionIsNotDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.selectProcessOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
            });

            it('[C286509] Should select automatically the processDefinition when the app contains only one', async () => {
                await processServicesPage.goToApp(simpleApp.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await expect(await startProcessPage.getProcessDefinitionValue()).toBe(simpleApp.title);
                await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
            });

            it('[C286511] Should be able to type the process definition and start a process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.selectProcessOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.enterProcessName('Type');
                await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);
                await expect(await startProcessPage.getProcessDefinitionValue()).toBe(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.clickStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Type');
            });

            it('[C286513] Should be able to use down arrow key when navigating throw suggestions', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition('process');

                await startProcessPage.pressDownArrowAndEnter();
                await expect(await startProcessPage.getProcessDefinitionValue()).toBe(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
            });

            it('[C286514] Should the process definition input be cleared when clicking on options drop down ', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition('process');
                await startProcessPage.selectProcessOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await expect(await startProcessPage.getProcessDefinitionValue()).toBe(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.clickProcessDropdownArrow();

                await expect(await startProcessPage.getProcessDefinitionValue()).toBe('');
            });

            it('[C260453] Should be possible to add a comment on an active process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Comment Process');
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Comment Process');
                await processDetailsPage.addComment('comment1');
                await processDetailsPage.checkCommentIsDisplayed('comment1');
            });

            it('[C260454] Should be possible to download audit log file', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Audit Log');
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Audit Log');
                await processDetailsPage.auditLogButton.click();

                await FileBrowserUtil.isFileDownloaded(auditLogFile);
            });

            it('Should be able to attach a file using the button', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Attach File');
                await startProcessPage.clickFormStartProcessButton();

                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Attach File');

                await attachmentListPage.clickAttachFileButton(jpgFile.location);
                await attachmentListPage.checkFileIsAttached(jpgFile.name);
            });

            it('[C260451] Should be possible to display process diagram', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Show Diagram');
                await startProcessPage.clickFormStartProcessButton();

                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Show Diagram');

                await processDetailsPage.clickShowDiagram();
            });

            it('[C260452] Should redirect user when clicking on active/completed task', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Active Task');
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Active Task');
                await processDetailsPage.activeTask.click();
                await processDetailsPage.taskTitle.waitVisible();
            });

            it('[C260457] Should display process in Completed when cancelled', async () => {
                await navigationBarPage.navigateToProcessServicesPage();
                await processServicesPage.checkApsContainer();
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Cancel Process');
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Cancel Process');
                await processDetailsPage.cancelProcessButton.click();
                await processFiltersPage.clickCompletedFilterButton();
                await processFiltersPage.selectFromProcessList('Cancel Process');
                await processDetailsPage.showDiagramButtonDisabled.waitVisible();
            });

            it('[C260461] Should be possible to add a comment on a completed/canceled process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('Comment Process 2');
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Comment Process 2');
                await processDetailsPage.cancelProcessButton.click();
                await processFiltersPage.clickCompletedFilterButton();
                await processFiltersPage.selectFromProcessList('Comment Process 2');
                await processDetailsPage.addComment('goodbye');
                await processDetailsPage.checkCommentIsDisplayed('goodbye');
            });

            it('[C260467] Should NOT be possible to attach a file on a completed process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.enterProcessName('File');
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('File');
                await processDetailsPage.cancelProcessButton.click();
                await processFiltersPage.clickCompletedFilterButton();
                await processFiltersPage.selectFromProcessList('File');
                await attachmentListPage.checkAttachFileButtonIsNotDisplayed();
            });

            it('[C291781] Should be displayed an error message if process name exceed 255 characters', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await startProcessPage.enterProcessName(processName255Characters);
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await expect(await startProcessPage.isStartProcessButtonEnabled()).toEqual(true);

                await startProcessPage.enterProcessName(processNameBiggerThen255Characters);
                await startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError);
                await startProcessPage.checkStartProcessButtonIsDisabled();
            });

            it('[C261039] Advanced date time widget', async () => {
                await processServicesPage.goToApp(dateFormApp.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('DateFormProcess');
                await startProcessPage.formFields().checkWidgetIsVisible('testdate');
                await widget.dateWidget().setDateInput('testdate', '15-7-2019');
                await expect(await startProcessPage.isStartFormProcessButtonEnabled()).toEqual(true);
                await startProcessPage.clickFormStartProcessButton();

                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('DateFormProcess');
                await processInstanceTasksPage.clickOnStartForm();
                await processInstanceTasksPage.checkStartProcessDialogIsDisplayed();
                await expect(await processInstanceTasksPage.getTitle()).toBe('Start Form');
                await expect(await (await widget.dateWidget()).getDateInput('testdate')).toBe('15-7-2019');
                await processInstanceTasksPage.clickCloseButton();
                await processInstanceTasksPage.checkStartProcessDialogIsNotDisplayed();
            });
        });
    });

    describe('Provider: ALL', () => {
        const uploadDialog = new UploadDialogPage();
        let processUserModel;
        const imageUploaded = new FileModel({
            name: browser.params.resources.Files.PROFILE_IMAGES.ECM.file_name,
            location: browser.params.resources.Files.PROFILE_IMAGES.ECM.file_location
        });

        beforeAll(async () => {
            const apiServiceAll = createApiService({
                provider: 'ALL',
                hostEcm: browser.params.testConfig.appConfig.ecmHost,
                hostBpm: browser.params.testConfig.appConfig.bpmHost
            });

            const usersActionsAll = new UsersActions(apiServiceAll);

            await apiServiceAll.login(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);

            processUserModel = await usersActionsAll.createUser();

            const alfrescoJsBPMAdminUser = createApiService({ hostBpm: browser.params.testConfig.appConfig.bpmHost });

            await alfrescoJsBPMAdminUser.login(processUserModel.username, processUserModel.password);

            const applicationsService = new ApplicationsUtil(alfrescoJsBPMAdminUser);

            await applicationsService.importPublishDeployApp(startProcessAttachFileApp.file_path);
        });

        it('[C260490] Should be able to start a Process within ACS', async () => {
            await BrowserActions.getUrl(`${browser.baseUrl}/settings`);

            await LocalStorageUtil.setStorageItem('providers', 'ALL');

            await loginPage.login(processUserModel.username, processUserModel.password);

            await contentServicesPage.goToDocumentList();
            await contentServicesPage.uploadFile(imageUploaded.location);
            await contentServicesPage.checkContentIsDisplayed(imageUploaded.name);
            await uploadDialog.clickOnCloseButton();
            await uploadDialog.dialogIsNotDisplayed();
            await contentServicesPage.checkContentIsDisplayed(imageUploaded.name);

            await contentServicesPage.getDocumentList().rightClickOnRow(imageUploaded.name);
            await contentServicesPage.checkContextActionIsVisible('Start Process');
            await contentServicesPage.pressContextMenuActionNamed('Start Process');
            await selectAppsDialog.checkSelectAppsDialogIsDisplayed();
            await selectAppsDialog.selectApp('start process app');
            await selectAppsDialog.clickContinueButton();
            await startProcessPage.enterProcessName('Test Process');

            await attachmentListPage.checkFileIsAttached(imageUploaded.name);
            await startProcessPage.clickFormStartProcessButton();
            await navigationBarPage.navigateToProcessServicesPage();
            await processServicesPage.checkApsContainer();
            await processServicesPage.goToApp(startProcessAttachFileApp.title);

            await processServiceTabBarPage.clickProcessButton();
            await processFiltersPage.clickCompletedFilterButton();
            await processFiltersPage.selectFromProcessList('Test Process');
            await expect(await processDetailsPage.auditLogEmptyListMessage.getText()).toBe('This list is empty');
        });
    });

});
