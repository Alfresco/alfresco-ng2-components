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

import { LoginPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { CreateFolderDialog } from '../../pages/adf/dialog/createFolderDialog';
import { NotificationPage } from '../../pages/adf/notificationPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser, Key } from 'protractor';

describe('Create folder directive', function () {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const createFolderDialog = new CreateFolderDialog();
    const notificationPage = new NotificationPage();
    const metadataViewPage = new MetadataViewPage();

    const acsUser = new AcsUserModel();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        done();
    });

    beforeEach(async (done) => {
        await browser.actions().sendKeys(Key.ESCAPE).perform();
        done();
    });

    afterEach(async (done) => {
        await browser.actions().sendKeys(Key.ESCAPE).perform();
        done();
    });

    it('[C260154] Should not create the folder if cancel button is clicked', () => {
        const folderName = 'cancelFolder';
        contentServicesPage.clickOnCreateNewFolder();

        createFolderDialog.addFolderName(folderName);
        createFolderDialog.clickOnCancelButton();

        contentServicesPage.checkContentIsNotDisplayed(folderName);
    });

    it('[C260155] Should enable the Create button only when a folder name is present', () => {
        const folderName = 'NotEnableFolder';
        contentServicesPage.clickOnCreateNewFolder();

        createFolderDialog.checkCreateBtnIsDisabled();

        createFolderDialog.addFolderName(folderName);

        createFolderDialog.checkCreateBtnIsEnabled();
    });

    it('[C260156] Should not be possible create two folder with the same name', () => {
        const folderName = 'duplicate';
        contentServicesPage.createNewFolder(folderName);

        contentServicesPage.checkContentIsDisplayed(folderName);

        contentServicesPage.createNewFolder(folderName);

        notificationPage.checkNotifyContains('There\'s already a folder with this name. Try a different name.');
    });

    it('[C260157] Should be possible create a folder under a folder with the same name', () => {
        const folderName = 'sameSubFolder';

        contentServicesPage.createNewFolder(folderName);
        contentServicesPage.checkContentIsDisplayed(folderName);

        contentServicesPage.doubleClickRow(folderName);

        contentServicesPage.createNewFolder(folderName);
        contentServicesPage.checkContentIsDisplayed(folderName);
    });

    it('[C260158] Should be possible add a folder description when create a new folder', () => {
        const folderName = 'folderDescription';
        const description = 'this is the description';

        contentServicesPage.clickOnCreateNewFolder();

        createFolderDialog.addFolderName(folderName);
        createFolderDialog.addFolderDescription(description);

        createFolderDialog.clickOnCreateButton();

        contentServicesPage.checkContentIsDisplayed(folderName);

        contentServicesPage.metadataContent(folderName);

        expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('this is the description');
    });

    it('[C260159] Should not be possible create a folder with banned character', () => {
        browser.refresh();
        contentServicesPage.clickOnCreateNewFolder();

        createFolderDialog.addFolderName('*');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName('<');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName('>');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName('\\');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName('/');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName('?');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName(':');
        createFolderDialog.checkCreateBtnIsDisabled();
        createFolderDialog.addFolderName('|');
        createFolderDialog.checkCreateBtnIsDisabled();
    });
});
