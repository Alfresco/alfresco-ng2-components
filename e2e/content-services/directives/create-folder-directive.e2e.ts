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

import { LoginPage, NotificationHistoryPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { FolderDialog } from '../../pages/adf/dialog/folderDialog';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser, Key } from 'protractor';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Create folder directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const createFolderDialog = new FolderDialog();
    const notificationHistoryPage = new NotificationHistoryPage();
    const metadataViewPage = new MetadataViewPage();
    const acsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

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

        await createFolderDialog.checkCreateUpdateBtnIsDisabled();

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

        await contentServicesPage.doubleClickRow(folderName);

        await contentServicesPage.createNewFolder(folderName);
        await contentServicesPage.checkContentIsDisplayed(folderName);
    });

    it('[C260158] Should be possible add a folder description when create a new folder', async () => {
        const folderName = 'folderDescription';
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
        await browser.refresh();
        await contentServicesPage.clickOnCreateNewFolder();

        await createFolderDialog.addFolderName('*');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName('<');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName('>');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName('\\');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName('/');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName('?');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName(':');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
        await createFolderDialog.addFolderName('|');
        await createFolderDialog.checkCreateUpdateBtnIsDisabled();
    });
});
