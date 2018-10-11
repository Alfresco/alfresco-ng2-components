/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginPage } from '../pages/adf/loginPage';
import NavigationBarPage = require('../pages/adf/navigationBarPage');
import ContentList = require('../pages/adf/dialog/contentList');

import { LockFilePage } from '../pages/adf/lockFilePage';

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');

import CONSTANTS = require('../util/constants');
import Util = require('../util/util');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Lock File', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const contentList = new ContentList();
    const lockFilePage = new LockFilePage();

    let adminUser = new AcsUserModel();
    let managerUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let pngSecondFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    let nodeId, site, documentLibrary, secondNodeId;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(adminUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(managerUser);

        await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(),
            visibility: 'PRIVATE'
        });

        let resultNode = await this.alfrescoJsApi.core.nodesApi.getNodeChildren(site.entry.guid);

        documentLibrary = resultNode.list.entries[0].entry.id;

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        done();

    });

    describe('Lock file interaction with the UI', () => {

        beforeAll(async (done) => {
            let pngSecondUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngSecondFileModel.location, pngSecondFileModel.name, documentLibrary);

            secondNodeId = pngSecondUploadedFile.entry.id;

            done();
        });

        beforeEach(async (done) => {
            let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;

            loginPage.loginToContentServicesUsingUserModel(adminUser);
            navigationBarPage.openContentServicesFolder(documentLibrary);

            done();
        });

        afterEach(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await this.alfrescoJsApi.core.nodesApi.unlockNode(secondNodeId);
            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, secondNodeId);

            done();
        });

        it('[C286604] Should be able to open Lock file option by clicking the lock image', () => {
            contentList.clickContentLockIcon(pngFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.checkCancelButtonIsDisplayed();
            lockFilePage.checkSaveButtonIsDisplayed();
        });

        it('[C286625] Should be able to click Cancel to cancel lock file operation', () => {
            contentList.clickContentLockIcon(pngFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickCancelButton();

            contentList.checkUnlockedIcon(pngFileModel.name);
        });

        it('[C286603] Should be able to click on Lock file checkbox and lock a file', () => {
            contentList.clickContentLockIcon(pngSecondFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickSaveButton();

            contentList.checkLockedIcon(pngSecondFileModel.name);
        });

        it('[C286618] Should be able to uncheck Lock file checkbox and unlock a file', () => {
            contentList.clickContentLockIcon(pngFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickSaveButton();

            contentList.checkLockedIcon(pngFileModel.name);
            contentList.clickContentLockIcon(pngFileModel.name);

            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickSaveButton();

            contentList.checkUnlockedIcon(pngFileModel.name);
        });

    });

    describe('Locked file without owner permissions', () => {

        beforeAll(async (done) => {
            let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;

            await this.alfrescoJsApi.core.nodesApi.lockNode(nodeId, {
                timeToExpire: 0,
                type: 'FULL',
                lifetime: 'PERSISTENT'
            });

            await this.alfrescoJsApi.login(managerUser.id, managerUser.password);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await this.alfrescoJsApi.core.nodesApi.unlockNode(nodeId);

            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

            done();
        });

        it('[C286610] Should not be able to delete a locked file', async () => {
            try {
                await this.alfrescoJsApi.core.nodesApi.deleteNode(nodeId);

            } catch (error) {
                expect(error.status).toEqual(409);
            }

        });

        it('[C286611] Should not be able to rename a locked file', async () => {
            try {
                await this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' });

            } catch (error) {
                expect(error.status).toEqual(409);
            }

        });

        it('[C286612] Should not be able to move a locked file', async () => {
            try {
                await this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

            } catch (error) {
                expect(error.status).toEqual(409);
            }
        });

        it('[C286613] Should not be able to update a new version on a locked file', async () => {
            try {
                await this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');

            } catch (error) {
                expect(error.status).toEqual(409);
            }
        });

    });

    describe('Locked file with owner permissions', () => {
        beforeAll(async (done) => {
            let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, documentLibrary);
            let pngSecondUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngSecondFileModel.location, pngSecondFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;
            secondNodeId = pngSecondUploadedFile.entry.id;

            await this.alfrescoJsApi.login(managerUser.id, managerUser.password);

            await this.alfrescoJsApi.core.nodesApi.lockNode(nodeId, {
                timeToExpire: 0,
                type: 'ALLOW_OWNER_CHANGES',
                lifetime: 'PERSISTENT'
            });
            await this.alfrescoJsApi.core.nodesApi.lockNode(secondNodeId, {
                timeToExpire: 0,
                type: 'ALLOW_OWNER_CHANGES',
                lifetime: 'PERSISTENT'
            });

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await this.alfrescoJsApi.core.nodesApi.unlockNode(nodeId);

            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

            done();
        });

        it('[C286614] Owner of the locked file should be able to rename if "Allow owner to modify" is checked', async () => {

            let response = await this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' });

            expect(response.entry.name).toEqual('My new name');
        });

        it('[C286615] Owner of the locked file should be able to update a new version if "Allow owner to modify" is checked', async () => {
            let response = await this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');

            expect(response.entry.modifiedAt).toBeGreaterThan(response.entry.createdAt);
        });

        it('[C286616] Owner of the locked file should be able to move if "Allow owner to modify" is checked', async () => {
            await this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

            let movedFile = await this.alfrescoJsApi.core.nodesApi.getNode(nodeId);

            expect(movedFile.entry.parentId).not.toEqual(documentLibrary);

        });

        it('[C286617] Owner of the locked file should be able to delete if "Allow owner to modify" is checked', async () => {
            await this.alfrescoJsApi.core.nodesApi.deleteNode(secondNodeId);

            try {
                await this.alfrescoJsApi.core.nodesApi.getNode(secondNodeId);

            } catch (error) {
                expect(error.status).toEqual(404);
            }
        });

    });

});
