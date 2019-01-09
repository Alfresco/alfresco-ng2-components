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

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';

import { LoginPage } from '../pages/adf/loginPage';
import { TagPage } from '../pages/adf/tagPage';
import { AppNavigationBarPage } from '../pages/adf/process-services/appNavigationBarPage';

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../actions/ACS/upload.actions';

import { Util } from '../util/util';
import { browser } from 'protractor';

describe('Tag component', () => {

    let loginPage = new LoginPage();
    let tagPage = new TagPage();
    let appNavigationBarPage = new AppNavigationBarPage();

    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();
    let pdfFileModel = new FileModel({ 'name': resources.Files.ADF_DOCUMENTS.PDF.file_name });
    let deleteFile = new FileModel({ 'name': Util.generateRandomString() });
    let sameTag = Util.generateRandomStringToLowerCase();

    let tagList = [
        Util.generateRandomStringToLowerCase(),
        Util.generateRandomStringToLowerCase(),
        Util.generateRandomStringToLowerCase(),
        Util.generateRandomStringToLowerCase()];

    let tags = [
        { tag: 'test-tag-01' }, { tag: 'test-tag-02' }, { tag: 'test-tag-03' }, { tag: 'test-tag-04' }, { tag: 'test-tag-05' },
        { tag: 'test-tag-06' }, { tag: 'test-tag-07' }, { tag: 'test-tag-08' }, { tag: 'test-tag-09' }, { tag: 'test-tag-10' },
        { tag: 'test-tag-11' }, { tag: 'test-tag-12' }, { tag: 'test-tag-13' }, { tag: 'test-tag-14' }, { tag: 'test-tag-15' },
        { tag: 'test-tag-16' }, { tag: 'test-tag-17' }, { tag: 'test-tag-18' }, { tag: 'test-tag-19' }, { tag: 'test-tag-20' },
        { tag: 'test-tag-21' }, { tag: 'test-tag-22' }, { tag: 'test-tag-23' }, { tag: 'test-tag-24' }, { tag: 'test-tag-25' },
        { tag: 'test-tag-26' }, { tag: 'test-tag-27' }, { tag: 'test-tag-28' }, { tag: 'test-tag-29' }, { tag: 'test-tag-30' }];

    let uppercaseTag = Util.generateRandomStringToUpperCase();
    let digitsTag = Util.generateRandomStringDigits();
    let nonLatinTag = Util.generateRandomStringNonLatin();
    let pdfUploadedFile, nodeId;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');

        nodeId = pdfUploadedFile.entry.id;

        let uploadedDeleteFile = await uploadActions.uploadFile(this.alfrescoJsApi, deleteFile.location, deleteFile.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        Object.assign(deleteFile, uploadedDeleteFile.entry);

        await this.alfrescoJsApi.core.tagsApi.addTag(nodeId, tags);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        appNavigationBarPage.clickTagButton();

        done();
    });

    afterAll(async (done) => {
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pdfUploadedFile.entry.id);
        browser.refresh();
        done();
    });

    it('[C260374] Should NOT be possible to add a new tag without Node ID', () => {
        expect(tagPage.getNodeId()).toEqual('');
        expect(tagPage.getNewTagPlaceholder()).toEqual('New Tag');
        expect(tagPage.addTagButtonIsEnabled()).toEqual(false);
        tagPage.checkTagListIsEmpty();
        tagPage.checkTagListByNodeIdIsEmpty();
        expect(tagPage.addNewTagInput('a').addTagButtonIsEnabled()).toEqual(false);
        expect(tagPage.getNewTagInput()).toEqual('a');
    });

    it('[C268151] Should be possible to add a new tag to a Node', () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[0]);

        tagPage.checkTagIsDisplayedInTagList(tagList[0]);
        tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0]);
    });

    it('[C260377] Should NOT be possible to add a tag that already exists', () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(sameTag);
        tagPage.checkTagIsDisplayedInTagList(sameTag);
        tagPage.addTag(sameTag);
        expect(tagPage.getErrorMessage()).toEqual('Tag already exists');
    });

    it('[C260378] Should be possible to add multiple tags', () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[2]);

        browser.driver.sleep(5000); // wait CS return tags

        tagPage.checkTagListIsOrderedAscending();
        tagPage.checkTagListByNodeIdIsOrderedAscending();
        tagPage.checkTagListContentServicesIsOrderedAscending();
    });

    it('[C91326] Should be possible to create a tag with different characters', () => {
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

    it('[C260375] Should be possible to delete a tag', () => {
        let deleteTag = Util.generateRandomStringToUpperCase();

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

    it('[C286290] Should be able to hide the delete option from a tag component', () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[3]);

        tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[3]);
        tagPage.checkDeleteTagFromTagListByNodeIdIsDisplayed(tagList[3]);

        tagPage.clickShowDeleteButtonSwitch();

        tagPage.checkDeleteTagFromTagListByNodeIdIsNotDisplayed(tagList[3]);
    });

    it('[C286472] Should be able to click Show more/less button on List Tags Content Services', () => {
        tagPage.insertNodeId(pdfFileModel.id);

        tagPage.checkShowMoreButtonIsDisplayed();
        tagPage.checkShowLessButtonIsNotDisplayed();

        expect(tagPage.checkTagsOnList()).toEqual(10);

        tagPage.clickShowMoreButton();
        tagPage.checkShowLessButtonIsDisplayed();

        tagPage.clickShowMoreButtonUntilNotDisplayed();
        tagPage.checkShowLessButtonIsDisplayed();
    });

});
