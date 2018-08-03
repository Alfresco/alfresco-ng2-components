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

import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import ViewerPage = require('../../pages/adf/viewerPage');
import ContentListPage = require('../../pages/adf/dialog/contentList');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');
import { VersionManagePage } from '../../pages/adf/versionManagerPage';
import UploadDialog = require('../../pages/adf/dialog/uploadDialog');
import NotificationPage = require('../../pages/adf/notificationPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { NodeActions } from '../../actions/ACS/node.actions';

import Util = require('../../util/util');
import path = require('path');
import CONSTANTS = require('../../util/constants');

fdescribe('Version component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new ContentListPage();
    const versionManagePage = new VersionManagePage();
    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const uploadDialog = new UploadDialog();
    const notificationPage = new NotificationPage();
    const site;

    let acsUser = new AcsUserModel();
    let consumerUser = new AcsUserModel();
    let collaboratorUser = new AcsUserModel();
    let contributorUser = new AcsUserModel();
    let managerUser = new AcsUserModel();
    let fileCreatorUser = new AcsUserModel();

    let newVersionFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    let lockFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_C.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_C.file_location
    });

    let differentCreatoFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_D.file_location
    });

    beforeAll(async (done) => {

        let uploadActions = new UploadActions();
        let nodeActions = new NodeActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(managerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(fileCreatorUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: consumerUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: collaboratorUser.id,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: contributorUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: fileCreatorUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        let lockFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, lockFileModel.location, lockFileModel.name, site.entry.guid);
        Object.assign(lockFileModel, lockFileUploaded.entry);

        nodeActions.lockNode(this.alfrescoJsApi, lockFileModel.id);

        await this.alfrescoJsApi.login(fileCreatorUser.id, fileCreatorUser.password);

        await uploadActions.uploadFile(this.alfrescoJsApi, differentCreatoFile.location, differentCreatoFile.name, site.entry.guid);

        done();
    });

    describe('Manager', () => {

        let sameCreatoFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });

        beforeAll(async (done) => {
            let uploadActions = new UploadActions();

            await this.alfrescoJsApi.login(managerUser.id, managerUser.password);

            let sameCreatoFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, sameCreatoFile.location, sameCreatoFile.name, site.entry.guid);
            Object.assign(sameCreatoFile, sameCreatoFileUploaded.entry);

            loginPage.loginToContentServicesUsingUserModel(managerUser);

            navigationBarPage.openContentServicesFolder(site.entry.guid);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.nodes.deleteNode(sameCreatoFile.id);
            done();
        });

        it('[C277200] should a user with Manager permission be able to upload a new version for a file with different creator', () => {
            contentListPage.versionManagerContent(differentCreatoFile.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionExist('1.1');
            expect(versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            expect(versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            versionManagePage.deleteFileVersion('1.1');
            versionManagePage.clickAcceptConfirm();

            versionManagePage.chekFileVersionNotExist('1.1');

            versionManagePage.closeVersionDialog();

            uploadDialog.clickOnCloseButton();
        });

        it('[C277204] Should a user with Manager permission not be able to upload a new version for a locked file', () => {
            contentListPage.versionManagerContent(lockFileModel.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionNotExist('1.1');

            versionManagePage.closeVersionDialog();

            uploadDialog.clickOnCloseButton();
        });

        it('[C277196] Should a user with Manager permission be able to upload a new version for the created file', () => {
            contentListPage.versionManagerContent(sameCreatoFile.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionExist('1.1');
            expect(versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            expect(versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            versionManagePage.deleteFileVersion('1.1');
            versionManagePage.clickAcceptConfirm();

            versionManagePage.chekFileVersionNotExist('1.1');

            versionManagePage.closeVersionDialog();

            uploadDialog.clickOnCloseButton();
        });
    });

    describe('Consumer', () => {

        beforeAll(async (done) => {
            let uploadActions = new UploadActions();

            loginPage.loginToContentServicesUsingUserModel(consumerUser);

            navigationBarPage.openContentServicesFolder(site.entry.guid);

            done();
        });

        it('[C277197] Should a user with Consumer permission not be able to upload a new version for a file with different creator', () => {
            contentListPage.versionManagerContent(differentCreatoFile.name);

            notificationPage.checkNotifyContains(`You don't have access to do this`);
        });

        it('[C277201] Should a user with Consumer permission not be able to upload a new version for a locked file', () => {
            contentListPage.versionManagerContent(lockFileModel.name);

            notificationPage.checkNotifyContains(`You don't have access to do this`);
        });

    });

    describe('Contributor', () => {
        let sameCreatoFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });

        beforeAll(async (done) => {
            let uploadActions = new UploadActions();

            await this.alfrescoJsApi.login(contributorUser.id, contributorUser.password);

            let sameCreatoFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, sameCreatoFile.location, sameCreatoFile.name, site.entry.guid);
            Object.assign(sameCreatoFile, sameCreatoFileUploaded.entry);

            loginPage.loginToContentServicesUsingUserModel(contributorUser);

            navigationBarPage.openContentServicesFolder(site.entry.guid);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.nodes.deleteNode(sameCreatoFile.id);
            done();
        });

        it('[C277177] Should a user with Contributor permission be able to upload a new version for the created file', () => {
            contentListPage.versionManagerContent(sameCreatoFile.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionExist('1.1');
            expect(versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            expect(versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            versionManagePage.deleteFileVersion('1.1');
            versionManagePage.clickAcceptConfirm();

            versionManagePage.chekFileVersionNotExist('1.1');

            versionManagePage.closeVersionDialog();

            uploadDialog.clickOnCloseButton();
        });

        it('[C277198] Should a user with Contributor permission not be able to upload a new version for a file with different creator', () => {
            contentListPage.versionManagerContent(differentCreatoFile.name);

            notificationPage.checkNotifyContains(`You don't have access to do this`);
        });

        it('[C277202] Should a user with Contributor permission not be able to upload a new version for a locked file', () => {
            contentListPage.versionManagerContent(lockFileModel.name);

            notificationPage.checkNotifyContains(`You don't have access to do this`);
        });
    });

    describe('Collaborator', () => {
        let sameCreatoFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });

        beforeAll(async (done) => {
            let uploadActions = new UploadActions();

            await this.alfrescoJsApi.login(collaboratorUser.id, collaboratorUser.password);

            let sameCreatoFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, sameCreatoFile.location, sameCreatoFile.name, site.entry.guid);
            Object.assign(sameCreatoFile, sameCreatoFileUploaded.entry);

            loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

            navigationBarPage.openContentServicesFolder(site.entry.guid);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.nodes.deleteNode(sameCreatoFile.id);
            done();
        });

        it('[C277195] Should a user with Collaborator permission be able to upload a new version for the created file', () => {
            contentListPage.versionManagerContent(sameCreatoFile.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionExist('1.1');
            expect(versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            expect(versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            versionManagePage.deleteFileVersion('1.1');
            versionManagePage.clickAcceptConfirm();

            versionManagePage.chekFileVersionNotExist('1.1');

            versionManagePage.closeVersionDialog();

            uploadDialog.clickOnCloseButton();
        });

        it('[C277203] Should a user with Collaborator permission not be able to upload a new version for a locked file', () => {
            contentListPage.versionManagerContent(lockFileModel.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionNotExist('1.1');

            versionManagePage.closeVersionDialog();

            uploadDialog.clickOnCloseButton();
        });

        it('[C277199] should a user with Collaborator permission be able to upload a new version for a file with different creator', () => {
            contentListPage.versionManagerContent(differentCreatoFile.name);

            versionManagePage.showNewVersionButton.click();

            versionManagePage.uploadNewVersionFile(newVersionFile.location);

            versionManagePage.chekFileVersionExist('1.1');
            expect(versionManagePage.getFileVersionName('1.1')).toEqual(newVersionFile.name);
            expect(versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();

            versionManagePage.clickActionButton('1.1');

            expect(element(by.css(`[id="adf-version-list-action-delete-1.1"]`)).isEnabled()).toBe(false);

            versionManagePage.closeActionButton();

            versionManagePage.closeVersionDialog();
        });
    });

});
