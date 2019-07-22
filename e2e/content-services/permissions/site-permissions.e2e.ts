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

import { PermissionsPage } from '../../pages/adf/permissionsPage';
import { LoginPage, BrowserActions, UploadActions, StringUtil, NotificationHistoryPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import { ViewerPage } from '../../pages/adf/viewerPage';
import CONSTANTS = require('../../util/constants');
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Permissions Component', () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf.url
    });
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const permissionsPage = new PermissionsPage();
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const contentList = contentServicesPage.getDocumentList();

    const viewerPage = new ViewerPage();
    const navigationBarPage = new NavigationBarPage();
    const metadataViewPage = new MetadataViewPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const uploadDialog = new UploadDialog();

    let folderOwnerUser, consumerUser, siteConsumerUser, contributorUser, managerUser, collaboratorUser;

    let publicSite, privateSite, folderName;

    const fileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const testFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
    });

    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let siteFolder, privateSiteFile;

    folderOwnerUser = new AcsUserModel();
    consumerUser = new AcsUserModel();
    siteConsumerUser = new AcsUserModel();
    collaboratorUser = new AcsUserModel();
    contributorUser = new AcsUserModel();
    managerUser = new AcsUserModel();

    beforeAll(async (done) => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(folderOwnerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(siteConsumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(managerUser);
        await this.alfrescoJsApi.login(folderOwnerUser.id, folderOwnerUser.password);

        browser.sleep(15000);

        const publicSiteName = `PUBLIC_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        const privateSiteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;

        folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}`;

        const publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };

        const privateSiteBody = { visibility: 'PRIVATE', title: privateSiteName };

        publicSite = await this.alfrescoJsApi.core.sitesApi.createSite(publicSiteBody);
        privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: siteConsumerUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: collaboratorUser.id,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: contributorUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(publicSite.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(privateSite.entry.id, {
            id: managerUser.id,
            role: CONSTANTS.CS_USER_ROLES.MANAGER
        });

        siteFolder = await uploadActions.createFolder(folderName, publicSite.entry.guid);

        privateSiteFile = await uploadActions.uploadFile(fileModel.location, 'privateSite' + fileModel.name, privateSite.entry.guid);

        await this.alfrescoJsApi.core.nodesApi.updateNode(privateSiteFile.entry.id,
            {
                permissions: {
                    locallySet: [{
                        authorityId: managerUser.getId(),
                        name: 'SiteConsumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

        await uploadActions.uploadFile(fileModel.location, 'Site' + fileModel.name, siteFolder.entry.id);

        done();

    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id);
        await this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);

        done();
    });

    describe('Role Site Dropdown', () => {

        beforeAll(async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(folderOwnerUser);

            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + publicSite.entry.guid);

            done();
        });

        it('[C277002] Should display the Role Site dropdown', async () => {
            contentServicesPage.checkContentIsDisplayed(folderName);

            contentList.rightClickOnRow(folderName);

            contentServicesPage.pressContextMenuActionNamed('Permission');

            permissionsPage.checkPermissionInheritedButtonIsDisplayed();
            permissionsPage.checkAddPermissionButtonIsDisplayed();
            permissionsPage.clickAddPermissionButton();
            permissionsPage.checkAddPermissionDialogIsDisplayed();
            permissionsPage.checkSearchUserInputIsDisplayed();

            permissionsPage.searchUserOrGroup(consumerUser.getId());
            permissionsPage.clickUserOrGroup(consumerUser.getFirstName());
            permissionsPage.checkUserOrGroupIsAdded(consumerUser.getId());

            expect(permissionsPage.getRoleCellValue(consumerUser.getId())).toEqual('SiteCollaborator');

            permissionsPage.clickRoleDropdownByUserOrGroupName(consumerUser.getId());

            expect(permissionsPage.getRoleDropdownOptions().count()).toBe(4);
            expect(permissionsPage.getRoleDropdownOptions().get(0).getText()).toBe(CONSTANTS.CS_USER_ROLES.COLLABORATOR);
            expect(permissionsPage.getRoleDropdownOptions().get(1).getText()).toBe(CONSTANTS.CS_USER_ROLES.CONSUMER);
            expect(permissionsPage.getRoleDropdownOptions().get(2).getText()).toBe(CONSTANTS.CS_USER_ROLES.CONTRIBUTOR);
            expect(permissionsPage.getRoleDropdownOptions().get(3).getText()).toBe(CONSTANTS.CS_USER_ROLES.MANAGER);
        });

    });

    describe('Roles: SiteConsumer, SiteCollaborator, SiteContributor, SiteManager', () => {

        it('[C276994] Role SiteConsumer', async () => {

            await loginPage.loginToContentServicesUsingUserModel(siteConsumerUser);

            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(fileModel.location);

            notificationHistoryPage.checkNotifyContains('You don\'t have the create permission to upload the content');

        });

        it('[C276997] Role SiteContributor', async () => {
            await loginPage.loginToContentServicesUsingUserModel(contributorUser);

            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            contentList.checkActionMenuIsNotDisplayed();

            contentServicesPage.metadataContent('Site' + fileModel.name);

            notificationHistoryPage.checkNotifyContains('You don\'t have access to do this.');

            contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

            uploadDialog.fileIsUploaded(testFileModel.name);
            uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

        });

        it('[C277005] Role SiteCollaborator', async () => {

            await loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);

            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();

            contentServicesPage.checkDeleteIsDisabled('Site' + fileModel.name);

            BrowserActions.closeMenuAndDialogs();

            browser.controlFlow().execute(async () => {

                contentList.checkActionMenuIsNotDisplayed();

                contentServicesPage.metadataContent('Site' + fileModel.name);

                metadataViewPage.editIconIsDisplayed();
                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
                metadataViewPage.clickEditPropertyIcons('properties.cm:title');

                metadataViewPage.enterPropertyText('properties.cm:title', 'newTitle');
                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');

                expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('newTitle');
                metadataViewPage.clickCloseButton();

                contentServicesPage.uploadFile(pngFileModel.location).checkContentIsDisplayed(pngFileModel.name);

                uploadDialog.fileIsUploaded(pngFileModel.name);
                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

            });

        });

        it('[C277006] Role SiteManager', async () => {
            await loginPage.loginToContentServicesUsingUserModel(managerUser);
            navigationBarPage.openContentServicesFolder(siteFolder.entry.id);
            contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);

            contentList.doubleClickRow('Site' + fileModel.name);

            viewerPage.checkFileIsLoaded();
            viewerPage.clickCloseButton();

            contentList.waitForTableBody();
            contentServicesPage.metadataContent('Site' + fileModel.name);

            metadataViewPage.editIconIsDisplayed();

            browser.controlFlow().execute(async () => {

                await metadataViewPage.editIconClick();

                metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');
                metadataViewPage.clickEditPropertyIcons('properties.cm:description');
                metadataViewPage.enterDescriptionText('newDescription');

                await metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');

                expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('newDescription');

                metadataViewPage.clickCloseButton();
                contentServicesPage.uploadFile(testFileModel.location).checkContentIsDisplayed(testFileModel.name);

                uploadDialog.fileIsUploaded(testFileModel.name);
                uploadDialog.clickOnCloseButton().dialogIsNotDisplayed();

                contentServicesPage.checkContentIsDisplayed('Site' + fileModel.name);
                contentServicesPage.deleteContent('Site' + fileModel.name);
                contentServicesPage.checkContentIsNotDisplayed('Site' + fileModel.name);
            });

        });

    });

});
