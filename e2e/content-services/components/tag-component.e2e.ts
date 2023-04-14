/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FileModel } from '../../models/ACS/file.model';
import { createApiService,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { TagPage } from '../../content-services/pages/tag.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { browser } from 'protractor';
import { TagsApi } from '@alfresco/js-api';

describe('Tag component', () => {

    const loginPage = new LoginPage();
    const tagPage = new TagPage();
    const navigationBarPage = new NavigationBarPage();

    let acsUser: UserModel;
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const tagsApi = new TagsApi(apiService.getInstance());

    const uploadActions = new UploadActions(apiService);
    const pdfFileModel = new FileModel({ name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name });
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

    let pdfUploadedFile; let nodeId;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser();

        await apiService.login(acsUser.username, acsUser.password);

        pdfUploadedFile = await uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-');

        nodeId = pdfUploadedFile.entry.id;

        const uploadedDeleteFile = await uploadActions.uploadFile(deleteFile.location, deleteFile.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        Object.assign(deleteFile, uploadedDeleteFile.entry);

        await tagsApi.createTagForNode(nodeId, tags);

        await loginPage.login(acsUser.username, acsUser.password);
        await navigationBarPage.clickTagButton();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await apiService.loginWithProfile('admin');
        await uploadActions.deleteFileOrFolder(pdfUploadedFile.entry.id);
    });

    it('[C268151] Should be possible to add a new tag to a Node', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(tagList[0]);

        await tagPage.checkTagIsDisplayedInTagList(tagList[0]);
        await tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[0]);
    });

    it('[C260377] Should NOT be possible to add a tag that already exists', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(sameTag);
        await tagPage.checkTagIsDisplayedInTagList(sameTag);
        await tagPage.addTag(sameTag);
        await expect(await tagPage.errorMessage.getText()).toEqual('Tag already exists');
    });

    it('[C260375] Should be possible to delete a tag', async () => {
        const deleteTag = StringUtil.generateRandomString().toUpperCase();

        await tagPage.insertNodeId(deleteFile.id);

        await tagPage.addTag(deleteTag);

        await tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.deleteTagFromTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.insertNodeId(deleteFile.id);

        await tagPage.addTag(deleteTag);

        await tagPage.checkTagIsDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsDisplayedInTagListByNodeId(deleteTag.toLowerCase());

        await tagPage.deleteTagFromTagList(deleteTag.toLowerCase());

        await tagPage.checkTagIsNotDisplayedInTagList(deleteTag.toLowerCase());
        await tagPage.checkTagIsNotDisplayedInTagListByNodeId(deleteTag.toLowerCase());
    });

    it('[C286290] Should be able to hide the delete option from a tag component', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);
        await tagPage.addTag(tagList[3]);

        await tagPage.checkTagIsDisplayedInTagListByNodeId(tagList[3]);
        await tagPage.checkDeleteTagFromTagListByNodeIdIsDisplayed(tagList[3]);

        await tagPage.showDeleteButton.click();

        await tagPage.checkDeleteTagFromTagListByNodeIdIsNotDisplayed(tagList[3]);
    });

    it('[C286472] Should be able to click Show more/less button on List Tags Content Services', async () => {
        await tagPage.insertNodeId(pdfFileModel.id);

        await tagPage.showMoreButton.waitVisible();
        await tagPage.showLessButton.waitNotVisible();

        await expect(await tagPage.tagsOnPage.count()).toEqual(10);

        await tagPage.showMoreButton.click();
        await tagPage.showLessButton.waitVisible();

        await tagPage.showLessButton.click();
        await tagPage.showLessButton.waitNotVisible();
    });

});
