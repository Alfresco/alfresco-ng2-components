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
    AppListCloudPage,
    LocalStorageUtil,
    LoginSSOPage,
    ProcessDefinitionsService,
    ProcessInstancesService,
    QueryService,
    TaskFormCloudComponent,
    TaskHeaderCloudPage
} from '@alfresco/adf-testing';
import { browser, protractor } from 'protractor';
import { ProcessCloudDemoPage } from '../pages/adf/demo-shell/process-services/processCloudDemoPage';
import { ProcessDetailsCloudDemoPage } from '../pages/adf/demo-shell/process-services-cloud/processDetailsCloudDemoPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ProcessListPage } from '../pages/adf/process-services/processListPage';
import { EditProcessFilterConfiguration } from './config/edit-process-filter.config';
import { ProcessListCloudConfiguration } from './config/process-list-cloud.config';

describe('Process filters cloud', () => {
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudPage();
    const processCloudDemoPage = new ProcessCloudDemoPage();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const processDetailsCloudDemoPage = new ProcessDetailsCloudDemoPage();
    const taskHeaderCloudPage = new TaskHeaderCloudPage();
    const taskFormCloudComponent = new TaskFormCloudComponent();
    const processListPage = new ProcessListPage();
    const apiService = new ApiService(
        browser.params.config.oauth2.clientId,
        browser.params.config.bpmHost, browser.params.config.oauth2.host, browser.params.config.providers
    );

    const processListCloudConfigFile = new ProcessListCloudConfiguration().getConfiguration();
    const editProcessFilterConfigFile = new EditProcessFilterConfiguration().getConfiguration();

    let processDefinitionService: ProcessDefinitionsService;
    let processInstancesService: ProcessInstancesService;
    let queryService: QueryService;

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    let simpleProcessDefinition, processInstance, taskAssigned, taskName;

    beforeAll(async () => {
        await apiService.login(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        processDefinitionService = new ProcessDefinitionsService(apiService);
        processInstancesService = new ProcessInstancesService(apiService);
        queryService = new QueryService(apiService);

        simpleProcessDefinition = await processDefinitionService
            .getProcessDefinitionByName(browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.processes.processstring, simpleApp);
        processInstance = await processInstancesService.createProcessInstance(simpleProcessDefinition.entry.key, simpleApp);
        taskAssigned = await queryService.getProcessInstanceTasks(processInstance.entry.id, simpleApp);
        taskName = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.tasks.processstring;

        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.hrUser.email, browser.params.testConfig.hrUser.password);
        await LocalStorageUtil.setConfigField('adf-edit-process-filter', JSON.stringify(editProcessFilterConfigFile));
        await LocalStorageUtil.setConfigField('adf-cloud-process-list', JSON.stringify(processListCloudConfigFile));

    });

    beforeEach(async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudComponent.checkApsContainer();
        await appListCloudComponent.goToApp(simpleApp);
        await tasksCloudDemoPage.taskListCloudComponent().checkTaskListIsLoaded();
        await processCloudDemoPage.clickOnProcessFilters();
    });

    it('[C290041] Should be displayed the "No Process Found" message when the process list is empty', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(simpleApp);
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('COMPLETED');

        await processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded();
        await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().contents.count()).toBeGreaterThan(0);

        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', 'i_am_fake_id');
        await expect(await processListPage.getDisplayedProcessListTitle()).toEqual('No Processes Found');
    });

    it('[C315296] Should NOT display "No Process Found" before displaying the process list', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(simpleApp);
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('COMPLETED');

        await expect(await processListPage.isNotEmpty()).toBeTruthy();
        await expect(await processCloudDemoPage.processListCloudComponent().getDataTable().contents.count()).toBeGreaterThan(0);

        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', 'i_am_fake_id');
        await processListPage.isEmpty();
    });

    it('[C290040] Should be able to open the Task Details page by clicking on the process name', async () => {
        await processCloudDemoPage.editProcessFilterCloudComponent().openFilter();
        await processCloudDemoPage.editProcessFilterCloudComponent().setAppNameDropDown(simpleApp);
        await processCloudDemoPage.editProcessFilterCloudComponent().setStatusFilterDropDown('RUNNING');
        await processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processInstanceId', processInstance.entry.id);

        await processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Id', processInstance.entry.id);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();

        await processDetailsCloudDemoPage.checkTaskIsDisplayed(taskName);
        await browser.navigate().back();

        await tasksCloudDemoPage.clickOnTaskFilter();
        await tasksCloudDemoPage.editTaskFilterCloudComponent().openFilter();
        await tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(taskAssigned.list.entries[0].entry.name);
        await tasksCloudDemoPage.taskListCloudComponent().selectRow(taskAssigned.list.entries[0].entry.name);
        await taskHeaderCloudPage.checkTaskPropertyListIsDisplayed();
        await expect(await taskFormCloudComponent.getFormTitle()).toContain(taskName);
        await taskFormCloudComponent.clickCompleteButton();
    });
});
