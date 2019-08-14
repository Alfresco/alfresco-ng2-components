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
var browser_visibility_1 = require("../utils/browser-visibility");
var tabs_page_1 = require("../../material/pages/tabs.page");
var browser_actions_1 = require("../utils/browser-actions");
var UserInfoPage = /** @class */ (function () {
    function UserInfoPage() {
        this.dialog = protractor_1.element.all(protractor_1.by.css('mat-card[class*="adf-userinfo-card"]')).first();
        this.userImage = protractor_1.element(protractor_1.by.css('div[id="user-initial-image"]'));
        this.userInfoEcmHeaderTitle = protractor_1.element(protractor_1.by.css('div[id="ecm-username"]'));
        this.userInfoEcmTitle = protractor_1.element(protractor_1.by.css('mat-card-content span[id="ecm-full-name"]'));
        this.ecmEmail = protractor_1.element(protractor_1.by.css('span[id="ecm-email"]'));
        this.ecmJobTitle = protractor_1.element(protractor_1.by.css('span[id="ecm-job-title"]'));
        this.userInfoProcessHeaderTitle = protractor_1.element(protractor_1.by.css('div[id="bpm-username"]'));
        this.userInfoProcessTitle = protractor_1.element(protractor_1.by.css('mat-card-content span[id="bpm-full-name"]'));
        this.processEmail = protractor_1.element(protractor_1.by.css('span[id="bpm-email"]'));
        this.processTenant = protractor_1.element(protractor_1.by.css('span[class="detail-profile"]'));
        this.apsImage = protractor_1.element(protractor_1.by.css('img[id="bpm-user-detail-image"]'));
        this.acsImage = protractor_1.element(protractor_1.by.css('img[id="ecm-user-detail-image"]'));
        this.initialImage = protractor_1.element.all(protractor_1.by.css('div[id="user-initials-image"]')).first();
        this.userInfoSsoHeaderTitle = this.dialog.element(protractor_1.by.css('div[id="identity-username"]'));
        this.userInfoSsoTitle = protractor_1.element(protractor_1.by.css('.adf-userinfo__detail-title'));
        this.ssoEmail = protractor_1.element(protractor_1.by.id('identity-email'));
        this.userProfileButton = protractor_1.element(protractor_1.by.css('button[data-automation-id="adf-user-profile"]'));
    }
    UserInfoPage.prototype.dialogIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.dialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.dialogIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.dialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.clickUserProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.userProfileButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.clickOnContentServicesTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabsPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabsPage = new tabs_page_1.TabsPage();
                        return [4 /*yield*/, tabsPage.clickTabByTitle('Content Services')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.checkProcessServicesTabIsSelected = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabsPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabsPage = new tabs_page_1.TabsPage;
                        return [4 /*yield*/, tabsPage.checkTabIsSelectedByTitle('Process Services')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.clickOnProcessServicesTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabsPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabsPage = new tabs_page_1.TabsPage;
                        return [4 /*yield*/, tabsPage.clickTabByTitle('Process Services')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.userImageIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.userImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.getContentHeaderTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.dialog)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.userInfoEcmHeaderTitle)];
                }
            });
        });
    };
    UserInfoPage.prototype.getContentTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.userInfoEcmTitle)];
            });
        });
    };
    UserInfoPage.prototype.getContentEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.ecmEmail)];
            });
        });
    };
    UserInfoPage.prototype.getContentJobTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.ecmJobTitle)];
            });
        });
    };
    UserInfoPage.prototype.getProcessHeaderTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.userInfoProcessHeaderTitle)];
            });
        });
    };
    UserInfoPage.prototype.getProcessTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.userInfoProcessTitle)];
            });
        });
    };
    UserInfoPage.prototype.getProcessEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.processEmail)];
            });
        });
    };
    UserInfoPage.prototype.getProcessTenant = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.processTenant)];
            });
        });
    };
    UserInfoPage.prototype.getSsoHeaderTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.userInfoSsoHeaderTitle)];
            });
        });
    };
    UserInfoPage.prototype.getSsoTitle = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.userInfoSsoTitle)];
            });
        });
    };
    UserInfoPage.prototype.getSsoEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.ssoEmail)];
            });
        });
    };
    UserInfoPage.prototype.closeUserProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.dialog)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.closeMenuAndDialogs()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.checkACSProfileImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.acsImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.checkAPSProfileImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.apsImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.checkInitialImage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.initialImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.initialImageNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.initialImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.ACSProfileImageNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.acsImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserInfoPage.prototype.APSProfileImageNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.apsImage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return UserInfoPage;
}());
exports.UserInfoPage = UserInfoPage;
//# sourceMappingURL=user-info.page.js.map