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

import CONSTANTS = require('../util/constants');
import {
    FileBrowserUtil,
    LoginSSOPage, SelectAppsDialog,
    ProcessInstanceTasksPage,
    StringUtil,
    Widget,
    ApplicationsUtil,
    StartProcessPage, ApiService
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { FileModel } from '../models/ACS/file.model';
import { Tenant } from '../models/APS/tenant';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import { AttachmentListPage } from '../pages/adf/process-services/attachment-list.page';
import { ProcessDetailsPage } from '../pages/adf/process-services/process-details.page';
import { ProcessFiltersPage } from '../pages/adf/process-services/process-filters.page';
import { ProcessServicesPage } from '../pages/adf/process-services/process-services.page';
import { ProcessServiceTabBarPage } from '../pages/adf/process-services/process-service-tab-bar.page';
import { ContentServicesPage } from '../pages/adf/content-services.page';
import { UsersActions } from '../actions/users.actions';
import { AcsUserModel } from '../models/ACS/acs-user.model';
import { UploadDialogPage } from '../pages/adf/dialog/upload-dialog.page';
import { UserRepresentation } from '@alfresco/js-api';
import { ApsUserModel } from '../models/APS/aps-user.model';

describe('Start Process Component', () => {

    const loginPage = new LoginSSOPage();
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

    const app = browser.params.resources.Files.APP_WITH_PROCESSES;
    const simpleApp = browser.params.resources.Files.WIDGETS_SMOKE_TEST;
    const dateFormApp = browser.params.resources.Files.APP_WITH_DATE_FIELD_FORM;
    const startProcessAttachFileApp = browser.params.resources.Files.START_PROCESS_ATTACH_FILE;

    let procUserModel: UserRepresentation;
    let secondProcUserModel: UserRepresentation;
    let appId, tenantId, simpleAppCreated, dateFormAppCreated;

    const processName255Characters = StringUtil.generateRandomString(255);
    const processNameBiggerThen255Characters = StringUtil.generateRandomString(256);

    const lengthValidationError = 'Length exceeded, 255 characters max.';

    const apiService = new ApiService();
    const apiServiceUserTwo = new ApiService();

    const auditLogFile = 'Audit.pdf';

    const jpgFile = new FileModel({
        'location': browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': browser.params.resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    describe('Provider: BPM', () => {
        beforeAll(async () => {
            try {
                await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

                const newTenant = await apiService.getInstance().activiti.adminTenantsApi.createTenant(new Tenant());

                tenantId = newTenant.id;
                procUserModel = new ApsUserModel({ tenantId: tenantId });
                secondProcUserModel = new ApsUserModel({ tenantId: tenantId });

                await apiService.getInstance().activiti.adminUsersApi.createNewUser(procUserModel);
                await apiService.getInstance().activiti.adminUsersApi.createNewUser(secondProcUserModel);

                await apiServiceUserTwo.login(secondProcUserModel.email, secondProcUserModel.password);

                const applicationsService = new ApplicationsUtil(apiServiceUserTwo);

                const appCreated = await applicationsService.importPublishDeployApp(app.file_path);

                simpleAppCreated = await applicationsService.importPublishDeployApp(simpleApp.file_path);

                dateFormAppCreated = await applicationsService.importPublishDeployApp(dateFormApp.file_path);

                appId = appCreated.id;
            } catch (error) {
                throw new Error(`API call failed in beforeAll: ${error}`);
            }
        });

        afterAll(async () => {
            await apiServiceUserTwo.getInstance().activiti.modelsApi.deleteModel(appId);
            await apiServiceUserTwo.getInstance().activiti.modelsApi.deleteModel(simpleAppCreated.id);
            await apiServiceUserTwo.getInstance().activiti.modelsApi.deleteModel(dateFormAppCreated.id);
            await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(tenantId);
        });

        describe(' Once logged with user without apps', () => {
            beforeEach(async () => {
                await loginPage.login(procUserModel.email, procUserModel.password);
                await navigationBarPage.navigateToProcessServicesPage();
                await processServicesPage.checkApsContainer();
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
            beforeAll(async () => {
                await loginPage.login(secondProcUserModel.email, secondProcUserModel.password);
            });

            beforeEach(async () => {
                await navigationBarPage.navigateToProcessServicesPage();
                await processServicesPage.checkApsContainer();
            });

            it('[C260441] Should display start process form and default name when creating a new process', async () => {
                await processServicesPage.goToApp('Task App');
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
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
                await startProcessPage.checkOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.checkOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
            });

            it('[C260443] Should be possible to start a process without start event', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await expect(await startProcessPage.checkSelectProcessPlaceholderIsDisplayed()).toBe('');

                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);

                await expect(await startProcessPage.getDefaultName()).toEqual('My Default Name');

                await startProcessPage.checkStartProcessButtonIsEnabled();
            });

            it('[C260449] Should be possible to start a process with start event', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('Test');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();
                await processDetailsPage.checkDetailsAreDisplayed();
                const processId = await processDetailsPage.getId();
                const response = await apiService.getInstance().activiti.processApi.getProcessInstance(processId);

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
                await startProcessPage.checkOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.selectOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkStartProcessButtonIsEnabled();
            });

            it('[C286508] Should display only one option when typing an existent process definition', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.typeProcessDefinition(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkOptionIsDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkOptionIsNotDisplayed(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.selectOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkStartProcessButtonIsEnabled();
            });

            it('[C286509] Should select automatically the processDefinition when the app contains only one', async () => {
                await processServicesPage.goToApp(simpleApp.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await expect(await startProcessPage.getProcessDefinitionValue()).toBe(simpleApp.title);
                await startProcessPage.checkStartProcessButtonIsEnabled();
            });

            it('[C286511] Should be able to type the process definition and start a process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('Type');
                await startProcessPage.typeProcessDefinition(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.selectOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.checkStartProcessButtonIsEnabled();
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
                await startProcessPage.selectOption(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await expect(await startProcessPage.getProcessDefinitionValue()).toBe(browser.params.resources.Files.APP_WITH_PROCESSES.process_wse_name);
                await startProcessPage.clickProcessDropdownArrow();

                await expect(await startProcessPage.getProcessDefinitionValue()).toBe('');
            });

            it('[C260453] Should be possible to add a comment on an active process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('Comment Process');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
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
                await startProcessPage.enterProcessName('Audit Log');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Audit Log');
                await processDetailsPage.clickAuditLogButton();

                await FileBrowserUtil.isFileDownloaded(auditLogFile);
            });

            it('Should be able to attach a file using the button', async () => {
                await processServicesPage.goToApp(app.title);

                await processServiceTabBarPage.clickProcessButton();

                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();

                await startProcessPage.enterProcessName('Attach File');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
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

                await startProcessPage.enterProcessName('Show Diagram');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
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
                await startProcessPage.enterProcessName('Active Task');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Active Task');
                await processDetailsPage.clickOnActiveTask();
                await processDetailsPage.checkActiveTaskTitleIsDisplayed();
            });

            it('[C260457] Should display process in Completed when cancelled', async () => {
                await loginPage.login(secondProcUserModel.email, secondProcUserModel.password);
                await navigationBarPage.navigateToProcessServicesPage();
                await processServicesPage.checkApsContainer();
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('Cancel Process');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Cancel Process');
                await processDetailsPage.clickCancelProcessButton();
                await processFiltersPage.clickCompletedFilterButton();
                await processFiltersPage.selectFromProcessList('Cancel Process');
                await processDetailsPage.checkShowDiagramIsDisabled();
            });

            it('[C260461] Should be possible to add a comment on a completed/canceled process', async () => {
                await processServicesPage.goToApp(app.title);
                await processServiceTabBarPage.clickProcessButton();
                await processFiltersPage.clickCreateProcessButton();
                await processFiltersPage.clickNewProcessDropdown();
                await startProcessPage.enterProcessName('Comment Process 2');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('Comment Process 2');
                await processDetailsPage.clickCancelProcessButton();
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
                await startProcessPage.enterProcessName('File');
                await startProcessPage.selectFromProcessDropdown(browser.params.resources.Files.APP_WITH_PROCESSES.process_se_name);
                await startProcessPage.clickFormStartProcessButton();
                await processFiltersPage.clickRunningFilterButton();
                await processFiltersPage.selectFromProcessList('File');
                await processDetailsPage.clickCancelProcessButton();
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
                await startProcessPage.checkStartProcessButtonIsEnabled();

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
        let processUserModel, contentUserModel;
        const imageUploaded = new FileModel({
            'name': browser.params.resources.Files.PROFILE_IMAGES.ECM.file_name,
            'location': browser.params.resources.Files.PROFILE_IMAGES.ECM.file_location
        });

        beforeAll(async () => {
            const users = new UsersActions(apiService);

            const apiServiceAll = new ApiService({
                provider: 'ALL',
                hostEcm: browser.params.testConfig.appConfig.hostEcm,
                hostBpm: browser.params.testConfig.appConfig.hostBpm
            });

            await apiServiceAll.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

            processUserModel = await users.createTenantAndUser();

            contentUserModel = new AcsUserModel({
                'id': processUserModel.email,
                'password': processUserModel.password,
                'firstName': processUserModel.firstName,
                'lastName': processUserModel.lastName,
                'email': processUserModel.email
            });

            await apiServiceAll.getInstance().core.peopleApi.addPerson(contentUserModel);

            this.alfrescoJsBPMAdminUser = new ApiService({ hostBpm: browser.params.testConfig.appConfig.hostBpm });

            await this.alfrescoJsBPMAdminUser.login(processUserModel.email, processUserModel.password);

            const applicationsService = new ApplicationsUtil(this.alfrescoJsBPMAdminUser);

            const appCreated = await applicationsService.importPublishDeployApp(startProcessAttachFileApp.file_path);
            appId = appCreated.id;
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C260490] Should be able to start a Process within ACS', async () => {
            browser.params.testConfig.appConfig.provider = 'ALL';

            await loginPage.login(contentUserModel.email, contentUserModel.password);

            await contentServicesPage.goToDocumentList();
            await contentServicesPage.checkDocumentListElementsAreDisplayed();
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
            await expect(await processDetailsPage.getEmptyMessage()).toBe('This list is empty');
        });
    });

});
