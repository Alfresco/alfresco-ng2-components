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
var adf_testing_1 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var ViewerPage = /** @class */ (function () {
    function ViewerPage() {
        this.tabsPage = new adf_testing_1.TabsPage();
        this.formControllersPage = new adf_testing_1.FormControllersPage();
        this.closeButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-toolbar-back"]'));
        this.fileName = protractor_1.element(protractor_1.by.id('adf-viewer-display-name'));
        this.infoButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-toolbar-sidebar"]'));
        this.leftSideBarButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-toolbar-left-sidebar"]'));
        this.previousPageButton = protractor_1.element(protractor_1.by.id('viewer-previous-page-button'));
        this.nextPageButton = protractor_1.element(protractor_1.by.id('viewer-next-page-button'));
        this.zoomInButton = protractor_1.element(protractor_1.by.id('viewer-zoom-in-button'));
        this.zoomOutButton = protractor_1.element(protractor_1.by.id('viewer-zoom-out-button'));
        this.scalePageButton = protractor_1.element(protractor_1.by.id('viewer-scale-page-button'));
        this.fullScreenButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-toolbar-fullscreen"]'));
        this.rotateLeft = protractor_1.element(protractor_1.by.css('button[id="viewer-rotate-left-button"]'));
        this.rotateRight = protractor_1.element(protractor_1.by.css('button[id="viewer-rotate-right-button"]'));
        this.scaleImg = protractor_1.element(protractor_1.by.css('button[id="viewer-reset-button"]'));
        this.fileThumbnail = protractor_1.element(protractor_1.by.css('img[data-automation-id="adf-file-thumbnail"]'));
        this.pageSelectorInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-page-selector"]'));
        this.imgContainer = protractor_1.element(protractor_1.by.css('div[data-automation-id="adf-image-container"]'));
        this.mediaContainer = protractor_1.element(protractor_1.by.css('adf-media-player[class="adf-media-player ng-star-inserted"]'));
        this.percentage = protractor_1.element(protractor_1.by.css('div[data-automation-id="adf-page-scale"'));
        this.thumbnailsBtn = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-thumbnails-button"]'));
        this.thumbnailsContent = protractor_1.element(protractor_1.by.css('div[data-automation-id="adf-thumbnails-content"]'));
        this.thumbnailsClose = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-thumbnails-close"]'));
        this.secondThumbnail = protractor_1.element(protractor_1.by.css('adf-pdf-thumb > img[title="Page 2"'));
        this.lastThumbnailDisplayed = protractor_1.element.all(protractor_1.by.css('adf-pdf-thumb')).last();
        this.passwordDialog = protractor_1.element(protractor_1.by.css('adf-pdf-viewer-password-dialog'));
        this.passwordSubmit = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-password-dialog-submit"]'));
        this.passwordDialogClose = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-password-dialog-close"]'));
        this.passwordSubmitDisabled = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-password-dialog-submit"][disabled]'));
        this.passwordInput = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-password-dialog-input"]'));
        this.passwordError = protractor_1.element(protractor_1.by.css('mat-error[data-automation-id="adf-password-dialog-error"]'));
        this.infoSideBar = protractor_1.element(protractor_1.by.id('adf-right-sidebar'));
        this.leftSideBar = protractor_1.element(protractor_1.by.id('adf-left-sidebar'));
        this.viewer = protractor_1.element(protractor_1.by.css('adf-viewer'));
        this.pdfViewer = protractor_1.element(protractor_1.by.css('adf-pdf-viewer'));
        this.imgViewer = protractor_1.element(protractor_1.by.css('adf-img-viewer'));
        this.activeTab = protractor_1.element(protractor_1.by.css('div[class*="mat-tab-label-active"]'));
        this.toolbarSwitch = protractor_1.element(protractor_1.by.id('adf-switch-toolbar'));
        this.toolbar = protractor_1.element(protractor_1.by.id('adf-viewer-toolbar'));
        this.lastButton = protractor_1.element.all(protractor_1.by.css('#adf-viewer-toolbar mat-toolbar > button[data-automation-id*="adf-toolbar-"]')).last();
        this.goBackSwitch = protractor_1.element(protractor_1.by.id('adf-switch-goback'));
        this.canvasLayer = protractor_1.element.all(protractor_1.by.css('div[class="canvasWrapper"] > canvas')).first();
        this.openWithSwitch = protractor_1.element(protractor_1.by.id('adf-switch-openwith'));
        this.openWith = protractor_1.element(protractor_1.by.id('adf-viewer-openwith'));
        this.moreActionsMenuSwitch = protractor_1.element(protractor_1.by.id('adf-switch-moreactionsmenu'));
        this.moreActionsMenu = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-toolbar-more-actions"]'));
        this.customNameSwitch = protractor_1.element(protractor_1.by.id('adf-switch-custoname'));
        this.customToolbarToggle = protractor_1.element(protractor_1.by.id('adf-toggle-custom-toolbar'));
        this.customToolbar = protractor_1.element(protractor_1.by.css('adf-viewer-toolbar[data-automation-id="adf-viewer-custom-toolbar"]'));
        this.showRightSidebarSwitch = protractor_1.element(protractor_1.by.id('adf-switch-showrightsidebar'));
        this.showLeftSidebarSwitch = protractor_1.element(protractor_1.by.id('adf-switch-showleftsidebar'));
        this.moreActionsSwitch = protractor_1.element(protractor_1.by.id('adf-switch-moreactions'));
        this.pdfPageLoaded = protractor_1.element(protractor_1.by.css('[data-page-number="1"][data-loaded="true"], adf-img-viewer, adf-txt-viewer'));
        this.downloadSwitch = protractor_1.element(protractor_1.by.id('adf-switch-download'));
        this.downloadButton = protractor_1.element(protractor_1.by.id('adf-viewer-download'));
        this.printSwitch = protractor_1.element(protractor_1.by.id('adf-switch-print'));
        this.printButton = protractor_1.element(protractor_1.by.id('adf-viewer-print'));
        this.allowSidebarSwitch = protractor_1.element(protractor_1.by.id('adf-switch-allowsidebar'));
        this.allowLeftSidebarSwitch = protractor_1.element(protractor_1.by.id('adf-switch-allowLeftSidebar'));
        this.uploadButton = protractor_1.element(protractor_1.by.id('adf-viewer-upload'));
        this.timeButton = protractor_1.element(protractor_1.by.id('adf-viewer-time'));
        this.bugButton = protractor_1.element(protractor_1.by.id('adf-viewer-bug'));
        this.codeViewer = protractor_1.element(protractor_1.by.id('adf-monaco-file-editor'));
        this.showTabWithIconSwitch = protractor_1.element(protractor_1.by.id('adf-tab-with-icon'));
        this.showTabWithIconAndLabelSwitch = protractor_1.element(protractor_1.by.id('adf-icon-and-label-tab'));
        this.unknownFormat = protractor_1.element(protractor_1.by.css("adf-viewer-unknown-format .adf-viewer__unknown-format-view"));
    }
    ViewerPage.prototype.checkCodeViewerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.codeViewer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.viewFile = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var fileView;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fileView = protractor_1.element.all(protractor_1.by.css("#document-list-container div[data-automation-id=\"" + fileName + "\"]")).first();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(fileView)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().sendKeys(protractor_1.protractor.Key.ENTER).perform()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clearPageNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.pageSelectorInput, protractor_1.protractor.Key.ENTER)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.getZoom = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.percentage)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.getCanvasWidth = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvasLayer.getAttribute("width")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.getCanvasHeight = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.canvasLayer.getAttribute("height")];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.getDisplayedFileName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.fileName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.fileName)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.exitFullScreen = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jsCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsCode = 'document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen();';
                        return [4 /*yield*/, protractor_1.browser.executeScript(jsCode)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enterPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordInput)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(this.passwordInput, password)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkFileIsLoaded = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.pdfPageLoaded, 30000, fileName + " not loaded")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickClosePasswordDialog = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.passwordDialogClose)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkImgViewerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.imgViewer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPasswordErrorIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordError)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPasswordInputIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordInput)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPasswordSubmitDisabledIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordSubmitDisabled)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPasswordDialogIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordDialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkAllThumbnailsDisplayed = function (nbPages) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultThumbnailHeight, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        defaultThumbnailHeight = 143;
                        _a = expect;
                        return [4 /*yield*/, this.thumbnailsContent.getAttribute('style')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('height: ' + nbPages * defaultThumbnailHeight + 'px; transform: translate(-50%, 0px);')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkCurrentThumbnailIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectedThumbnail, pageNumber, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        selectedThumbnail = protractor_1.element(protractor_1.by.css('adf-pdf-thumb[class="adf-pdf-thumbnails__thumb ng-star-inserted adf-pdf-thumbnails__thumb--selected"] > img'));
                        return [4 /*yield*/, this.pageSelectorInput.getAttribute('value')];
                    case 1:
                        pageNumber = _c.sent();
                        _b = (_a = expect('Page ' + pageNumber)).toEqual;
                        return [4 /*yield*/, selectedThumbnail.getAttribute('title')];
                    case 2: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkThumbnailsCloseIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsClose)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkThumbnailsBtnIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsBtn)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkThumbnailsBtnIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-thumbnails-button"]:disabled')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkThumbnailsContentIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.thumbnailsContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkThumbnailsContentIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.thumbnailsContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkCloseButtonIsDisplayed = function () {
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
    ViewerPage.prototype.getLastButtonTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lastButton.getAttribute('title')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.getMoreActionsMenuTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moreActionsMenu.getAttribute('title')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.checkDownloadButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.downloadButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkInfoButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.infoButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkInfoButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.infoButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkFileThumbnailIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.fileThumbnail)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkFileNameIsDisplayed = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.fileName)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.fileName.getText()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(file)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPreviousPageButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.previousPageButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkNextPageButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.nextPageButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkZoomInButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.zoomInButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkZoomInButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.zoomInButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkZoomOutButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.zoomOutButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkScalePageButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.scalePageButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPageSelectorInputIsDisplayed = function (checkNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.pageSelectorInput)];
                    case 1:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, this.pageSelectorInput.getAttribute('value')];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(checkNumber)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkImgContainerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.imgContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkMediaPlayerContainerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.mediaContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkFileContent = function (pageNumber, text) {
        return __awaiter(this, void 0, void 0, function () {
            var allPages, pageLoaded, textLayerLoaded, specificText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        allPages = this.canvasLayer;
                        pageLoaded = protractor_1.element.all(protractor_1.by.css('div[data-page-number="' + pageNumber + '"][data-loaded="true"]')).first();
                        textLayerLoaded = protractor_1.element.all(protractor_1.by.css('div[data-page-number="' + pageNumber + '"] div[class="textLayer"]')).first();
                        specificText = protractor_1.element.all(protractor_1.by.cssContainingText('div[data-page-number="' + pageNumber + '"] div[class="textLayer"]', text)).first();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(allPages)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(pageLoaded)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(textLayerLoaded)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(specificText)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkFullScreenButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.fullScreenButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkFullScreenButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.fullScreenButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPercentageIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.percentage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkZoomedIn = function (zoom) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, this.percentage.getText()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBeGreaterThan(zoom)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkZoomedOut = function (zoom) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, this.percentage.getText()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBeLessThan(zoom)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkRotateLeftButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.rotateLeft)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkRotateRightButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.rotateRight)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkScaleImgButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.scaleImg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkRotation = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var rotation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.imgContainer.getAttribute('style')];
                    case 1:
                        rotation = _a.sent();
                        return [4 /*yield*/, expect(rotation).toEqual(text)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkInfoSideBarIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.infoSideBar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkInfoSideBarIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.infoSideBar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkLeftSideBarButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.leftSideBarButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkLeftSideBarButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.leftSideBarButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickInfoButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.clickExecuteScript('button[data-automation-id="adf-toolbar-sidebar"]')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickOnTab = function (tabName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tabsPage.clickTabByTitle(tabName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkTabIsActive = function (tabName) {
        return __awaiter(this, void 0, void 0, function () {
            var tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tab = protractor_1.element(protractor_1.by.cssContainingText('.adf-info-drawer-layout-content div.mat-tab-labels div.mat-tab-label-active .mat-tab-label-content', tabName));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(tab)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickLeftSidebarButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.leftSideBarButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkLeftSideBarIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.leftSideBar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkLeftSideBarIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.leftSideBar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickPasswordSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.passwordSubmit)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickSecondThumbnail = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.secondThumbnail)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickLastThumbnailDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.lastThumbnailDisplayed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickThumbnailsClose = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.thumbnailsClose)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickThumbnailsBtn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.thumbnailsBtn)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickScaleImgButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.scaleImg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickDownloadButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.downloadButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickCloseButton = function () {
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
    ViewerPage.prototype.clickPreviousPageButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.previousPageButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickNextPageButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.nextPageButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickZoomInButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.zoomInButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickZoomOutButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.zoomOutButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickActualSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.scalePageButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickFullScreenButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.fullScreenButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickRotateLeftButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.rotateLeft)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickRotateRightButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.rotateRight)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.getActiveTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getText(this.activeTab)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.clickOnCommentsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.tabsPage.clickTabByTitle('Comments')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableToolbar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.toolbarSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableToolbar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.toolbarSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkToolbarIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.toolbar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkToolbarIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.toolbar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableGoBack = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.goBackSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableGoBack = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.goBackSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkGoBackIsDisplayed = function () {
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
    ViewerPage.prototype.checkGoBackIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.closeButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableToolbarOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.openWithSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableToolbarOptions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.openWithSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkToolbarOptionsIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.openWith)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkToolbarOptionsIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.openWith)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableDownload = function () {
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
    ViewerPage.prototype.enableDownload = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.openWithSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableShowTabWithIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.showTabWithIconSwitch)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.enableToggle(this.showTabWithIconSwitch)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableShowTabWithIconAndLabel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.showTabWithIconAndLabelSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkDownloadButtonDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.downloadButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkDownloadButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.downloadButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disablePrint = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.printSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enablePrint = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.printSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPrintButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.printButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkPrintButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.printButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableAllowSidebar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.allowSidebarSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableAllowLeftSidebar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.allowLeftSidebarSwitch)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.disableToggle(this.allowLeftSidebarSwitch)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkMoreActionsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.bugButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.timeButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.uploadButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkMoreActionsIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.bugButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.timeButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(this.uploadButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableMoreActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.moreActionsSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableMoreActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.moreActionsSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableMoreActionsMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.moreActionsMenuSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableCustomToolbar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.customToolbarToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.disableToggle(this.customToolbarToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableCustomToolbar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript('arguments[0].scrollIntoView()', this.customToolbarToggle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formControllersPage.enableToggle(this.customToolbarToggle)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkCustomToolbarIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.customToolbar)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.disableCustomName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.customNameSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enableCustomName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.customNameSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickToggleRightSidebar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showRightSidebarSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.clickToggleLeftSidebar = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.showLeftSidebarSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.enterCustomName = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var textField;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        textField = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-text-custom-name"]'));
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
    ViewerPage.prototype.disableOverlay = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(protractor_1.element(protractor_1.by.id('adf-viewer-overlay')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkOverlayViewerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.viewer.element(protractor_1.by.css('div[class*="adf-viewer-overlay-container"]')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkInlineViewerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.viewer.element(protractor_1.by.css('div[class*="adf-viewer-inline-container"]')))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkTabHasNoIcon = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tab = protractor_1.element(protractor_1.by.css("div[id=\"mat-tab-label-1-" + index + "\"] div[class=\"mat-tab-label-content\"] mat-icon"));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(tab)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.checkTabHasNoLabel = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tab = protractor_1.element(protractor_1.by.css("div[id=\"mat-tab-label-1-" + index + "\"] div[class=\"mat-tab-label-content\"] span"));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(tab)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.getTabLabelById = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tab = protractor_1.element(protractor_1.by.css("div[id=\"mat-tab-label-1-" + index + "\"] div[class=\"mat-tab-label-content\"] span"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(tab)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.getTabIconById = function (index) {
        return __awaiter(this, void 0, void 0, function () {
            var tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tab = protractor_1.element(protractor_1.by.css("div[id=\"mat-tab-label-1-" + index + "\"] div[class=\"mat-tab-label-content\"] mat-icon"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(tab)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ViewerPage.prototype.checkUnknownFormatIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.unknownFormat)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ViewerPage.prototype.getUnknownFormatMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unknownFormatLabel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unknownFormatLabel = this.unknownFormat.element(protractor_1.by.css(".label"));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getText(unknownFormatLabel)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ViewerPage;
}());
exports.ViewerPage = ViewerPage;
//# sourceMappingURL=viewerPage.js.map