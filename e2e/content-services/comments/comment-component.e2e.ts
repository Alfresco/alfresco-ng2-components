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
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { CommentsPage } from '../../pages/adf/commentsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import CONSTANTS = require('../../util/constants');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Comment Component', () => {

    const loginPage: LoginPage = new LoginPage();
    const contentServicesPage: ContentServicesPage = new ContentServicesPage();
    const viewerPage: ViewerPage = new ViewerPage();
    const commentsPage: CommentsPage = new CommentsPage();
    const navigationBarPage = new NavigationBarPage();
    const acsUser: AcsUserModel = new AcsUserModel();

    let userFullName, nodeId;

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const comments = {
        first: 'This is a comment',
        multiline: 'This is a comment\n' + 'with a new line',
        second: 'This is another comment',
        codeType: `<form action="/action_page.php">
        First name: <input type="text" name="fname"><br>
            Last name: <input type="text" name="lname"><br>
        <input type="submit" value="Submit">
        </form>`,
        test: 'Test'
    };

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;

        userFullName = pngUploadedFile.entry.createdByUser.displayName;

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();

    });

    afterEach(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(nodeId);

    });

    it('[C276947] Should be able to add a comment on ACS and view on ADF', async () => {
        await this.alfrescoJsApi.core.commentsApi.addComment(nodeId, { content: comments.test });

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.checkImgViewerIsDisplayed();
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();

        await commentsPage.checkCommentsTabIsSelected();
        await commentsPage.checkCommentInputIsDisplayed();

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        await expect(await commentsPage.getMessage(0)).toEqual(comments.test);
        await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);

    });

    it('[C276948] Should be able to add a comment on a file', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.checkImgViewerIsDisplayed();
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await viewerPage.clickOnCommentsTab();

        await commentsPage.addComment(comments.first);
        await commentsPage.checkUserIconIsDisplayed(0);

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        await expect(await commentsPage.getMessage(0)).toEqual(comments.first);
        await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    it('[C280021] Should be able to add a multiline comment on a file', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.checkImgViewerIsDisplayed();
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await viewerPage.clickOnCommentsTab();

        await commentsPage.addComment(comments.multiline);
        await commentsPage.checkUserIconIsDisplayed(0);

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        await expect(await commentsPage.getMessage(0)).toEqual(comments.multiline);
        await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);

        await commentsPage.addComment(comments.second);
        await commentsPage.checkUserIconIsDisplayed(0);

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (2)');
        await expect(await commentsPage.getMessage(0)).toEqual(comments.second);
        await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    it('[C280022] Should not be able to add an HTML or other code input into the comment input filed', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.checkImgViewerIsDisplayed();
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await viewerPage.clickOnCommentsTab();

        await commentsPage.addComment(comments.codeType);
        await commentsPage.checkUserIconIsDisplayed(0);

        await expect(await commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        await expect(await commentsPage.getMessage(0)).toEqual('First name: Last name:');
        await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
        await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    describe('Consumer Permissions', () => {
        let site, pngUploadedFile;

        beforeAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                id: acsUser.id,
                role: CONSTANTS.CS_USER_ROLES.CONSUMER
            });

            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, site.entry.guid);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            await navigationBarPage.clickContentServicesButton();

        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id);

        });

        it('[C290147] Should NOT be able to add comments to a site file with Consumer permissions', async () => {
            await navigationBarPage.goToSite(site);
            await contentServicesPage.checkAcsContainer();

            await viewerPage.viewFile(pngUploadedFile.entry.name);
            await viewerPage.checkImgViewerIsDisplayed();
            await viewerPage.checkInfoButtonIsDisplayed();
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();

            await commentsPage.checkCommentsTabIsSelected();
            await commentsPage.checkCommentInputIsNotDisplayed();
        });
    });
});
