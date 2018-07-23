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

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');

import LoginPage = require('../pages/adf/loginPage');
import TagPage = require('../pages/adf/tagPage');

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import Util = require('../util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

import Util = require('../util/util');

describe('Tag component', () => {

    let loginPage = new LoginPage();
    let tagPage = new TagPage();

    let acsUser = new AcsUserModel();
    let pdfFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let deleteFile = new FileModel({ 'name': Util.generateRandomString() });
    let sameTag = Util.generateRandomStringToLowerCase();
    let tagList = [Util.generateRandomStringToLowerCase(), Util.generateRandomStringToLowerCase()];
    let uppercaseTag = Util.generateRandomStringToUpperCase();
    let digitsTag = Util.generateRandomStringDigits();
    let nonLatinTag = Util.generateRandomStringNonLatin();

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');

        let uploadedDeleteFile = await uploadActions.uploadFile(this.alfrescoJsApi, deleteFile.location, deleteFile.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        Object.assign(deleteFile, uploadedDeleteFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('[C260374] Tag node ID', () => {
        tagPage.goToTagPage();
        expect(tagPage.getNodeId()).toEqual('');
        expect(tagPage.getNewTagPlaceholder()).toEqual('New Tag');
        expect(tagPage.addTagButtonIsEnabled()).toEqual(false);
        tagPage.checkTagListIsEmpty();
        tagPage.checkTagListByNodeIdIsEmpty();
        expect(tagPage.addNewTagInput('a').addTagButtonIsEnabled()).toEqual(false);
        expect(tagPage.getNewTagInput()).toEqual('a');
    });

    it('[C268151] New tag for specific Node ID', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[0]);

        tagPage.checkTagIsDisplayedInTagList(tagList[0]);
        tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0]);
    });

    it('[C260377] Tag name already exists', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(sameTag);
        tagPage.checkTagIsDisplayedInTagList(sameTag);
        tagPage.addTag(sameTag);
        expect(tagPage.getErrorMessage()).toEqual('Tag already exists');
    });

    it('[C260378] Multiple tags', () => {
        tagPage.goToTagPage();
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.checkTagListIsOrderedAscending();
        tagPage.checkTagListByNodeIdIsOrderedAscending();
        tagPage.checkTagListContentServicesIsOrderedAscending();
    });

    it('[C91326] Tag text field', () => {
        tagPage.goToTagPage();

        tagPage.insertNodeId(pdfFileModel.id);

        tagPage.addTag(uppercaseTag);

        tagPage.checkTagIsDisplayedInTagList(uppercaseTag.toLowerCase());
        tagPage.checkTagIsDisplayedInTagListByNodeId(uppercaseTag.toLowerCase());

        tagPage.checkTagIsNotDisplayedInTagList(uppercaseTag);

        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(digitsTag);

        tagPage.checkTagIsDisplayedInTagList(digitsTag);
        tagPage.checkTagIsDisplayedInTagListByNodeId(digitsTag);

        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(nonLatinTag);

        tagPage.checkTagIsDisplayedInTagList(nonLatinTag);
        tagPage.checkTagIsDisplayedInTagListByNodeId(nonLatinTag);
    });

    it('[C260375] Delete tag', () => {
        let deleteTag = Util.generateRandomStringToUpperCase();

        tagPage.goToTagPage();

        tagPage.insertNodeId(deleteFile.id);

        tagPage.addTag(deleteTag);

        tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase());
        tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        tagPage.deleteTagFromTagListByNodeId(deleteTag.toLowerCase());

        tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase());
        tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        tagPage.insertNodeId(deleteFile.id);

        tagPage.addTag(deleteTag);

        tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase());
        tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        tagPage.deleteTagFromTagList(deleteTag.toLowerCase());

        tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase());
        tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase());
    });
});
