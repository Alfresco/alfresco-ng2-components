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
    AppListCloudPage,
    ContentNodeSelectorDialogPage,
    createApiService,
    FileModel,
    GroupIdentityService,
    IdentityService,
    // LocalStorageUtil,
    LoginPage,
    // LoginPage,
    ProcessCloudWidgetPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    QueryService,
    StartTasksCloudPage,
    StringUtil,
    TasksService,
    UploadActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { browser } from 'protractor';
import { TasksCloudDemoPage } from '../pages/tasks-cloud-demo.page';
// import { StartProcessCloudConfiguration } from '../config/start-process-cloud.config';

describe('', () => {
    // const app = browser.params.resources.Files.WIDGET_CHECK_APP;

    // const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const widget = new ProcessCloudWidgetPage();
    const contentNodeSelectorDialogPage = new ContentNodeSelectorDialogPage();

    const appListCloudComponent = new AppListCloudPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const taskList = tasksCloudDemoPage.taskListCloudComponent();
    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;
    const startTask = new StartTasksCloudPage();
    // const pdfFileOne = {
    //     name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
    //     location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    // };

    const loginSSOPage = new LoginPage();


    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const identityService = new IdentityService(apiService);
    const groupIdentityService = new GroupIdentityService(apiService);
    const queryService = new QueryService(apiService);
    const tasksService = new TasksService(apiService);

    // const startProcessCloudConfiguration = new StartProcessCloudConfiguration();
    // const startProcessCloudConfig = startProcessCloudConfiguration.getConfiguration();

    let testUser, groupInfo;
    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let processDefinition, uploadContentFileProcess;
    const candidateBaseApp = browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name;
    // const pdfFile = new FileModel({ 'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name });

    const pdfFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
    });
    const testFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
    });

    const folderName = StringUtil.generateRandomString(5);
    let uploadedFolder;

    beforeAll(async () => {
        // await apiService.loginWithProfile('hrUser');
  
        await apiService.loginWithProfile('identityAdmin');

        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER]);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);

        await apiService.login(testUser.username, testUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        processInstancesService = new ProcessInstancesService(apiService);
        processDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.processes.uploadFileProcess, candidateBaseApp);

        await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp);


        uploadContentFileProcess = await processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
            'name': StringUtil.generateRandomString(),
            'businessKey': StringUtil.generateRandomString()
        });
        const task = await queryService.getProcessInstanceTasks(uploadContentFileProcess.entry.id, candidateBaseApp);
        await tasksService.claimTask(task.list.entries[0].entry.id, candidateBaseApp);

        await apiService.login(testUser.username, testUser.password);
        uploadedFolder = await uploadActions.createFolder(folderName, '-my-');
        await uploadActions.uploadFile(testFileModel.location, testFileModel.name, uploadedFolder.entry.id);
        await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id);

        await loginSSOPage.login(testUser.username, testUser.password);
        // await LocalStorageUtil.setConfigField('adf-cloud-start-process', JSON.stringify(startProcessCloudConfig));


    });

    it('', async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
        await taskList.getDataTable().waitForTableBody();
        await tasksCloudDemoPage.openNewTaskForm();
        await startTask.checkFormIsDisplayed();
        await startTask.addName('standaloneTaskName');
        await startTask.selectFormDefinition(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.forms.attachMultipleSingle.name);
        await startTask.clickStartButton();
        await taskList.getDataTable().waitTillContentLoaded();
        await taskList.selectRow('standaloneTaskName');
        const localFileWidget = await widget.attachFileWidgetCloud('Attachfile0whgiz');
        await localFileWidget.clickAttachContentFile('Attachfile0whgiz');
        await contentNodeSelectorDialogPage.attachFileFromContentNode(folderName, testFileModel.name);

        await localFileWidget.clickOnFile('testExtension.test');
        // await contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name);

        debugger;
        // await contentNodeSelectorDialogPage.attachFilesFromLocal([pdfFile]);
        // await localFileWidget.checkFileIsAttached(pdfFile.name);
    });

});
