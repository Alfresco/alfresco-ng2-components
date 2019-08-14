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
var processServiceTabBarPage_1 = require("./processServiceTabBarPage");
var protractor_1 = require("protractor");
var adf_testing_1 = require("@alfresco/adf-testing");
var ProcessServicesPage = /** @class */ (function () {
    function ProcessServicesPage() {
        this.apsAppsContainer = protractor_1.element(protractor_1.by.css('div[class="adf-app-listgrid ng-star-inserted"]'));
        this.taskApp = protractor_1.element(protractor_1.by.css('mat-card[title="Task App"]'));
        this.iconTypeLocator = protractor_1.by.css('mat-icon[class*="card-logo-icon"]');
        this.descriptionLocator = protractor_1.by.css('mat-card-subtitle[class*="subtitle"]');
    }
    ProcessServicesPage.prototype.checkApsContainer = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(this.apsAppsContainer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessServicesPage.prototype.goToApp = function (applicationName) {
        return __awaiter(this, void 0, void 0, function () {
            var app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = protractor_1.element(protractor_1.by.css('mat-card[title="' + applicationName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserActions.click(app)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new processServiceTabBarPage_1.ProcessServiceTabBarPage()];
                }
            });
        });
    };
    ProcessServicesPage.prototype.goToTaskApp = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.click(this.taskApp)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, new processServiceTabBarPage_1.ProcessServiceTabBarPage()];
                }
            });
        });
    };
    ProcessServicesPage.prototype.getAppIconType = function (applicationName) {
        return __awaiter(this, void 0, void 0, function () {
            var app, iconType;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = protractor_1.element(protractor_1.by.css('mat-card[title="' + applicationName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(app)];
                    case 1:
                        _a.sent();
                        iconType = app.element(this.iconTypeLocator);
                        return [2 /*return*/, adf_testing_1.BrowserActions.getText(iconType)];
                }
            });
        });
    };
    ProcessServicesPage.prototype.getBackgroundColor = function (applicationName) {
        return __awaiter(this, void 0, void 0, function () {
            var app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = protractor_1.element(protractor_1.by.css('mat-card[title="' + applicationName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(app)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, app.getCssValue('background-color')];
                }
            });
        });
    };
    ProcessServicesPage.prototype.getDescription = function (applicationName) {
        return __awaiter(this, void 0, void 0, function () {
            var app, description;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = protractor_1.element(protractor_1.by.css('mat-card[title="' + applicationName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(app)];
                    case 1:
                        _a.sent();
                        description = app.element(this.descriptionLocator);
                        return [2 /*return*/, adf_testing_1.BrowserActions.getText(description)];
                }
            });
        });
    };
    ProcessServicesPage.prototype.checkAppIsNotDisplayed = function (applicationName) {
        return __awaiter(this, void 0, void 0, function () {
            var app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = protractor_1.element(protractor_1.by.css('mat-card[title="' + applicationName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsNotVisible(app)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ProcessServicesPage.prototype.checkAppIsDisplayed = function (applicationName) {
        return __awaiter(this, void 0, void 0, function () {
            var app;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = protractor_1.element(protractor_1.by.css('mat-card[title="' + applicationName + '"]'));
                        return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilElementIsVisible(app)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ProcessServicesPage;
}());
exports.ProcessServicesPage = ProcessServicesPage;
//# sourceMappingURL=processServicesPage.js.map