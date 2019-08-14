"use strict";
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
var adf_testing_1 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
describe('Header Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var headerPage = new adf_testing_2.HeaderPage();
    var settingsPage = new adf_testing_2.SettingsPage();
    var user, tenantId;
    var names = {
        app_title_default: 'ADF Demo Application',
        app_title_custom: 'New Test App',
        urlPath_default: './assets/images/logo.png',
        urlPath_custom: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flower_jtca001.jpg',
        urlPath_logo_link: '"/settings-layout"',
        color_primary: 'primary',
        color_accent: 'accent',
        color_warn: 'warn',
        color_custom: '#862B2B',
        logo_title: 'ADF Demo Application',
        logo_tooltip: 'test_tooltip'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    users = new users_actions_1.UsersActions();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 2:
                    user = _a.sent();
                    tenantId = user.tenantId;
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.email, user.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(user)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickHeaderDataButton()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.activiti.adminTenantsApi.deleteTenant(tenantId)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280002] Should be able to view Header component', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.checkShowMenuCheckBoxIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkChooseHeaderColourIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkHexColorInputIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkChangeTitleIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkChangeUrlPathIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkLogoHyperlinkInputIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkLogoTooltipInputIsDisplayed()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279996] Should be able to show/hide menu button', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.clickShowMenuButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkMenuButtonIsNotDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, headerPage.clickShowMenuButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkMenuButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279999] Should be able to change the colour between primary, accent and warn', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.changeHeaderColor(names.color_accent)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkToolbarColor(names.color_accent)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, headerPage.changeHeaderColor(names.color_primary)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkToolbarColor(names.color_primary)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, headerPage.changeHeaderColor(names.color_warn)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkToolbarColor(names.color_warn)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280552] Should be able to change the colour of the header by typing a hex code', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.addHexCodeColor(names.color_custom)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkToolbarColor(names.color_custom)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279997] Should be able to change the title of the app', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.checkAppTitle(names.app_title_default)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, headerPage.addTitle(names.app_title_custom)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkAppTitle(names.app_title_custom)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279998] Should be able to change the default logo of the app', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.checkIconIsDisplayed(names.urlPath_default)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, headerPage.addIcon(names.urlPath_custom)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkIconIsDisplayed(names.urlPath_custom)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280553] Should be able to set a hyperlink to the logo', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.addLogoHyperlink(names.urlPath_logo_link)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickAppLogo(names.logo_title)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286517] Should be able to set a hyperlink to the logo text', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.addLogoHyperlink(names.urlPath_logo_link)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickAppLogoText()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280554] Should be able to customise the tooltip-text of the logo', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.addLogoTooltip(names.logo_tooltip)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkLogoTooltip(names.logo_tooltip)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286297] Should be able to change the position of the sidebar menu', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, headerPage.sideBarPositionEnd()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkSidebarPositionEnd()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, headerPage.sideBarPositionStart()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, headerPage.checkSidebarPositionStart()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=header-component.e2e.js.map