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

import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { LoginPage, StringUtil, UploadActions } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { FileModel } from '../../models/ACS/fileModel';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    let acsUser = null;
    const navigationBarPage = new NavigationBarPage();

    describe('Gallery View', () => {

        const cardProperties = {
            DISPLAY_NAME: 'Display name',
            SIZE: 'Size',
            LOCK: 'Lock',
            CREATED_BY: 'Created by',
            CREATED: 'Created'
        };

        let funnyUser;

        const pdfFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });

        const testFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const docxFile = new FileModel({
            name: resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode, fileTestNode, fileDocxNode, folderNode, filePDFSubNode;

        beforeAll(async () => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            funnyUser = await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.createFolder(folderName, '-my-');
            filePDFSubNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, folderNode.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await navigationBarPage.clickHomeButton();
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.clickGridViewButton();
            await contentServicesPage.checkCardViewContainerIsDisplayed();
        });

        it('[C280016] Should be able to choose Gallery View', async () => {
            await expect(await contentServicesPage.getCardElementShowedInPage()).toBe(4);
        });

        it('[C280023] Gallery Card should show details', async () => {
            await expect(await contentServicesPage.getDocumentCardIconForElement(folderName)).toContain('/assets/images/ft_ic_folder.svg');
            await expect(await contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
            await expect(await contentServicesPage.getDocumentCardIconForElement(docxFile.name)).toContain('/assets/images/ft_ic_ms_word.svg');
            await expect(await contentServicesPage.getDocumentCardIconForElement(testFile.name)).toContain('/assets/images/ft_ic_document.svg');
            await contentServicesPage.checkMenuIsShowedForElementIndex(0);
            await contentServicesPage.checkMenuIsShowedForElementIndex(1);
            await contentServicesPage.checkMenuIsShowedForElementIndex(2);
            await contentServicesPage.checkMenuIsShowedForElementIndex(3);
        });

        it('[C280069] Gallery Card should show attributes', async () => {
            await contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.DISPLAY_NAME);
            await contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.SIZE);
            await contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED_BY);
            await contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED);

            await expect(await contentServicesPage.getAttributeValueForElement(folderName, cardProperties.DISPLAY_NAME)).toBe(folderName);
            await expect(await contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED)).toMatch(/(ago|few)/);

            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.DISPLAY_NAME)).toBe(pdfFile.name);
            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.SIZE)).toBe(`105.02 KB`);
            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);

            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.DISPLAY_NAME)).toBe(docxFile.name);
            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.SIZE)).toBe(`81.05 KB`);
            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED_BY))
                .toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);

            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.DISPLAY_NAME)).toBe(testFile.name);
            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.SIZE)).toBe(`14 Bytes`);
            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED_BY))
                .toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);
        });

        it('[C280129] Should keep Gallery View when accessing a folder', async () => {
            await contentServicesPage.navigateToCardFolder(folderName);

            await expect(await contentServicesPage.getCardElementShowedInPage()).toBe(1);
            await expect(await contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
        });

        it('[C280130] Should be able to go back to List View', async () => {
            await contentServicesPage.clickGridViewButton();
            await contentServicesPage.checkAcsContainer();
            await contentServicesPage.doubleClickRow(folderName);
            await contentServicesPage.checkRowIsDisplayed(pdfFile.name);
        });

        it('[C261993] Should be able to sort Gallery Cards by display name', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.DISPLAY_NAME);
            await contentServicesPage.checkListIsSortedByNameColumn('asc');
        });

        it('[C261994] Should be able to sort Gallery Cards by size', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.SIZE);
            await contentServicesPage.checkListIsSortedBySizeColumn('asc');
        });

        it('[C261995] Should be able to sort Gallery Cards by author', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED_BY);
            await contentServicesPage.checkListIsSortedByAuthorColumn('asc');
        });

        it('[C261996] Should be able to sort Gallery Cards by created date', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED);
            await contentServicesPage.checkListIsSortedByCreatedColumn('asc');
        });

        afterAll(async () => {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            if (filePdfNode) {
                await uploadActions.deleteFileOrFolder(filePdfNode.entry.id);
            }
            if (fileTestNode) {
                await uploadActions.deleteFileOrFolder(fileTestNode.entry.id);
            }
            if (fileDocxNode) {
                await uploadActions.deleteFileOrFolder(fileDocxNode.entry.id);
            }
            if (filePDFSubNode) {
                await uploadActions.deleteFileOrFolder(filePDFSubNode.entry.id);
            }
            if (folderNode) {
                await uploadActions.deleteFileOrFolder(folderNode.entry.id);
            }

        });
    });

});
