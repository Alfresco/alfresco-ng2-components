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

import LoginPage = require('../pages/adf/loginPage');
import ProcessServicesPage = require('../pages/adf/process_services/processServicesPage');
import TasksPage = require('../pages/adf/process_services/tasksPage');
import { AttachmentListPage } from '../pages/adf/process_services/attachmentListPage';

import CONSTANTS = require('../util/constants');

import Tenant = require('../models/APS/Tenant');
import Task = require('../models/APS/Task');
import TaskModel = require('../models/APS/TaskModel');
import FormModel = require('../models/APS/FormModel');
import FileModel = require('../models/ACS/fileModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';
import fs = require('fs');
import path = require('path');

describe('Start Task - Task App', () => {

    let TASKDATAFORMAT = 'mmm dd yyyy';
    let loginPage = new LoginPage();
    let processServicesPage = new ProcessServicesPage();
    let attachmentListPage = new AttachmentListPage();
    let processUserModel, assigneeUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let formTextField = app.form_fields.form_fieldId;
    let formFieldValue = 'First value ';
    let taskPage = new TasksPage();
    let formModel;
    let firstComment = 'comm1', firstChecklist = 'checklist1';
    let tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    let showHeaderTask = 'Show Header';
    let jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'BPM',
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        let newTenant = await this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new Tenant());

        assigneeUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        processUserModel = await users.createApsUser(this.alfrescoJsApi, newTenant.id);

        let pathFile = path.join(TestConfig.main.rootPath + app.file_location);
        let file = fs.createReadStream(pathFile);

        await this.alfrescoJsApi.login(processUserModel.email, processUserModel.password);

        await this.alfrescoJsApi.activiti.appsApi.importAppDefinition(file);

        await this.alfrescoJsApi.activiti.taskApi.createNewTask({name: showHeaderTask});

        loginPage.loginToProcessServicesUsingUserModel(processUserModel);

        done();
    });

    it('[C260383] Modifying task', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[0])
            .addForm(app.formName).clickStartButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]);
                taskPage.usingTaskDetails().clickInvolvePeopleButton()
                    .typeUser(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
                    .selectUserToInvolve(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName)
                    .checkUserIsSelected(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
                taskPage.usingTaskDetails().clickAddInvolvedUserButton();
                expect(taskPage.usingTaskDetails().getInvolvedUserEmail(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName))
                    .toEqual(assigneeUserModel.email);
                taskPage.usingTaskDetails().selectActivityTab().addComment(firstComment)
                    .checkCommentIsDisplayed(firstComment);
                taskPage.clickOnAddChecklistButton().addName(firstChecklist).clickCreateChecklistButton();
                taskPage.checkChecklistIsDisplayed(firstChecklist);
                taskPage.usingTaskDetails().selectDetailsTab();
            });
    });

    it('[C260506] Information box', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[1]).addDescription('Description')
            .addForm(app.formName).clickStartButton()
            .then(() => {
                expect(taskPage.usingTaskDetails().getTitle()).toEqual('Activities');
            })
            .then(() => {
                return this.alfrescoJsApi.activiti.taskApi.listTasks(new Task({ sort: 'created-desc' }));
            })
            .then((response) => {
                let taskModel = new TaskModel(response.data[0]);
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(taskModel.getName());
                expect(taskPage.usingTaskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), TASKDATAFORMAT));
                expect(taskPage.usingTaskDetails().getId()).toEqual(taskModel.getId());
                expect(taskPage.usingTaskDetails().getDescription()).toEqual(taskModel.getDescription());
                expect(taskPage.usingTaskDetails().getAssignee()).toEqual(taskModel.getAssignee().getEntireName());
                expect(taskPage.usingTaskDetails().getCategory())
                    .toEqual(taskModel.getCategory() === null ? CONSTANTS.TASKDETAILS.NO_CATEGORY : taskModel.getCategory());
                expect(taskPage.usingTaskDetails().getDueDate())
                    .toEqual(taskModel.getDueDate() === null ? CONSTANTS.TASKDETAILS.NO_DATE : taskModel.getDueDate());
                expect(taskPage.usingTaskDetails().getParentName())
                    .toEqual(taskModel.getParentTaskName() === null ? CONSTANTS.TASKDETAILS.NO_PARENT : taskModel.getParentTaskName());
                expect(taskPage.usingTaskDetails().getStatus()).toEqual(CONSTANTS.TASKSTATUS.RUNNING);
                return this.alfrescoJsApi.activiti.taskFormsApi.getTaskForm(response.data[0].id);
            })
            .then(function (response) {
                formModel = new FormModel(response);
                expect(taskPage.usingTaskDetails().getFormName())
                    .toEqual(formModel.getName() === null ? CONSTANTS.TASKDETAILS.NO_FORM : formModel.getName());
            });
    });

    it('Start task with no form', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[2]).clickStartButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[2]);
                taskPage.usingFormFields().noFormIsDisplayed();
                expect(taskPage.usingTaskDetails().getFormName()).toEqual(CONSTANTS.TASKDETAILS.NO_FORM);
            });
    });

    it('[C260422] Start task buttons', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().checkStartButtonIsDisabled().addName(tasks[3])
            .checkStartButtonIsEnabled().clickCancelButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskIsNotDisplayedInTasksList(tasks[3]);
                expect(taskPage.usingFiltersPage().getActiveFilter()).toEqual(CONSTANTS.TASKFILTERS.MY_TASKS);
            });
    });

    it('[C260423] Refreshing the form', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask()
            .addForm(app.formName).addName(tasks[4]).clickStartButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[4]);
                expect(taskPage.usingFormFields().setFieldValue(by.id, formTextField, formFieldValue)
                    .getFieldValue(formTextField)).toEqual(formFieldValue);
                taskPage.usingFormFields().refreshForm().checkFieldValue(by.id, formTextField, '');
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[4]);
                taskPage.usingFormFields().setFieldValue(by.id, formTextField, formFieldValue)
                    .checkFieldValue(by.id, formTextField, formFieldValue);
                taskPage.usingFormFields().saveForm().checkFieldValue(by.id, formTextField, formFieldValue);
            });
    });

    it('[C260425] Assign User', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[5])
            .addAssignee(assigneeUserModel.firstName).clickStartButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskListIsLoaded();
                taskPage.usingTasksListPage().waitForTableBody();
                taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.INV_TASKS);
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[5]).selectTaskFromTasksList(tasks[5]);
                taskPage.checkTaskTitle(tasks[5]);
                expect(taskPage.usingTaskDetails().getAssignee()).toEqual(assigneeUserModel.firstName + ' ' + assigneeUserModel.lastName);
            });
    });

    it('Attach a file', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[6]).clickStartButton()
            .then(() => {
                attachmentListPage.clickAttachFileButton(jpgFile.location);
                attachmentListPage.checkFileIsAttached(jpgFile.name);
            });
    });

    it('[C260420] Should Information box be hidden when showHeaderContent property is set on false', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(showHeaderTask).selectTaskFromTasksList(showHeaderTask);

        taskPage.usingTaskDetails().usingTaskDetailsToggles().disableShowHeader();
        taskPage.usingTaskDetails().taskInfoDrawerIsNotDisplayed();

        taskPage.usingTaskDetails().usingTaskDetailsToggles().enableShowHeader();
        taskPage.usingTaskDetails().taskInfoDrawerIsDisplayed();
    });

    it('[C260424] Should be able to see Spinner loading on task list when clicking on Tasks', () => {
        processServicesPage.goToProcessServices().goToTaskApp();
        taskPage.usingTasksListPage().checkSpinnerIsDisplayed();
    });

});
