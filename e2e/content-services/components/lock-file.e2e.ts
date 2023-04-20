/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    WaitActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { LockFilePage } from '../../content-services/pages/lock-file.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { NodeEntry, NodesApi, SitesApi } from '@alfresco/js-api';
import CONSTANTS = require('../../util/constants');

describe('Lock File', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const lockFilePage = new LockFilePage();
    const contentServices = new ContentServicesPage();

    const adminUser = new UserModel();
    const managerUser = new UserModel();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);
    const waitActions = new WaitActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const pngFileToLock = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_path
    });

    const pngFileToLockAdmin = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG_C.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG_C.file_path
    });

    let site; let documentLibrary;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(adminUser);
        await usersActions.createUser(managerUser);

        await apiService.login(adminUser.username, adminUser.password);

        const sitesApi = new SitesApi(apiService.getInstance());

        site = await sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PRIVATE'
        });

        const resultNode = await nodesApi.listNodeChildren(site.entry.guid);

        documentLibrary = resultNode.list.entries[0].entry.id;

        await sitesApi.createSiteMembership(site.entry.id, {
            id: managerUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        try {
            const sitesApi = new SitesApi(apiService.getInstance());
            await sitesApi.deleteSite(site.entry.id, { permanent: true });
        } catch (e) {
        }
    });

    describe('Lock file interaction with the UI', () => {

        let pngLockedUploadedFile: NodeEntry;
        let pngUploadedFile: NodeEntry;

        beforeAll(async () => {
            pngLockedUploadedFile = await uploadActions.uploadFile(pngFileToLock.location, pngFileToLock.name, documentLibrary);

            await loginPage.login(adminUser.username, adminUser.password);

            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);

            await navigationBarPage.openContentServicesFolder(documentLibrary);
            await contentServices.waitForTableBody();
        });

        afterEach(async () => {
            await apiService.login(adminUser.username, adminUser.password);
            try {
                await nodesApi.unlockNode(pngUploadedFile.entry.id);
                await waitActions.nodeIsUnlock(pngUploadedFile.entry.id);
            } catch (e) {
            }
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            try {
                await nodesApi.unlockNode(pngLockedUploadedFile.entry.id);
            } catch (e) {
            }
            try {
                await uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id);
            } catch (e) {
            }
            try {
                await uploadActions.deleteFileOrFolder(pngLockedUploadedFile.entry.id);
            } catch (e) {
            }
            await navigationBarPage.clickLogoutButton();
        });

        it('[C286604] Should be able to open Lock file option by clicking the lock image', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.cancelButton.waitVisible();
            await lockFilePage.saveButton.waitVisible();
        });

        it('[C286625] Should be able to click Cancel to cancel lock file operation', async () => {
            await contentServices.lockContent(pngFileModel.name);
            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.cancelButton.click();

            await contentServices.checkUnlockedIcon(pngFileModel.name);
        });

        it('[C286603] Should be able to click on Lock file checkbox and lock a file', async () => {
            await contentServices.lockContent(pngFileToLock.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            await contentServices.checkLockedIcon(pngFileToLock.name);
        });

        it('[C286618] Should be able to uncheck Lock file checkbox and unlock a file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            await contentServices.checkLockedIcon(pngFileModel.name);
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            await contentServices.checkUnlockedIcon(pngFileModel.name);
        });
    });

    describe('Locked file without owner permissions', () => {

        let pngUploadedFile: NodeEntry;

        beforeEach(async () => {
            await apiService.login(adminUser.username, adminUser.password);
            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);

            await loginPage.login(managerUser.username, managerUser.password);

            await navigationBarPage.openContentServicesFolder(documentLibrary);
        });

        afterEach(async () => {
            await apiService.login(adminUser.username, adminUser.password);

            try {
                await nodesApi.unlockNode(pngUploadedFile.entry.id);
                await uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id);
            } catch (error) {
            }
            await navigationBarPage.clickLogoutButton();
        });

        it('[C286610] Should not be able to delete a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                await nodesApi.deleteNode(pngUploadedFile.entry.id);
            } catch (error) {
                await expect(error.status).toEqual(409);
            }
        });

        it('[C286611] Should not be able to rename a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                await nodesApi.updateNode(pngUploadedFile.entry.id, { name: 'My new name' });

            } catch (error) {
                await expect(error.status).toEqual(409);
            }
        });

        it('[C286612] Should not be able to move a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                await nodesApi.moveNode(pngUploadedFile.entry.id, { targetParentId: '-my-' });

            } catch (error) {
                await expect(error.status).toEqual(409);
            }
        });

        it('[C286613] Should not be able to update a new version on a locked file', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                await nodesApi.updateNodeContent(pngUploadedFile.entry.id, 'NEW FILE CONTENT');
            } catch (error) {
                await expect(error.status).toEqual(409);
            }
        });
    });

    describe('Locked file with owner permissions', () => {
        let pngFileToBeLocked: NodeEntry;
        let pngUploadedFile: NodeEntry;

        beforeEach(async () => {
            await apiService.login(adminUser.username, adminUser.password);
            pngFileToBeLocked = await uploadActions.uploadFile(pngFileToLockAdmin.location, pngFileToLockAdmin.name, documentLibrary);
            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, documentLibrary);
            await loginPage.login(adminUser.username, adminUser.password);
            await navigationBarPage.openContentServicesFolder(documentLibrary);
            await contentServices.getDocumentList().dataTable.waitTillContentLoaded();
        });

        afterEach(async () => {
            await apiService.login(adminUser.username, adminUser.password);
            try {
                await uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id);
                await uploadActions.deleteFileOrFolder(pngFileToBeLocked.entry.id);
            } catch (e) {
            }
            await navigationBarPage.clickLogoutButton();
        });

        it('[C286615] Owner of the locked file should be able to update a new version if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.allowOwnerCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                await apiService.login(adminUser.username, adminUser.password);

                const response = await nodesApi.updateNodeContent(pngUploadedFile.entry.id, 'NEW FILE CONTENT');
                await expect(response.entry.modifiedAt.getTime()).toBeGreaterThan(response.entry.createdAt.getTime());
            } catch (error) {
            }
        });

        it('[C286616] Owner of the locked file should be able to move if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.allowOwnerCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                await apiService.login(adminUser.username, adminUser.password);
                await nodesApi.moveNode(pngUploadedFile.entry.id, { targetParentId: '-my-' });

                const movedFile = await nodesApi.getNode(pngUploadedFile.entry.id);

                await expect(movedFile.entry.parentId).not.toEqual(documentLibrary);
            } catch (error) {
            }
        });

        it('[C286617] Owner of the locked file should be able to delete if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileToLockAdmin.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.allowOwnerCheckbox.click();
            await lockFilePage.saveButton.click();

            await contentServices.deleteContent(pngFileToBeLocked.entry.name);
            await contentServices.checkContentIsNotDisplayed(pngFileToBeLocked.entry.name);
        });

        it('[C286614] Owner of the locked file should be able to rename if Allow owner to modify is checked', async () => {
            await contentServices.lockContent(pngFileModel.name);

            await lockFilePage.lockFileCheckboxText.waitVisible();
            await lockFilePage.lockFileCheckbox.click();
            await lockFilePage.allowOwnerCheckbox.click();
            await lockFilePage.saveButton.click();

            try {
                const response = await nodesApi.updateNode(pngUploadedFile.entry.id, { name: 'My new name' });
                await expect(response.entry.name).toEqual('My new name');
            } catch (error) {
            }
        });
    });
});
