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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var permissionsPage_1 = require("../../pages/adf/permissionsPage");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var fileModel_1 = require("../../models/ACS/fileModel");
var adf_testing_1 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var folderModel_1 = require("../../models/ACS/folderModel");
var viewerPage_1 = require("../../pages/adf/viewerPage");
var metadataViewPage_1 = require("../../pages/adf/metadataViewPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
describe('Permissions Component', function () {
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var permissionsPage = new permissionsPage_1.PermissionsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var contentList = contentServicesPage.getDocumentList();
    var viewerPage = new viewerPage_1.ViewerPage();
    var metadataViewPage = new metadataViewPage_1.MetadataViewPage();
    var notificationPage = new adf_testing_1.NotificationHistoryPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var fileOwnerUser, filePermissionUser, file;
    var fileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    var testFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
    });
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var groupBody = {
        id: adf_testing_1.StringUtil.generateRandomString(),
        displayName: adf_testing_1.StringUtil.generateRandomString()
    };
    var roleConsumerFolderModel = new folderModel_1.FolderModel({ name: 'roleConsumer' + adf_testing_1.StringUtil.generateRandomString() });
    var roleCoordinatorFolderModel = new folderModel_1.FolderModel({ name: 'roleCoordinator' + adf_testing_1.StringUtil.generateRandomString() });
    var roleCollaboratorFolderModel = new folderModel_1.FolderModel({ name: 'roleCollaborator' + adf_testing_1.StringUtil.generateRandomString() });
    var roleContributorFolderModel = new folderModel_1.FolderModel({ name: 'roleContributor' + adf_testing_1.StringUtil.generateRandomString() });
    var roleEditorFolderModel = new folderModel_1.FolderModel({ name: 'roleEditor' + adf_testing_1.StringUtil.generateRandomString() });
    var roleConsumerFolder, roleCoordinatorFolder, roleContributorFolder, roleCollaboratorFolder, roleEditorFolder;
    var folders;
    fileOwnerUser = new acsUserModel_1.AcsUserModel();
    filePermissionUser = new acsUserModel_1.AcsUserModel();
    var duplicateUserPermissionMessage = 'One or more of the permissions you have set is already present : authority -> ' + filePermissionUser.getId() + ' / role -> Contributor';
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(fileOwnerUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(filePermissionUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.groupsApi.createGroup(groupBody)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(roleConsumerFolderModel.name, '-my-')];
                case 6:
                    roleConsumerFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(roleCoordinatorFolderModel.name, '-my-')];
                case 7:
                    roleCoordinatorFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(roleContributorFolderModel.name, '-my-')];
                case 8:
                    roleContributorFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(roleCollaboratorFolderModel.name, '-my-')];
                case 9:
                    roleCollaboratorFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(roleEditorFolderModel.name, '-my-')];
                case 10:
                    roleEditorFolder = _a.sent();
                    folders = [roleConsumerFolder, roleContributorFolder, roleCoordinatorFolder, roleCollaboratorFolder, roleEditorFolder];
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(roleConsumerFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: filePermissionUser.getId(),
                                        name: 'Consumer',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(roleCollaboratorFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: filePermissionUser.getId(),
                                        name: 'Collaborator',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(roleCoordinatorFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: filePermissionUser.getId(),
                                        name: 'Coordinator',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(roleContributorFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: filePermissionUser.getId(),
                                        name: 'Contributor',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(roleEditorFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: filePermissionUser.getId(),
                                        name: 'Editor',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'RoleConsumer' + fileModel.name, roleConsumerFolder.entry.id)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'RoleContributor' + fileModel.name, roleContributorFolder.entry.id)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'RoleCoordinator' + fileModel.name, roleCoordinatorFolder.entry.id)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'RoleCollaborator' + fileModel.name, roleCollaboratorFolder.entry.id)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'RoleEditor' + fileModel.name, roleEditorFolder.entry.id)];
                case 20:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var _i, folders_1, folder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    _i = 0, folders_1 = folders;
                    _a.label = 3;
                case 3:
                    if (!(_i < folders_1.length)) return [3 /*break*/, 6];
                    folder = folders_1[_i];
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(folder.entry.id)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    describe('Inherit and assigning permissions', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-')];
                    case 2:
                        file = _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(fileOwnerUser)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileModel.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkSelectedSiteIsDisplayed('My files')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentList.rightClickOnRow(fileModel.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Permission')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkPermissionContainerIsDisplayed()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(file.entry.id)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('[C268974] Inherit Permission', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, permissionsPage.checkPermissionInheritedButtonIsDisplayed()];
                    case 1:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, permissionsPage.getPermissionInheritedButtonText()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('Permission Inherited')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, permissionsPage.checkPermissionsDatatableIsDisplayed()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, permissionsPage.clickPermissionInheritedButton()];
                    case 5:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, permissionsPage.getPermissionInheritedButtonText()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe('Inherit Permission')];
                    case 7:
                        _d.sent();
                        return [4 /*yield*/, permissionsPage.checkNoPermissionsIsDisplayed()];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, permissionsPage.clickPermissionInheritedButton()];
                    case 9:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, permissionsPage.getPermissionInheritedButtonText()];
                    case 10: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe('Permission Inherited')];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, permissionsPage.checkPermissionsDatatableIsDisplayed()];
                    case 12:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286272] Should be able to see results when searching for a user', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, permissionsPage.checkAddPermissionButtonIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkSearchUserInputIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup('a')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkResultListIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276979] Should be able to give permissions to a group of people', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, permissionsPage.checkAddPermissionButtonIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkSearchUserInputIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup('GROUP_' + groupBody.id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickUserOrGroup('GROUP_' + groupBody.id)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkUserOrGroupIsAdded('GROUP_' + groupBody.id)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277100] Should display EVERYONE group in the search result set', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, permissionsPage.checkAddPermissionButtonIsDisplayed()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionDialogIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkSearchUserInputIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup(filePermissionUser.getId())];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkResultListIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup('somerandomtext')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkResultListIsDisplayed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkUserOrGroupIsDisplayed('EVERYONE')];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Changing and duplicate Permissions', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(fileOwnerUser.id, fileOwnerUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-')];
                    case 2:
                        file = _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(fileOwnerUser)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileModel.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkSelectedSiteIsDisplayed('My files')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentList.rightClickOnRow(fileModel.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Permission')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionButtonIsDisplayed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionDialogIsDisplayed()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkSearchUserInputIsDisplayed()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup(filePermissionUser.getId())];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName())];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkUserOrGroupIsAdded(filePermissionUser.getId())];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(file.entry.id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C274691] Should be able to add a new User with permission to the file and also change locally set permissions', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, roleDropdownOptions, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_m.sent()]).toEqual('Contributor')];
                    case 2:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId())];
                    case 3:
                        _m.sent();
                        roleDropdownOptions = permissionsPage.getRoleDropdownOptions();
                        _b = expect;
                        return [4 /*yield*/, roleDropdownOptions.count()];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_m.sent()]).toBe(5)];
                    case 5:
                        _m.sent();
                        _c = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(0).getText()];
                    case 6: return [4 /*yield*/, _c.apply(void 0, [_m.sent()]).toBe('Contributor')];
                    case 7:
                        _m.sent();
                        _d = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(1).getText()];
                    case 8: return [4 /*yield*/, _d.apply(void 0, [_m.sent()]).toBe('Collaborator')];
                    case 9:
                        _m.sent();
                        _e = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(2).getText()];
                    case 10: return [4 /*yield*/, _e.apply(void 0, [_m.sent()]).toBe('Coordinator')];
                    case 11:
                        _m.sent();
                        _f = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(3).getText()];
                    case 12: return [4 /*yield*/, _f.apply(void 0, [_m.sent()]).toBe('Editor')];
                    case 13:
                        _m.sent();
                        _g = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(4).getText()];
                    case 14: return [4 /*yield*/, _g.apply(void 0, [_m.sent()]).toBe('Consumer')];
                    case 15:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.selectOption('Collaborator')];
                    case 16:
                        _m.sent();
                        _h = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 17: return [4 /*yield*/, _h.apply(void 0, [_m.sent()]).toEqual('Collaborator')];
                    case 18:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId())];
                    case 19:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.selectOption('Coordinator')];
                    case 20:
                        _m.sent();
                        _j = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 21: return [4 /*yield*/, _j.apply(void 0, [_m.sent()]).toEqual('Coordinator')];
                    case 22:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId())];
                    case 23:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.selectOption('Editor')];
                    case 24:
                        _m.sent();
                        _k = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 25: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).toEqual('Editor')];
                    case 26:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.clickRoleDropdownByUserOrGroupName(filePermissionUser.getId())];
                    case 27:
                        _m.sent();
                        return [4 /*yield*/, permissionsPage.selectOption('Consumer')];
                    case 28:
                        _m.sent();
                        _l = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 29: return [4 /*yield*/, _l.apply(void 0, [_m.sent()]).toEqual('Consumer')];
                    case 30:
                        _m.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276980] Should not be able to duplicate User or Group to the locally set permissions', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual('Contributor')];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionDialogIsDisplayed()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, permissionsPage.checkSearchUserInputIsDisplayed()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup(filePermissionUser.getId())];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, permissionsPage.clickUserOrGroup(filePermissionUser.getFirstName())];
                    case 7:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, permissionsPage.getAssignPermissionErrorText()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(duplicateUserPermissionMessage)];
                    case 9:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276982] Should be able to remove User or Group from the locally set permissions', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(filePermissionUser.getId())];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Contributor')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, permissionsPage.clickDeletePermissionButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, permissionsPage.checkUserOrGroupIsDeleted(filePermissionUser.getId())];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Role: Consumer, Contributor, Coordinator, Collaborator, Editor, No Permissions', function () {
        it('[C276993] Role Consumer', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(filePermissionUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(roleConsumerFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('RoleConsumer' + fileModel.name)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentList.waitForTableBody()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('RoleConsumer' + fileModel.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('RoleConsumer' + fileModel.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, notificationPage.checkNotifyContains('You don\'t have access to do this.')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileModel.location)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content')];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276996] Role Contributor', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(filePermissionUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(roleContributorFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleContributor' + fileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('RoleContributor' + fileModel.name)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentList.waitForTableBody()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('RoleContributor' + fileModel.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('RoleContributor' + fileModel.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, notificationPage.checkNotifyContains('You don\'t have access to do this.')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(testFileModel.location)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileModel.name)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(testFileModel.name)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 17:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277000] Role Editor', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(filePermissionUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(roleEditorFolder.entry.id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleEditor' + fileModel.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('RoleEditor' + fileModel.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentList.waitForTableBody()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('RoleEditor' + fileModel.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('RoleEditor' + fileModel.name)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title')];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:title')];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle1')];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:title')];
                    case 17:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:title')];
                    case 18: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('newTitle1')];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickCloseButton()];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileModel.location)];
                    case 21:
                        _b.sent();
                        return [4 /*yield*/, notificationPage.checkNotifyContains('You don\'t have the create permission to upload the content')];
                    case 22:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277003] Role Collaborator', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(filePermissionUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(roleCollaboratorFolder.entry.id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleCollaborator' + fileModel.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('RoleCollaborator' + fileModel.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentList.waitForTableBody()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('RoleCollaborator' + fileModel.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('RoleCollaborator' + fileModel.name)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title')];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:title')];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle2')];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:title')];
                    case 17:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:title')];
                    case 18: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('newTitle2')];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickCloseButton()];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(testFileModel.location)];
                    case 21:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileModel.name)];
                    case 22:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(testFileModel.name)];
                    case 23:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 24:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 25:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277004] Role Coordinator', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(filePermissionUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(roleCoordinatorFolder.entry.id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('RoleCoordinator' + fileModel.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentList.waitForTableBody()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('RoleCoordinator' + fileModel.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title')];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:title')];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle3')];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:title')];
                    case 14:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:title')];
                    case 15: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('newTitle3')];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickCloseButton()];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(pngFileModel.location)];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFileModel.name)];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(pngFileModel.name)];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 21:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 22:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleCoordinator' + fileModel.name)];
                    case 23:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent('RoleCoordinator' + fileModel.name)];
                    case 24:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed('RoleCoordinator' + fileModel.name)];
                    case 25:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279881] No Permission User', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(filePermissionUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(roleConsumerFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('RoleConsumer' + fileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkSelectedSiteIsDisplayed('My files')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentList.rightClickOnRow('RoleConsumer' + fileModel.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Permission')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkPermissionInheritedButtonIsDisplayed()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionButtonIsDisplayed()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickPermissionInheritedButton()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, notificationPage.checkNotifyContains('You are not allowed to change permissions')];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, notificationPage.checkNotifyContains('You are not allowed to change permissions')];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=permissions-component.e2e.js.map