/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
/*tslint:disable*/

import { LoginPage } from '../pages/adf/loginPage';
import { ProcessServicesPage } from '../pages/adf/process_services/processServicesPage';
import ProcessFiltersPage = require('../pages/adf/process_services/processFiltersPage');
import { Widget } from '../pages/adf/process_services/widgets/widget';
import StartProcess = require('../pages/adf/process_services/startProcessPage');
import ProcessDetailsPage = require('../pages/adf/process_services/processDetailsPage');
import { TaskDetailsPage } from '../pages/adf/process_services/taskDetailsPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from '../actions/APS/apps.actions';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('Form widgets - People', () => {

    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let processUserModel;
    let app = resources.Files.APP_WITH_USER_WIDGET;
    let processFiltersPage = new ProcessFiltersPage();
    let appModel;
    let alfrescoJsApi;
    let widget = new Widget();
    let startProcess = new StartProcess();
    let processDetailsPage = new ProcessDetailsPage();
    let taskDetails = new TaskDetailsPage();

    beforeAll(async (done) => {
        let users = new UsersActions();
        let appsActions = new AppsActions();

        alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(alfrescoJsApi);

        await alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        appModel = await appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location);

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    afterAll(async (done) => {

        await alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId);

        done();
    });

    it('[C272778] Check text, multiline widgets - label, value and displayed', async () => {

        processServicesPage.goToProcessServices().goToApp(appModel.name)
            .clickProcessButton();
        processFiltersPage.clickCreateProcessButton();
        processFiltersPage.clickNewProcessDropdown();

        widget.peopleWidget().checkPeopleFieldIsDisplayed();
        widget.peopleWidget().fillPeopleField(processUserModel.firstName);
        widget.peopleWidget().selectUserFromDropdown();

        startProcess.clickStartProcessButton();
        processDetailsPage.clickOnActiveTask();

        browser.controlFlow().execute(async () => {
            let taskId = await taskDetails.getId();
            let taskForm = await alfrescoJsApi.activiti.taskApi.getTaskForm(taskId);
            let userEmail = taskForm["fields"][0].fields["1"][0].value.email;
            expect(userEmail).toEqual(processUserModel.email);
        });
    });
});
