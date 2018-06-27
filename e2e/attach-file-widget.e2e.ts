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

var AdfLoginPage = require('./pages/adf/loginPage.js');
var TasksPage = require('./pages/adf/process_services/tasksPage.js');
var ViewerPage = require('./pages/adf/viewerPage.js');
var UsingWidget = require('./pages/adf/process_services/widgets/usingWidget.js');
var ProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');

var UserAPI = require('./restAPI/APS/enterprise/UsersAPI');
var CONSTANTS = require('./util/constants');
var AppDefinitionsAPI = require('./restAPI/APS/enterprise/AppDefinitionsAPI');
var BasicAuthorization = require('./restAPI/httpRequest/BasicAuthorization');
var TenantsAPI = require('./restAPI/APS/enterprise/TenantsAPI');
var RuntimeAppDefinitionAPI = require('./restAPI/APS/enterprise/RuntimeAppDefinitionAPI');

var Tenant = require('./models/APS/Tenant');
var AppDefinition = require('./models/APS/AppDefinition');
var FileModel = require('./models/ACS/fileModel.js');
var User = require('./models/APS/User');
var AppPublish = require('./models/APS/AppPublish');

var TestConfig = require('./test.config.js');
var resources = require('./util/resources.js');

xdescribe('Start Task - Task App', () => {

    var adfLoginPage = new AdfLoginPage();
    var viewerPage = new ViewerPage();
    var usingWidget = new UsingWidget();
    var processServicesPage = new ProcessServicesPage();
    var taskPage = new TasksPage();

    var basicAuthAdmin = new BasicAuthorization(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    var basicAuth, processUserModel;
    var app = resources.Files.WIDGETS_SMOKE_TEST;
    var appModel, modelId;
    var tasks = ['View file'];
    var pdfFile = new FileModel({'name': resources.Files.ADF_DOCUMENTS.PDF.file_name});
    var appFilds = app.form_fields;

    beforeAll(function (done) {
        new TenantsAPI().createTenant(basicAuthAdmin, new Tenant())
            .then(function (result) {
                return new UserAPI().createUser(basicAuthAdmin, processUserModel = new User({tenantId: JSON.parse(result.responseBody).id}));
            })
            .then(function (response) {
                basicAuth = new BasicAuthorization(processUserModel.email, processUserModel.password);
                return new AppDefinitionsAPI().importApp(basicAuth, app.file_location);
            })
            .then(function (response) {
                appModel = JSON.parse(response.responseBody);
                modelId = appModel.definition.models[0].id;
                return appModel.id;
            })
            .then(() => {
                return new AppDefinitionsAPI().publishApp(basicAuth, appModel.id.toString(), new AppPublish());
            })
            .then(function (response) {
                return new RuntimeAppDefinitionAPI().deployApp(basicAuth, new AppDefinition({id: appModel.id.toString()}));
            })
            .then(function (response) {
                done();
            });
    });

    afterAll(function (done) {
        return new TenantsAPI().deleteTenant(basicAuthAdmin, processUserModel.tenantId.toString())
            .then(function (result) {
                done();
            })
            .catch(function (error) {
                console.log('Failed with error: ', error);
            });
    });

    it('[C274690] Task List attachment - View file', () => {
        adfLoginPage.loginToProcessServicesUsingUserModel(processUserModel);
        processServicesPage.goToProcessServices().goToTaskApp().clickTasksButton();
        taskPage.usingFiltersPage().goToFilter(CONSTANTS.TASKFILTERS.MY_TASKS);
        taskPage.createNewTask().addName(tasks[0]).addForm(app.formName).clickStartButton()
            .then(() => {
                usingWidget.usingAttachFileWidget().attachFile(appFilds.attachfile_id, pdfFile.location);
                usingWidget.usingAttachFileWidget().checkFileIsAttached(appFilds.attachfile_id, pdfFile.name);

                usingWidget.usingAttachFileWidget().viewFile(pdfFile.name);
                viewerPage.checkFileContent('1', pdfFile.firstPageText);
                viewerPage.checkCloseButtonIsDisplayed();
                viewerPage.clickCloseButton();
                taskPage.usingTasksListPage().checkTaskIsDisplayedInTasksList(tasks[0]);
            });
    });

});

