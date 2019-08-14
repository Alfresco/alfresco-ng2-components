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
var adf_testing_1 = require("@alfresco/adf-testing");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var viewerPage_1 = require("../../pages/adf/viewerPage");
var CONSTANTS = require("../../util/constants");
var metadataViewPage_1 = require("../../pages/adf/metadataViewPage");
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Permissions Component', function () {
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var permissionsPage = new permissionsPage_1.PermissionsPage();
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var contentList = contentServicesPage.getDocumentList();
    var viewerPage = new viewerPage_1.ViewerPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var metadataViewPage = new metadataViewPage_1.MetadataViewPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var folderOwnerUser, consumerUser, siteConsumerUser, contributorUser, managerUser, collaboratorUser;
    var publicSite, privateSite, folderName;
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
    var siteFolder, privateSiteFile;
    folderOwnerUser = new acsUserModel_1.AcsUserModel();
    consumerUser = new acsUserModel_1.AcsUserModel();
    siteConsumerUser = new acsUserModel_1.AcsUserModel();
    collaboratorUser = new acsUserModel_1.AcsUserModel();
    contributorUser = new acsUserModel_1.AcsUserModel();
    managerUser = new acsUserModel_1.AcsUserModel();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var publicSiteName, privateSiteName, publicSiteBody, privateSiteBody;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(folderOwnerUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(siteConsumerUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(managerUser)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 9:
                    _a.sent();
                    publicSiteName = "PUBLIC_TEST_SITE_" + adf_testing_1.StringUtil.generateRandomString(5);
                    privateSiteName = "PRIVATE_TEST_SITE_" + adf_testing_1.StringUtil.generateRandomString(5);
                    folderName = "MEESEEKS_" + adf_testing_1.StringUtil.generateRandomString(5);
                    publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };
                    privateSiteBody = { visibility: 'PRIVATE', title: privateSiteName };
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite(publicSiteBody)];
                case 10:
                    publicSite = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody)];
                case 11:
                    privateSite = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
                            id: siteConsumerUser.id,
                            role: CONSTANTS.CS_USER_ROLES.CONSUMER
                        })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
                            id: collaboratorUser.id,
                            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
                        })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
                            id: contributorUser.id,
                            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
                        })];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
                            id: managerUser.id,
                            role: CONSTANTS.CS_USER_ROLES.MANAGER
                        })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(privateSite.entry.id, {
                            id: managerUser.id,
                            role: CONSTANTS.CS_USER_ROLES.MANAGER
                        })];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderName, publicSite.entry.guid)];
                case 17:
                    siteFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid)];
                case 18:
                    privateSiteFile = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(privateSiteFile.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: managerUser.getId(),
                                        name: 'SiteConsumer',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id)];
                case 20:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Role Site Dropdown', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(folderOwnerUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/files/' + publicSite.entry.guid)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277002] Should display the Role Site dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, roleDropdownOptions, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, contentList.rightClickOnRow(folderName)];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Permission')];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.checkPermissionInheritedButtonIsDisplayed()];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionButtonIsDisplayed()];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(5000)];
                    case 6:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.clickAddPermissionButton()];
                    case 7:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.checkAddPermissionDialogIsDisplayed()];
                    case 8:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.checkSearchUserInputIsDisplayed()];
                    case 9:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.searchUserOrGroup(consumerUser.getId())];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.clickUserOrGroup(consumerUser.getFirstName())];
                    case 11:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId())];
                    case 12:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, permissionsPage.getRoleCellValue(consumerUser.getId())];
                    case 13: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual('SiteCollaborator')];
                    case 14:
                        _g.sent();
                        return [4 /*yield*/, permissionsPage.clickRoleDropdownByUserOrGroupName(consumerUser.getId())];
                    case 15:
                        _g.sent();
                        roleDropdownOptions = permissionsPage.getRoleDropdownOptions();
                        _b = expect;
                        return [4 /*yield*/, roleDropdownOptions.count()];
                    case 16: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toBe(4)];
                    case 17:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(0).getText()];
                    case 18: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toBe(CONSTANTS.CS_USER_ROLES.COLLABORATOR)];
                    case 19:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(1).getText()];
                    case 20: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toBe(CONSTANTS.CS_USER_ROLES.CONSUMER)];
                    case 21:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(2).getText()];
                    case 22: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toBe(CONSTANTS.CS_USER_ROLES.CONTRIBUTOR)];
                    case 23:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, roleDropdownOptions.get(3).getText()];
                    case 24: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toBe(CONSTANTS.CS_USER_ROLES.MANAGER)];
                    case 25:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', function () {
        it('[C276994] Role SiteConsumer', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(siteConsumerUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(siteFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('Site' + fileModel.name)];
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
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('Site' + fileModel.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileModel.location)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content')];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276997] Role SiteContributor', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(contributorUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(siteFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('Site' + fileModel.name)];
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
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('Site' + fileModel.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.')];
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
        it('[C277005] Role SiteCollaborator', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(collaboratorUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(siteFolder.entry.id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('Site' + fileModel.name)];
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
                        return [4 /*yield*/, contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, contentList.checkActionMenuIsNotDisplayed()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.metadataContent('Site' + fileModel.name)];
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
                        return [4 /*yield*/, metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle')];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:title')];
                    case 17:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:title')];
                    case 18: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('newTitle')];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickCloseButton()];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(pngFileModel.location)];
                    case 21:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFileModel.name)];
                    case 22:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(pngFileModel.name)];
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
        it('[C277006] Role SiteManager', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(managerUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, navigationBarPage.openContentServicesFolder(siteFolder.entry.id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentList.doubleClickRow('Site' + fileModel.name)];
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
                        return [4 /*yield*/, contentServicesPage.metadataContent('Site' + fileModel.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconIsDisplayed()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editIconClick()];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description')];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickEditPropertyIcons('properties.cm:description')];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.enterDescriptionText('newDescription')];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickUpdatePropertyIcon('properties.cm:description')];
                    case 14:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, metadataViewPage.getPropertyText('properties.cm:description')];
                    case 15: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('newDescription')];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, metadataViewPage.clickCloseButton()];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(testFileModel.location)];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileModel.name)];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(testFileModel.name)];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 21:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 22:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name)];
                    case 23:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent('Site' + fileModel.name)];
                    case 24:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed('Site' + fileModel.name)];
                    case 25:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=site-permissions.e2e.js.map