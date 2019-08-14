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
var appSettingsToggles_1 = require("./dialog/appSettingsToggles");
var protractor_1 = require("protractor");
var adf_testing_1 = require("@alfresco/adf-testing");
var adf_testing_2 = require("@alfresco/adf-testing");
var TaskDetailsPage = /** @class */ (function () {
    function TaskDetailsPage() {
        this.appSettingsTogglesClass = new appSettingsToggles_1.AppSettingsToggles();
        this.formContent = protractor_1.element(protractor_1.by.css('adf-form'));
        this.formNameField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="formName"] span'));
        this.assigneeField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="assignee"] span'));
        this.statusField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="status"] span'));
        this.categoryField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="category"] span'));
        this.parentNameField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="parentName"] span'));
        this.parentTaskIdField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="parentTaskId"] span'));
        this.durationField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="duration"] span'));
        this.endDateField = protractor_1.element.all(protractor_1.by.css('span[data-automation-id*="endDate"] span')).first();
        this.createdField = protractor_1.element(protractor_1.by.css('span[data-automation-id="card-dateitem-created"] span'));
        this.idField = protractor_1.element.all(protractor_1.by.css('span[data-automation-id*="id"] span')).first();
        this.descriptionField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="description"] span'));
        this.dueDateField = protractor_1.element(protractor_1.by.css('span[data-automation-id*="dueDate"] span'));
        this.activitiesTitle = protractor_1.element(protractor_1.by.css('div[class*="adf-info-drawer-layout-header-title"] div'));
        this.commentField = protractor_1.element(protractor_1.by.id('comment-input'));
        this.addCommentButton = protractor_1.element(protractor_1.by.css('[data-automation-id="comments-input-add"]'));
        this.involvePeopleButton = protractor_1.element(protractor_1.by.css('div[class*="add-people"]'));
        this.addPeopleField = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-people-search-input"]'));
        this.addInvolvedUserButton = protractor_1.element(protractor_1.by.css('button[id="add-people"] span'));
        this.emailInvolvedUser = protractor_1.by.xpath('following-sibling::div[@class="adf-people-email"]');
        this.taskDetailsInfoDrawer = protractor_1.element(protractor_1.by.tagName('adf-info-drawer'));
        this.taskDetailsSection = protractor_1.element(protractor_1.by.css('div[data-automation-id="adf-tasks-details"]'));
        this.taskDetailsEmptySection = protractor_1.element(protractor_1.by.css('div[data-automation-id="adf-tasks-details--empty"]'));
        this.completeTask = protractor_1.element(protractor_1.by.css('button[id="adf-no-form-complete-button"]'));
        this.completeFormTask = protractor_1.element(protractor_1.by.css('button[id="adf-form-complete"]'));
        this.taskDetailsTitle = protractor_1.element(protractor_1.by.css('h2[class="adf-activiti-task-details__header"] span'));
        this.auditLogButton = protractor_1.element(protractor_1.by.css('button[adf-task-audit]'));
        this.noPeopleInvolved = protractor_1.element(protractor_1.by.id('no-people-label'));
        this.cancelInvolvePeopleButton = protractor_1.element(protractor_1.by.id('close-people-search'));
        this.involvePeopleHeader = protractor_1.element(protractor_1.by.css('div[class="adf-search-text-header"]'));
        this.removeInvolvedPeople = protractor_1.element(protractor_1.by.css('button[data-automation-id="Remove"]'));
        this.peopleTitle = protractor_1.element(protractor_1.by.id('people-title'));
        this.attachFormDropdown = protractor_1.element(protractor_1.by.css('div[class="adf-attach-form-row"]'));
        this.cancelAttachForm = protractor_1.element(protractor_1.by.id('adf-no-form-cancel-button'));
        this.attachFormButton = protractor_1.element(protractor_1.by.id('adf-no-form-attach-form-button'));
        this.disabledAttachFormButton = protractor_1.element(protractor_1.by.css('button[id="adf-no-form-attach-form-button"][disabled]'));
        this.removeAttachForm = protractor_1.element(protractor_1.by.id('adf-no-form-remove-button'));
        this.attachFormName = protractor_1.element(protractor_1.by.css('span[class="adf-form-title ng-star-inserted"]'));
        this.emptyTaskDetails = protractor_1.element(protractor_1.by.css('adf-task-details > div > div'));
    }
    TaskDetailsPage.prototype.getTaskDetailsTitle = function () {
        return adf_testing_2.BrowserActions.getText(this.taskDetailsTitle);
    };
    TaskDetailsPage.prototype.checkSelectedForm = function (formName) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.attachFormName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.attachFormName.getText()];
                    case 2:
                        text = _a.sent();
                        return [4 /*yield*/, expect(formName).toEqual(text)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkAttachFormButtonIsDisabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.disabledAttachFormButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkAttachFormButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsClickable(this.attachFormButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkAttachFormDropdownIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.attachFormDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickAttachFormDropdown = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.attachFormDropdown)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.selectAttachFormOption = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var selectedOption;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedOption = protractor_1.element(protractor_1.by.cssContainingText('mat-option[role="option"]', option));
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(selectedOption)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkCancelAttachFormIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.cancelAttachForm)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.noFormIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.formContent)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickCancelAttachForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.cancelAttachForm)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkRemoveAttachFormIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.removeAttachForm)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickRemoveAttachForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.removeAttachForm)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkAttachFormButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.attachFormButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkAttachFormButtonIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.attachFormButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickAttachFormButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, adf_testing_2.BrowserActions.click(this.attachFormButton)];
            });
        });
    };
    TaskDetailsPage.prototype.checkFormIsAttached = function (formName) {
        return __awaiter(this, void 0, void 0, function () {
            var attachedFormName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.formNameField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.formNameField.getText()];
                    case 2:
                        attachedFormName = _a.sent();
                        return [4 /*yield*/, expect(attachedFormName).toEqual(formName)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getFormName = function () {
        return adf_testing_2.BrowserActions.getText(this.formNameField);
    };
    TaskDetailsPage.prototype.clickForm = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.formNameField)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getAssignee = function () {
        return adf_testing_2.BrowserActions.getText(this.assigneeField);
    };
    TaskDetailsPage.prototype.getStatus = function () {
        return adf_testing_2.BrowserActions.getText(this.statusField);
    };
    TaskDetailsPage.prototype.getCategory = function () {
        return adf_testing_2.BrowserActions.getText(this.categoryField);
    };
    TaskDetailsPage.prototype.getParentName = function () {
        return adf_testing_2.BrowserActions.getText(this.parentNameField);
    };
    TaskDetailsPage.prototype.getParentTaskId = function () {
        return adf_testing_2.BrowserActions.getText(this.parentTaskIdField);
    };
    TaskDetailsPage.prototype.getDuration = function () {
        return adf_testing_2.BrowserActions.getText(this.durationField);
    };
    TaskDetailsPage.prototype.getEndDate = function () {
        return adf_testing_2.BrowserActions.getText(this.endDateField);
    };
    TaskDetailsPage.prototype.getCreated = function () {
        return adf_testing_2.BrowserActions.getText(this.createdField);
    };
    TaskDetailsPage.prototype.getId = function () {
        return adf_testing_2.BrowserActions.getText(this.idField);
    };
    TaskDetailsPage.prototype.getDescription = function () {
        return adf_testing_2.BrowserActions.getText(this.descriptionField);
    };
    TaskDetailsPage.prototype.getDueDate = function () {
        return adf_testing_2.BrowserActions.getText(this.dueDateField);
    };
    TaskDetailsPage.prototype.getTitle = function () {
        return adf_testing_2.BrowserActions.getText(this.activitiesTitle);
    };
    TaskDetailsPage.prototype.selectActivityTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabsPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabsPage = new adf_testing_1.TabsPage;
                        return [4 /*yield*/, tabsPage.clickTabByTitle('Activity')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.selectDetailsTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabsPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tabsPage = new adf_testing_1.TabsPage;
                        return [4 /*yield*/, tabsPage.clickTabByTitle('Details')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.addComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.commentField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.commentField.sendKeys(comment)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.addCommentButton)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkCommentIsDisplayed = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = protractor_1.element(protractor_1.by.cssContainingText('div[id="comment-message"]', comment));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickInvolvePeopleButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.involvePeopleButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsClickable(this.involvePeopleButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.actions().mouseMove(this.involvePeopleButton).perform()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.involvePeopleButton)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.typeUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.addPeopleField)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addPeopleField.sendKeys(user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.selectUserToInvolve = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowsUser(user)];
                    case 1:
                        row = _a.sent();
                        return [4 /*yield*/, row.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkUserIsSelected = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        row = protractor_1.element(protractor_1.by.cssContainingText('div[class*="search-list-container"] div[class*="people-full-name"]', user));
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickAddInvolvedUserButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.addInvolvedUserButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getRowsUser = function (user) {
        return protractor_1.element(protractor_1.by.cssContainingText('div[class*="people-full-name"]', user));
    };
    TaskDetailsPage.prototype.removeInvolvedUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowsUser(user)];
                    case 1: return [4 /*yield*/, (_a.sent()).element(protractor_1.by.xpath('ancestor::div[contains(@class, "adf-datatable-row")]'))];
                    case 2:
                        row = _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(row)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, row.element(protractor_1.by.css('button[data-automation-id="action_menu_0"]')).click()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.removeInvolvedPeople)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.removeInvolvedPeople)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getInvolvedUserEmail = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var row, email;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRowsUser(user)];
                    case 1:
                        row = _a.sent();
                        email = row.element(this.emailInvolvedUser);
                        return [2 /*return*/, adf_testing_2.BrowserActions.getText(email)];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickAuditLogButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.auditLogButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.appSettingsToggles = function () {
        return this.appSettingsTogglesClass;
    };
    TaskDetailsPage.prototype.taskInfoDrawerIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsInfoDrawer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.taskInfoDrawerIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(this.taskDetailsInfoDrawer)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkNoPeopleIsInvolved = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.noPeopleInvolved)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickCancelInvolvePeopleButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.cancelInvolvePeopleButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getInvolvePeopleHeader = function () {
        return adf_testing_2.BrowserActions.getText(this.involvePeopleHeader);
    };
    TaskDetailsPage.prototype.getInvolvePeoplePlaceholder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.addPeopleField)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.addPeopleField.getAttribute('placeholder')];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkCancelButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.cancelInvolvePeopleButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsClickable(this.cancelInvolvePeopleButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkAddPeopleButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.addInvolvedUserButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsClickable(this.addInvolvedUserButton)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.noUserIsDisplayedInSearchInvolvePeople = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsNotVisible(protractor_1.element(protractor_1.by.cssContainingText('div[class*="people-full-name"]', user)))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getInvolvedPeopleTitle = function () {
        return adf_testing_2.BrowserActions.getText(this.peopleTitle);
    };
    TaskDetailsPage.prototype.checkTaskDetailsEmpty = function () {
        return adf_testing_2.BrowserActions.getText(this.taskDetailsEmptySection);
    };
    TaskDetailsPage.prototype.checkTaskDetailsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.taskDetailsSection)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.formNameField)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.assigneeField)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.statusField)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.categoryField)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.parentNameField)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.createdField)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.idField)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.descriptionField)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.dueDateField)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.activitiesTitle)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, adf_testing_2.BrowserActions.getText(this.taskDetailsSection)];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickCompleteTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.completeTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkCompleteFormButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.completeFormTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.completeFormTask];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkCompleteTaskButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsClickable(this.completeTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.checkCompleteTaskButtonIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserVisibility.waitUntilElementIsVisible(this.completeTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.clickCompleteFormTask = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_2.BrowserActions.click(this.completeFormTask)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TaskDetailsPage.prototype.getEmptyTaskDetailsMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, adf_testing_2.BrowserActions.getText(this.emptyTaskDetails)];
            });
        });
    };
    return TaskDetailsPage;
}());
exports.TaskDetailsPage = TaskDetailsPage;
//# sourceMappingURL=taskDetailsPage.js.map