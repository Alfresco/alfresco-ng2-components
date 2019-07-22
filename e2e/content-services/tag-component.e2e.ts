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
import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { TagPage } from '../pages/adf/tagPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import resources = require('../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

describe('Tag component',  () => {

    const loginPage = new LoginPage();
    const tagPage = new TagPage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf.url
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const pdfFileModel = new FileModel({ name: resources.Files.ADF_DOCUMENTS.PDF.file_name });
    const deleteFile = new FileModel({ name: StringUtil.generateRandomString() });
    const sameTag = StringUtil.generateRandomString().toLowerCase();

    const tagList = [
        StringUtil.generateRandomString().toLowerCase(),
        StringUtil.generateRandomString().toLowerCase(),
        StringUtil.generateRandomString().toLowerCase(),
        StringUtil.generateRandomString().toLowerCase()];

    const tags = [
        { tag: 'test-tag-01' }, { tag: 'test-tag-02' }, { tag: 'test-tag-03' }, { tag: 'test-tag-04' }, { tag: 'test-tag-05' },
        { tag: 'test-tag-06' }, { tag: 'test-tag-07' }, { tag: 'test-tag-08' }, { tag: 'test-tag-09' }, { tag: 'test-tag-10' },
        { tag: 'test-tag-11' }];

    const uppercaseTag = StringUtil.generateRandomString().toUpperCase();
    const digitsTag = StringUtil.generateRandomStringDigits();
    const nonLatinTag = StringUtil.generateRandomStringNonLatin();
    let pdfUploadedFile, nodeId;

    beforeAll(async (done) => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        pdfUploadedFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');

        nodeId = pdfUploadedFile.entry.id;

        const uploadedDeleteFile = await uploadActions.uploadFile(deleteFile.location, deleteFile.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        Object.assign(deleteFile, uploadedDeleteFile.entry);

        await this.alfrescoJsApi.core.tagsApi.addTag(nodeId, tags);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    afterAll(async (done) => {
        try {
            await uploadActions.deleteFileOrFolder(pdfUploadedFile.entry.id);
        } catch (error) {
        }
        done();
    });

    it('[C260374] Should NOT be possible to add a new tag without Node ID', async () => {
        navigationBarPage.clickTagButton();

        expect(tagPage.getNodeId()).toEqual('');
        expect(tagPage.getNewTagPlaceholder()).toEqual('New Tag');
        expect(tagPage.addTagButtonIsEnabled()).toEqual(false);
        tagPage.checkTagListIsEmpty();
        tagPage.checkTagListByNodeIdIsEmpty();
        expect(tagPage.addNewTagInput('a').addTagButtonIsEnabled()).toEqual(false);
        expect(tagPage.getNewTagInput()).toEqual('a');
    });

    it('[C268151] Should be possible to add a new tag to a Node', async () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[0]);

        tagPage.checkTagIsDisplayedInTagList(tagList[0]);
        tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0]);
    });

    it('[C260377] Should NOT be possible to add a tag that already exists', async () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(sameTag);
        tagPage.checkTagIsDisplayedInTagList(sameTag);
        tagPage.addTag(sameTag);
        expect(tagPage.getErrorMessage()).toEqual('Tag already exists');
    });

    it('[C91326] Should be possible to create a tag with different characters', async () => {
        tagPage.insertNodeId(pdfFileModel.id);

        tagPage.addTag(uppercaseTag + digitsTag + nonLatinTag);

        browser.driver.sleep(5000); // wait CS return tags

        tagPage.checkTagIsDisplayedInTagList(uppercaseTag.toLowerCase() + digitsTag + nonLatinTag);
        tagPage.checkTagIsDisplayedInTagListByNodeId(uppercaseTag.toLowerCase() + digitsTag + nonLatinTag);

        tagPage.checkTagIsNotDisplayedInTagList(uppercaseTag + digitsTag + nonLatinTag);
    });

    it('[C260375] Should be possible to delete a tag', async () => {
        const deleteTag = StringUtil.generateRandomString().toUpperCase();

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

    it('[C286290] Should be able to hide the delete option from a tag component', async () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[3]);

        tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[3]);
        tagPage.checkDeleteTagFromTagListByNodeIdIsDisplayed(tagList[3]);

        tagPage.clickShowDeleteButtonSwitch();

        tagPage.checkDeleteTagFromTagListByNodeIdIsNotDisplayed(tagList[3]);
    });

    it('[C286472] Should be able to click Show more/less button on List Tags Content Services', async () => {
        tagPage.insertNodeId(pdfFileModel.id);

        tagPage.checkShowMoreButtonIsDisplayed();
        tagPage.checkShowLessButtonIsNotDisplayed();

        expect(tagPage.checkTagsOnList()).toEqual(10);

        tagPage.clickShowMoreButton();
        tagPage.checkShowLessButtonIsDisplayed();

        tagPage.clickShowLessButton();
        tagPage.checkShowLessButtonIsNotDisplayed();
    });

    it('[C260378] Should be possible to add multiple tags', async () => {
        tagPage.insertNodeId(pdfFileModel.id);
        tagPage.addTag(tagList[2]);

        browser.driver.sleep(5000); // wait CS return tags

        tagPage.checkTagListIsOrderedAscending();
        tagPage.checkTagListByNodeIdIsOrderedAscending();
        tagPage.checkTagListContentServicesIsOrderedAscending();
    });

});
