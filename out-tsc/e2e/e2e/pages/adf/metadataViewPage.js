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
var MetadataViewPage = /** @class */ (function () {
    function MetadataViewPage() {
        this.title = protractor_1.element(protractor_1.by.css("div[info-drawer-title]"));
        this.expandedAspect = protractor_1.element(protractor_1.by.css("mat-expansion-panel-header[aria-expanded='true']"));
        this.aspectTitle = protractor_1.by.css("mat-panel-title");
        this.name = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-name'] span"));
        this.creator = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-createdByUser.displayName'] span"));
        this.createdDate = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-dateitem-createdAt'] span"));
        this.modifier = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-modifiedByUser.displayName'] span"));
        this.modifiedDate = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-dateitem-modifiedAt'] span"));
        this.mimetypeName = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-content.mimeTypeName']"));
        this.size = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-content.sizeInBytes']"));
        this.description = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-properties.cm:description'] span"));
        this.author = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-properties.cm:author'] span"));
        this.titleProperty = protractor_1.element(protractor_1.by.css("span[data-automation-id='card-textitem-value-properties.cm:title'] span"));
        this.editIcon = protractor_1.element(protractor_1.by.css("button[data-automation-id='meta-data-card-toggle-edit']"));
        this.informationButton = protractor_1.element(protractor_1.by.css("button[data-automation-id='meta-data-card-toggle-expand']"));
        this.informationSpan = protractor_1.element(protractor_1.by.css("span[data-automation-id='meta-data-card-toggle-expand-label']"));
        this.informationIcon = protractor_1.element(protractor_1.by.css("span[data-automation-id='meta-data-card-toggle-expand-label'] ~ mat-icon"));
        this.displayEmptySwitch = protractor_1.element(protractor_1.by.id("adf-metadata-empty"));
        this.readonlySwitch = protractor_1.element(protractor_1.by.id("adf-metadata-readonly"));
        this.multiSwitch = protractor_1.element(protractor_1.by.id("adf-metadata-multi"));
        this.presetSwitch = protractor_1.element(protractor_1.by.id('adf-toggle-custom-preset'));
        this.defaultPropertiesSwitch = protractor_1.element(protractor_1.by.id('adf-metadata-default-properties'));
        this.closeButton = protractor_1.element(protractor_1.by.cssContainingText('button.mat-button span', 'Close'));
        this.displayAspect = protractor_1.element(protractor_1.by.css("input[placeholder='Display Aspect']"));
        this.applyAspect = protractor_1.element(protractor_1.by.cssContainingText("button span.mat-button-wrapper", 'Apply Aspect'));
    }
    MetadataViewPage.prototype.getTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.title)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getExpandedAspectName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.expandedAspect.element(this.aspectTitle))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getCreator = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.creator)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getCreatedDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.createdDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getModifier = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.modifier)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getModifiedDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.modifiedDate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getMimetypeName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.mimetypeName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.size)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getDescription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.description)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getAuthor = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.author)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getTitleProperty = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.titleProperty)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.editIconIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.editIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.editIconIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.editIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.editIconClick = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.clickExecuteScript('button[data-automation-id="meta-data-card-toggle-edit"]')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.informationButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsClickable(this.informationButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.informationButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.informationButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickOnInformationButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.informationButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.getInformationButtonText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.informationSpan)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.getInformationIconText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.informationIcon)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickOnPropertiesTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var propertiesTab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertiesTab = protractor_1.element(protractor_1.by.cssContainingText(".adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content", "Properties"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(propertiesTab)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.getEditIconTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.editIcon.getAttribute('title')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.editPropertyIconIsDisplayed = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var editPropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editPropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsPresent(editPropertyIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.updatePropertyIconIsDisplayed = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var updatePropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatePropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(updatePropertyIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickUpdatePropertyIcon = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var updatePropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatePropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(updatePropertyIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickClearPropertyIcon = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var clearPropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearPropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(clearPropertyIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.enterPropertyText = function (propertyName, text) {
        return __awaiter(this, void 0, void 0, function () {
            var textField;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        textField = protractor_1.element(protractor_1.by.css('input[data-automation-id="card-textitem-editinput-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsClickable(textField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(textField, text.toString())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.enterPresetText = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var presetField, applyButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        presetField = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-text-custom-preset"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(presetField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(presetField, text)];
                    case 2:
                        _a.sent();
                        applyButton = protractor_1.element(protractor_1.by.css('button[id="adf-metadata-aplly"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(applyButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.enterDescriptionText = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var textField;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        textField = protractor_1.element(protractor_1.by.css('textarea[data-automation-id="card-textitem-edittextarea-properties.cm:description"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(textField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(textField, text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.getPropertyText = function (propertyName, type) {
        return __awaiter(this, void 0, void 0, function () {
            var propertyType, textField;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        propertyType = type || 'textitem';
                        textField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(textField)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.clearPropertyIconIsDisplayed = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var clearPropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearPropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(clearPropertyIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickEditPropertyIcons = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var editPropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editPropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(editPropertyIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.getPropertyIconTooltip = function (propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var editPropertyIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editPropertyIcon = protractor_1.element(protractor_1.by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
                        return [4 /*yield*/, editPropertyIcon.getAttribute('title')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickMetadataGroup = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        group = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(group)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.checkMetadataGroupIsPresent = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        group = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(group)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.checkMetadataGroupIsNotPresent = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        group = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(group)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.checkMetadataGroupIsExpand = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var group, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        group = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(group)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, group.getAttribute('class')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toContain('mat-expanded')];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.checkMetadataGroupIsNotExpand = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var group, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        group = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsPresent(group)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, group.getAttribute('class')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).not.toContain('mat-expanded')];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.getMetadataGroupTitle = function (groupName) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        group = protractor_1.element(protractor_1.by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(group)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MetadataViewPage.prototype.checkPropertyIsVisible = function (propertyName, type) {
        return __awaiter(this, void 0, void 0, function () {
            var property;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        property = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(property)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.checkPropertyIsNotVisible = function (propertyName, type) {
        return __awaiter(this, void 0, void 0, function () {
            var property;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        property = protractor_1.element(protractor_1.by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(property)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickCloseButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.closeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.typeAspectName = function (aspectName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.displayAspect)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.displayAspect, aspectName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MetadataViewPage.prototype.clickApplyAspect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.applyAspect)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return MetadataViewPage;
}());
exports.MetadataViewPage = MetadataViewPage;
//# sourceMappingURL=metadataViewPage.js.map