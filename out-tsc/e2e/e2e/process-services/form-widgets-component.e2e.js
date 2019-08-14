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
var adf_testing_1 = require("@alfresco/adf-testing");
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var CONSTANTS = require("../util/constants");
var FormDefinitionModel = require("../models/APS/FormDefinitionModel");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
var formInstance = new FormDefinitionModel();
describe('Form widgets', function () {
    var alfrescoJsApi;
    var taskPage = new tasksPage_1.TasksPage();
    var newTask = 'First task';
    var loginPage = new adf_testing_1.LoginPage();
    var processUserModel;
    var appModel;
    var widget = new adf_testing_1.Widget();
    describe('Form widgets', function () {
        var app = resources.Files.WIDGETS_SMOKE_TEST;
        var appFields = app.form_fields;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var users, appsActions, task, _a, response, formDefinition;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        users = new users_actions_1.UsersActions();
                        appsActions = new apps_actions_1.AppsActions();
                        alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                            provider: 'BPM',
                            hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                        });
                        return [4 /*yield*/, alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, users.createTenantAndUser(alfrescoJsApi)];
                    case 2:
                        processUserModel = _b.sent();
                        return [4 /*yield*/, alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location)];
                    case 4:
                        appModel = _b.sent();
                        return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, new navigationBarPage_1.NavigationBarPage().navigateToProcessServicesPage()];
                    case 6: return [4 /*yield*/, (_b.sent()).goToApp(appModel.name)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, taskPage.createNewTask()];
                    case 9:
                        task = _b.sent();
                        return [4 /*yield*/, task.addName(newTask)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, task.addDescription('Description')];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, task.addForm(app.formName)];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, task.clickStartButton()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, taskPage.tasksListPage().checkContentIsDisplayed(newTask)];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, taskPage.formFields().checkFormIsDisplayed()];
                    case 15:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                    case 16: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Activities')];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, taskPage.taskDetails().getId()];
                    case 18:
                        response = _b.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.taskFormsApi.getTaskForm(response)];
                    case 19:
                        formDefinition = _b.sent();
                        formInstance.setFields(formDefinition.fields);
                        formInstance.setAllWidgets(formDefinition.fields);
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272778] Should display text and multi-line in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.text_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.text_id).name)];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.text_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.text_id).value || '')];
                    case 4:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, widget.multilineTextWidget().getFieldValue(appFields.multiline_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).value || '')];
                    case 6:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.multiline_id)];
                    case 7: return [4 /*yield*/, _d.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.multiline_id).name)];
                    case 8:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272779] Should display number and amount in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.number_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.number_id).value || '')];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.number_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.number_id).name)];
                    case 4:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.amount_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).value || '')];
                    case 6:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.amount_id)];
                    case 7: return [4 /*yield*/, _d.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.amount_id).name)];
                    case 8:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272780] Should display attach file and attach folder in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.attachFolder_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.attachFolder_id).name)];
                    case 2:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.attachFile_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.attachFile_id).name)];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272781] Should display date and date & time in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.date_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.date_id).name)];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.date_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.date_id).value || '')];
                    case 4:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.dateTime_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.dateTime_id).name)];
                    case 6:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.dateTime_id)];
                    case 7: return [4 /*yield*/, _d.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.dateTime_id).value || '')];
                    case 8:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272782] Should display people and group in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.people_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.people_id).value || '')];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.people_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.people_id).name)];
                    case 4:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.group_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.group_id).value || '')];
                    case 6:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.group_id)];
                    case 7: return [4 /*yield*/, _d.apply(void 0, [_e.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.group_id).name)];
                    case 8:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272783] Should display displayText and displayValue in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, widget.displayTextWidget().getFieldLabel(appFields.displayText_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.displayText_id).value)];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, widget.displayValueWidget().getFieldLabel(appFields.displayValue_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.displayValue_id).value || 'Display value' || '')];
                    case 4:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, widget.displayValueWidget().getFieldValue(appFields.displayValue_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.displayValue_id).value || '')];
                    case 6:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272784] Should display typeahead and header in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, widget.headerWidget().getFieldLabel(appFields.header_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.header_id).name)];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldValue(appFields.typeAhead_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.typeAhead_id).value || '')];
                    case 4:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.typeAhead_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.typeAhead_id).name)];
                    case 6:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272785] Should display checkbox and radio button in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var radioOption, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        radioOption = 1;
                        _a = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.checkbox_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.checkbox_id).name)];
                    case 2:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.radioButtons_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.radioButtons_id).name)];
                    case 4:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, widget.radioWidget().getSpecificOptionLabel(appFields.radioButtons_id, radioOption)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.radioButtons_id).options[radioOption - 1].name)];
                    case 6:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C268149] Should display hyperlink, dropdown and dynamic table in form', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, widget.hyperlink().getFieldText(appFields.hyperlink_id)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_f.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).hyperlinkUrl || '')];
                    case 2:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.hyperlink_id)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_f.sent()])
                            .toEqual(formInstance.getWidgetBy('id', appFields.hyperlink_id).name)];
                    case 4:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, taskPage.formFields().getFieldLabel(appFields.dropdown_id)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_f.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).name)];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, expect(widget.dropdown().getSelectedOptionText(appFields.dropdown_id))
                                .toContain(formInstance.getWidgetBy('id', appFields.dropdown_id).value)];
                    case 7:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, widget.dynamicTable().getFieldLabel(appFields.dynamicTable_id)];
                    case 8: return [4 /*yield*/, _d.apply(void 0, [_f.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.dynamicTable_id).name)];
                    case 9:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, widget.dynamicTable().getColumnName(appFields.dynamicTable_id)];
                    case 10: return [4 /*yield*/, _e.apply(void 0, [_f.sent()])
                            .toContain(formInstance.getWidgetBy('id', appFields.dynamicTable_id).columnDefinitions[0].name)];
                    case 11:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('with fields involving other people', function () {
        var appsActions = new apps_actions_1.AppsActions();
        var app = resources.Files.FORM_ADF;
        var deployedApp, process;
        var appFields = app.form_fields;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var users, appDefinitions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        users = new users_actions_1.UsersActions();
                        alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                            provider: 'BPM',
                            hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                        });
                        return [4 /*yield*/, alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, users.createTenantAndUser(alfrescoJsApi)];
                    case 2:
                        processUserModel = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, appsActions.importPublishDeployApp(alfrescoJsApi, app.file_location)];
                    case 4:
                        appModel = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.getAppDefinitions()];
                    case 5:
                        appDefinitions = _a.sent();
                        deployedApp = appDefinitions.data.find(function (currentApp) {
                            return currentApp.modelId === appModel.id;
                        });
                        return [4 /*yield*/, appsActions.startProcess(alfrescoJsApi, appModel, app.processName)];
                    case 6:
                        process = _a.sent();
                        return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var urlToNavigateTo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        urlToNavigateTo = protractor_1.browser.params.testConfig.adf.url + "/activiti/apps/" + deployedApp.id + "/tasks/";
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(urlToNavigateTo)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.MY_TASKS)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, taskPage.formFields().checkFormIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, alfrescoJsApi.activiti.processApi.deleteProcessInstance(process.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(processUserModel.tenantId)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260405] Value fields configured with process variables', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, taskPage.formFields().checkFormIsDisplayed()];
                    case 1:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, taskPage.taskDetails().getTitle()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual('Activities')];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, taskPage.formFields().setValueInInputById('label', 'value 1')];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, taskPage.formFields().completeForm()];
                    case 5:
                        _e.sent();
                        /* cspell:disable-next-line */
                        return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.COMPLETED_TASKS)];
                    case 6:
                        /* cspell:disable-next-line */
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, widget.displayTextWidget().getFieldText(appFields.displayText_id)];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])
                            .toContain('value 1')];
                    case 8:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, widget.textWidget().getFieldValue(appFields.text_id)];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])
                            .toEqual('value 1')];
                    case 10:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, widget.displayValueWidget().getFieldValue(appFields.displayValue_id)];
                    case 11: return [4 /*yield*/, _d.apply(void 0, [_e.sent()])
                            .toEqual('value 1')];
                    case 12:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=form-widgets-component.e2e.js.map