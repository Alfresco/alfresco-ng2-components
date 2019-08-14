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
var folderDialog_1 = require("./dialog/folderDialog");
var createLibraryDialog_1 = require("./dialog/createLibraryDialog");
var adf_testing_1 = require("@alfresco/adf-testing");
var drop_actions_1 = require("../../actions/drop.actions");
var protractor_1 = require("protractor");
var path = require("path");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("./navigationBarPage");
var ContentServicesPage = /** @class */ (function () {
    function ContentServicesPage() {
        this.columns = {
            name: 'Display name',
            size: 'Size',
            nodeId: 'Node id',
            createdBy: 'Created by',
            created: 'Created'
        };
        this.contentList = new adf_testing_2.DocumentListPage(protractor_1.element.all(protractor_1.by.css('adf-upload-drag-area adf-document-list')).first());
        this.formControllersPage = new adf_testing_1.FormControllersPage();
        this.createFolderDialog = new folderDialog_1.FolderDialog();
        this.createLibraryDialog = new createLibraryDialog_1.CreateLibraryDialog();
        this.dragAndDropAction = new drop_actions_1.DropActions();
        this.multipleFileUploadToggle = protractor_1.element(protractor_1.by.id('adf-document-list-enable-drop-files'));
        this.uploadBorder = protractor_1.element(protractor_1.by.id('document-list-container'));
        this.contentServices = protractor_1.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Content Services"]'));
        this.currentFolder = protractor_1.element(protractor_1.by.css('div[class*="adf-breadcrumb-item adf-active"] div'));
        this.createFolderButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="create-new-folder"]'));
        this.editFolderButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="edit-folder"]'));
        this.createLibraryButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="create-new-library"]'));
        this.activeBreadcrumb = protractor_1.element(protractor_1.by.css('div[class*="active"]'));
        this.tooltip = protractor_1.by.css('div[class*="--text adf-full-width"] span');
        this.uploadFileButton = protractor_1.element(protractor_1.by.css('.adf-upload-button-file-container button'));
        this.uploadFileButtonInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="upload-single-file"]'));
        this.uploadMultipleFileButton = protractor_1.element(protractor_1.by.css('input[data-automation-id="upload-multiple-files"]'));
        this.uploadFolderButton = protractor_1.element(protractor_1.by.css('input[data-automation-id="uploadFolder"]'));
        this.errorSnackBar = protractor_1.element(protractor_1.by.css('simple-snack-bar[class*="mat-simple-snackbar"]'));
        this.emptyPagination = protractor_1.element(protractor_1.by.css('adf-pagination[class*="adf-pagination__empty"]'));
        this.dragAndDrop = protractor_1.element.all(protractor_1.by.css('adf-upload-drag-area div')).first();
        this.nameHeader = protractor_1.element(protractor_1.by.css('div[data-automation-id="auto_id_name"] > span'));
        this.sizeHeader = protractor_1.element(protractor_1.by.css('div[data-automation-id="auto_id_content.sizeInBytes"] > span'));
        this.createdByHeader = protractor_1.element(protractor_1.by.css('div[data-automation-id="auto_id_createdByUser.displayName"] > span'));
        this.createdHeader = protractor_1.element(protractor_1.by.css('div[data-automation-id="auto_id_createdAt"] > span'));
        this.recentFiles = protractor_1.element(protractor_1.by.css('.adf-container-recent'));
        this.recentFilesExpanded = protractor_1.element(protractor_1.by.css('.adf-container-recent mat-expansion-panel-header.mat-expanded'));
        this.recentFilesClosed = protractor_1.element(protractor_1.by.css('.adf-container-recent mat-expansion-panel-header'));
        this.recentFileIcon = protractor_1.element(protractor_1.by.css('.adf-container-recent mat-expansion-panel-header mat-icon'));
        this.emptyFolder = protractor_1.element(protractor_1.by.css('.adf-empty-folder-this-space-is-empty'));
        this.emptyFolderImage = protractor_1.element(protractor_1.by.css('.adf-empty-folder-image'));
        this.emptyRecent = protractor_1.element(protractor_1.by.css('.adf-container-recent .adf-empty-list__title'));
        this.gridViewButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="document-list-grid-view"]'));
        this.cardViewContainer = protractor_1.element(protractor_1.by.css('div.adf-document-list-container div.adf-datatable-card'));
        this.shareNodeButton = protractor_1.element(protractor_1.by.cssContainingText('mat-icon', ' share '));
        this.nameColumnHeader = 'name';
        this.createdByColumnHeader = 'createdByUser.displayName';
        this.createdColumnHeader = 'createdAt';
        this.deleteContentElement = protractor_1.element(protractor_1.by.css('button[data-automation-id*="DELETE"]'));
        this.metadataAction = protractor_1.element(protractor_1.by.css('button[data-automation-id*="METADATA"]'));
        this.versionManagerAction = protractor_1.element(protractor_1.by.css('button[data-automation-id*="VERSIONS"]'));
        this.moveContentElement = protractor_1.element(protractor_1.by.css('button[data-automation-id*="MOVE"]'));
        this.copyContentElement = protractor_1.element(protractor_1.by.css('button[data-automation-id*="COPY"]'));
        this.lockContentElement = protractor_1.element(protractor_1.by.css('button[data-automation-id="DOCUMENT_LIST.ACTIONS.LOCK"]'));
        this.downloadContent = protractor_1.element(protractor_1.by.css('button[data-automation-id*="DOWNLOAD"]'));
        this.siteListDropdown = protractor_1.element(protractor_1.by.css("mat-select[data-automation-id='site-my-files-option']"));
        this.downloadButton = protractor_1.element(protractor_1.by.css('button[title="Download"]'));
        this.favoriteButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="favorite"]'));
        this.markedFavorite = protractor_1.element(protractor_1.by.cssContainingText('button[data-automation-id="favorite"] mat-icon', 'star'));
        this.notMarkedFavorite = protractor_1.element(protractor_1.by.cssContainingText('button[data-automation-id="favorite"] mat-icon', 'star_border'));
        this.multiSelectToggle = protractor_1.element(protractor_1.by.cssContainingText('span.mat-slide-toggle-content', ' Multiselect (with checkboxes) '));
    }
    ContentServicesPage.prototype.pressContextMenuActionNamed = function (actionName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.clickExecuteScript("button[data-automation-id=\"context-" + actionName + "\"]")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkContextActionIsVisible = function (actionName) {
        return __awaiter(this, void 0, void 0, function () {
            var actionButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actionButton = protractor_1.element(protractor_1.by.css("button[data-automation-id=\"context-" + actionName + "\""));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(actionButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkContextActionIsEnabled = function (actionName) {
        return __awaiter(this, void 0, void 0, function () {
            var actionButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        actionButton = protractor_1.element(protractor_1.by.css("button[data-automation-id=\"context-" + actionName + "\""));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(actionButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, actionButton.isEnabled()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getDocumentList = function () {
        return this.contentList;
    };
    ContentServicesPage.prototype.closeActionContext = function () {
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
    ContentServicesPage.prototype.checkLockedIcon = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.checkLockedIcon(content)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkUnlockedIcon = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.checkUnlockedIcon(content)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkDeleteIsDisabled = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var disabledDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.clickOnActionMenu(content)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForContentOptions()];
                    case 2:
                        _a.sent();
                        disabledDelete = protractor_1.element(protractor_1.by.css("button[data-automation-id*='DELETE'][disabled='true']"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(disabledDelete)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.deleteContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.clickOnActionMenu(content)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForContentOptions()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.deleteContentElement)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.metadataContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.clickOnActionMenu(content)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForContentOptions()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.metadataAction)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.versionManagerContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.clickOnActionMenu(content)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForContentOptions()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.versionManagerAction)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.copyContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.clickOnActionMenu(content)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.copyContentElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.lockContent = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.clickOnActionMenu(content)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.lockContentElement)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.waitForContentOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.copyContentElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.moveContentElement)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.deleteContentElement)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.downloadContent)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickFileHyperlink = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var hyperlink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(hyperlink)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkFileHyperlinkIsEnabled = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var hyperlink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hyperlink = this.contentList.dataTablePage().getFileHyperlink(fileName);
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(hyperlink)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickHyperlinkNavigationToggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var hyperlinkToggle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hyperlinkToggle = protractor_1.element(protractor_1.by.cssContainingText('.mat-slide-toggle-content', 'Hyperlink navigation'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(hyperlinkToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.enableDropFilesInAFolder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.multipleFileUploadToggle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.disableDropFilesInAFolder = function () {
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
    ContentServicesPage.prototype.getElementsDisplayedId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().getAllRowsColumnValues(this.columns.nodeId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkElementsDateSortedAsc = function (elements) {
        var sorted = true;
        var i = 0;
        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            var left = adf_testing_2.DateUtil.parse(elements[i], 'DD-MM-YY');
            var right = adf_testing_2.DateUtil.parse(elements[i + 1], 'DD-MM-YY');
            if (left > right) {
                sorted = false;
            }
            i++;
        }
        return sorted;
    };
    ContentServicesPage.prototype.checkElementsDateSortedDesc = function (elements) {
        var sorted = true;
        var i = 0;
        while (elements.length > 1 && sorted === true && i < (elements.length - 1)) {
            var left = adf_testing_2.DateUtil.parse(elements[i], 'DD-MM-YY');
            var right = adf_testing_2.DateUtil.parse(elements[i + 1], 'DD-MM-YY');
            if (left < right) {
                sorted = false;
            }
            i++;
        }
        return sorted;
    };
    ContentServicesPage.prototype.checkRecentFileToBeShowed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.recentFiles)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.expandRecentFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkRecentFileToBeShowed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkRecentFileToBeClosed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.recentFilesClosed)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.checkRecentFileToBeOpened()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.closeRecentFiles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkRecentFileToBeShowed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkRecentFileToBeOpened()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.recentFilesExpanded)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.checkRecentFileToBeClosed()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkRecentFileToBeClosed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.recentFilesClosed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkRecentFileToBeOpened = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.recentFilesExpanded)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getRecentFileIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.getText(this.recentFileIcon)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkAcsContainer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.uploadBorder)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.waitForTableBody = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.waitForTableBody()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.goToDocumentList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var navigationBarPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        navigationBarPage = new navigationBarPage_1.NavigationBarPage();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickOnContentServices = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.contentServices)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.numberOfResultsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().numberOfRows()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.currentFolderName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.currentFolder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.currentFolder.getText()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getAllRowsNameColumn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.getAllRowsColumnValues(this.columns.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.sortByName = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTable.sortByColumn(sortOrder, this.nameColumnHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.sortByAuthor = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTable.sortByColumn(sortOrder, this.createdByColumnHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.sortByCreated = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTable.sortByColumn(sortOrder, this.createdColumnHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.sortAndCheckListIsOrderedByName = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByName(sortOrder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkListIsSortedByNameColumn(sortOrder)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkListIsSortedByNameColumn = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.name)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkListIsSortedByCreatedColumn = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.created)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkListIsSortedByAuthorColumn = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.createdBy)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkListIsSortedBySizeColumn = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().checkListIsSorted(sortOrder, this.columns.size)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.sortAndCheckListIsOrderedByAuthor = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByAuthor(sortOrder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkListIsSortedByAuthorColumn(sortOrder)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.sortAndCheckListIsOrderedByCreated = function (sortOrder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sortByCreated(sortOrder)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.checkListIsSortedByCreatedColumn(sortOrder)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.doubleClickRow = function (nodeName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.contentList.doubleClickRow(nodeName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickOnCreateNewFolder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.createFolderButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickOnFavoriteButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.favoriteButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkIsMarkedFavorite = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.markedFavorite)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkIsNotMarkedFavorite = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.notMarkedFavorite)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickOnEditFolder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.editFolderButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkEditFolderButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.editFolderButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.openCreateLibraryDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.createLibraryButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createLibraryDialog.waitForDialogToOpen()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.createNewFolder = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickOnCreateNewFolder()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createFolderDialog.addFolderName(folder)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.createFolderDialog.clickOnCreateUpdateButton()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkContentIsDisplayed = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().checkContentIsDisplayed(this.columns.name, content)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkContentsAreDisplayed = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < content.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkContentIsDisplayed(content[i])];
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
    ContentServicesPage.prototype.checkContentIsNotDisplayed = function (content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().checkContentIsNotDisplayed(this.columns.name, content)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getActiveBreadcrumb = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.activeBreadcrumb)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.activeBreadcrumb.getAttribute('title')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.uploadFile = function (fileLocation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkUploadButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.uploadFileButtonInput.sendKeys(path.resolve(path.join(protractor_1.browser.params.testConfig.main.rootPath, fileLocation)))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.checkUploadButton()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.uploadMultipleFile = function (files) {
        return __awaiter(this, void 0, void 0, function () {
            var allFiles, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton)];
                    case 1:
                        _a.sent();
                        allFiles = path.resolve(path.join(protractor_1.browser.params.testConfig.main.rootPath, files[0]));
                        for (i = 1; i < files.length; i++) {
                            allFiles = allFiles + '\n' + path.resolve(path.join(protractor_1.browser.params.testConfig.main.rootPath, files[i]));
                        }
                        return [4 /*yield*/, this.uploadMultipleFileButton.sendKeys(allFiles)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.uploadFolder = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.uploadFolderButton.sendKeys(path.resolve(path.join(protractor_1.browser.params.testConfig.main.rootPath, folder)))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.uploadFolderButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getSingleFileButtonTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(this.uploadFileButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.uploadFileButtonInput.getAttribute('title')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getMultipleFileButtonTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(this.uploadMultipleFileButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.uploadMultipleFileButton.getAttribute('title')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getFolderButtonTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsPresent(this.uploadFolderButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.uploadFolderButton.getAttribute('title')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkUploadButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsClickable(this.uploadFileButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.uploadButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.uploadFileButton.isEnabled()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getErrorMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.errorSnackBar)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.errorSnackBar.getText()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.enableInfiniteScrolling = function () {
        return __awaiter(this, void 0, void 0, function () {
            var infiniteScrollButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        infiniteScrollButton = protractor_1.element(protractor_1.by.cssContainingText('.mat-slide-toggle-content', 'Enable Infinite Scrolling'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(infiniteScrollButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.enableCustomPermissionMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var customPermissionMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customPermissionMessage = protractor_1.element(protractor_1.by.cssContainingText('.mat-slide-toggle-content', 'Enable custom permission message'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(customPermissionMessage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.enableMediumTimeFormat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var mediumTimeFormat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mediumTimeFormat = protractor_1.element(protractor_1.by.css('#enableMediumTimeFormat'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(mediumTimeFormat)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.enableThumbnails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var thumbnailSlide;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        thumbnailSlide = protractor_1.element(protractor_1.by.id('adf-thumbnails-upload-switch'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(thumbnailSlide)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkPaginationIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.emptyPagination)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getDocumentListRowNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var documentList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        documentList = protractor_1.element(protractor_1.by.css('adf-upload-drag-area adf-document-list'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(documentList)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.$$('adf-upload-drag-area adf-document-list .adf-datatable-row').count()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkColumnNameHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.nameHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkColumnSizeHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.sizeHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkColumnCreatedByHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.createdByHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkColumnCreatedHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.createdHeader)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkDragAndDropDIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.dragAndDrop)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.dragAndDropFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkDragAndDropDIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dragAndDropAction.dropFile(this.dragAndDrop, file)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.dragAndDropFolder = function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkDragAndDropDIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.dragAndDropAction.dropFolder(this.dragAndDrop, folder)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkLockIsDisplayedForElement = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var lockButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lockButton = protractor_1.element(protractor_1.by.css("div.adf-datatable-cell[data-automation-id=\"" + name + "\"] button"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(lockButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getColumnValueForRow = function (file, columnName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.contentList.dataTablePage().getColumnValueForRow(this.columns.name, file, columnName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getStyleValueForRowText = function (rowName, styleName) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = protractor_1.element(protractor_1.by.css("div.adf-datatable-cell[data-automation-id=\"" + rowName + "\"] span.adf-datatable-cell-value[title=\"" + rowName + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, row.getCssValue(styleName)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkEmptyFolderTextToBe = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.emptyFolder)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.emptyFolder.getText()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toContain(text)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkEmptyFolderImageUrlToContain = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.emptyFolderImage)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.emptyFolderImage.getAttribute('src')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toContain(url)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkEmptyRecentFileIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.emptyRecent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getRowIconImageUrl = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var iconRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        iconRow = protractor_1.element(protractor_1.by.css(".adf-document-list-container div.adf-datatable-cell[data-automation-id=\"" + fileName + "\"] img"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(iconRow)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, iconRow.getAttribute('src')];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkGridViewButtonIsVisible = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.gridViewButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickGridViewButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkGridViewButtonIsVisible()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.gridViewButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkCardViewContainerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.cardViewContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getCardElementShowedInPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.cardViewContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, protractor_1.$$('div.adf-document-list-container div.adf-datatable-card div.adf-cell-value img').count()];
                }
            });
        });
    };
    ContentServicesPage.prototype.getDocumentCardIconForElement = function (elementName) {
        return __awaiter(this, void 0, void 0, function () {
            var elementIcon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elementIcon = protractor_1.element(protractor_1.by.css(".adf-document-list-container div.adf-datatable-cell[data-automation-id=\"" + elementName + "\"] img"));
                        return [4 /*yield*/, elementIcon.getAttribute('src')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkDocumentCardPropertyIsShowed = function (elementName, propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var elementProperty;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elementProperty = protractor_1.element(protractor_1.by.css(".adf-document-list-container div.adf-datatable-cell[data-automation-id=\"" + elementName + "\"][title=\"" + propertyName + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(elementProperty)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getAttributeValueForElement = function (elementName, propertyName) {
        return __awaiter(this, void 0, void 0, function () {
            var elementSize;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elementSize = protractor_1.element(protractor_1.by.css(".adf-document-list-container div.adf-datatable-cell[data-automation-id=\"" + elementName + "\"][title=\"" + propertyName + "\"] span"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.getText(elementSize)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkMenuIsShowedForElementIndex = function (elementIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var elementMenu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        elementMenu = protractor_1.element(protractor_1.by.css("button[data-automation-id=\"action_menu_" + elementIndex + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(elementMenu)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.navigateToCardFolder = function (folderName) {
        return __awaiter(this, void 0, void 0, function () {
            var folderCard, folderSelected;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        folderCard = protractor_1.element(protractor_1.by.css(".adf-document-list-container div.adf-image-table-cell.adf-datatable-cell[data-automation-id=\"" + folderName + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(folderCard)];
                    case 2:
                        _a.sent();
                        folderSelected = protractor_1.element(protractor_1.by.css(".adf-datatable-row.adf-is-selected div[data-automation-id=\"" + folderName + "\"].adf-datatable-cell--image"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(folderSelected)];
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
    ContentServicesPage.prototype.selectGridSortingFromDropdown = function (sortingChosen) {
        return __awaiter(this, void 0, void 0, function () {
            var sortingDropdown, optionToClick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sortingDropdown = protractor_1.element(protractor_1.by.css('mat-select[data-automation-id="grid-view-sorting"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(sortingDropdown)];
                    case 1:
                        _a.sent();
                        optionToClick = protractor_1.element(protractor_1.by.css("mat-option[data-automation-id=\"grid-view-sorting-" + sortingChosen + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(optionToClick)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkRowIsDisplayed = function (rowName) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = this.contentList.dataTablePage().getCellElementByValue(this.columns.name, rowName);
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickShareButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.shareNodeButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.checkSelectedSiteIsDisplayed = function (siteName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.siteListDropdown.element(protractor_1.by.cssContainingText('.mat-select-value-text span', siteName)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.selectSite = function (siteName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.clickOnSelectDropdownOption(siteName, this.siteListDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickDownloadButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.downloadButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.clickMultiSelectToggle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.multiSelectToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ContentServicesPage.prototype.getRowByName = function (rowName) {
        return this.contentList.dataTable.getRow(this.columns.name, rowName);
    };
    return ContentServicesPage;
}());
exports.ContentServicesPage = ContentServicesPage;
//# sourceMappingURL=contentServicesPage.js.map