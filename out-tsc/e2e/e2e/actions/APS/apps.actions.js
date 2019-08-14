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
var path = require("path");
var fs = require("fs");
var AppPublish = require("../../models/APS/AppPublish");
var remote = require("selenium-webdriver/remote");
var protractor_1 = require("protractor");
var AppsActions = /** @class */ (function () {
    function AppsActions() {
    }
    AppsActions.prototype.getProcessTaskId = function (alfrescoJsApi, processId) {
        return __awaiter(this, void 0, void 0, function () {
            var taskList, taskId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, alfrescoJsApi.activiti.taskApi.listTasks({})];
                    case 1:
                        taskList = _a.sent();
                        taskId = -1;
                        taskList.data.forEach(function (task) {
                            if (task.processInstanceId === processId) {
                                taskId = task.id;
                            }
                        });
                        return [2 /*return*/, taskId];
                }
            });
        });
    };
    AppsActions.prototype.getAppDefinitionId = function (alfrescoJsApi, appModelId) {
        return __awaiter(this, void 0, void 0, function () {
            var appDefinitions, appDefinitionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.getAppDefinitions()];
                    case 1:
                        appDefinitions = _a.sent();
                        appDefinitionId = -1;
                        appDefinitions.data.forEach(function (appDefinition) {
                            if (appDefinition.modelId === appModelId) {
                                appDefinitionId = appDefinition.id;
                            }
                        });
                        return [2 /*return*/, appDefinitionId];
                }
            });
        });
    };
    AppsActions.prototype.importPublishDeployApp = function (alfrescoJsApi, appFileLocation) {
        return __awaiter(this, void 0, void 0, function () {
            var appCreated, publishApp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.importApp(alfrescoJsApi, appFileLocation)];
                    case 1:
                        appCreated = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish())];
                    case 2:
                        publishApp = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, appCreated];
                }
            });
        });
    };
    AppsActions.prototype.importApp = function (alfrescoJsApi, appFileLocation) {
        return __awaiter(this, void 0, void 0, function () {
            var pathFile, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protractor_1.browser.setFileDetector(new remote.FileDetector());
                        pathFile = path.join(protractor_1.browser.params.testConfig.main.rootPath + appFileLocation);
                        file = fs.createReadStream(pathFile);
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.importAppDefinition(file)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AppsActions.prototype.publishDeployApp = function (alfrescoJsApi, appId) {
        return __awaiter(this, void 0, void 0, function () {
            var publishApp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protractor_1.browser.setFileDetector(new remote.FileDetector());
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.publishAppDefinition(appId, new AppPublish())];
                    case 1:
                        publishApp = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, publishApp];
                }
            });
        });
    };
    AppsActions.prototype.importNewVersionAppDefinitionPublishDeployApp = function (alfrescoJsApi, appFileLocation, modelId) {
        return __awaiter(this, void 0, void 0, function () {
            var pathFile, file, appCreated, publishApp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protractor_1.browser.setFileDetector(new remote.FileDetector());
                        pathFile = path.join(protractor_1.browser.params.testConfig.main.rootPath + appFileLocation);
                        file = fs.createReadStream(pathFile);
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.importNewAppDefinition(modelId, file)];
                    case 1:
                        appCreated = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.publishAppDefinition(appCreated.id, new AppPublish())];
                    case 2:
                        publishApp = _a.sent();
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.deployAppDefinitions({ appDefinitions: [{ id: publishApp.appDefinition.id }] })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, appCreated];
                }
            });
        });
    };
    AppsActions.prototype.startProcess = function (alfrescoJsApi, app, processName) {
        return __awaiter(this, void 0, void 0, function () {
            var appDefinitionsList, appDefinition, processDefinitionList, chosenProcess, processDefinitionIdToStart, startProcessOptions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        protractor_1.browser.setFileDetector(new remote.FileDetector());
                        return [4 /*yield*/, alfrescoJsApi.activiti.appsApi.getAppDefinitions()];
                    case 1:
                        appDefinitionsList = _a.sent();
                        appDefinition = appDefinitionsList.data.filter(function (currentApp) {
                            return currentApp.name === app.name;
                        });
                        return [4 /*yield*/, alfrescoJsApi.activiti.processApi.getProcessDefinitions({ deploymentId: appDefinition.deploymentId })];
                    case 2:
                        processDefinitionList = _a.sent();
                        chosenProcess = processDefinitionList.data.find(function (processDefinition) {
                            return processDefinition.name === processName;
                        });
                        processDefinitionIdToStart = chosenProcess ? chosenProcess.id : processDefinitionList.data[0].id;
                        startProcessOptions = { processDefinitionId: processDefinitionIdToStart };
                        if (typeof processName !== 'undefined') {
                            startProcessOptions.name = processName;
                        }
                        return [4 /*yield*/, alfrescoJsApi.activiti.processApi.startNewProcessInstance(startProcessOptions)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return AppsActions;
}());
exports.AppsActions = AppsActions;
//# sourceMappingURL=apps.actions.js.map