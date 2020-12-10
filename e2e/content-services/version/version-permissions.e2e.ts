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

import { browser, by, element } from 'protractor';
import {
    ApiService,
    BrowserActions,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { VersionManagePage } from '../../core/pages/version-manager.page';
import { UploadDialogPage } from '../../core/pages/dialog/upload-dialog.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { FileModel } from '../../models/ACS/file.model';
import CONSTANTS = require('../../util/constants');

describe('Version component permissions', () => {

    const loginPage = new LoginPage();
    const versionManagePage = new VersionManagePage();
    const navigationBarPage = new NavigationBarPage();
    const uploadDialog = new UploadDialogPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const contentServices = new ContentServicesPage();
    let site;

    const acsUser = new UserModel();
    const consumerUser = new UserModel();
    const collaboratorUser = new UserModel();
    const contributorUser = new UserModel();
    const managerUser = new UserModel();
    const fileCreatorUser = new UserModel();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const newVersionFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    const lockFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG_C.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG_C.file_path
    });

    const differentCreatorFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG_D.file_path
    });

    const uploadActions = new UploadActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        await usersActions.createUser(consumerUser);
        await usersActions.createUser(collaboratorUser);
        await usersActions.createUser(contributorUser);
        await usersActions.createUser(managerUser);
        await usersActions.createUser(fileCreatorUser);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: consumerUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: collaboratorUser.username,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: contributorUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: managerUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: fileCreatorUser.username,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        const lockFileUploaded = await uploadActions.uploadFile(lockFileModel.location, lockFileModel.name, site.entry.guid);
        Object.assign(lockFileModel, lockFileUploaded.entry);

        await apiService.getInstance().nodes.lockNode(lockFileModel.id, {
                type: 'FULL',
                lifetime: 'PERSISTENT'
            });

        await apiService.login(fileCreatorUser.email, fileCreatorUser.password);

        await uploadActions.uploadFile(differentCreatorFile.location, differentCreatorFile.name, site.entry.guid);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    describe('Manager', () => {
        const sameCreatorFile = new FileModel({
            'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
        });

        beforeAll(async () => {
            await apiService.login(managerUser.email, managerUser.password);

            const sameCreatorFileUploaded = await uploadActions.uploadFile(sameCreatorFile.location, sameCreatorFile.name, site.entry.guid);
            Object.assign(sameCreatorFile, sameCreatorFileUploaded.entry);

            await loginPage.login(managerUser.email, managerUser.password);

            await navigationBarPage.openContentServicesFolder(site.entry.guid);
        });

        afterAll(async () => {
            await apiService.getInstance().nodes.deleteNode(sameCreatorFile.id);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C277200] should a user with Manager permission be able to upload a new version for a file with different creator', async () => {
            await contentServices.versionManagerContent(differentCreatorFile.name);

            await BrowserActions.click(versionManagePage.showNewVersionButton);

            await versionManagePage.uploadNewVersionFile(newVersionFile.location);

            await versionManagePage.checkFileVersionExist('1.1');
            await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            await expect(await versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            await versionManagePage.deleteFileVersion('1.1');
            await versionManagePage.clickAcceptConfirm();

            await versionManagePage.checkFileVersionNotExist('1.1');

            await versionManagePage.closeVersionDialog();

            await uploadDialog.clickOnCloseButton();
        });

        it('[C277204] Should be disabled the option for locked file', async () => {
            await contentServices.getDocumentList().rightClickOnRow(lockFileModel.name);
            await expect(await contentServices.isContextActionEnabled('Manage versions')).toBe(false, 'Manage versions is enabled');
        });
    });

    describe('Consumer', () => {
        beforeAll(async () => {
            await loginPage.login(consumerUser.email, consumerUser.password);

            await navigationBarPage.openContentServicesFolder(site.entry.guid);
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C277197] Should a user with Consumer permission not be able to upload a new version for a file with different creator', async () => {
            await contentServices.versionManagerContent(differentCreatorFile.name);

            await notificationHistoryPage.checkNotifyContains(`You don't have access to do this`);
        });

        it('[C277201] Should a user with Consumer permission not be able to upload a new version for a locked file', async () => {
            await contentServices.getDocumentList().rightClickOnRow(lockFileModel.name);
            await expect(await contentServices.isContextActionEnabled('Manage versions')).toBe(false, 'Manage version is enabled');
        });
    });

    describe('Contributor', () => {
        const sameCreatorFile = new FileModel({
            'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
        });

        beforeAll(async () => {
            await apiService.login(contributorUser.email, contributorUser.password);

            const sameCreatorFileUploaded = await uploadActions.uploadFile(sameCreatorFile.location, sameCreatorFile.name, site.entry.guid);
            Object.assign(sameCreatorFile, sameCreatorFileUploaded.entry);

            await loginPage.login(contributorUser.email, contributorUser.password);

            await navigationBarPage.openContentServicesFolder(site.entry.guid);
        });

        afterAll(async () => {
            await apiService.getInstance().nodes.deleteNode(sameCreatorFile.id);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C277177] Should a user with Contributor permission be able to upload a new version for the created file', async () => {
            await contentServices.versionManagerContent(sameCreatorFile.name);

            await BrowserActions.click(versionManagePage.showNewVersionButton);

            await versionManagePage.uploadNewVersionFile(newVersionFile.location);

            await versionManagePage.checkFileVersionExist('1.1');
            await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            await expect(await versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            await versionManagePage.deleteFileVersion('1.1');
            await versionManagePage.clickAcceptConfirm();

            await versionManagePage.checkFileVersionNotExist('1.1');

            await versionManagePage.closeVersionDialog();

            await uploadDialog.clickOnCloseButton();
        });

        it('[C277198] Should a user with Contributor permission not be able to upload a new version for a file with different creator', async () => {
            await contentServices.versionManagerContent(differentCreatorFile.name);

            await notificationHistoryPage.checkNotifyContains(`You don't have access to do this`);
        });

        it('[C277202] Should be disabled the option for a locked file', async () => {
            await contentServices.getDocumentList().rightClickOnRow(lockFileModel.name);
            await expect(await contentServices.isContextActionEnabled('Manage versions')).toBe(false, 'Manage versions is enabled');
        });
    });

    describe('Collaborator', () => {
        const sameCreatorFile = new FileModel({
            'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
        });

        beforeAll(async () => {
            await apiService.login(collaboratorUser.email, collaboratorUser.password);

            const sameCreatorFileUploaded = await uploadActions.uploadFile(sameCreatorFile.location, sameCreatorFile.name, site.entry.guid);
            Object.assign(sameCreatorFile, sameCreatorFileUploaded.entry);

            await loginPage.login(collaboratorUser.email, collaboratorUser.password);

            await navigationBarPage.openContentServicesFolder(site.entry.guid);
        });

        afterAll(async () => {
            await apiService.getInstance().nodes.deleteNode(sameCreatorFile.id);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C277195] Should a user with Collaborator permission be able to upload a new version for the created file', async () => {
            await contentServices.versionManagerContent(sameCreatorFile.name);

            await BrowserActions.click(versionManagePage.showNewVersionButton);

            await versionManagePage.uploadNewVersionFile(newVersionFile.location);

            await versionManagePage.checkFileVersionExist('1.1');
            await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            await expect(await versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            await versionManagePage.deleteFileVersion('1.1');
            await versionManagePage.clickAcceptConfirm();

            await versionManagePage.checkFileVersionNotExist('1.1');

            await versionManagePage.closeVersionDialog();

            await uploadDialog.clickOnCloseButton();
        });

        it('[C277199] should a user with Collaborator permission be able to upload a new version for a file with different creator', async () => {
            await contentServices.versionManagerContent(differentCreatorFile.name);

            await BrowserActions.click(versionManagePage.showNewVersionButton);

            await versionManagePage.uploadNewVersionFile(newVersionFile.location);

            await versionManagePage.checkFileVersionExist('1.1');
            await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            await expect(await versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            await versionManagePage.clickActionButton('1.1');

            await expect(await element(by.css(`[id="adf-version-list-action-delete-1.1"]`)).isEnabled()).toBe(false);

            await versionManagePage.closeActionsMenu();

            await versionManagePage.closeVersionDialog();
        });

        it('[C277203] Should a user with Collaborator permission not be able to upload a new version for a locked file', async () => {
            await contentServices.getDocumentList().rightClickOnRow(lockFileModel.name);
            await expect(await contentServices.isContextActionEnabled('Manage versions')).toBe(false, 'Manage versions is enabled');
        });
    });
});
