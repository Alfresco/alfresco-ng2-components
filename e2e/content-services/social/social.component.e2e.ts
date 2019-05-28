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

import { LoginPage, LikePage, RatePage } from '@alfresco/adf-testing';

import TestConfig = require('../../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { SocialPage } from '../../pages/adf/demo-shell/socialPage';

describe('Social component', () => {

    const loginPage = new LoginPage();
    const likePage = new LikePage();
    const ratePage = new RatePage();
    const socialPage = new SocialPage();
    const navigationBarPage = new NavigationBarPage();
    const componentOwner = new AcsUserModel();
    const componentVisitor = new AcsUserModel();
    const secondComponentVisitor = new AcsUserModel();
    const uploadActions = new UploadActions();
    const blueLikeColor = ('rgba(33, 150, 243, 1)');
    const greyLikeColor = ('rgba(128, 128, 128, 1)');
    const yellowRatedStarColor = ('rgba(255, 233, 68, 1)');

    let emptyFile;

    const emptyFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(componentOwner);

        await this.alfrescoJsApi.core.peopleApi.addPerson(componentVisitor);

        await this.alfrescoJsApi.core.peopleApi.addPerson(secondComponentVisitor);

        await this.alfrescoJsApi.login(componentOwner.id, componentOwner.password);

        emptyFile = await uploadActions.uploadFile(this.alfrescoJsApi, emptyFileModel.location, emptyFileModel.name, '-my-');

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

        done();
    });

    afterAll(async (done) => {
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, emptyFile.entry.id);
        done();
    });

    describe('Social operations by users on their own components', () => {

        beforeAll(() => {
            loginPage.loginToContentServicesUsingUserModel(componentOwner);
        });

        beforeEach(async () => {
            await navigationBarPage.clickSocialButton();
        });

        it('[C203006] Should be able to like and unlike their components but not rate them,', () => {
            socialPage.writeCustomNodeId(emptyFile.entry.id);
            expect(socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            likePage.clickLike();
            expect(likePage.getLikeCounter()).toBe('1');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getLikedIconColor()).toBe(blueLikeColor);
            ratePage.rateComponent(4);
            expect(ratePage.isNotStarRated(4));
            expect(ratePage.getUnratedStarColor(4)).toBe(greyLikeColor);
            likePage.clickUnlike();
            expect(likePage.getLikeCounter()).toBe('0');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getUnlikedIconColor()).toBe(greyLikeColor);
        });

    });

    describe('Social operations on components that belong to other users', () => {
        beforeAll(() => {
            loginPage.loginToContentServicesUsingUserModel(componentVisitor);
        });

        beforeEach(async () => {
            await navigationBarPage.clickSocialButton();
        });

        it('[C260324] Should be able to like, unlike and rate component', () => {
            socialPage.writeCustomNodeId(emptyFile.entry.id);
            expect(socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            likePage.clickLike();
            expect(likePage.getLikeCounter()).toBe('1');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getLikedIconColor()).toBe(blueLikeColor);
            likePage.clickUnlike();
            expect(likePage.getLikeCounter()).toBe('0');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getUnlikedIconColor()).toBe(greyLikeColor);
            ratePage.rateComponent(4);
            expect(ratePage.isStarRated(4));
            expect(ratePage.getRatedStarColor(4)).toBe(yellowRatedStarColor);
        });

    });

    describe('Social operations by multiple users on other s components', () => {

        beforeAll(() => {
            loginPage.loginToContentServicesUsingUserModel(componentVisitor);
        });

        beforeEach(async () => {
            await navigationBarPage.clickSocialButton();
        });

        it('[C260327] Should be able to display total likes and average rating', async () => {
            socialPage.writeCustomNodeId(emptyFile.entry.id);
            expect(socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            likePage.clickLike();
            expect(likePage.getLikeCounter()).toBe('1');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getLikedIconColor()).toBe(blueLikeColor);
            ratePage.rateComponent(4);
            expect(ratePage.isStarRated(4));
            expect(ratePage.getRatedStarColor(4)).toBe(yellowRatedStarColor);
            await loginPage.loginToContentServicesUsingUserModel(secondComponentVisitor);
            navigationBarPage.clickSocialButton();
            socialPage.writeCustomNodeId(emptyFile.entry.id);
            expect(socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            ratePage.rateComponent(0);
            expect(ratePage.isStarRated(2));
            likePage.clickLike();
            expect(likePage.getLikeCounter()).toEqual('2');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getLikedIconColor()).toBe(blueLikeColor);
            likePage.clickUnlike();
            expect(likePage.getLikeCounter()).toEqual('1');
            likePage.removeHoverFromLikeButton();
            expect(likePage.getUnlikedIconColor()).toBe(greyLikeColor);
        });
    });
});
