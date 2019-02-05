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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import { AppListCloudComponent } from '../pages/adf/process-cloud/appListCloudComponent';
import TestConfig = require('../test.config');
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { TasksCloudDemoPage } from '../pages/adf/demo-shell/process-services/tasksCloudDemoPage';
import { StartTasksCloudComponent } from '../pages/adf/process-cloud/startTasksCloudComponent';
import { Util } from '../util/util';

describe('Start Task', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudComponent = new AppListCloudComponent();
    const tasksCloudDemoPage = new TasksCloudDemoPage();
    const startTask = new StartTasksCloudComponent();
    const standaloneTaskName = Util.generateRandomString(5);
    const taskName255Characters = Util.generateRandomString(255);
    const taskNameBiggerThen255Characters = Util.generateRandomString(256);
    const lengthValidationError = 'Length exceeded, 255 characters max.';
    const requiredError = 'Field required';
    const dateValidationError = 'Date format DD/MM/YYYY';
    const user = TestConfig.adf.adminEmail, password = TestConfig.adf.adminPassword;
    const appName = 'simple-app';
    let silentLogin;

    beforeAll((done) => {
        silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
        loginSSOPage.clickOnSSOButton();
        loginSSOPage.loginAPS(user, password);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudComponent.checkApsContainer();
        appListCloudComponent.checkAppIsDisplayed(appName);
        appListCloudComponent.goToApp(appName);
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody();
        done();
    });

    it('[C290166] Should be possible to cancel a task', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.checkStartButtonIsDisabled()
                 .blur(startTask.name)
                 .checkValidationErrorIsDisplayed(requiredError);
        startTask.addName(standaloneTaskName)
                 .addDescription('descriptions')
                 .addDueDate('12/12/2018');
        startTask.checkStartButtonIsEnabled();
        startTask.clickCancelButton();
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(standaloneTaskName);
    });

    it('[C290180] Should be able to create a new standalone task', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.addName(standaloneTaskName)
                 .addDescription('descriptions')
                 .addDueDate('12/12/2018')
                 .addPriority('50')
                 .clickStartButton();
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsDisplayed(standaloneTaskName);
    });

    it('[C290181] Should be displayed an error message if task name exceed 255 characters', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.addName(taskName255Characters)
                 .checkStartButtonIsEnabled();
        startTask.addName(taskNameBiggerThen255Characters)
                 .blur(startTask.name)
                 .checkValidationErrorIsDisplayed(lengthValidationError)
                 .checkStartButtonIsDisabled()
                 .clickCancelButton();
    });

    it('[C291774] Should be displayed an error message if the date is invalid', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.addDueDate('12/12/2018')
                 .checkStartButtonIsEnabled();
        startTask.addDueDate('invalid date')
                 .blur(startTask.dueDate)
                 .validateDate(dateValidationError)
                 .checkStartButtonIsDisabled()
                 .clickCancelButton();
    });

    it('[C290182] Should be possible to assign the task to another user', () => {
        tasksCloudDemoPage.openNewTaskForm();
        startTask.addName(standaloneTaskName)
                 .addAssignee('User')
                 .clickStartButton();
        tasksCloudDemoPage.myTasksFilter().clickTaskFilter();
        expect(tasksCloudDemoPage.getActiveFilterName()).toBe('My Tasks');
        tasksCloudDemoPage.taskListCloudComponent().getDataTable().checkContentIsNotDisplayed(standaloneTaskName);
    });

});
