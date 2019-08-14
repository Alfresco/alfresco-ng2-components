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
var processServicesPage_1 = require("./process-services/processServicesPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var peopleGroupCloudComponentPage_1 = require("./demo-shell/process-services/peopleGroupCloudComponentPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var NavigationBarPage = /** @class */ (function () {
    function NavigationBarPage() {
        this.linkListContainer = protractor_1.element(protractor_1.by.css('.adf-sidenav-linklist'));
        this.linkMenuChildrenContainer = protractor_1.element(protractor_1.by.css('.nestedMenu'));
        this.dataTableNestedButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Datatable"]'));
        this.dataTableCopyContentButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Copy Content"]'));
        this.dataTableDragAndDropButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Drag and Drop"]'));
        this.processServicesNestedButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="App"]'));
        this.processServicesCloudHomeButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Home"]'));
        this.themeButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="theme menu"]'));
        this.themeMenuContent = protractor_1.element(protractor_1.by.css('div[class*="mat-menu-panel"]'));
        this.languageMenuButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="language-menu-button"]'));
        this.appTitle = protractor_1.element(protractor_1.by.css('.adf-app-title'));
        this.menuButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-menu-icon"]'));
        this.formButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="Form"]'));
        this.peopleGroupCloudButton = this.linkMenuChildrenContainer.element(protractor_1.by.css('.adf-sidenav-link[data-automation-id="People/Group Cloud"]'));
    }
    NavigationBarPage.prototype.clickNavigationBarItem = function (title) {
        return __awaiter(this, void 0, void 0, function () {
            var menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        menu = protractor_1.element(protractor_1.by.css(".adf-sidenav-link[data-automation-id=\"" + title + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(menu)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickHomeButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Home')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickContentServicesButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Content Services')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickCardViewButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('CardView')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickHeaderDataButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Header Data')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickTaskListButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Task List')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickProcessCloudButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Process Cloud')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToProcessServicesCloudPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickProcessCloudButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.processServicesCloudHomeButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, new adf_testing_1.AppListCloudPage()];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToFormCloudPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickProcessCloudButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.formButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToPeopleGroupCloudPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickProcessCloudButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.peopleGroupCloudButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, new peopleGroupCloudComponentPage_1.PeopleGroupCloudComponentPage()];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickProcessServicesButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Process Services')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToProcessServicesPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickProcessServicesButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.processServicesNestedButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, new processServicesPage_1.ProcessServicesPage()];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToProcessServicesFormPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickProcessServicesButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.formButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickLoginButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Login')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickTrashcanButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Trashcan')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickCustomSources = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Custom Sources')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickDataTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Datatable')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.linkMenuChildrenContainer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToDatatable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickDataTable()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.dataTableNestedButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToDragAndDropDatatable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickDataTable()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.dataTableDragAndDropButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.navigateToCopyContentDatatable = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickDataTable()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.dataTableCopyContentButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickTagButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Tag')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickSocialButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Social')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickSettingsButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Settings')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickConfigEditorButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Configuration Editor')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickOverlayViewerButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Overlay Viewer')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickTreeViewButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Tree View')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickIconsButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('Icons')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickAboutButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clickNavigationBarItem('About')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickLogoutButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.clickExecuteScript('.adf-sidenav-link[adf-logout]')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickThemeButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.themeButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.themeMenuContent)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickOnSpecificThemeButton = function (themeName) {
        return __awaiter(this, void 0, void 0, function () {
            var themeElement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        themeElement = protractor_1.element(protractor_1.by.css("button[data-automation-id=\"" + themeName + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(themeElement)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.openContentServicesFolder = function (folderId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/files/" + folderId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.openLanguageMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.languageMenuButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.appTitle)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.chooseLanguage = function (language) {
        return __awaiter(this, void 0, void 0, function () {
            var buttonLanguage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buttonLanguage = protractor_1.element(protractor_1.by.xpath("//adf-language-menu//button[contains(text(), '" + language + "')]"));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(buttonLanguage)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotPresent(this.linkMenuChildrenContainer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.checkMenuButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.menuButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.checkMenuButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.menuButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.checkToolbarColor = function (color) {
        return __awaiter(this, void 0, void 0, function () {
            var toolbarColor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        toolbarColor = protractor_1.element(protractor_1.by.css("mat-toolbar[class*=\"mat-" + color + "\"]"));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(toolbarColor)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickAppLogo = function (logoTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var appLogo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        appLogo = protractor_1.element(protractor_1.by.css('a[title="' + logoTitle + '"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(appLogo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.clickAppLogoText = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.appTitle)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.checkLogoTooltip = function (logoTooltipTitle) {
        return __awaiter(this, void 0, void 0, function () {
            var logoTooltip;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logoTooltip = protractor_1.element(protractor_1.by.css('a[title="' + logoTooltipTitle + '"]'));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(logoTooltip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.openViewer = function (nodeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + ("/files(overlay:files/" + nodeId + "/view"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.goToSite = function (site) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + ("/files/" + site.entry.guid + "/display/list"))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NavigationBarPage.prototype.scrollTo = function (el) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript("return arguments[0].scrollTop = arguments[1].offsetTop", this.linkListContainer.getWebElement(), el.getWebElement())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return NavigationBarPage;
}());
exports.NavigationBarPage = NavigationBarPage;
//# sourceMappingURL=navigationBarPage.js.map