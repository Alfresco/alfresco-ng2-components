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
var CreateLibraryDialog = /** @class */ (function () {
    function CreateLibraryDialog() {
        this.libraryDialog = protractor_1.element(protractor_1.by.css('[role="dialog"]'));
        this.libraryTitle = protractor_1.element(protractor_1.by.css('.adf-library-dialog>h2'));
        this.libraryNameField = protractor_1.element(protractor_1.by.css('input[formcontrolname="title"]'));
        this.libraryIdField = protractor_1.element(protractor_1.by.css('input[formcontrolname="id"]'));
        this.libraryDescriptionField = protractor_1.element(protractor_1.by.css('textarea[formcontrolname="description"]'));
        this.publicRadioButton = protractor_1.element(protractor_1.by.css('[data-automation-id="PUBLIC"]>label'));
        this.privateRadioButton = protractor_1.element(protractor_1.by.css('[data-automation-id="PRIVATE"]>label'));
        this.moderatedRadioButton = protractor_1.element(protractor_1.by.css('[data-automation-id="MODERATED"]>label'));
        this.cancelButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="cancel-library-id"]'));
        this.createButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="create-library-id"]'));
        this.errorMessage = protractor_1.element(protractor_1.by.css('.mat-dialog-content .mat-error'));
        this.errorMessages = protractor_1.element.all(protractor_1.by.css('.mat-dialog-content .mat-error'));
        this.libraryNameHint = protractor_1.element(protractor_1.by.css('adf-library-dialog .mat-hint'));
    }
    CreateLibraryDialog.prototype.getSelectedRadio = function () {
        return __awaiter(this, void 0, void 0, function () {
            var radio;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        radio = protractor_1.element(protractor_1.by.css('.mat-radio-button[class*="checked"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(radio)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.waitForDialogToOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsPresent(this.libraryDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.waitForDialogToClose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotPresent(this.libraryDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isDialogOpen = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.isElementPresent(this.libraryDialog)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.getTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.libraryTitle)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.getLibraryIdText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryIdField.getAttribute('value')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isErrorMessageDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.errorMessage.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.getErrorMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.errorMessage)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.getErrorMessages = function (position) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.errorMessages.get(position))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.waitForLibraryNameHint = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.libraryNameHint)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.getLibraryNameHint = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.libraryNameHint)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isNameDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryNameField.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isLibraryIdDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryIdField.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isDescriptionDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryDescriptionField.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isPublicDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publicRadioButton.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isModeratedDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moderatedRadioButton.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isPrivateDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.privateRadioButton.isDisplayed()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isCreateEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.isCancelEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cancelButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.clickCreate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.createButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.clickCancel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.cancelButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.typeLibraryName = function (libraryName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.libraryNameField, libraryName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.typeLibraryId = function (libraryId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.libraryIdField, libraryId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.typeLibraryDescription = function (libraryDescription) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.libraryDescriptionField, libraryDescription)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.clearLibraryName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryNameField.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.libraryNameField.sendKeys(' ', protractor_1.protractor.Key.CONTROL, 'a', protractor_1.protractor.Key.NULL, protractor_1.protractor.Key.BACK_SPACE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.clearLibraryId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.libraryIdField.clear()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.libraryIdField.sendKeys(' ', protractor_1.protractor.Key.CONTROL, 'a', protractor_1.protractor.Key.NULL, protractor_1.protractor.Key.BACK_SPACE)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.selectPublic = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.publicRadioButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.selectPrivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.privateRadioButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CreateLibraryDialog.prototype.selectModerated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.moderatedRadioButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return CreateLibraryDialog;
}());
exports.CreateLibraryDialog = CreateLibraryDialog;
//# sourceMappingURL=createLibraryDialog.js.map