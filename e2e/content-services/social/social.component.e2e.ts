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
    LikePage,
    LoginPage,
    RatePage,
    UploadActions,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { SocialPage } from '../../content-services/pages/social.page';
import { browser } from 'protractor';

describe('Social component', () => {

    const loginPage = new LoginPage();
    const likePage = new LikePage();
    const ratePage = new RatePage();
    const socialPage = new SocialPage();
    const navigationBarPage = new NavigationBarPage();
    const componentOwner = new UserModel();
    const componentVisitor = new UserModel();
    const secondComponentVisitor = new UserModel();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const uploadActions = new UploadActions(apiService);

    const blueLikeColor = ('rgba(33, 150, 243, 1)');
    const greyLikeColor = ('rgba(128, 128, 128, 1)');
    const yellowRatedStarColor = ('rgba(255, 233, 68, 1)');
    const averageStarColor = ('rgba(128, 128, 128, 1)');

    let emptyFile;

    const emptyFileModel = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.TXT_0B.file_path
    });

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(componentOwner);
        await usersActions.createUser(componentVisitor);
        await usersActions.createUser(secondComponentVisitor);

        await apiService.login(componentOwner.email, componentOwner.password);

        emptyFile = await uploadActions.uploadFile(emptyFileModel.location, emptyFileModel.name, '-my-');

        await apiService.getInstance().core.nodesApi.updateNode(emptyFile.entry.id,

            {
                permissions: {
                    locallySet: [{
                        authorityId: componentVisitor.email,
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }, {
                        authorityId: secondComponentVisitor.email,
                        name: 'Consumer',
                        accessStatus: 'ALLOWED'
                    }]
                }
            });
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');
        await uploadActions.deleteFileOrFolder(emptyFile.entry.email);
    });

    describe('User interaction on their own components', () => {
        beforeEach(async () => {
            await loginPage.login(componentOwner.email, componentOwner.password);
            await navigationBarPage.clickSocialButton();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C203006] Should be able to like and unlike their components but not rate them,', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await likePage.clickLike();
            await likePage.checkLikeCounter(1);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);
            await ratePage.rateComponent(4);
            await ratePage.checkRatingCounter(0);
            await expect(await ratePage.isNotStarRated(4));
            await expect(await ratePage.getUnratedStarColor(4)).toBe(averageStarColor);
            await likePage.clickUnlike();
            await likePage.checkLikeCounter(0);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
        });
    });

    describe('User interaction on components that belong to other users', () => {

        beforeEach(async () => {
            await loginPage.login(componentVisitor.email, componentVisitor.password);
            await navigationBarPage.clickSocialButton();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C260324] Should be able to like and unlike a component', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await likePage.checkLikeCounter(0);
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
            await likePage.clickLike();
            await likePage.checkLikeCounter(1);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);
            await likePage.clickUnlike();
            await likePage.checkLikeCounter(0);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
        });

        it('[C310198] Should be able to rate and unRate a component', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);

            await ratePage.checkRatingCounter(0);
            await ratePage.rateComponent(4);
            await ratePage.checkRatingCounter(1);
            await expect(await ratePage.isStarRated(4));
            await expect(await ratePage.getRatedStarColor(4)).toBe(yellowRatedStarColor);
            await ratePage.removeRating(4);
            await ratePage.checkRatingCounter(0);
            await expect(await ratePage.isNotStarRated(4));
        });
    });

    describe('Multiple Users interaction', () => {

        beforeEach(async () => {
            await loginPage.login(componentVisitor.email, componentVisitor.password);
            await navigationBarPage.clickSocialButton();
        });

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        it('[C310197] Should be able to like, unLike, display total likes', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
            await likePage.clickLike();
            await likePage.checkLikeCounter(1);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(secondComponentVisitor.email, secondComponentVisitor.password);
            await navigationBarPage.clickSocialButton();
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
            await likePage.clickLike();
            await likePage.checkLikeCounter(2);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getLikedIconColor()).toBe(blueLikeColor);
            await likePage.clickUnlike();
            await likePage.checkLikeCounter(1);
            await likePage.removeHoverFromLikeButton();
            await expect(await likePage.getUnLikedIconColor()).toBe(greyLikeColor);
        });

        it('[C260327] Should be able to rate, unRate, display total ratings, display average rating', async () => {
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await ratePage.rateComponent(4);
            await ratePage.checkRatingCounter(1);
            await expect(await ratePage.isStarRated(4));
            await expect(await ratePage.getRatedStarColor(4)).toBe(yellowRatedStarColor);

            await navigationBarPage.clickLogoutButton();
            await loginPage.login(secondComponentVisitor.email, secondComponentVisitor.password);
            await navigationBarPage.clickSocialButton();
            await socialPage.writeCustomNodeId(emptyFile.entry.id);
            await expect(await socialPage.getNodeIdFieldValue()).toEqual(emptyFile.entry.id);
            await ratePage.checkRatingCounter(1);
            await expect(await ratePage.getAverageStarColor(4)).toBe(averageStarColor);
            await ratePage.rateComponent(0);
            await ratePage.checkRatingCounter(2);
            await expect(await ratePage.isStarRated(2));
            await ratePage.removeRating(0);
            await ratePage.checkRatingCounter(1);
            await expect(await ratePage.getAverageStarColor(4)).toBe(averageStarColor);
        });
    });
});
