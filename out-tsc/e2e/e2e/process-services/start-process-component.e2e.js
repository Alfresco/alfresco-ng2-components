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
var resources = require("../util/resources");
var CONSTANTS = require("../util/constants");
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var startProcessPage_1 = require("../pages/adf/process-services/startProcessPage");
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var processServiceTabBarPage_1 = require("../pages/adf/process-services/processServiceTabBarPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var attachmentListPage_1 = require("../pages/adf/process-services/attachmentListPage");
var apps_actions_1 = require("../actions/APS/apps.actions");
var protractor_1 = require("protractor");
var user_1 = require("../models/APS/user");
var tenant_1 = require("../models/APS/tenant");
var fileModel_1 = require("../models/ACS/fileModel");
var dateFormat = require("dateformat");
var js_api_1 = require("@alfresco/js-api");
var adf_testing_2 = require("@alfresco/adf-testing");
describe('Start Process Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var startProcessPage = new startProcessPage_1.StartProcessPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processServiceTabBarPage = new processServiceTabBarPage_1.ProcessServiceTabBarPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var attachmentListPage = new attachmentListPage_1.AttachmentListPage();
    var startProcessDialog = new adf_testing_1.StartProcessDialog();
    var apps = new apps_actions_1.AppsActions();
    var widget = new adf_testing_1.Widget();
    var app = resources.Files.APP_WITH_PROCESSES;
    var simpleApp = resources.Files.WIDGETS_SMOKE_TEST;
    var dateFormApp = resources.Files.APP_WITH_DATE_FIELD_FORM;
    var appId, procUserModel, secondProcUserModel, tenantId, simpleAppCreated, dateFormAppCreated;
    var processModelWithSe = 'process_with_se', processModelWithoutSe = 'process_without_se';
    var processName255Characters = adf_testing_2.StringUtil.generateRandomString(255);
    var processNameBiggerThen255Characters = adf_testing_2.StringUtil.generateRandomString(256);
    var lengthValidationError = 'Length exceeded, 255 characters max.';
    var auditLogFile = 'Audit.pdf';
    var jpgFile = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var newTenant, appCreated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.createTenant(new tenant_1.Tenant())];
                case 2:
                    newTenant = _a.sent();
                    tenantId = newTenant.id;
                    procUserModel = new user_1.User({ tenantId: tenantId });
                    secondProcUserModel = new user_1.User({ tenantId: tenantId });
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(procUserModel)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminUsersApi.createNewUser(secondProcUserModel)];
                case 4:
                    _a.sent();
                    this.alfrescoJsApiUserTwo = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApiUserTwo.login(secondProcUserModel.email, secondProcUserModel.password)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, app.file_location)];
                case 6:
                    appCreated = _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, simpleApp.file_location)];
                case 7:
                    simpleAppCreated = _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApiUserTwo, dateFormApp.file_location)];
                case 8:
                    dateFormAppCreated = _a.sent();
                    appId = appCreated.id;
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(appId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(simpleAppCreated.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApiUserTwo.activiti.modelsApi.deleteModel(dateFormAppCreated.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe(' Once logged with user without apps', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(procUserModel)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260458] Should NOT be able to start a process without process model', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp('Task App')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkNoProcessMessage()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe(' Once logged with user with app', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260441] Should display start process form and default name when creating a new process', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp('Task App')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessPage.getDefaultName()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('My Default Name')];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260445] Should require process definition and be possible to click cancel button', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp('Task App')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys('v\b\b').perform()];
                    case 6:
                        _a.sent(); // clear doesn't trigger the validator
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsDisabled()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickCancelProcessButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkNoContentMessage()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260444] Should require process name', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithoutSe)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.deleteDefaultName('My Default Name')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsDisabled()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickProcessDropdownArrow()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkOptionIsDisplayed(processModelWithSe)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkOptionIsDisplayed(processModelWithoutSe)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260443] Should be possible to start a process without start event', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessPage.checkSelectProcessPlaceholderIsDisplayed()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithoutSe)];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, startProcessPage.getDefaultName()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('My Default Name')];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260449] Should be possible to start a process with start event', function () { return __awaiter(_this, void 0, void 0, function () {
            var processId, response, _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _k.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _k.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _k.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _k.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Test')];
                    case 5:
                        _k.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _k.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _k.sent();
                        return [4 /*yield*/, processDetailsPage.checkDetailsAreDisplayed()];
                    case 8:
                        _k.sent();
                        return [4 /*yield*/, processDetailsPage.getId()];
                    case 9:
                        processId = _k.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.activiti.processApi.getProcessInstance(processId)];
                    case 10:
                        response = _k.sent();
                        _a = expect;
                        return [4 /*yield*/, processDetailsPage.getProcessStatus()];
                    case 11: return [4 /*yield*/, _a.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_STATUS.RUNNING)];
                    case 12:
                        _k.sent();
                        _b = expect;
                        return [4 /*yield*/, processDetailsPage.getEndDate()];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_END_DATE)];
                    case 14:
                        _k.sent();
                        _c = expect;
                        return [4 /*yield*/, processDetailsPage.getProcessCategory()];
                    case 15: return [4 /*yield*/, _c.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_CATEGORY)];
                    case 16:
                        _k.sent();
                        _d = expect;
                        return [4 /*yield*/, processDetailsPage.getBusinessKey()];
                    case 17: return [4 /*yield*/, _d.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_BUSINESS_KEY)];
                    case 18:
                        _k.sent();
                        _e = expect;
                        return [4 /*yield*/, processDetailsPage.getCreatedBy()];
                    case 19: return [4 /*yield*/, _e.apply(void 0, [_k.sent()]).toEqual(response.startedBy.firstName + " " + response.startedBy.lastName)];
                    case 20:
                        _k.sent();
                        _f = expect;
                        return [4 /*yield*/, processDetailsPage.getCreated()];
                    case 21: return [4 /*yield*/, _f.apply(void 0, [_k.sent()]).toEqual(dateFormat(CONSTANTS.PROCESS_DATE_FORMAT))];
                    case 22:
                        _k.sent();
                        _g = expect;
                        return [4 /*yield*/, processDetailsPage.getId()];
                    case 23: return [4 /*yield*/, _g.apply(void 0, [_k.sent()]).toEqual(response.id)];
                    case 24:
                        _k.sent();
                        _h = expect;
                        return [4 /*yield*/, processDetailsPage.getProcessDescription()];
                    case 25: return [4 /*yield*/, _h.apply(void 0, [_k.sent()]).toEqual(CONSTANTS.PROCESS_DESCRIPTION)];
                    case 26:
                        _k.sent();
                        _j = expect;
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 27: return [4 /*yield*/, _j.apply(void 0, [_k.sent()]).toEqual(response.name)];
                    case 28:
                        _k.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286503] Should NOT display any process definition when typing a non-existent one', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.typeProcessDefinition('nonexistent')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkNoProcessDefinitionOptionIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsDisabled()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286504] Should display proper options when typing a part of existent process definitions', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.typeProcessDefinition('process')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkOptionIsDisplayed(processModelWithoutSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkOptionIsDisplayed(processModelWithSe)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectOption(processModelWithoutSe)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286508] Should display only one option when typing an existent process definition', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.typeProcessDefinition(processModelWithoutSe)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkOptionIsDisplayed(processModelWithoutSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkOptionIsNotDisplayed(processModelWithSe)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectOption(processModelWithoutSe)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286509] Should select automatically the processDefinition when the app contains only one', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(simpleApp.title)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessPage.getProcessDefinitionValue()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(simpleApp.title)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286511] Should be able to type the process definition and start a process', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Type')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.typeProcessDefinition(processModelWithoutSe)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.selectOption(processModelWithoutSe)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessPage.getProcessDefinitionValue()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(processModelWithoutSe)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.clickStartProcessButton()];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Type')];
                    case 13:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286513] Should be able to use down arrow key when navigating throw suggestions', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.typeProcessDefinition('process')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.pressDownArrowAndEnter()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessPage.getProcessDefinitionValue()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(processModelWithoutSe)];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286514] Should the process definition input be cleared when clicking on options drop down ', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.typeProcessDefinition('process')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.selectOption(processModelWithoutSe)];
                    case 6:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessPage.getProcessDefinitionValue()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(processModelWithoutSe)];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.clickProcessDropdownArrow()];
                    case 9:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, startProcessPage.getProcessDefinitionValue()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('')];
                    case 11:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260453] Should be possible to add a comment on an active process', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Comment Process')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Comment Process')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.addComment('comment1')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkCommentIsDisplayed('comment1')];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260454] Should be possible to download audit log file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Audit Log')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Audit Log')];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, processDetailsPage.clickAuditLogButton()];
                    case 10:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(auditLogFile)];
                    case 11: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                    case 12:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('Should be able to attach a file using the button', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Attach File')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Attach File')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, attachmentListPage.clickAttachFileButton(jpgFile.location)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, attachmentListPage.checkFileIsAttached(jpgFile.name)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260451] Should be possible to display process diagram', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Show Diagram')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Show Diagram')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.clickShowDiagram()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260452] Should redirect user when clicking on active/completed task', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Active Task')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Active Task')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.clickOnActiveTask()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkActiveTaskTitleIsDisplayed()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260457] Should display process in Completed when cancelled', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(secondProcUserModel)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Cancel Process')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Cancel Process')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.clickCancelProcessButton()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Cancel Process')];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkShowDiagramIsDisabled()];
                    case 16:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260461] Should be possible to add a comment on a completed/canceled process', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('Comment Process 2')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Comment Process 2')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.clickCancelProcessButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('Comment Process 2')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.addComment('goodbye')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkCommentIsDisplayed('goodbye')];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260467] Should NOT be possible to attach a file on a completed process', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('File')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('File')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.clickCancelProcessButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCompletedFilterButton()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('File')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, attachmentListPage.checkAttachFileButtonIsNotDisplayed()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291781] Should be displayed an error message if process name exceed 255 characters', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(app.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName(processName255Characters)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.selectFromProcessDropdown(processModelWithoutSe)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsEnabled()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName(processNameBiggerThen255Characters)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkValidationErrorIsDisplayed(lengthValidationError)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, startProcessPage.checkStartProcessButtonIsDisabled()];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261039] Advanced date time widget', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, processServicesPage.goToApp(dateFormApp.title)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, processServiceTabBarPage.clickProcessButton()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickCreateProcessButton()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickNewProcessDropdown()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.enterProcessName('DateFormProcess')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.formFields().checkWidgetIsVisible('testdate')];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, widget.dateWidget().setDateInput('testdate', '15-7-2019')];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.checkStartFormProcessButtonIsEnabled()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, startProcessPage.clickFormStartProcessButton()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, processFiltersPage.selectFromProcessList('DateFormProcess')];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, processDetailsPage.clickOnStartForm()];
                    case 12:
                        _c.sent();
                        return [4 /*yield*/, startProcessDialog.checkStartProcessDialogIsDisplayed()];
                    case 13:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, startProcessDialog.getTitle()];
                    case 14: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('Start Form')];
                    case 15:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, widget.dateWidget()];
                    case 16: return [4 /*yield*/, (_c.sent()).getDateInput('testdate')];
                    case 17: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('15-7-2019')];
                    case 18:
                        _c.sent();
                        return [4 /*yield*/, startProcessDialog.clickCloseButton()];
                    case 19:
                        _c.sent();
                        return [4 /*yield*/, startProcessDialog.checkStartProcessDialogIsNotDisplayed()];
                    case 20:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=start-process-component.e2e.js.map