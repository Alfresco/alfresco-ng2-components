"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var tasksCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/tasksCloudDemoPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
var start_process_cloud_config_1 = require("./config/start-process-cloud.config");
var processCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services/processCloudDemoPage");
var processDetailsCloudDemoPage_1 = require("../pages/adf/demo-shell/process-services-cloud/processDetailsCloudDemoPage");
var fileModel_1 = require("../models/ACS/fileModel");
var js_api_1 = require("@alfresco/js-api");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var breadCrumbDropdownPage_1 = require("../pages/adf/content-services/breadcrumb/breadCrumbDropdownPage");
describe('Start Task Form', function () {
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var taskFormCloudComponent = new adf_testing_1.TaskFormCloudComponent();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var appListCloudComponent = new adf_testing_1.AppListCloudPage();
    var tasksCloudDemoPage = new tasksCloudDemoPage_1.TasksCloudDemoPage();
    var startTask = new adf_testing_1.StartTasksCloudPage();
    var contentNodeSelectorDialogPage = new adf_testing_1.ContentNodeSelectorDialogPage();
    var breadCrumbDropdownPage = new breadCrumbDropdownPage_1.BreadCrumbDropdownPage();
    var processDetailsCloudDemoPage = new processDetailsCloudDemoPage_1.ProcessDetailsCloudDemoPage();
    var settingsPage = new adf_testing_1.SettingsPage();
    var widget = new adf_testing_1.Widget();
    var startProcessPage = new adf_testing_1.StartProcessCloudPage();
    var processCloudDemoPage = new processCloudDemoPage_1.ProcessCloudDemoPage();
    var taskHeaderCloudPage = new adf_testing_1.TaskHeaderCloudPage();
    var processHeaderCloud = new adf_testing_1.ProcessHeaderCloudPage();
    var apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.providers);
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.config.bpmHost
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var startProcessCloudConfiguration = new start_process_cloud_config_1.StartProcessCloudConfiguration();
    var startProcessCloudConfig = startProcessCloudConfiguration.getConfiguration();
    var standaloneTaskName = adf_testing_1.StringUtil.generateRandomString(5);
    var startEventFormProcess = adf_testing_1.StringUtil.generateRandomString(5);
    var testUser, acsUser, groupInfo;
    var processDefinitionService;
    var processInstancesService;
    var processDefinition, uploadLocalFileProcess, uploadContentFileProcess, uploadDefaultFileProcess, cancelUploadFileProcess, completeUploadFileProcess;
    var candidateBaseApp = resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.name;
    var pdfFile = new fileModel_1.FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    var pdfFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    var testFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });
    var identityService;
    var groupIdentityService;
    var folderName = adf_testing_1.StringUtil.generateRandomString(5);
    var uploadedFolder;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 1:
                    _a.sent();
                    identityService = new adf_testing_1.IdentityService(apiService);
                    groupIdentityService = new adf_testing_1.GroupIdentityService(apiService);
                    return [4 /*yield*/, identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.APS_USER])];
                case 2:
                    testUser = _a.sent();
                    return [4 /*yield*/, groupIdentityService.getGroupInfoByGroupName('hr')];
                case 3:
                    groupInfo = _a.sent();
                    return [4 /*yield*/, identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                case 5:
                    _a.sent();
                    processDefinitionService = new adf_testing_1.ProcessDefinitionsService(apiService);
                    processInstancesService = new adf_testing_1.ProcessInstancesService(apiService);
                    return [4 /*yield*/, processDefinitionService
                            .getProcessDefinitionByName(resources.ACTIVITI7_APPS.CANDIDATE_BASE_APP.processes.uploadFileProcess, candidateBaseApp)];
                case 6:
                    processDefinition = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 8:
                    uploadLocalFileProcess = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 9:
                    uploadContentFileProcess = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 10:
                    uploadDefaultFileProcess = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 11:
                    cancelUploadFileProcess = _a.sent();
                    return [4 /*yield*/, processInstancesService.createProcessInstance(processDefinition.entry.key, candidateBaseApp, {
                            'name': adf_testing_1.StringUtil.generateRandomString(),
                            'businessKey': adf_testing_1.StringUtil.generateRandomString()
                        })];
                case 12:
                    completeUploadFileProcess = _a.sent();
                    return [4 /*yield*/, new acsUserModel_1.AcsUserModel({
                            email: testUser.email,
                            password: testUser.password,
                            id: testUser.username,
                            firstName: testUser.firstName,
                            lastName: testUser.lastName
                        })];
                case 13:
                    acsUser = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                case 17:
                    uploadedFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(testFileModel.location, testFileModel.name, uploadedFolder.entry.id)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpmSso(protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.bpmHost, protractor_1.browser.params.config.oauth2.host, protractor_1.browser.params.config.identityHost, protractor_1.browser.params.config.oauth2.clientId)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('adf-cloud-start-process', JSON.stringify(startProcessCloudConfig))];
                case 22:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var tasksService, standAloneTaskId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(uploadedFolder.entry.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(testUser.email, testUser.password)];
                case 2:
                    _a.sent();
                    tasksService = new adf_testing_1.TasksService(apiService);
                    return [4 /*yield*/, tasksService.getTaskId(standaloneTaskName, candidateBaseApp)];
                case 3:
                    standAloneTaskId = _a.sent();
                    return [4 /*yield*/, tasksService.deleteTask(standAloneTaskId, candidateBaseApp)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apiService.login(protractor_1.browser.params.identityAdmin.email, protractor_1.browser.params.identityAdmin.password)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, identityService.deleteIdentityUser(testUser.idIdentityService)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('StandaloneTask with form', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(candidateBaseApp)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C307976] Should be able to start and save a task with a form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, startTask.addName(standaloneTaskName)];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, startTask.selectFormDefinition('StartEventForm')];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, startTask.clickStartButton()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName)];
                    case 7:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.formFields().checkFormIsDisplayed()];
                    case 8:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.formFields().checkWidgetIsVisible('FirstName')];
                    case 9:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.formFields().checkWidgetIsVisible('Number07vyx9')];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, widget.textWidget().setValue('FirstName', 'sample')];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, widget.numberWidget().setFieldValue('Number07vyx9', 26)];
                    case 12:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkSaveButtonIsDisplayed()];
                    case 13:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.clickSaveButton()];
                    case 14:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, widget.textWidget().getFieldValue('FirstName')];
                    case 15: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toBe('sample')];
                    case 16:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, widget.numberWidget().getFieldValue('Number07vyx9')];
                    case 17: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toBe('26')];
                    case 18:
                        _f.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                    case 19:
                        _f.sent();
                        return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                    case 20:
                        _f.sent();
                        return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(candidateBaseApp)];
                    case 21:
                        _f.sent();
                        return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                    case 22:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().getDataTable().waitForTableBody()];
                    case 23:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                    case 24: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toBe('My Tasks')];
                    case 25:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedByName(standaloneTaskName)];
                    case 26:
                        _f.sent();
                        return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRow(standaloneTaskName)];
                    case 27:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.formFields().checkFormIsDisplayed()];
                    case 28:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, widget.textWidget().getFieldValue('FirstName')];
                    case 29: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toBe('sample')];
                    case 30:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, widget.numberWidget().getFieldValue('Number07vyx9')];
                    case 31: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toBe('26')];
                    case 32:
                        _f.sent();
                        return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsDisplayed()];
                    case 33:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C311428] Should display the Standalone forms based on the flag set', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tasksCloudDemoPage.openNewTaskForm()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, startTask.checkFormIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, startTask.checkFormDefinitionIsNotDisplayed('UploadFileForm')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, startTask.checkFormDefinitionIsDisplayed('StartEventForm')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startTask.checkFormDefinitionIsDisplayed('FormToTestValidations')];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Start a process with a start event form', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(candidateBaseApp)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.openNewProcessForm()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, startProcessPage.clearField(startProcessPage.processNameInput)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, startProcessPage.enterProcessName(startEventFormProcess)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, startProcessPage.selectFromProcessDropdown('processwithstarteventform')];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, startProcessPage.formFields().checkFormIsDisplayed()];
                        case 9:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311277] Should be able to start a process with a start event form - default values', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, widget.textWidget().getFieldValue('FirstName')];
                        case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('sample name')];
                        case 2:
                            _c.sent();
                            _b = expect;
                            return [4 /*yield*/, widget.numberWidget().getFieldValue('Number07vyx9')];
                        case 3: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('17')];
                        case 4:
                            _c.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311277] Should be able to start a process with a start event form - form validation', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                return __generator(this, function (_j) {
                    switch (_j.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, widget.textWidget().getErrorMessage('FirstName')];
                        case 1: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toContain('Enter no more than 10 characters')];
                        case 2:
                            _j.sent();
                            _b = expect;
                            return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                        case 3: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toBe(false)];
                        case 4:
                            _j.sent();
                            return [4 /*yield*/, widget.textWidget().setValue('FirstName', 'Sam')];
                        case 5:
                            _j.sent();
                            _c = expect;
                            return [4 /*yield*/, widget.textWidget().getErrorMessage('FirstName')];
                        case 6: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toContain('Enter at least 5 characters')];
                        case 7:
                            _j.sent();
                            _d = expect;
                            return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                        case 8: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toBe(false)];
                        case 9:
                            _j.sent();
                            return [4 /*yield*/, widget.numberWidget().setFieldValue('Number07vyx9', 9)];
                        case 10:
                            _j.sent();
                            _e = expect;
                            return [4 /*yield*/, widget.numberWidget().getErrorMessage('Number07vyx9')];
                        case 11: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toContain('Can\'t be less than 10')];
                        case 12:
                            _j.sent();
                            _f = expect;
                            return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                        case 13: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toBe(false)];
                        case 14:
                            _j.sent();
                            return [4 /*yield*/, widget.numberWidget().setFieldValue('Number07vyx9', 99999)];
                        case 15:
                            _j.sent();
                            _g = expect;
                            return [4 /*yield*/, widget.numberWidget().getErrorMessage('Number07vyx9')];
                        case 16: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toContain('Can\'t be greater than 1,000')];
                        case 17:
                            _j.sent();
                            _h = expect;
                            return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                        case 18: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toBe(false)];
                        case 19:
                            _j.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311277] Should be able to start a process with a start event form - claim and complete the process', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, processId, taskId, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, widget.textWidget().setValue('FirstName', 'Sample')];
                        case 1:
                            _d.sent();
                            return [4 /*yield*/, widget.numberWidget().setFieldValue('Number07vyx9', 100)];
                        case 2:
                            _d.sent();
                            _a = expect;
                            return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                        case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(true)];
                        case 4:
                            _d.sent();
                            return [4 /*yield*/, startProcessPage.clickStartProcessButton()];
                        case 5:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().clickProcessFilter()];
                        case 6:
                            _d.sent();
                            _b = expect;
                            return [4 /*yield*/, processCloudDemoPage.getActiveFilterName()];
                        case 7: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe('Running Processes')];
                        case 8:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().clickCustomiseFilterHeader()];
                        case 9:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.editProcessFilterCloudComponent().setProperty('processName', startEventFormProcess)];
                        case 10:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().waitTillContentLoaded()];
                        case 11:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(startEventFormProcess)];
                        case 12:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', startEventFormProcess)];
                        case 13:
                            _d.sent();
                            return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                        case 14:
                            _d.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('StartEventFormTask')];
                        case 15:
                            _d.sent();
                            return [4 /*yield*/, processHeaderCloud.getId()];
                        case 16:
                            processId = _d.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('StartEventFormTask')];
                        case 17:
                            _d.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 18:
                            _d.sent();
                            return [4 /*yield*/, taskHeaderCloudPage.getId()];
                        case 19:
                            taskId = _d.sent();
                            return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsDisplayed()];
                        case 20:
                            _d.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickCompleteButton()];
                        case 21:
                            _d.sent();
                            _c = expect;
                            return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                        case 22: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe('My Tasks')];
                        case 23:
                            _d.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId)];
                        case 24:
                            _d.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                        case 25:
                            _d.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId)];
                        case 26:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                        case 27:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.completedProcessesFilter().clickProcessFilter()];
                        case 28:
                            _d.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedById(processId)];
                        case 29:
                            _d.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
    describe('Attach content to process-cloud task form using upload widget', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.checkApsContainer()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.checkAppIsDisplayed(candidateBaseApp)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, appListCloudComponent.goToApp(candidateBaseApp)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.clickOnProcessFilters()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.runningProcessesFilter().clickProcessFilter()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkProcessListIsLoaded()];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C310358] Should be able to attach a file to a form from local', function () { return __awaiter(_this, void 0, void 0, function () {
                var localFileWidget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadLocalFileProcess.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadLocalFileProcess.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachlocalfile')];
                        case 6:
                            localFileWidget = _a.sent();
                            return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, localFileWidget.attachLocalFile(pdfFile.location)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, localFileWidget.checkFileIsAttached(pdfFile.name)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, localFileWidget.removeFile(pdfFile.name)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, localFileWidget.checkFileIsNotAttached(pdfFile.name)];
                        case 11:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311285] Should be able to attach a file to a form from acs repository', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 6:
                            contentFileWidget = _a.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name)];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickMoveCopyButton()];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.removeFile(testFileModel.name)];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsNotAttached(testFileModel.name)];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile')];
                        case 18:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311287] Content node selector default location when attaching a file to a form from acs repository', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget, _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadDefaultFileProcess.entry.name)];
                        case 1:
                            _f.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadDefaultFileProcess.entry.name)];
                        case 2:
                            _f.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _f.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _f.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 5:
                            _f.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 6:
                            contentFileWidget = _f.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 7:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 8:
                            _f.sent();
                            _a = expect;
                            return [4 /*yield*/, breadCrumbDropdownPage.getTextOfCurrentFolder()];
                        case 9: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toBe(testUser.username)];
                        case 10:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 11:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowContentIsDisplayed(folderName)];
                        case 12:
                            _f.sent();
                            _b = expect;
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkCancelButtonIsEnabled()];
                        case 13: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toBe(true)];
                        case 14:
                            _f.sent();
                            _c = expect;
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkCopyMoveButtonIsEnabled()];
                        case 15: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toBe(false)];
                        case 16:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(folderName)];
                        case 17:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(folderName)];
                        case 18:
                            _f.sent();
                            _d = expect;
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkCancelButtonIsEnabled()];
                        case 19: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toBe(true)];
                        case 20:
                            _f.sent();
                            _e = expect;
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkCopyMoveButtonIsEnabled()];
                        case 21: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toBe(false)];
                        case 22:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickCancelButton()];
                        case 23:
                            _f.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 24:
                            _f.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311288] No file should be attached when canceling the content node selector', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(cancelUploadFileProcess.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', cancelUploadFileProcess.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 6:
                            contentFileWidget = _a.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowContentIsDisplayed(folderName)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickCancelButton()];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsNotAttached(testFileModel.name)];
                        case 17:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311289] Should be able to attach single file', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 5:
                            contentFileWidget = _a.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickMoveCopyButton()];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile')];
                        case 15:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311292] Attached file is not displayed anymore after release if the form is not saved', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 5:
                            contentFileWidget = _a.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickMoveCopyButton()];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile')];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickReleaseButton()];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsNotAttached(testFileModel.name)];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsDisplayed('Attachsinglecontentfile')];
                        case 19:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311293] Attached file is displayed after release if the form was saved', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(uploadContentFileProcess.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', uploadContentFileProcess.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 5:
                            contentFileWidget = _a.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name)];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name)];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickMoveCopyButton()];
                        case 12:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 14:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile')];
                        case 15:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickSaveButton()];
                        case 16:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickReleaseButton()];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 18:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 19:
                            _a.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile')];
                        case 20:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C311295] Attached file is displayed after complete', function () { return __awaiter(_this, void 0, void 0, function () {
                var contentFileWidget, taskId, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().checkContentIsDisplayedByName(completeUploadFileProcess.entry.name)];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, processCloudDemoPage.processListCloudComponent().getDataTable().selectRow('Name', completeUploadFileProcess.entry.name)];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.checkTaskIsDisplayed('UploadFileTask')];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, processDetailsCloudDemoPage.selectProcessTaskByName('UploadFileTask')];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickClaimButton()];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, widget.attachFileWidgetCloud('Attachsinglecontentfile')];
                        case 6:
                            contentFileWidget = _b.sent();
                            return [4 /*yield*/, contentFileWidget.clickAttachContentFile('Attachsinglecontentfile')];
                        case 7:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsDisplayed()];
                        case 8:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().doubleClickRowByContent(folderName)];
                        case 9:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().waitTillContentLoaded()];
                        case 10:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().clickRowByContent(testFileModel.name)];
                        case 11:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.contentListPage().dataTablePage().checkRowByContentIsSelected(testFileModel.name)];
                        case 12:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.clickMoveCopyButton()];
                        case 13:
                            _b.sent();
                            return [4 /*yield*/, contentNodeSelectorDialogPage.checkDialogIsNotDisplayed()];
                        case 14:
                            _b.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 15:
                            _b.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile')];
                        case 16:
                            _b.sent();
                            return [4 /*yield*/, taskHeaderCloudPage.getId()];
                        case 17:
                            taskId = _b.sent();
                            return [4 /*yield*/, taskFormCloudComponent.checkCompleteButtonIsDisplayed()];
                        case 18:
                            _b.sent();
                            return [4 /*yield*/, taskFormCloudComponent.clickCompleteButton()];
                        case 19:
                            _b.sent();
                            _a = expect;
                            return [4 /*yield*/, tasksCloudDemoPage.getActiveFilterName()];
                        case 20: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('My Tasks')];
                        case 21:
                            _b.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsNotDisplayedById(taskId)];
                        case 22:
                            _b.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.completedTasksFilter().clickTaskFilter()];
                        case 23:
                            _b.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().checkContentIsDisplayedById(taskId)];
                        case 24:
                            _b.sent();
                            return [4 /*yield*/, tasksCloudDemoPage.taskListCloudComponent().selectRowByTaskId(taskId)];
                        case 25:
                            _b.sent();
                            return [4 /*yield*/, contentFileWidget.checkFileIsAttached(testFileModel.name)];
                        case 26:
                            _b.sent();
                            return [4 /*yield*/, contentFileWidget.checkUploadContentButtonIsNotDisplayed('Attachsinglecontentfile')];
                        case 27:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=start-task-form-cloud.e2e.js.map