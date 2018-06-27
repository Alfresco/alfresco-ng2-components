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

import AdfLoginPage = require('./pages/adf/loginPage.js');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
import TasksPage = require('./pages/adf/process_services/tasksPage.js');
import AttachmentListPage = require('./pages/adf/process_services/attachmentListPage.js');

import CONSTANTS = require('./util/constants');
import BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');

import UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
import TaskAPI = require('./restAPI/APS/enterprise/TaskAPI');
import FormModelsAPI = require('./restAPI/APS/enterprise/FormModelsAPI.js');
import AppDefinitionsAPI = require('./restAPI/APS/enterprise/AppDefinitionsAPI');
import TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');

import User = require('./models/APS/User');
import Tenant = require('./models/APS/Tenant');
import Task = require('./models/APS/Task');
import TaskModel = require('./models/APS/TaskModel.js');
import FormModel = require('./models/APS/FormModel.js');
import FileModel = require('./models/ACS/fileModel.js');

import TestConfig = require('./test.config.js');
import resources = require('./util/resources.js');

import dateFormat = require('dateformat');

xdescribe('Start Task - Task App', () => {

    let adfLoginPage = new AdfLoginPage();
    let processServicesPage = new ProcessServicesPage();
    let attachmentListPage = new AttachmentListPage();
    let basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    let basicAuth, processUserModel, assigneeUserModel;
    let app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    let formTextField = app.form_fields.form_fieldId;
    let formFieldValue = 'First value ';
    let taskPage = new TasksPage();
    let taskModel, formModel;
    let firstComment = 'comm1', firstChecklist = 'checklist1';
    let tasks = ['Modifying task', 'Information box', 'No form', 'Not Created', 'Refreshing form', 'Assignee task', 'Attach File'];
    let jpgFile = new FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });

    beforeAll( (done) => {
        new TenantsAPI().createTenant(basicAuthAdmin, new Tenant())
            .then(function (result) {
                new UserAPI().createUser(basicAuthAdmin, assigneeUserModel = new User({ tenantId: JSON.parse(result.responseBody).id }));
                return new UserAPI().createUser(basicAuthAdmin, processUserModel = new User({ tenantId: JSON.parse(result.responseBody).id }));
            })
            .then(function (response) {
                basicAuth = new BasicAuthorization(processUserModel.email, processUserModel.password);
                return new AppDefinitionsAPI().importApp(basicAuth, app.file_location);
            })
            .then(() => {
                done();
            });
    });

    afterAll((done) => {
        return new TenantsAPI().deleteTenant(basicAuthAdmin, processUserModel.tenantId.toString())
            .then(function (result) {
                done();
            })
            .catch(function (error) {
                // console.log('Failed with error: ', error);
            });
    });

    it('Modifying task', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
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

    it('Information box', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[1]).addDescription('Description')
            .addForm(app.formName).clickStartButton()
            .then(() => {
                expect(taskPage.usingTaskDetails().getTitle()).toEqual('Activities');
            })
            .then(() => {
                return TaskAPI.tasksQuery(basicAuth, new Task({ sort: 'created-desc' }));
            })
            .then(function (response) {
                taskModel = new TaskModel(JSON.parse(response.responseBody).data[0]);
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(taskModel.getName());
                expect(taskPage.usingTaskDetails().getCreated()).toEqual(dateFormat(taskModel.getCreated(), CONSTANTS.TASKDATAFORMAT));
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
                return new FormModelsAPI().getForm(basicAuth, taskModel.getFormKey());
            })
            .then(function (response) {
                formModel = new FormModel(JSON.parse(response.responseBody));
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

    it('Start task buttons', () => {
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().checkStartButtonIsDisabled().addName(tasks[3])
            .checkStartButtonIsEnabled().clickCancelButton()
            .then(() => {
                taskPage.usingTasksListPage().checkTaskIsNotDisplayedInTasksList(tasks[3]);
                expect(taskPage.usingFiltersPage().getActiveFilter()).toEqual(CONSTANTS.TASKFILTERS.MY_TASKS);
            });
    });

    it('Refreshing the form', () => {
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

    it('Assign User', () => {
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
});
