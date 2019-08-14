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
var UploadDialog = /** @class */ (function () {
    function UploadDialog() {
        this.closeButton = protractor_1.element((protractor_1.by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]')));
        this.dialog = protractor_1.element(protractor_1.by.css('div[id="upload-dialog"]'));
        this.minimizedDialog = protractor_1.element(protractor_1.by.css('div[class*="upload-dialog--minimized"]'));
        this.uploadedStatusIcon = protractor_1.by.css('mat-icon[class*="status--done"]');
        this.cancelledStatusIcon = protractor_1.by.css('div[class*="status--cancelled"]');
        this.errorStatusIcon = protractor_1.by.css('div[class*="status--error"] mat-icon');
        this.errorTooltip = protractor_1.element(protractor_1.by.css('div.mat-tooltip'));
        this.rowByRowName = protractor_1.by.xpath('ancestor::adf-file-uploading-list-row');
        this.title = protractor_1.element(protractor_1.by.css('span[class*="upload-dialog__title"]'));
        this.minimizeButton = protractor_1.element(protractor_1.by.css('mat-icon[title="Minimize"]'));
        this.maximizeButton = protractor_1.element(protractor_1.by.css('mat-icon[title="Maximize"]'));
        this.canUploadConfirmationTitle = protractor_1.element(protractor_1.by.css('p[class="upload-dialog__confirmation--title"]'));
        this.canUploadConfirmationDescription = protractor_1.element(protractor_1.by.css('p[class="upload-dialog__confirmation--text"]'));
        this.confirmationDialogNoButton = protractor_1.element(protractor_1.by.partialButtonText('No'));
        this.confirmationDialogYesButton = protractor_1.element(protractor_1.by.partialButtonText('Yes'));
        this.cancelUploadsElement = protractor_1.element((protractor_1.by.css('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-cancel-all"]')));
    }
    UploadDialog.prototype.clickOnCloseButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkCloseButtonIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clickExecuteScript('footer[class*="upload-dialog__actions"] button[id="adf-upload-dialog-close"]')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.checkCloseButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.closeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.dialogIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.dialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.dialogIsMinimized = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.minimizedDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.dialogIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.dialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.getRowsName = function (content) {
        var row = protractor_1.element.all(protractor_1.by.css("div[class*='uploading-row'] span[title=\"" + content + "\"]")).first();
        return row;
    };
    UploadDialog.prototype.getRowByRowName = function (content) {
        var rows = this.getRowsName(content);
        return rows.element(this.rowByRowName);
    };
    UploadDialog.prototype.fileIsUploaded = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowByRowName(content)];
                    case 1:
                        row = _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(row.element(this.uploadedStatusIcon))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.fileIsError = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowByRowName(content)];
                    case 1:
                        row = _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(row.element(this.errorStatusIcon))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.filesAreUploaded = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < content.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.fileIsUploaded(content[i])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.fileIsNotDisplayedInDialog = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(protractor_1.element(protractor_1.by.css("div[class*='uploading-row'] span[title=\"" + content + "\"]")))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.cancelUploads = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.cancelUploadsElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.fileIsCancelled = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowByRowName(content)];
                    case 1:
                        row = _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(row.element(this.cancelledStatusIcon))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.removeUploadedFile = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var row, elementRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowByRowName(content)];
                    case 1:
                        row = _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(row.element(this.uploadedStatusIcon))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getRowByRowName(content)];
                    case 3:
                        elementRow = _a.sent();
                        elementRow.element(this.uploadedStatusIcon).click();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.getTitleText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.title)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.title.getText()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UploadDialog.prototype.getConfirmationDialogTitleText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.canUploadConfirmationTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.canUploadConfirmationTitle.getText()];
                }
            });
        });
    };
    UploadDialog.prototype.getConfirmationDialogDescriptionText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.canUploadConfirmationDescription)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.canUploadConfirmationDescription.getText()];
                }
            });
        });
    };
    UploadDialog.prototype.clickOnConfirmationDialogYesButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.confirmationDialogYesButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.clickOnConfirmationDialogNoButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.confirmationDialogNoButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.numberOfCurrentFilesUploaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTitleText()];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, text.split('Uploaded ')[1].split(' / ')[0]];
                }
            });
        });
    };
    UploadDialog.prototype.numberOfInitialFilesUploaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTitleText()];
                    case 1:
                        text = _a.sent();
                        return [2 /*return*/, text.split('Uploaded ')[1].split(' / ')[1]];
                }
            });
        });
    };
    UploadDialog.prototype.minimizeUploadDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.minimizeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.maximizeUploadDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.maximizeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.displayTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(this.errorStatusIcon))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(protractor_1.element(this.errorStatusIcon)).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UploadDialog.prototype.getTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.errorTooltip)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return UploadDialog;
}());
exports.UploadDialog = UploadDialog;
//# sourceMappingURL=uploadDialog.js.map