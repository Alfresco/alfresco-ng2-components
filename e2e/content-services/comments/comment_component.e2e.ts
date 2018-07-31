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
import { CommentsPage } from '../../pages/adf/commentsPage';

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('Comment Component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let viewerPage = new ViewerPage();
    let commentsPage = new CommentsPage();

    let acsUser = new AcsUserModel();

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let nodeId, userFullName;

    let comments = {
        first: 'This is a comment',
        multiline: 'This is a comment\n' + 'with a new line',
        second: 'This is another comment',
        codeType: `<form action="/action_page.php">
        First name: <input type="text" name="fname"><br>
            Last name: <input type="text" name="lname"><br>
        <input type="submit" value="Submit">
        </form>`
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

        let uploadActions = new UploadActions();

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;

        userFullName = pngUploadedFile.entry.createdByUser.displayName;

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();

        done();
    });

    afterEach(async (done) => {

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.nodesApi.deleteNode(nodeId, {'permanent': true}).then(function() {
            console.log('API called successfully.');
        }, function(error) {
            console.error(error);
        });

        done();
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
        expect(commentsPage.getTime(0)).toEqual('a few seconds ago');
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
        expect(commentsPage.getTime(0)).toEqual('a few seconds ago');

        commentsPage.addComment(comments.second);
        commentsPage.checkUserIconIsDisplayed(0);

        expect(commentsPage.getTotalNumberOfComments()).toEqual('Comments (2)');
        expect(commentsPage.getMessage(0)).toEqual(comments.second);
        expect(commentsPage.getUserName(0)).toEqual(userFullName);
        expect(commentsPage.getTime(0)).toEqual('a few seconds ago');
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
        expect(commentsPage.getTime(0)).toEqual('a few seconds ago');
    });
});
