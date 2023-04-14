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

import { createApiService,
    LoginPage,
    NotificationHistoryPage,
    StringUtil,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { FolderDialogPage } from '../../core/pages/dialog/folder-dialog.page';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { browser, Key } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Create folder directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const createFolderDialog = new FolderDialogPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const metadataViewPage = new MetadataViewPage();
    let acsUser: UserModel;
    const navigationBarPage = new NavigationBarPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser();

        await loginPage.login(acsUser.username, acsUser.password);

        await contentServicesPage.goToDocumentList();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await browser.actions().sendKeys(Key.ESCAPE).perform();
    });

    afterEach(async () => {
        await browser.actions().sendKeys(Key.ESCAPE).perform();
    });

    it('[C260154] Should not create the folder if cancel button is clicked', async () => {
        const folderName = 'cancelFolder';
        await contentServicesPage.clickOnCreateNewFolder();

        await createFolderDialog.addFolderName(folderName);
        await createFolderDialog.clickOnCancelButton();

        await contentServicesPage.checkContentIsNotDisplayed(folderName);
    });

    it('[C260155] Should enable the Create button only when a folder name is present', async () => {
        const folderName = 'NotEnableFolder';
        await contentServicesPage.clickOnCreateNewFolder();

        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);

        await createFolderDialog.addFolderName(folderName);

        await createFolderDialog.checkCreateUpdateBtnIsEnabled();
    });

    it('[C260156] Should not be possible create two folder with the same name', async () => {
        const folderName = 'duplicate';
        await contentServicesPage.createNewFolder(folderName);

        await contentServicesPage.checkContentIsDisplayed(folderName);

        await contentServicesPage.createNewFolder(folderName);

        await notificationHistoryPage.checkNotifyContains('There\'s already a folder with this name. Try a different name.');
    });

    it('[C260157] Should be possible create a folder under a folder with the same name', async () => {
        const folderName = 'sameSubFolder';

        await contentServicesPage.createNewFolder(folderName);
        await contentServicesPage.checkContentIsDisplayed(folderName);

        await contentServicesPage.openFolder(folderName);

        await contentServicesPage.createNewFolder(folderName);
        await contentServicesPage.checkContentIsDisplayed(folderName);
    });

    it('[C260158] Should be possible add a folder description when create a new folder', async () => {
        const folderName = StringUtil.generateRandomString();
        const description = 'this is the description';

        await contentServicesPage.clickOnCreateNewFolder();

        await createFolderDialog.addFolderName(folderName);
        await createFolderDialog.addFolderDescription(description);

        await createFolderDialog.clickOnCreateUpdateButton();

        await contentServicesPage.checkContentIsDisplayed(folderName);

        await contentServicesPage.metadataContent(folderName);

        await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('this is the description');
    });

    it('[C260159] Should not be possible create a folder with banned character', async () => {
        await contentServicesPage.clickOnCreateNewFolder();

        await createFolderDialog.addFolderName('*');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName('<');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName('>');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName('\\');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName('/');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName('?');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName(':');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
        await createFolderDialog.addFolderName('|');
        await expect(await createFolderDialog.checkCreateUpdateBtnIsEnabled()).toEqual(false);
    });
});
