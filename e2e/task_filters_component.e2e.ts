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

 /*tslint:disable:ban */

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import LoginPage = require('./pages/adf/loginPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import StartProcessPage = require('./pages/adf/process_services/startProcessPage');
import ProcessFiltersPage = require('./pages/adf/process_services/processFiltersPage');
import AppNavigationBarPage = require('./pages/adf/process_services/appNavigationBarPage');
import ProcessDetailsPage = require('./pages/adf/process_services/processDetailsPage');
import TaskFiltersPage = require('./pages/adf/process_services/taskFiltersPage');

import AlfrescoApi = require('alfresco-js-api-node');
import { AppsActions } from './actions/APS/apps.actions';
import { UsersActions } from './actions/users.actions';




fdescribe('Task Filters Test', () => {

    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let processServicesPage = new ProcessServicesPage();
    let startProcessPage = new StartProcessPage();
    let processFiltersPage = new ProcessFiltersPage();
    let appNavigationBarPage = new AppNavigationBarPage();
    let processDetailsPage = new ProcessDetailsPage();
    let taskFiltersPage = new TaskFiltersPage();

    let app = resources.Files.APP_WITH_DATE_FIELD_FORM;

    let processTitle = {
        running: 'Test_running',
        completed: 'Test_completed'
    };
    let processFilter = {
        running: 'Running',
        all: 'All',
        completed: 'Completed'
    };

    beforeAll(async (done) => {
        let apps = new AppsActions();
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let user = await users.createTenantAndUser(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(user.email, user.password);

        await apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location);

        await loginPage.loginToProcessServicesUsingUserModel(user);

        done();
    });

    it('[C260330] Should display task list when app is in task section', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        expect(taskFiltersPage.checkMyTasksItem()).toBe('My Tasks');
        expect(taskFiltersPage.checkQueuedTaskItem()).toBe('Queued Tasks');
        expect(taskFiltersPage.checkCompletedTaskItem()).toBe('Completed Tasks');
        expect(taskFiltersPage.checkInvolvedTaskItem()).toBe('Involved Tasks');

    });

    it('[C260330] Should collapse Task Filter List when it is clicked', () => {
        navigationBarPage.clickProcessServicesButton();

        processServicesPage.checkApsContainer();
        processServicesPage.goToApp(app.title);

        expect(taskFiltersPage.checkTasksAccordion()).toBeDefined;

        taskFiltersPage.clickTasksAccordionButton();  
        
        expect(taskFiltersPage.checkTasksAccordion()).toBeNull;

    });


    
   
});
