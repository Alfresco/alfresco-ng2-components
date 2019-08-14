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
var browser_actions_1 = require("../../core/utils/browser-actions");
var browser_visibility_1 = require("../../core/utils/browser-visibility");
var TaskHeaderCloudPage = /** @class */ (function () {
    function TaskHeaderCloudPage() {
        this.assigneeField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="assignee"] span'));
        this.statusField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="status"] span'));
        this.priorityField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="priority"] span'));
        this.dueDateField = protractor_1.element.all(protractor_1.by.css('span[data-automation-id*="dueDate"] span')).first();
        this.categoryField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="category"] span'));
        this.createdField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-dateitem-created"] span'));
        this.parentNameField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="parentName"] span'));
        this.parentTaskIdField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="parentTaskId"] span'));
        this.endDateField = protractor_1.element.all(protractor_1.by.css('span[data-automation-id*="endDate"] span')).first();
        this.idField = protractor_1.element.all(protractor_1.by.css('span[data-automation-id*="id"] span')).first();
        this.descriptionField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="description"] span'));
        this.taskPropertyList = protractor_1.element(protractor_1.by.css('adf-cloud-task-header adf-card-view div[class="adf-property-list"]'));
    }
    TaskHeaderCloudPage.prototype.getAssignee = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.assigneeField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getStatus = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.statusField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getPriority = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.priorityField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getCategory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.categoryField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getParentName = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.parentNameField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getParentTaskId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.parentTaskIdField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getEndDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.endDateField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getCreated = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.createdField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.idField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getDescription = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.descriptionField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.getDueDate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.dueDateField)];
            });
        });
    };
    TaskHeaderCloudPage.prototype.checkTaskPropertyListIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.taskPropertyList)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return TaskHeaderCloudPage;
}());
exports.TaskHeaderCloudPage = TaskHeaderCloudPage;
//# sourceMappingURL=task-header-cloud-component.page.js.map