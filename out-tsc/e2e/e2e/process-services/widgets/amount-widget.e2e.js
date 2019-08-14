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
var resources = require("../../util/resources");
var protractor_1 = require("protractor");
describe('Amount Widget', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var processUserModel;
    var taskPage = new tasksPage_1.TasksPage();
    var widget = new adf_testing_1.Widget();
    var alfrescoJsApi;
    var appsActions = new apps_actions_1.AppsActions();
    var appModel;
    var app = resources.Files.WIDGET_CHECK_APP.AMOUNT;
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
    it('[C274703] Should be possible to set general, advance and visibility properties for Amount Widget', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, taskPage.formFields().checkWidgetIsHidden(app.FIELD.amount_input_id)];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, widget.checkboxWidget().clickCheckboxInput(app.FIELD.checkbox_id)];
                case 2:
                    _k.sent();
                    return [4 /*yield*/, taskPage.formFields().checkWidgetIsVisible(app.FIELD.amount_input_id)];
                case 3:
                    _k.sent();
                    _a = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_k.sent()]).toBeTruthy()];
                case 5:
                    _k.sent();
                    _b = expect;
                    return [4 /*yield*/, widget.amountWidget().getAmountFieldLabel(app.FIELD.amount_input_id)];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).toContain('Amount')];
                case 7:
                    _k.sent();
                    _c = expect;
                    return [4 /*yield*/, widget.amountWidget().getPlaceholder(app.FIELD.amount_input_id)];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_k.sent()]).toContain('Type amount')];
                case 9:
                    _k.sent();
                    _d = expect;
                    return [4 /*yield*/, widget.amountWidget().getAmountFieldCurrency(app.FIELD.amount_input_id)];
                case 10: return [4 /*yield*/, _d.apply(void 0, [_k.sent()]).toBe('$')];
                case 11:
                    _k.sent();
                    return [4 /*yield*/, widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 4)];
                case 12:
                    _k.sent();
                    _e = expect;
                    return [4 /*yield*/, widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)];
                case 13: return [4 /*yield*/, _e.apply(void 0, [_k.sent()]).toBe('Can\'t be less than 5')];
                case 14:
                    _k.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 15: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).toBeTruthy()];
                case 16:
                    _k.sent();
                    return [4 /*yield*/, widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id)];
                case 17:
                    _k.sent();
                    return [4 /*yield*/, widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 101)];
                case 18:
                    _k.sent();
                    _g = expect;
                    return [4 /*yield*/, widget.amountWidget().getErrorMessage(app.FIELD.amount_input_id)];
                case 19: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).toBe('Can\'t be greater than 100')];
                case 20:
                    _k.sent();
                    _h = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 21: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).toBeTruthy()];
                case 22:
                    _k.sent();
                    return [4 /*yield*/, widget.amountWidget().clearFieldValue(app.FIELD.amount_input_id)];
                case 23:
                    _k.sent();
                    return [4 /*yield*/, widget.amountWidget().setFieldValue(app.FIELD.amount_input_id, 6)];
                case 24:
                    _k.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.formFields().isCompleteFormButtonDisabled()];
                case 25: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).toBeFalsy()];
                case 26:
                    _k.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=amount-widget.e2e.js.map