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
var adf_testing_1 = require("@alfresco/adf-testing");
var CONSTANTS = require("../util/constants");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var tasksListPage_1 = require("../pages/adf/process-services/tasksListPage");
var taskDetailsPage_1 = require("../pages/adf/process-services/taskDetailsPage");
var filtersPage_1 = require("../pages/adf/process-services/filtersPage");
var standaloneTask_1 = require("../models/APS/standaloneTask");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
describe('Task Details - Form', function () {
    var loginPage = new adf_testing_2.LoginPage();
    var tasksListPage = new tasksListPage_1.TasksListPage();
    var taskDetailsPage = new taskDetailsPage_1.TaskDetailsPage();
    var filtersPage = new filtersPage_1.FiltersPage();
    var task, otherTask, user, newForm, attachedForm, otherAttachedForm;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users, attachedFormModel, otherTaskModel, otherAttachedFormModel, newFormModel, otherEmptyTask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    attachedFormModel = {
                        'name': adf_testing_1.StringUtil.generateRandomString(),
                        'description': '',
                        'modelType': 2,
                        'stencilSet': 0
                    };
                    otherTaskModel = new standaloneTask_1.StandaloneTask();
                    otherAttachedFormModel = {
                        'name': adf_testing_1.StringUtil.generateRandomString(),
                        'description': '',
                        'modelType': 2,
                        'stencilSet': 0
                    };
                    newFormModel = {
                        'name': adf_testing_1.StringUtil.generateRandomString(),
                        'description': '',
                        'modelType': 2,
                        'stencilSet': 0
                    };
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.createModel(attachedFormModel)];
                case 4:
                    attachedForm = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.createModel(newFormModel)];
                case 5:
                    newForm = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask(otherTaskModel)];
                case 6:
                    otherEmptyTask = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.modelsApi.createModel(otherAttachedFormModel)];
                case 7:
                    otherAttachedForm = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.attachForm(otherEmptyTask.id, { 'formId': otherAttachedForm.id })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.getTask(otherEmptyTask.id)];
                case 9:
                    otherTask = _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var taskModel, emptyTask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskModel = new standaloneTask_1.StandaloneTask();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.createNewTask(taskModel)];
                case 1:
                    emptyTask = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.attachForm(emptyTask.id, { 'formId': attachedForm.id })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.taskApi.getTask(emptyTask.id)];
                case 3:
                    task = _a.sent();
                    return [4 /*yield*/, new navigationBarPage_1.NavigationBarPage().navigateToProcessServicesPage()];
                case 4: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, tasksListPage.checkTaskListIsLoaded()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, filtersPage.goToFilter('Involved Tasks')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, tasksListPage.checkTaskListIsLoaded()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280018] Should be able to change the form in a task', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tasksListPage.selectRow(task.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickForm()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkAttachFormDropdownIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkAttachFormButtonIsDisabled()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickAttachFormDropdown()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.selectAttachFormOption(newForm.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkSelectedForm(newForm.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkAttachFormButtonIsEnabled()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkCancelAttachFormIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickCancelAttachForm()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkFormIsAttached(attachedForm.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickForm()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkAttachFormDropdownIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickAttachFormDropdown()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.selectAttachFormOption(newForm.name)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkAttachFormButtonIsDisplayed()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickAttachFormButton()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkFormIsAttached(newForm.name)];
                case 18:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280019] Should be able to remove the form form a task', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, tasksListPage.selectRow(task.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, taskDetailsPage.clickForm()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, taskDetailsPage.checkRemoveAttachFormIsDisplayed()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, taskDetailsPage.clickRemoveAttachForm()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, taskDetailsPage.checkFormIsAttached('No form')];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, taskDetailsPage.getFormName()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(CONSTANTS.TASK_DETAILS.NO_FORM)];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280557] Should display task details when selecting another task while the Attach Form dialog is displayed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tasksListPage.selectRow(task.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.clickForm()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkRemoveAttachFormIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, tasksListPage.selectRow(otherTask.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, taskDetailsPage.checkFormIsAttached(otherAttachedForm.name)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=task-details-form.e2e.js.map