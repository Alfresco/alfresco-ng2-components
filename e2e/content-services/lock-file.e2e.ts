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

import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';

import { LockFilePage } from '../pages/adf/lockFilePage';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';

import CONSTANTS = require('../util/constants');
import { Util } from '../util/util';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Lock File', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const lockFilePage = new LockFilePage();
    const contentServices = new ContentServicesPage();

    let adminUser = new AcsUserModel();
    let managerUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let pngFileToLock = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    let nodeId, site, documentLibrary, lockedFileNodeId;

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
            let pngLockedUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileToLock.location, pngFileToLock.name, documentLibrary);

            lockedFileNodeId = pngLockedUploadedFile.entry.id;

            done();
        });

        beforeEach(async (done) => {
            let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;

            loginPage.loginToContentServicesUsingUserModel(adminUser);

            await navigationBarPage.openContentServicesFolder(documentLibrary);

            contentServices.waitForTableBody();

            done();
        });

        afterEach(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await this.alfrescoJsApi.core.nodesApi.unlockNode(lockedFileNodeId);

            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, lockedFileNodeId);

            done();
        });

        it('[C286604] Should be able to open Lock file option by clicking the lock image', () => {
            contentServices.lockContent(pngFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.checkCancelButtonIsDisplayed();
            lockFilePage.checkSaveButtonIsDisplayed();
        });

        it('[C286625] Should be able to click Cancel to cancel lock file operation', () => {
            contentServices.lockContent(pngFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickCancelButton();

            contentServices.checkUnlockedIcon(pngFileModel.name);
        });

        it('[C286603] Should be able to click on Lock file checkbox and lock a file', () => {
            contentServices.lockContent(pngFileToLock.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickSaveButton();

            contentServices.checkLockedIcon(pngFileToLock.name);
        });

        it('[C286618] Should be able to uncheck Lock file checkbox and unlock a file', () => {
            contentServices.lockContent(pngFileModel.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickSaveButton();

            contentServices.checkLockedIcon(pngFileModel.name);
            contentServices.lockContent(pngFileModel.name);

            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickSaveButton();

            contentServices.checkUnlockedIcon(pngFileModel.name);
        });

    });

    describe('Locked file without owner permissions', () => {

        beforeEach(async (done) => {
            let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;

            loginPage.loginToContentServicesUsingUserModel(managerUser);

            navigationBarPage.openContentServicesFolder(documentLibrary);

            done();
        });

        afterEach(async (done) => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            await this.alfrescoJsApi.core.nodesApi.unlockNode(nodeId);

            await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

            done();
        });

        it('[C286610] Should not be able to delete a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await this.alfrescoJsApi.core.nodesApi.deleteNode(nodeId);

            } catch (error) {
                expect(error.status).toEqual(409);
            }

        });

        it('[C286611] Should not be able to rename a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' });

            } catch (error) {
                expect(error.status).toEqual(409);
            }

        });

        it('[C286612] Should not be able to move a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

            } catch (error) {
                expect(error.status).toEqual(409);
            }
        });

        it('[C286613] Should not be able to update a new version on a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');

            } catch (error) {
                expect(error.status).toEqual(409);
            }
        });

    });

    describe('Locked file with owner permissions', () => {

        let pngFileToBeLocked;

        beforeAll(async (done) => {
            pngFileToBeLocked = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileToLock.location, pngFileToLock.name, documentLibrary);

            lockedFileNodeId = pngFileToBeLocked.entry.id;

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

        it('[C286614] Owner of the locked file should be able to rename if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            let response = await this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' });

            expect(response.entry.name).toEqual('My new name');
        });

        it('[C286615] Owner of the locked file should be able to update a new version if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            let response = await this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');

            expect(response.entry.modifiedAt).toBeGreaterThan(response.entry.createdAt);
        });

        it('[C286616] Owner of the locked file should be able to move if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            await this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

            let movedFile = await this.alfrescoJsApi.core.nodesApi.getNode(nodeId);

            expect(movedFile.entry.parentId).not.toEqual(documentLibrary);

        });

        it('[C286617] Owner of the locked file should be able to delete if Allow owner to modify is checked', () => {
            contentServices.lockContent(pngFileToLock.name);

            lockFilePage.checkLockFileCheckboxIsDisplayed();
            lockFilePage.clickLockFileCheckbox();
            lockFilePage.clickAllowOwnerCheckbox();
            lockFilePage.clickSaveButton();

            contentServices.deleteContent(pngFileToBeLocked.entry.name);
            contentServices.checkContentIsNotDisplayed(pngFileToBeLocked.entry.name);
        });

    });
});
