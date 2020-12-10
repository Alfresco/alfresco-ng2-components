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

import { ApiService, LoginPage, StringUtil, UploadActions, UserModel, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { ContentServicesPage } from '../core/pages/content-services.page';
import { LockFilePage } from '../content-services/pages/lock-file.page';
import { FileModel } from '../models/ACS/file.model';
import { browser } from 'protractor';
import CONSTANTS = require('../util/constants');

describe('Lock File', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const lockFilePage = new LockFilePage();
    const contentServices = new ContentServicesPage();
    const adminUser = new UserModel();
    const managerUser = new UserModel();
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const pngFileToLock = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_path
    });

    let nodeId, site, documentLibrary, lockedFileNodeId;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(adminUser);
        await usersActions.createUser(managerUser);

        await apiService.login(adminUser.email, adminUser.password);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PRIVATE'
        });

        const resultNode = await apiService.getInstance().core.nodesApi.getNodeChildren(site.entry.guid);

        documentLibrary = resultNode.list.entries[0].entry.id;

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: managerUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    describe('Lock file interaction with the UI', () => {
        beforeAll(async () => {
            const pngLockedUploadedFile = await uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary);

            lockedFileNodeId = pngLockedUploadedFile.entry.id;
        });

        beforeEach(async () => {
            const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);
            nodeId = pngUploadedFile.entry.id;
            await loginPage.login(adminUser.email, adminUser.password);
            await navigationBarPage.openContentServicesFolder(documentLibrary);

            await contentServices.waitForTableBody();
        });

        afterEach(async () => {
            await apiService.login(adminUser.email, adminUser.password);
            await uploadActions.deleteFileOrFolder(nodeId);
            await navigationBarPage.clickLogoutButton();
        });

        afterAll(async () => {
            await apiService.login(adminUser.email, adminUser.password);
            await apiService.getInstance().core.nodesApi.unlockNode(lockedFileNodeId);
            await uploadActions.deleteFileOrFolder(lockedFileNodeId);
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
            await apiService.login(adminUser.email, adminUser.password);
            const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);

            nodeId = pngUploadedFile.entry.id;

            await loginPage.login(managerUser.email, managerUser.password);

            await navigationBarPage.openContentServicesFolder(documentLibrary);
        });

        afterEach(async () => {
            await apiService.login(adminUser.email, adminUser.password);

            try {
                await apiService.getInstance().core.nodesApi.unlockNode(nodeId);
                await uploadActions.deleteFileOrFolder(nodeId);
            } catch (error) {
            }
            await navigationBarPage.clickLogoutButton();
        });

        it('[C286610] Should not be able to delete a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                await apiService.getInstance().core.nodesApi.deleteNode(nodeId);
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
                await apiService.getInstance().core.nodesApi.updateNode(nodeId, { name: 'My new name' });

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
                await apiService.getInstance().core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

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
                await apiService.getInstance().core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');

            } catch (error) {
                await expect(error.status).toEqual(409);
            }
        });
    });

    describe('Locked file with owner permissions', () => {
        let pngFileToBeLocked;

        beforeAll(async () => {
            pngFileToBeLocked = await uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary);
            lockedFileNodeId = pngFileToBeLocked.entry.id;
        });

        beforeEach(async () => {
            const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);
            nodeId = pngUploadedFile.entry.id;
            await loginPage.login(adminUser.email, adminUser.password);
            await navigationBarPage.openContentServicesFolder(documentLibrary);
        });

        afterEach(async () => {
            await apiService.login(adminUser.email, adminUser.password);
            await uploadActions.deleteFileOrFolder(nodeId);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C286614] Owner of the locked file should be able to rename if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.checkLockFileCheckboxIsDisplayed();
            await lockFilePage.clickLockFileCheckbox();
            await lockFilePage.clickAllowOwnerCheckbox();
            await lockFilePage.clickSaveButton();

            try {
                const response = await apiService.getInstance().core.nodesApi.updateNode(nodeId, { name: 'My new name' });
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
                const response = await apiService.getInstance().core.nodesApi.updateNodeContent(nodeId, 'NEW FILE CONTENT');
                await expect(response.entry.modifiedAt.getTime()).toBeGreaterThan(response.entry.createdAt.getTime());
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
                await apiService.getInstance().core.nodesApi.moveNode(nodeId, { targetParentId: '-my-' });

                const movedFile = await apiService.getInstance().core.nodesApi.getNode(nodeId);

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
