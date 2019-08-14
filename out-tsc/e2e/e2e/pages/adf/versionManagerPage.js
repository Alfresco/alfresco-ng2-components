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
var path = require("path");
var protractor_1 = require("protractor");
var adf_testing_1 = require("@alfresco/adf-testing");
var adf_testing_2 = require("@alfresco/adf-testing");
var VersionManagePage = /** @class */ (function () {
    function VersionManagePage() {
        this.formControllersPage = new adf_testing_1.FormControllersPage();
        this.showNewVersionButton = protractor_1.element(protractor_1.by.id('adf-show-version-upload-button'));
        this.uploadNewVersionInput = protractor_1.element(protractor_1.by.css('adf-upload-version-button input[data-automation-id="upload-single-file"]'));
        this.uploadNewVersionButton = protractor_1.element(protractor_1.by.css('adf-upload-version-button'));
        this.uploadNewVersionContainer = protractor_1.element(protractor_1.by.id('adf-new-version-uploader-container'));
        this.cancelButton = protractor_1.element(protractor_1.by.id('adf-new-version-cancel'));
        this.majorRadio = protractor_1.element(protractor_1.by.id('adf-new-version-major'));
        this.minorRadio = protractor_1.element(protractor_1.by.id('adf-new-version-minor'));
        this.commentText = protractor_1.element(protractor_1.by.id('adf-new-version-text-area'));
        this.readOnlySwitch = protractor_1.element(protractor_1.by.id('adf-version-manager-switch-readonly'));
        this.downloadSwitch = protractor_1.element(protractor_1.by.id('adf-version-manager-switch-download'));
        this.commentsSwitch = protractor_1.element(protractor_1.by.id('adf-version-manager-switch-comments'));
    }
    VersionManagePage.prototype.checkUploadNewVersionsButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.showNewVersionButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.checkCancelButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.cancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.uploadNewVersionFile = function (fileLocation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(this.uploadNewVersionInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.uploadNewVersionInput.sendKeys(path.resolve(path.join(protractor_1.browser.params.testConfig.main.rootPath, fileLocation)))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.showNewVersionButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.getFileVersionName = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var fileElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileElement = protractor_1.element(protractor_1.by.css("[id=\"adf-version-list-item-name-" + version + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.getText(fileElement)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    VersionManagePage.prototype.checkFileVersionExist = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var fileVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileVersion = protractor_1.element(protractor_1.by.id("adf-version-list-item-version-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(fileVersion)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.checkFileVersionNotExist = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var fileVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileVersion = protractor_1.element(protractor_1.by.id("adf-version-list-item-version-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(fileVersion)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.getFileVersionComment = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var fileComment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileComment = protractor_1.element(protractor_1.by.id("adf-version-list-item-comment-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.getText(fileComment)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    VersionManagePage.prototype.getFileVersionDate = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var fileDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileDate = protractor_1.element(protractor_1.by.id("adf-version-list-item-date-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.getText(fileDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    VersionManagePage.prototype.enterCommentText = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.clearSendKeys(this.commentText, text)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.clickMajorChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var radioMajor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        radioMajor = protractor_1.element(protractor_1.by.id("adf-new-version-major"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(radioMajor)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.clickMinorChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var radioMinor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        radioMinor = protractor_1.element(protractor_1.by.id("adf-new-version-minor"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(radioMinor)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * disables readOnly
     */
    VersionManagePage.prototype.disableReadOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.readOnlySwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * enables readOnly
     */
    VersionManagePage.prototype.enableReadOnly = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.readOnlySwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * disables download
     */
    VersionManagePage.prototype.disableDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.downloadSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * enables download
     */
    VersionManagePage.prototype.enableDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.downloadSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * disables comments
     */
    VersionManagePage.prototype.disableComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.commentsSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * enables comments
     */
    VersionManagePage.prototype.enableComments = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.commentsSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.clickActionButton = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(protractor_1.element(protractor_1.by.id("adf-version-list-action-menu-button-" + version)))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css('.cdk-overlay-container .mat-menu-content')))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.clickAcceptConfirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(protractor_1.element(protractor_1.by.id("adf-confirm-accept")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.clickCancelConfirm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(protractor_1.element(protractor_1.by.id("adf-confirm-cancel")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.closeActionsMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.closeDisabledActionsMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var container;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        container = protractor_1.element(protractor_1.by.css('div.cdk-overlay-backdrop.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.closeDisabledMenu()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(container)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.downloadFileVersion = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var downloadButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickActionButton(version)];
                    case 1:
                        _a.sent();
                        downloadButton = protractor_1.element(protractor_1.by.id("adf-version-list-action-download-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(downloadButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(downloadButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.deleteFileVersion = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var deleteButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickActionButton(version)];
                    case 1:
                        _a.sent();
                        deleteButton = protractor_1.element(protractor_1.by.id("adf-version-list-action-delete-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(deleteButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.restoreFileVersion = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            var restoreButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickActionButton(version)];
                    case 1:
                        _a.sent();
                        restoreButton = protractor_1.element(protractor_1.by.id("adf-version-list-action-restore-" + version));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(restoreButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.checkActionsArePresent = function (version) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.id("adf-version-list-action-download-" + version)))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.id("adf-version-list-action-delete-" + version)))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.id("adf-version-list-action-restore-" + version)))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VersionManagePage.prototype.closeVersionDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.uploadNewVersionContainer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return VersionManagePage;
}());
exports.VersionManagePage = VersionManagePage;
//# sourceMappingURL=versionManagerPage.js.map