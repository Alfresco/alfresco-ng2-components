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
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../../actions/APS/apps.actions");
var users_actions_1 = require("../../actions/users.actions");
var adf_testing_1 = require("@alfresco/adf-testing");
var tasksPage_1 = require("../../pages/adf/process-services/tasksPage");
var CONSTANTS = require("../../util/constants");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
describe('Text widget', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processUserModel;
    var taskPage = new tasksPage_1.TasksPage();
    var widget = new adf_testing_1.Widget();
    var alfrescoJsApi;
    var appsActions = new apps_actions_1.AppsActions();
    var appModel;
    var app = resources.Files.WIDGET_CHECK_APP.TEXT;
    var deployedApp, process;
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
                    return [4 /*yield*/, appsActions.importPublishDeployApp(alfrescoJsApi, resources.Files.WIDGET_CHECK_APP.file_location)];
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
    it('[C268157] Should be able to set general properties for Text widget', function () { return __awaiter(_this, void 0, void 0, function () {
        var label, _a, placeHolder, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, widget.textWidget().getFieldLabel(app.FIELD.simpleText)];
                case 1:
                    label = _c.sent();
                    return [4 /*yield*/, expect(label).toBe('textSimple*')];
                case 2:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBeTruthy()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, widget.textWidget().getFieldPlaceHolder(app.FIELD.simpleText)];
                case 5:
                    placeHolder = _c.sent();
                    return [4 /*yield*/, expect(placeHolder).toBe('Type something...')];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.simpleText, 'TEST')];
                case 7:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBeFalsy()];
                case 9:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268170] Min-max length properties', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.textMinMax, 'A')];
                case 1:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, widget.textWidget().getErrorMessage(app.FIELD.textMinMax)];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toContain('Enter at least 4 characters')];
                case 3:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 4: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toBeTruthy()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.textMinMax, 'AAAAAAAAAAA')];
                case 6:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, widget.textWidget().getErrorMessage(app.FIELD.textMinMax)];
                case 7: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toContain('Enter no more than 10 characters')];
                case 8:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 9: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toBeTruthy()];
                case 10:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268171] Input mask reversed checkbox properties', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.textMask, '18951523')];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, widget.textWidget().getFieldValue(app.FIELD.textMask)];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('1895-1523')];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268171] Input mask reversed checkbox properties', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.textMaskReversed, '1234567899')];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, widget.textWidget().getFieldValue(app.FIELD.textMaskReversed)];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('3456-7899')];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268177] Should be able to set Regex Pattern property for Text widget', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.simpleText, 'TEST')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.textRegexp, 'T')];
                case 2:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBeTruthy()];
                case 4:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, widget.textWidget().getErrorMessage(app.FIELD.textRegexp)];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toContain('Enter a different value')];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.textRegexp, 'TE')];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBeFalsy()];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C274712] Should be able to set visibility properties for Text widget ', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, widget.textWidget().isWidgetNotVisible(app.FIELD.textHidden)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, widget.textWidget().setValue(app.FIELD.showHiddenText, '1')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, widget.textWidget().isWidgetVisible(app.FIELD.textHidden)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=text-widget.e2e.js.map