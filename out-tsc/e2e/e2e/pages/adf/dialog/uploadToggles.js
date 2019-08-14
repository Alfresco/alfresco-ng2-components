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
var adf_testing_1 = require("@alfresco/adf-testing");
var UploadToggles = /** @class */ (function () {
    function UploadToggles() {
        this.formControllersPage = new adf_testing_1.FormControllersPage();
        this.multipleFileUploadToggle = protractor_1.element(protractor_1.by.id('adf-multiple-upload-switch'));
        this.uploadFolderToggle = protractor_1.element(protractor_1.by.id('adf-folder-upload-switch'));
        this.extensionFilterToggle = protractor_1.element(protractor_1.by.id('adf-extension-filter-upload-switch'));
        this.maxSizeToggle = protractor_1.element(protractor_1.by.id('adf-max-size-filter-upload-switch'));
        this.versioningToggle = protractor_1.element(protractor_1.by.id('adf-version-upload-switch'));
        this.extensionAcceptedField = protractor_1.element(protractor_1.by.css('input[data-automation-id="accepted-files-type"]'));
        this.maxSizeField = protractor_1.element(protractor_1.by.css('input[data-automation-id="max-files-size"]'));
        this.disableUploadCheckbox = protractor_1.element(protractor_1.by.css('[id="adf-disable-upload"]'));
    }
    UploadToggles.prototype.enableMultipleFileUpload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.enableToggle(this.multipleFileUploadToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.disableMultipleFileUpload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.multipleFileUploadToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.disableToggle(this.multipleFileUploadToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.enableFolderUpload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.uploadFolderToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.checkMultipleFileUploadToggleIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var enabledToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enabledToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[id="adf-multiple-upload-switch"][class*="mat-checked"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(enabledToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.checkMaxSizeToggleIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var enabledToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enabledToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[id="adf-max-size-filter-upload-switch"][class*="mat-checked"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(enabledToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.checkVersioningToggleIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var enabledToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        enabledToggle = protractor_1.element(protractor_1.by.css('mat-slide-toggle[id="adf-version-upload-switch"][class*="mat-checked"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(enabledToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.disableFolderUpload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.uploadFolderToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.enableExtensionFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.extensionFilterToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.enableToggle(this.extensionFilterToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.disableExtensionFilter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.extensionFilterToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.disableToggle(this.extensionFilterToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.enableMaxSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.maxSizeToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.disableMaxSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.maxSizeToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.enableVersioning = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.versioningToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.disableVersioning = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.versioningToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.clickCheckboxDisableUpload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.disableUploadCheckbox.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.addExtension = function (extension) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.extensionAcceptedField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.extensionAcceptedField.sendKeys(',' + extension)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.addMaxSize = function (size) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clearText()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.maxSizeField.sendKeys(size)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadToggles.prototype.clearText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.maxSizeField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.maxSizeField, '')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UploadToggles;
}());
exports.UploadToggles = UploadToggles;
//# sourceMappingURL=uploadToggles.js.map