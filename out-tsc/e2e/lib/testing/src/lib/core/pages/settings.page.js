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
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var browser_visibility_1 = require("../utils/browser-visibility");
var browser_actions_1 = require("../utils/browser-actions");
var SettingsPage = /** @class */ (function () {
    function SettingsPage() {
        this.settingsURL = protractor_1.browser.baseUrl + '/settings';
        this.providerDropdown = protractor_1.element(protractor_1.by.css('mat-select[id="adf-provider-selector"] div[class="mat-select-arrow-wrapper"]'));
        this.ecmAndBpm = {
            option: protractor_1.element(protractor_1.by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"ALL")]')),
            text: 'ALL'
        };
        this.bpm = {
            option: protractor_1.element(protractor_1.by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"BPM") and not (contains(text(),"and"))]')),
            text: 'BPM'
        };
        this.ecm = {
            option: protractor_1.element(protractor_1.by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"ECM") and not (contains(text(),"and"))]')),
            text: 'ECM'
        };
        this.oauth = {
            option: protractor_1.element(protractor_1.by.xpath('//SPAN[@class="mat-option-text"][contains(text(),"OAUTH")]')),
            text: 'OAUTH'
        };
        this.selectedOption = protractor_1.element(protractor_1.by.css('span[class*="mat-select-value-text"]'));
        this.ecmText = protractor_1.element(protractor_1.by.css('input[data-automation-id*="ecmHost"]'));
        this.bpmText = protractor_1.element(protractor_1.by.css('input[data-automation-id*="bpmHost"]'));
        this.clientIdText = protractor_1.element(protractor_1.by.css('input[id="clientId"]'));
        this.authHostText = protractor_1.element(protractor_1.by.css('input[id="oauthHost"]'));
        this.logoutUrlText = protractor_1.element(protractor_1.by.css('input[id="logout-url"]'));
        this.basicAuthRadioButton = protractor_1.element(protractor_1.by.cssContainingText('mat-radio-button[id*="mat-radio"]', 'Basic Authentication'));
        this.identityHostText = protractor_1.element(protractor_1.by.css('input[id="identityHost"]'));
        this.ssoRadioButton = protractor_1.element(protractor_1.by.cssContainingText('[id*="mat-radio"]', 'SSO'));
        this.silentLoginToggleLabel = protractor_1.element(protractor_1.by.css('mat-slide-toggle[name="silentLogin"] label'));
        this.silentLoginToggleElement = protractor_1.element(protractor_1.by.css('mat-slide-toggle[name="silentLogin"]'));
        this.implicitFlowLabel = protractor_1.element(protractor_1.by.css('mat-slide-toggle[name="implicitFlow"] label'));
        this.implicitFlowElement = protractor_1.element(protractor_1.by.css('mat-slide-toggle[name="implicitFlow"]'));
        this.applyButton = protractor_1.element(protractor_1.by.css('button[data-automation-id*="host-button"]'));
        this.backButton = protractor_1.element(protractor_1.by.cssContainingText('button span[class="mat-button-wrapper"]', 'Back'));
        this.validationMessage = protractor_1.element(protractor_1.by.cssContainingText('mat-error', 'This field is required'));
    }
    SettingsPage.prototype.goToSettingsPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(this.settingsURL)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProvider = function (option, selected) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedOptionText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.providerDropdown)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(option)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.getText(this.selectedOption)];
                    case 3:
                        selectedOptionText = _a.sent();
                        return [4 /*yield*/, expect(selectedOptionText).toEqual(selected)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.getSelectedOptionText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.selectedOption)];
            });
        });
    };
    SettingsPage.prototype.getBpmHostUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bpmText.getAttribute('value')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SettingsPage.prototype.getEcmHostUrl = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ecmText.getAttribute('value')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SettingsPage.prototype.getBpmOption = function () {
        return this.bpm.option;
    };
    SettingsPage.prototype.getEcmOption = function () {
        return this.ecm.option;
    };
    SettingsPage.prototype.getEcmAndBpmOption = function () {
        return this.ecmAndBpm.option;
    };
    SettingsPage.prototype.setProviderEcmBpm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProviderBpm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProvider(this.bpm.option, this.bpm.text)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProviderEcm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setProvider(this.ecm.option, this.ecm.text)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProviderOauth = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToSettingsPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setProvider(this.oauth.option, this.oauth.text)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.clickBackButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.backButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.clickSsoRadioButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.ssoRadioButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProviderEcmSso = function (contentServiceURL, authHost, identityHost, silentLogin, implicitFlow, clientId, logoutUrl) {
        if (silentLogin === void 0) { silentLogin = true; }
        if (implicitFlow === void 0) { implicitFlow = true; }
        if (logoutUrl === void 0) { logoutUrl = '/logout'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToSettingsPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setProvider(this.ecm.option, this.ecm.text)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickSsoRadioButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.setContentServicesURL(contentServiceURL)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.setAuthHost(authHost)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.setIdentityHost(identityHost)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.setSilentLogin(silentLogin)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.setImplicitFlow(implicitFlow)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.setLogoutUrl(logoutUrl)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProviderBpmSso = function (processServiceURL, authHost, identityHost, silentLogin, implicitFlow) {
        if (silentLogin === void 0) { silentLogin = true; }
        if (implicitFlow === void 0) { implicitFlow = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToSettingsPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setProvider(this.bpm.option, this.bpm.text)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.bpmText)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.ecmText)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.clickSsoRadioButton()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.setClientId()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.setProcessServicesURL(processServiceURL)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.setAuthHost(authHost)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.setIdentityHost(identityHost)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.setSilentLogin(silentLogin)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.setImplicitFlow(implicitFlow)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProviderEcmBpmSso = function (contentServicesURL, processServiceURL, authHost, identityHost, clientId, silentLogin, implicitFlow) {
        if (silentLogin === void 0) { silentLogin = true; }
        if (implicitFlow === void 0) { implicitFlow = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToSettingsPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setProvider(this.ecmAndBpm.option, this.ecmAndBpm.text)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.bpmText)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.ecmText)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.clickSsoRadioButton()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.setClientId(clientId)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.setContentServicesURL(contentServicesURL)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.setProcessServicesURL(processServiceURL)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.setAuthHost(authHost)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.setIdentityHost(identityHost)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, this.setSilentLogin(silentLogin)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, this.setImplicitFlow(implicitFlow)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, this.clickApply()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setLogoutUrl = function (logoutUrl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsPresent(this.logoutUrlText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.logoutUrlText, logoutUrl)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setProcessServicesURL = function (processServiceURL) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.bpmText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.bpmText, processServiceURL)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setClientId = function (clientId) {
        if (clientId === void 0) { clientId = protractor_1.browser.params.config.oauth2.clientId; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.clientIdText, clientId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setContentServicesURL = function (contentServiceURL) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.ecmText, contentServiceURL)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.clearContentServicesURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearWithBackSpace(this.ecmText)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.clearProcessServicesURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.bpmText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearWithBackSpace(this.bpmText)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setAuthHost = function (authHostURL) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.authHostText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.authHostText, authHostURL)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setIdentityHost = function (identityHost) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.identityHostText)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.identityHostText, identityHost)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.clickApply = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.applyButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setSilentLogin = function (enableToggle) {
        return __awaiter(this, void 0, void 0, function () {
            var isChecked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.silentLoginToggleElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.silentLoginToggleElement.getAttribute('class')];
                    case 2:
                        isChecked = (_a.sent()).includes('mat-checked');
                        if (!(isChecked && !enableToggle || !isChecked && enableToggle)) return [3 /*break*/, 4];
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.silentLoginToggleLabel)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.setImplicitFlow = function (enableToggle) {
        return __awaiter(this, void 0, void 0, function () {
            var isChecked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.implicitFlowElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.implicitFlowElement.getAttribute('class')];
                    case 2:
                        isChecked = (_a.sent()).includes('mat-checked');
                        if (!(isChecked && !enableToggle || !isChecked && enableToggle)) return [3 /*break*/, 4];
                        return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.implicitFlowLabel)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.checkApplyButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css('button[data-automation-id*="host-button"]:disabled')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.checkProviderDropdownIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.providerDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.checkValidationMessageIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.validationMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.checkProviderOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.providerDropdown)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.ecmAndBpm.option)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.ecm.option)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.bpm.option)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.getBasicAuthRadioButton = function () {
        return this.basicAuthRadioButton;
    };
    SettingsPage.prototype.getSsoRadioButton = function () {
        return this.ssoRadioButton;
    };
    SettingsPage.prototype.getBackButton = function () {
        return this.backButton;
    };
    SettingsPage.prototype.getApplyButton = function () {
        return this.applyButton;
    };
    SettingsPage.prototype.checkBasicAuthRadioIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var radioButton, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        radioButton = this.getBasicAuthRadioButton();
                        _a = expect;
                        return [4 /*yield*/, radioButton.getAttribute('class')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toContain('mat-radio-checked')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SettingsPage.prototype.checkSsoRadioIsNotSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var radioButton, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        radioButton = this.getSsoRadioButton();
                        _a = expect;
                        return [4 /*yield*/, radioButton.getAttribute('class')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).not.toContain('mat-radio-checked')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SettingsPage;
}());
exports.SettingsPage = SettingsPage;
//# sourceMappingURL=settings.page.js.map