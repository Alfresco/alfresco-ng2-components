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
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var metadataViewPage_1 = require("../../pages/adf/metadataViewPage");
var cardViewComponentPage_1 = require("../../pages/adf/cardViewComponentPage");
var adf_testing_2 = require("@alfresco/adf-testing");
describe('CardView Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var cardViewPageComponent = new cardViewComponentPage_1.CardViewComponentPage();
    var metadataViewPage = new metadataViewPage_1.MetadataViewPage();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.loginToContentServices(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickCardViewButton()];
                case 2:
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
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardViewPageComponent.clickOnResetButton()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('key-value pair ', function () {
        it('[C279938] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-key-value-pairs-label-key-value-pairs"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279898] Should be possible edit key-value pair properties', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnAddButton()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.setName('testName')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.setValue('testValue')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnAddButton()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.waitForOutput()];
                    case 5:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('[CardView Key-Value Pairs Item] - [{"name":"testName","value":"testValue"}]')];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.deletePairsValues()];
                    case 8:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(1)];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('[CardView Key-Value Pairs Item] - []')];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('SelectBox', function () {
        it('[C279939] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-select-label-select"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279899] Should be possible edit selectBox item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickSelectBox()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.selectValueFromComboBox(1)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])
                            .toBe('[CardView Select Item] - two')];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Text', function () {
        it('[C279937] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-textitem-label-name"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279943] Should be present a default value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getTextFieldText()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Spock')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279934] Should be possible edit text item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnTextField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterTextField('example')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnTextSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('[CardView Text Item] - example')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279944] Should be possible undo text item modify when click on the clear button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnTextField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterTextField('example')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnTextClearIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getTextFieldText()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Spock')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Int', function () {
        it('[C279940] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-textitem-label-int"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279945] Should be present a default value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getIntFieldText()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('213')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279946] Should be possible edit int item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField('99999')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('[CardView Int Item] - 99999')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279947] Should not be possible add string value to the int item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField('string value')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getErrorInt()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Use an integer format')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279948] Should not be possible add float value to the int item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField('0.22')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getErrorInt()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Use an integer format')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279949] Should not be possible have an empty value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField(' ')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getErrorInt()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Use an integer format')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279950] Should return an error when the value is > 2147483647', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField('214748367')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntSaveIcon()];
                    case 3:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('[CardView Int Item] - 214748367')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField('2147483648')];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntSaveIcon()];
                    case 8:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, cardViewPageComponent.getErrorInt()];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('Use an integer format')];
                    case 10:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279951] Should be possible undo item modify when click on the clear button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnIntField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterIntField('999')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnIntClearIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getIntFieldText()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('213')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Float', function () {
        it('[C279941] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-textitem-label-float"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279952] Should be present a default value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getFloatFieldText()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('9.9')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279953] Should be possible edit float item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnFloatField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterFloatField('77.33')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnFloatSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('[CardView Float Item] - 77.33')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279954] Should not be possible add string value to the float item', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnFloatField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterFloatField('string value')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnFloatSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getErrorFloat()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Use a number format')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279955] Should be possible undo item item modify when click on the clear button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnFloatField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterFloatField('77.33')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnFloatClearIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getFloatFieldText()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('9.9')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279956] Should not be possible have an empty value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.clickOnFloatField()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.enterFloatField(' ')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, cardViewPageComponent.clickOnFloatSaveIcon()];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getErrorFloat()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Use a number format')];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Boolean', function () {
        it('[C279942] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var label;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        label = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-boolean-label-boolean"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(label)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279957] Should be possible edit the checkbox value when click on it', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, cardViewPageComponent.checkboxClick()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(0)];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('[CardView Boolean Item] - false')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, cardViewPageComponent.checkboxClick()];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, cardViewPageComponent.getOutputText(1)];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe('[CardView Boolean Item] - true')];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Date and DateTime', function () {
        it('[C279961] Should the label be present', function () { return __awaiter(_this, void 0, void 0, function () {
            var labelDate, labelDatetime;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        labelDate = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-dateitem-label-date"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(labelDate)];
                    case 1:
                        _a.sent();
                        labelDatetime = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-dateitem-label-datetime"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(labelDatetime)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279962] Should be present a default value', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('date', 'date')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('12/24/83')];
                    case 2:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('datetime', 'datetime')];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual('Dec 24, 1983, 10:00')];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('[C279936] Should not be possible edit any parameter when editable property is false', function () { return __awaiter(_this, void 0, void 0, function () {
        var editIconText, editIconInt, editIconFloat, editIconKey, editIconData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardViewPageComponent.disableEdit()];
                case 1:
                    _a.sent();
                    editIconText = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-edit-icon-name"]'));
                    editIconInt = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-edit-icon-int"]'));
                    editIconFloat = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-edit-icon-float"]'));
                    editIconKey = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-key-value-pairs-button-key-value-pairs"]'));
                    editIconData = protractor_1.element(protractor_1.by.css('mat-datetimepicker-toggle'));
                    return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(editIconText)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(editIconInt)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(editIconFloat)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(editIconKey)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(editIconData)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=card-view-component.e2e.js.map