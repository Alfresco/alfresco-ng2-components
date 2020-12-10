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

import {
    ApiService,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { CommentsPage } from '../../core/pages/comments.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import CONSTANTS = require('../../util/constants');

describe('Comment', () => {

    const loginPage: LoginPage = new LoginPage();
    const contentServicesPage: ContentServicesPage = new ContentServicesPage();
    const viewerPage: ViewerPage = new ViewerPage();
    const commentsPage: CommentsPage = new CommentsPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = new ApiService();

    let userFullName, nodeId;
    let acsUser: UserModel;

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

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
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();
    });

    describe('component', () => {

        beforeEach(async () => {
            await apiService.login(acsUser.email, acsUser.password);

            const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

            nodeId = pngUploadedFile.entry.id;

            userFullName = pngUploadedFile.entry.createdByUser.displayName;

            await loginPage.login(acsUser.email, acsUser.password);

            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
        });

        afterEach(async () => {
            await apiService.loginWithProfile('admin');
            await uploadActions.deleteFileOrFolder(nodeId);
            await navigationBarPage.clickLogoutButton();
        });

        it('[C276947] Should be able to add a comment on ACS and view on ADF', async () => {
            await apiService.getInstance().core.commentsApi.addComment(nodeId, { content: comments.test });

            await viewerPage.viewFile(pngFileModel.name);

            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();

            await commentsPage.checkCommentsTabIsSelected();
            await commentsPage.checkCommentInputIsDisplayed();

            await commentsPage.getTotalNumberOfComments('Comments (1)');
            await expect(await commentsPage.getMessage(0)).toEqual(comments.test);
            await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
            await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
        });

        it('[C276948] Should be able to add a comment on a file', async () => {
            await viewerPage.viewFile(pngFileModel.name);

            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await viewerPage.clickOnCommentsTab();

            await commentsPage.addComment(comments.first);
            await commentsPage.checkUserIconIsDisplayed();

            await commentsPage.getTotalNumberOfComments('Comments (1)');
            await expect(await commentsPage.getMessage(0)).toEqual(comments.first);
            await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
            await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
        });

        it('[C280021] Should be able to add a multiline comment on a file', async () => {
            await viewerPage.viewFile(pngFileModel.name);

            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await viewerPage.clickOnCommentsTab();

            await commentsPage.addComment(comments.multiline);
            await commentsPage.checkUserIconIsDisplayed();

            await commentsPage.getTotalNumberOfComments('Comments (1)');
            await expect(await commentsPage.getMessage(0)).toEqual(comments.multiline);
            await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
            await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);

            await commentsPage.addComment(comments.second);
            await commentsPage.checkUserIconIsDisplayed();

            await commentsPage.getTotalNumberOfComments('Comments (2)');
            await expect(await commentsPage.getMessage(0)).toEqual(comments.second);
            await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
            await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
        });

        it('[C280022] Should not be able to add an HTML or other code input into the comment input filed', async () => {
            await viewerPage.viewFile(pngFileModel.name);
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await viewerPage.clickOnCommentsTab();

            await commentsPage.addComment(comments.codeType);
            await commentsPage.checkUserIconIsDisplayed();

            await commentsPage.getTotalNumberOfComments('Comments (1)');
            await expect(await commentsPage.getMessage(0)).toEqual('First name: Last name:');
            await expect(await commentsPage.getUserName(0)).toEqual(userFullName);
            await expect(await commentsPage.getTime(0)).toMatch(/(ago|few)/);
        });
    });

    describe('Consumer Permissions', () => {
        let site, pngUploadedFile;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');

            site = await apiService.getInstance().core.sitesApi.createSite({
                title: StringUtil.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
                id: acsUser.username,
                role: CONSTANTS.CS_USER_ROLES.CONSUMER
            });

            pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, site.entry.guid);

            await loginPage.login(acsUser.email, acsUser.password);

            await navigationBarPage.navigateToContentServices();
        });

        afterAll(async () => {
            await uploadActions.deleteFileOrFolder(pngUploadedFile.entry.id);
            await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
        });

        it('[C290147] Should NOT be able to add comments to a site file with Consumer permissions', async () => {
            await navigationBarPage.goToSite(site);
            await contentServicesPage.checkAcsContainer();

            await viewerPage.viewFile(pngUploadedFile.entry.name);
            await viewerPage.checkInfoButtonIsDisplayed();
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();

            await commentsPage.checkCommentsTabIsSelected();
            await commentsPage.checkCommentInputIsNotDisplayed();
            await viewerPage.clickCloseButton();
        });
    });
});
