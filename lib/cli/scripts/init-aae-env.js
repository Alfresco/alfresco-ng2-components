#!/usr/bin/env node
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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.__esModule = true;
var commander_1 = require("commander");
var request = require("request");
var fs = require("fs");
var logger_1 = require("./logger");
var js_api_1 = require("@alfresco/js-api");
var ACTIVITI_CLOUD_APPS = require('./resources').ACTIVITI_CLOUD_APPS;
var alfrescoJsApiModeler;
var alfrescoJsApiDevops;
var args;
var isValid = true;
var absentApps = [];
var failingApps = [];
exports.AAE_MICROSERVICES = [
    'deployment-service',
    'modeling-service',
    'dmn-service'
];
function healthCheck(nameService) {
    return __awaiter(this, void 0, void 0, function () {
        var url, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, health, reset, green, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = args.host + "/" + nameService + "/actuator/health";
                    pathParams = {};
                    queryParams = {};
                    headerParams = {};
                    formParams = {};
                    bodyParam = {};
                    contentTypes = ['application/json'];
                    accepts = ['application/json'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts)];
                case 2:
                    health = _a.sent();
                    if (health.status !== 'UP') {
                        logger_1.logger.error(nameService + " is DOWN ");
                        isValid = false;
                    }
                    else {
                        reset = '\x1b[0m';
                        green = '\x1b[32m';
                        logger_1.logger.info("" + green + nameService + " is UP!" + reset);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    logger_1.logger.error(nameService + " is not reachable error: ", error_1);
                    isValid = false;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getApplicationByStatus(status) {
    return __awaiter(this, void 0, void 0, function () {
        var url, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = args.host + "/deployment-service/v1/applications/";
                    pathParams = {};
                    queryParams = { status: status };
                    headerParams = {};
                    formParams = {};
                    bodyParam = {};
                    contentTypes = ['application/json'];
                    accepts = ['application/json'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, alfrescoJsApiDevops.login(args.devopsUsername, args.devopsPassword)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts).on('error', function (error) {
                            logger_1.logger.error("Get application by status " + error + " ");
                        })];
                case 3:
                    error_2 = _a.sent();
                    logger_1.logger.error("Get application by status " + error_2.status + " ");
                    isValid = false;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getDescriptors() {
    var url = args.host + "/deployment-service/v1/descriptors";
    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};
    var bodyParam = {};
    var contentTypes = ['application/json'];
    var accepts = ['application/json'];
    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    }
    catch (error) {
        logger_1.logger.error("Get Descriptors " + error.status + " ");
        isValid = false;
    }
}
function getProjects() {
    var url = args.host + "/modeling-service/v1/projects";
    var pathParams = {};
    var queryParams = { maxItems: 1000 };
    var headerParams = {};
    var formParams = {};
    var bodyParam = {};
    var contentTypes = ['application/json'];
    var accepts = ['application/json'];
    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    }
    catch (error) {
        logger_1.logger.error('Get Projects' + error.status);
        isValid = false;
    }
}
function getProjectRelease(projectId) {
    var url = args.host + "/modeling-service/v1/projects/" + projectId + "/releases";
    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};
    var bodyParam = {};
    var contentTypes = ['application/json'];
    var accepts = ['application/json'];
    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'GET', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    }
    catch (error) {
        logger_1.logger.error('Get Projects Release' + error.status);
        isValid = false;
    }
}
function releaseProject(projectId) {
    return __awaiter(this, void 0, void 0, function () {
        var url, pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = args.host + "/modeling-service/v1/projects/" + projectId + "/releases";
                    pathParams = {};
                    queryParams = {};
                    headerParams = {};
                    formParams = {};
                    bodyParam = {};
                    contentTypes = ['application/json'];
                    accepts = ['application/json'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 2, , 4]);
                    return [2 /*return*/, alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts)];
                case 2:
                    error_3 = _a.sent();
                    return [4 /*yield*/, deleteProject(projectId)];
                case 3:
                    _a.sent();
                    logger_1.logger.error('Post Projects Release' + error_3.status);
                    isValid = false;
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteProject(projectId) {
    var url = args.host + "/modeling-service/v1/projects/" + projectId;
    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};
    var bodyParam = {};
    var contentTypes = ['application/json'];
    var accepts = ['application/json'];
    try {
        return alfrescoJsApiModeler.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    }
    catch (error) {
        logger_1.logger.error('Delete project error' + error.status);
        isValid = false;
    }
}
function importAndReleaseProject(absoluteFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, project, release, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.createReadStream(absoluteFilePath)];
                case 1:
                    fileContent = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, alfrescoJsApiModeler.oauth2Auth.callCustomApi(args.host + "/modeling-service/v1/projects/import", 'POST', {}, {}, {}, { file: fileContent }, {}, ['multipart/form-data'], ['application/json'])];
                case 3:
                    project = _a.sent();
                    logger_1.logger.info("Project imported");
                    logger_1.logger.info("Create release");
                    return [4 /*yield*/, alfrescoJsApiModeler.oauth2Auth.callCustomApi(args.host + "/modeling-service/v1/projects/" + project.entry.id + "/releases", 'POST', {}, {}, {}, {}, {}, ['application/json'], ['application/json'])];
                case 4:
                    release = _a.sent();
                    return [2 /*return*/, release];
                case 5:
                    error_4 = _a.sent();
                    logger_1.logger.error("Not able to import the project/create the release " + absoluteFilePath + " with status: " + error_4);
                    isValid = false;
                    throw (error_4);
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteDescriptor(name) {
    var url = args.host + "/deployment-service/v1/descriptors/" + name;
    var pathParams = {};
    var queryParams = {};
    var headerParams = {};
    var formParams = {};
    var bodyParam = {};
    var contentTypes = ['application/json'];
    var accepts = ['application/json'];
    try {
        return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'DELETE', pathParams, queryParams, headerParams, formParams, bodyParam, contentTypes, accepts);
    }
    catch (error) {
        logger_1.logger.error('Delete descriptor' + error.status);
        isValid = false;
    }
}
// function deploy(model: any) {
//     const url = `${args.host}/deployment-service/v1/applications/`;
//     const pathParams = {};
//     const queryParams = {};
//     const headerParams = {};
//     const formParams = {};
//     const bodyParam = model;
//     const contentTypes = ['application/json'];
//     const accepts = ['application/json'];
//     try {
//         return alfrescoJsApiDevops.oauth2Auth.callCustomApi(url, 'POST', pathParams, queryParams, headerParams, formParams, bodyParam,
//             contentTypes, accepts);
//     } catch (error) {
//         logger.error('Deploy post' + error.status);
//         isValid = false;
//     }
// }
function initializeDefaultToken(options) {
    options.tokenEndpoint = options.tokenEndpoint.replace('${clientId}', options.clientId);
    return options;
}
function getAlfrescoJsApiInstance(configArgs) {
    var ssoHost = configArgs.oauth;
    ssoHost = ssoHost !== null && ssoHost !== void 0 ? ssoHost : configArgs.host;
    var config = {
        provider: 'BPM',
        hostBpm: "" + configArgs.host,
        authType: 'OAUTH',
        oauth2: {
            host: "" + ssoHost,
            tokenUrl: ssoHost + "/" + configArgs.tokenEndpoint,
            clientId: "" + configArgs.clientId,
            scope: "" + configArgs.scope,
            secret: "" + configArgs.secret,
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/'
        }
    };
    return new js_api_1.AlfrescoApi(config);
}
function deployMissingApps(tag) {
    return __awaiter(this, void 0, void 0, function () {
        var deployedApps, reset, green;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getApplicationByStatus('')];
                case 1:
                    deployedApps = _a.sent();
                    findMissingApps(deployedApps.list.entries);
                    findFailingApps(deployedApps.list.entries);
                    if (!(failingApps.length > 0)) return [3 /*break*/, 2];
                    failingApps.forEach(function (app) {
                        var reset = '\x1b[0m';
                        var bright = '\x1b[1m';
                        var red = '\x1b[31m';
                        logger_1.logger.error("" + red + bright + "ERROR: App " + app.entry.name + " down or inaccessible " + reset + red + " with status " + app.entry.status + reset);
                    });
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 2:
                    if (!(absentApps.length > 0)) return [3 /*break*/, 4];
                    logger_1.logger.warn("Missing apps: " + JSON.stringify(absentApps));
                    return [4 /*yield*/, checkIfAppIsReleased(absentApps, tag)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    reset = '\x1b[0m';
                    green = '\x1b[32m';
                    logger_1.logger.info(green + "All the apps are correctly deployed" + reset);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function checkIfAppIsReleased(missingApps, tag) {
    return __awaiter(this, void 0, void 0, function () {
        var projectList, TIME, noError, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getProjects()];
                case 1:
                    projectList = _a.sent();
                    TIME = 5000;
                    noError = true;
                    _loop_1 = function (i) {
                        var currentAbsentApp, project, projectRelease, error_5, projectReleaseList, currentReleaseVersion_1, deployPayload;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    noError = true;
                                    currentAbsentApp = missingApps[i];
                                    project = projectList.list.entries.find(function (currentApp) { return currentAbsentApp.name === currentApp.entry.name; });
                                    if (!(project === undefined)) return [3 /*break*/, 5];
                                    logger_1.logger.warn('Missing project: Create the project for ' + currentAbsentApp.name);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, importProjectAndRelease(currentAbsentApp, tag)];
                                case 2:
                                    projectRelease = _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_5 = _a.sent();
                                    logger_1.logger.info("error status " + error_5.status);
                                    if (error_5.status !== 409) {
                                        logger_1.logger.info("Not possible to upload the project " + currentAbsentApp.name + " status  : " + JSON.stringify(error_5));
                                        process.exit(1);
                                    }
                                    else {
                                        logger_1.logger.error("Not possible to upload the project because inconsistency CS - Modelling try to delete manually the node");
                                        process.exit(1);
                                    }
                                    return [3 /*break*/, 4];
                                case 4: return [3 /*break*/, 9];
                                case 5:
                                    TIME += 5000;
                                    logger_1.logger.info('Project ' + project.entry.name + ' found');
                                    return [4 /*yield*/, getProjectRelease(project.entry.id)];
                                case 6:
                                    projectReleaseList = _a.sent();
                                    if (!(projectReleaseList.list.entries.length === 0)) return [3 /*break*/, 8];
                                    logger_1.logger.warn('Project needs release');
                                    return [4 /*yield*/, releaseProject(project)];
                                case 7:
                                    projectRelease = _a.sent();
                                    logger_1.logger.warn("Project released: " + projectRelease.id);
                                    return [3 /*break*/, 9];
                                case 8:
                                    logger_1.logger.info('Project already has release');
                                    currentReleaseVersion_1 = -1;
                                    projectReleaseList.list.entries.forEach(function (currentRelease) {
                                        if (currentRelease.entry.version > currentReleaseVersion_1) {
                                            currentReleaseVersion_1 = currentRelease.entry.version;
                                            projectRelease = currentRelease;
                                        }
                                    });
                                    _a.label = 9;
                                case 9:
                                    if (!noError) return [3 /*break*/, 12];
                                    return [4 /*yield*/, checkDescriptorExist(currentAbsentApp.name)];
                                case 10:
                                    _a.sent();
                                    return [4 /*yield*/, sleep(TIME)];
                                case 11:
                                    _a.sent();
                                    deployPayload = {
                                        name: currentAbsentApp.name,
                                        releaseId: projectRelease.entry.id,
                                        security: currentAbsentApp.security,
                                        infrastructure: currentAbsentApp.infrastructure,
                                        variables: currentAbsentApp.variables
                                    };
                                    // await deploy(deployPayload);
                                    console.log("DEPLOY PAYLOAD ========================================");
                                    console.log(deployPayload);
                                    console.log(" ======================================== DEPLOY PAYLOAD END ");
                                    _a.label = 12;
                                case 12: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < missingApps.length)) return [3 /*break*/, 5];
                    return [5 /*yield**/, _loop_1(i)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function checkDescriptorExist(name) {
    return __awaiter(this, void 0, void 0, function () {
        var descriptorList, _i, _a, descriptor;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.info("Check descriptor " + name + " exist in the list ");
                    return [4 /*yield*/, getDescriptors()];
                case 1:
                    descriptorList = _b.sent();
                    if (!(descriptorList && descriptorList.list && descriptorList.entries)) return [3 /*break*/, 5];
                    _i = 0, _a = descriptorList.list.entries;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    descriptor = _a[_i];
                    if (!(descriptor.entry.name === name)) return [3 /*break*/, 4];
                    if (!(descriptor.entry.deployed === false)) return [3 /*break*/, 4];
                    return [4 /*yield*/, deleteDescriptor(descriptor.entry.name)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, false];
            }
        });
    });
}
function importProjectAndRelease(app, tag) {
    return __awaiter(this, void 0, void 0, function () {
        var appLocationReplaced, projectRelease;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appLocationReplaced = app.file_location(tag);
                    logger_1.logger.warn('App fileLocation ' + appLocationReplaced);
                    return [4 /*yield*/, getFileFromRemote(appLocationReplaced, app.name)];
                case 1:
                    _a.sent();
                    logger_1.logger.warn('Project imported ' + app.name);
                    return [4 /*yield*/, importAndReleaseProject(app.name + ".zip")];
                case 2:
                    projectRelease = _a.sent();
                    return [4 /*yield*/, deleteLocalFile("" + app.name)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, projectRelease];
            }
        });
    });
}
function findMissingApps(deployedApps) {
    Object.keys(ACTIVITI_CLOUD_APPS).forEach(function (key) {
        var isPresent = deployedApps.find(function (currentApp) { return ACTIVITI_CLOUD_APPS[key].name === currentApp.entry.name; });
        if (!isPresent) {
            absentApps.push(ACTIVITI_CLOUD_APPS[key]);
        }
    });
}
function findFailingApps(deployedApps) {
    Object.keys(ACTIVITI_CLOUD_APPS).forEach(function (key) {
        var failingApp = deployedApps.filter(function (currentApp) { return ACTIVITI_CLOUD_APPS[key].name === currentApp.entry.name && 'Running' !== currentApp.entry.status; });
        if ((failingApp === null || failingApp === void 0 ? void 0 : failingApp.length) > 0) {
            failingApps.push.apply(failingApps, failingApp);
        }
    });
}
function getFileFromRemote(url, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    request(url)
                        .pipe(fs.createWriteStream(name + ".zip"))
                        .on('finish', function () {
                        logger_1.logger.info("The file is finished downloading.");
                        resolve();
                    })
                        .on('error', function (error) {
                        logger_1.logger.error("Not possible to download the project form remote");
                        reject(error);
                    });
                })];
        });
    });
}
function deleteLocalFile(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            logger_1.logger.info("Deleting local file " + name + ".zip");
            fs.unlinkSync(name + ".zip");
            return [2 /*return*/];
        });
    });
}
function sleep(time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger_1.logger.info("Waiting for " + time + " sec...");
                    return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, time); })];
                case 1:
                    _a.sent();
                    logger_1.logger.info("Done...");
                    return [2 /*return*/];
            }
        });
    });
}
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, main()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports["default"] = default_1;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var options, reset, green;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('START');
                    commander_1["default"]
                        .version('0.1.0')
                        .description('The following command is in charge of Initializing the activiti cloud env with the default apps' +
                        'adf-cli init-aae-env --host "gateway_env" --modelerUsername "modelerusername" --modelerPassword "modelerpassword" --devopsUsername "devevopsusername" --devopsPassword "devopspassword"')
                        .option('-h, --host [type]', 'Host gateway')
                        .option('--oauth [type]', 'SSO host')
                        .option('--clientId [type]', 'sso client')
                        .option('--secret [type]', 'sso secret', '')
                        .option('--scope [type]', 'sso scope', 'openid')
                        .option('--tokenEndpoint [type]', 'discovery token Endpoint', 'auth/realms/${clientId}/protocol/openid-connect/token')
                        .option('--modelerUsername [type]', 'username of a user with role ACTIVIT_MODELER')
                        .option('--modelerPassword [type]', 'modeler password')
                        .option('--devopsUsername [type]', 'username of a user with role ACTIVIT_DEVOPS')
                        .option('--devopsPassword [type]', 'devops password')
                        .option('--tag [type]', 'tag name of the codebase')
                        .parse(process.argv);
                    if (process.argv.includes('-h') || process.argv.includes('--help')) {
                        commander_1["default"].outputHelp();
                        return [2 /*return*/];
                    }
                    options = initializeDefaultToken(commander_1["default"].opts());
                    args = {
                        host: options.host,
                        clientId: options.clientId,
                        devopsUsername: options.devopsUsername,
                        devopsPassword: options.devopsPassword,
                        modelerUsername: options.modelerUsername,
                        modelerPassword: options.modelerPassword,
                        oauth: options.oauth,
                        tokenEndpoint: options.tokenEndpoint,
                        scope: options.scope,
                        secret: options.secret,
                        tag: options.tag
                    };
                    alfrescoJsApiModeler = getAlfrescoJsApiInstance(args);
                    exports.AAE_MICROSERVICES.map(function (serviceName) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, healthCheck(serviceName)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, alfrescoJsApiModeler.login(args.modelerUsername, args.modelerPassword).then(function () {
                            var reset = '\x1b[0m';
                            var green = '\x1b[32m';
                            logger_1.logger.info(green + "login SSO ok" + reset);
                        }, function (error) {
                            logger_1.logger.error("login SSO error " + JSON.stringify(error) + " " + args.modelerUsername);
                            process.exit(1);
                        })];
                case 1:
                    _a.sent();
                    if (!isValid) return [3 /*break*/, 4];
                    reset = '\x1b[0m';
                    green = '\x1b[32m';
                    logger_1.logger.info(green + "The environment is up and running " + reset);
                    alfrescoJsApiDevops = getAlfrescoJsApiInstance(args);
                    return [4 /*yield*/, alfrescoJsApiDevops.login(args.devopsUsername, args.devopsPassword).then(function () {
                            logger_1.logger.info('login SSO ok devopsUsername');
                        }, function (error) {
                            logger_1.logger.error("login SSO error " + JSON.stringify(error) + " " + args.devopsUsername);
                            process.exit(1);
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, deployMissingApps(args.tag)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    logger_1.logger.error('The environment is not up');
                    process.exit(1);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
main();
