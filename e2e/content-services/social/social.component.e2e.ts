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

import { LoginPage, LikePage, RatePage, UploadActions } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SocialPage } from '../../pages/adf/demo-shell/socialPage';
import { browser } from 'protractor';

describe('Social component', () => {

    const loginPage = new LoginPage();
    const likePage = new LikePage();
    const ratePage = new RatePage();
    const socialPage = new SocialPage();
    const navigationBarPage = new NavigationBarPage();
    const componentOwner = new AcsUserModel();
    const componentVisitor = new AcsUserModel();
    const secondComponentVisitor = new AcsUserModel();
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    const blueLikeColor = ('rgba(33, 150, 243, 1)');
    const greyLikeColor = ('rgba(128, 128, 128, 1)');
    const yellowRatedStarColor = ('rgba(255, 233, 68, 1)');
    const averageStarColor = ('rgba(128, 128, 128, 1)');

    let emptyFile;

    const emptyFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(componentOwner);

        await this.alfrescoJsApi.core.peopleApi.addPerson(componentVisitor);

        await this.alfrescoJsApi.core.peopleApi.addPerson(secondComponentVisitor);

        await this.alfrescoJsApi.login(componentOwner.id, componentOwner.password);

        emptyFile = await uploadActions.uploadFile(emptyFileModel.location, emptyFileModel.name, '-my-');

        await this.alfrescoJsApi.core.nodesApi.updateNode(emptyFile.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: componentVisitor.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }, {
                        authorityId: secondComponentVisitor.getId(),
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await uploadActions.deleteFileOrFolder(emptyFile.entry.id);

    });

    describe('User interaction on their own components', () => {

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(componentOwner);
            await navigationBarPage.clickSocialButton();
        });

        it('[C203006] Should be able to like and unlike their components but not rate them,', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await likePage.clickLike();
            await expect(await likePage.getLikeCounter()).toBe('1');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);
            await ratePage.rateComponent(4);
            await expect(await ratePage.getRatingCounter()).toBe('0');
            await expect(await ratePage.isNotStarRated(4));
            await expect(await ratePage.getUnratedStarColor(4)).toBe(averageStarColor);
            await likePage.clickUnlike();
            await expect(await likePage.getLikeCounter()).toBe('0');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
        });

    });

    describe('User interaction on components that belong to other users', () => {

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(componentVisitor);
            await navigationBarPage.clickSocialButton();
        });

        it('[C260324] Should be able to like and unlike a component', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await expect(await likePage.getLikeCounter()).toEqual('0');
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
            await likePage.clickLike();
            await expect(await likePage.getLikeCounter()).toBe('1');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);
            await likePage.clickUnlike();
            await expect(await likePage.getLikeCounter()).toBe('0');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
        });

        it('[C310198] Should be able to rate and unRate a component', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await expect(await ratePage.getRatingCounter()).toBe('0');
            await ratePage.rateComponent(4);
            await expect(await ratePage.getRatingCounter()).toBe('1');
            await expect(await ratePage.isStarRated(4));
            await expect(await ratePage.getRatedStarColor(4)).toBe(yellowRatedStarColor);
            await ratePage.removeRating(4);
            await expect(await ratePage.getRatingCounter()).toBe('0');
            await expect(await ratePage.isNotStarRated(4));
        });

    });

    describe('Multiple Users interaction', () => {

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(componentVisitor);
            await navigationBarPage.clickSocialButton();
        });

        it('[C310197] Should be able to like, unLike, display total likes', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
            await likePage.clickLike();
            await expect(await likePage.getLikeCounter()).toBe('1');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);

            await loginPage.loginToContentServicesUsingUserModel(secondComponentVisitor);
            await navigationBarPage.clickSocialButton();
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
            await likePage.clickLike();
            await expect(await likePage.getLikeCounter()).toEqual('2');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);
            await likePage.clickUnlike();
            await expect(await likePage.getLikeCounter()).toEqual('1');
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
        });

        it('[C260327] Should be able to rate, unRate, display total ratings, display average rating', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await ratePage.rateComponent(4);
            await expect(await ratePage.getRatingCounter()).toEqual('1');
            await expect(await ratePage.isStarRated(4));
            await expect(await ratePage.getRatedStarColor(4)).toBe(yellowRatedStarColor);

            await loginPage.loginToContentServicesUsingUserModel(secondComponentVisitor);
            await navigationBarPage.clickSocialButton();
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await expect(await ratePage.getRatingCounter()).toEqual('1');
            await expect(await ratePage.getAverageStarColor(4)).toBe(averageStarColor);
            await ratePage.rateComponent(0);
            await expect(await ratePage.getRatingCounter()).toEqual('2');
            await expect(await ratePage.isStarRated(2));
            await ratePage.removeRating(0);
            await expect(await ratePage.getRatingCounter()).toEqual('1');
            await expect(await ratePage.getAverageStarColor(4)).toBe(averageStarColor);
        });
    });
});
