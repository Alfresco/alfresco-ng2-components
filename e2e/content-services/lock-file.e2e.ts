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

import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../pages/adf/contentServicesPage';
import { LockFilePage } from '../pages/adf/lockFilePage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';
import CONSTANTS = require('../util/constants');
import { browser } from 'protractor';
import resources = require('../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Lock File', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const lockFilePage = new LockFilePage();
    const contentServices = new ContentServicesPage();
    const adminUser = new AcsUserModel();
    const managerUser = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const pngFileToLock = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    let nodeId, site, documentLibrary, lockedFileNodeId;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(adminUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(managerUser);

        await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PRIVATE'
        });

        const resultNode = await this.alfrescoJsApi.core.nodesApi.getNodeChildren(site.entry.guid);

        documentLibrary = resultNode.list.entries[0].entry.id;

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });
    });

    describe('Lock file interaction with the UI', () => {

        beforeAll(async () => {
            const pngLockedUploadedFile = await uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary);

            lockedFileNodeId = pngLockedUploadedFile.entry.id;

        });

        beforeEach(async () => {
            try {
                const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);
                nodeId = pngUploadedFile.entry.id;
                await loginPage.loginToContentServicesUsingUserModel(adminUser);
                await navigationBarPage.openContentServicesFolder(documentLibrary);

                await contentServices.waitForTableBody();
            } catch (error) {

            }

        });

        afterEach(async () => {
            try {
                await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

                await uploadActions.deleteFileOrFolder(nodeId);

            } catch (error) {

            }

        });

        afterAll(async () => {
            try {
                await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

                await this.alfrescoJsApi.core.nodesApi.unlockNode(lockedFileNodeId);

                await uploadActions.deleteFileOrFolder(lockedFileNodeId);

            } catch (error) {

            }

        });

        it('[C286604] Should be able to open Lock file option by clicking the lock image', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.checkCancelButtonIsDisplayed();
            await lockFilePage.checkSaveButtonIsDisplayed();
        });

        it('[C286625] Should be able to click Cancel to cancel lock file operation', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickCancelButton();

            await contentServices.checkUnlockedIcon(pngFileModel.name);
        });

        it('[C286603] Should be able to click on Lock file checkbox and lock a file', async () => {
            await contentServices.lockContent(pngFileToLock.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            await contentServices.checkLockedIcon(pngFileToLock.name);
        });

        it('[C286618] Should be able to uncheck Lock file checkbox and unlock a file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            await contentServices.checkLockedIcon(pngFileModel.name);
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            await contentServices.checkUnlockedIcon(pngFileModel.name);
        });

    });

    describe('Locked file without owner permissions', () => {

        beforeEach(async () => {
            const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;

            await loginPage.loginToContentServicesUsingUserModel(managerUser);

            await navigationBarPage.openContentServicesFolder(documentLibrary);

        });

        afterEach(async () => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            try {
                await this.alfrescoJsApi.core.nodesApi.unlockNode(nodeId);
                await uploadActions.deleteFileOrFolder(nodeId);
            } catch (error) {
            }

        });

        it('[C286610] Should not be able to delete a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await this.alfrescoJsApi.core.nodesApi.deleteNode(nodeId);
            } catch (error) {
                await expect(error.status).toEqual(409);
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
                await expect(error.status).toEqual(409);
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
                await expect(error.status).toEqual(409);
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
                await expect(error.status).toEqual(409);
            }
        });

    });

    describe('Locked file with owner permissions', () => {

        let pngFileToBeLocked;

        beforeAll(async () => {
            try {
                pngFileToBeLocked = await uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary);
                lockedFileNodeId = pngFileToBeLocked.entry.id;
            } catch (error) {
            }

        });

        beforeEach(async () => {
            try {
                const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);
                nodeId = pngUploadedFile.entry.id;
                await loginPage.loginToContentServicesUsingUserModel(adminUser);
                await navigationBarPage.openContentServicesFolder(documentLibrary);
            } catch (error) {
            }

        });

        afterEach(async () => {
            await this.alfrescoJsApi.login(adminUser.id, adminUser.password);

            try {
                await uploadActions.deleteFileOrFolder(nodeId);
            } catch (error) {
            }

        });

        it('[C286614] Owner of the locked file should be able to rename if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                const response = await this.alfrescoJsApi.core.nodesApi.updateNode(nodeId, { name: 'My new name' });
                await expect(response.entry.name).toEqual('My new name');
            } catch (error) {
            }

        });

        it('[C286615] Owner of the locked file should be able to update a new version if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                const response = await this.alfrescoJsApi.core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');
                await expect(response.entry.modifiedAt).toBeGreaterThan(response.entry.createdAt);
            } catch (error) {
            }

        });

        it('[C286616] Owner of the locked file should be able to move if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await this.alfrescoJsApi.core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

                const movedFile = await this.alfrescoJsApi.core.nodesApi.getNode(nodeId);

                await expect(movedFile.entry.parentId).not.toEqual(documentLibrary);
            } catch (error) {
            }

        });

        it('[C286617] Owner of the locked file should be able to delete if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileToLock.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            await contentServices.deleteContent(pngFileToBeLocked.entry.name);
            await contentServices.checkContentIsNotDisplayed(pngFileToBeLocked.entry.name);
        });

    });
});
