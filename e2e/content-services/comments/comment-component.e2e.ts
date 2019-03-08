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

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { CommentsPage } from '../../pages/adf/commentsPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import CONSTANTS = require('../../util/constants');
import { Util } from '../../util/util';

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Comment Component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let viewerPage = new ViewerPage();
    let commentsPage = new CommentsPage();
    const navigationBar = new NavigationBarPage();

    let acsUser = new AcsUserModel();

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    let uploadActions = new UploadActions();
    let nodeId, userFullName;

    let comments = {
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

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        done();
    });

    beforeEach(async (done) => {

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;

        userFullName = pngUploadedFile.entry.createdByUser.displayName;

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBar.clickContentServicesButton();
        contentServicesPage.waitForTableBody();

        done();
    });

    afterEach(async (done) => {

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);

        done();
    });

    it('[C276947] Should be able to add a comment on ACS and view on ADF', () => {

        browser.controlFlow().execute(async() => {
            await this.alfrescoJsApi.core.commentsApi.addComment(nodeId, {content: comments.test});
        });

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();

        commentsPage.checkCommentsTabIsSelected();
        commentsPage.checkCommentInputIsDisplayed();

        expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        expect(commentsPage.getMessage(0)).toEqual(comments.test);
        expect(commentsPage.getUserName(0)).toEqual(userFullName);
        expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);

    });

    it('[C276948] Should be able to add a comment on a file', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickOnCommentsTab();

        commentsPage.addComment(comments.first);
        commentsPage.checkUserIconIsDisplayed(0);

        expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        expect(commentsPage.getMessage(0)).toEqual(comments.first);
        expect(commentsPage.getUserName(0)).toEqual(userFullName);
        expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    it('[C280021] Should be able to add a multiline comment on a file', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickOnCommentsTab();

        commentsPage.addComment(comments.multiline);
        commentsPage.checkUserIconIsDisplayed(0);

        expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        expect(commentsPage.getMessage(0)).toEqual(comments.multiline);
        expect(commentsPage.getUserName(0)).toEqual(userFullName);
        expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);

        commentsPage.addComment(comments.second);
        commentsPage.checkUserIconIsDisplayed(0);

        expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (2)');
        expect(commentsPage.getMessage(0)).toEqual(comments.second);
        expect(commentsPage.getUserName(0)).toEqual(userFullName);
        expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    it('[C280022] Should not be able to add an HTML or other code input into the comment input filed', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        viewerPage.clickOnCommentsTab();

        commentsPage.addComment(comments.codeType);
        commentsPage.checkUserIconIsDisplayed(0);

        expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (1)');
        expect(commentsPage.getMessage(0)).toEqual('First name: Last name:');
        expect(commentsPage.getUserName(0)).toEqual(userFullName);
        expect(commentsPage.getTime(0)).toMatch(/(ago|few)/);
    });

    describe('Consumer Permissions', () => {
        let site, pngUploadedFile;

        beforeAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            site = await this.alfrescoJsApi.core.sitesApi.createSite({
                title: Util.generateRandomString(8),
                visibility: 'PUBLIC'
            });

            await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                id: acsUser.id,
                role: CONSTANTS.CS_USER_ROLES.CONSUMER
            });

            pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, site.entry.guid);

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            navigationBar.clickContentServicesButton();

            done();
        });

        afterAll((done) => {
            uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pngUploadedFile.entry.id);

            done();
        });

        it('[C290147] Should NOT be able to add comments to a site file with Consumer permissions', () => {
            navigationBar.goToSite(site);
            contentServicesPage.checkAcsContainer();

            viewerPage.viewFile(pngUploadedFile.entry.name);
            viewerPage.checkInfoButtonIsDisplayed();
            viewerPage.clickInfoButton();
            viewerPage.checkInfoSideBarIsDisplayed();

            commentsPage.checkCommentsTabIsSelected();
            commentsPage.checkCommentInputIsNotDisplayed();
        });
    });
});
