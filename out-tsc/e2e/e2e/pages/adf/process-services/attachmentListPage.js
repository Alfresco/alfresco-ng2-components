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
var path = require("path");
var remote = require("selenium-webdriver/remote");
var adf_testing_1 = require("@alfresco/adf-testing");
var AttachmentListPage = /** @class */ (function () {
    function AttachmentListPage() {
        this.attachFileButton = protractor_1.element(protractor_1.by.css("input[type='file']"));
        this.buttonMenu = protractor_1.element(protractor_1.by.css("button[data-automation-id='action_menu_0']"));
        this.viewButton = protractor_1.element(protractor_1.by.css("button[data-automation-id*='MENU_ACTIONS.VIEW_CONTENT']"));
        this.removeButton = protractor_1.element(protractor_1.by.css("button[data-automation-id*='MENU_ACTIONS.REMOVE_CONTENT']"));
        this.downloadButton = protractor_1.element(protractor_1.by.css("button[data-automation-id*='MENU_ACTIONS.DOWNLOAD_CONTENT']"));
        this.noContentContainer = protractor_1.element(protractor_1.by.css("div[class*='adf-no-content-container']"));
    }
    AttachmentListPage.prototype.checkEmptyAttachmentList = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.noContentContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.clickAttachFileButton = function (fileLocation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protractor_1.browser.setFileDetector(new remote.FileDetector());
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsPresent(this.attachFileButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.attachFileButton.sendKeys(path.resolve(path.join(protractor_1.browser.params.testConfig.main.rootPath, fileLocation)))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.checkFileIsAttached = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var fileAttached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileAttached = protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(fileAttached)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.checkAttachFileButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.attachFileButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.viewFile = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first().click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.buttonMenu)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.viewButton)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.removeFile = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first().click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.buttonMenu)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.removeButton)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.downloadFile = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first().click()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.buttonMenu)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(500)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.downloadButton)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.doubleClickFile = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var fileAttached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first())];
                    case 2:
                        _a.sent();
                        fileAttached = protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(fileAttached)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AttachmentListPage.prototype.checkFileIsRemoved = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var fileAttached;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileAttached = protractor_1.element.all(protractor_1.by.css('div[data-automation-id="' + name + '"]')).first();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(fileAttached)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AttachmentListPage;
}());
exports.AttachmentListPage = AttachmentListPage;
//# sourceMappingURL=attachmentListPage.js.map