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

import { ContentServicesPage } from '../../core/pages/content-services.page';
import { browser } from 'protractor';
import { createApiService, LoginPage, StringUtil, UploadActions, UsersActions } from '@alfresco/adf-testing';
import { FileModel } from '../../models/ACS/file.model';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);
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

        const pdfFile = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.PDF.file_path
        });

        const testFile = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.TEST.file_path
        });

        const docxFile = new FileModel({
            name: browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: browser.params.resources.Files.ADF_DOCUMENTS.DOCX.file_path
        });
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode; let fileTestNode; let fileDocxNode; let folderNode; let filePDFSubNode;

        beforeAll(async () => {
            await apiService.loginWithProfile('admin');
            acsUser = await usersActions.createUser();
            await apiService.login(acsUser.username, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.createFolder(folderName, '-my-');
            filePDFSubNode = await uploadActions.uploadFile(pdfFile.location, pdfFile.name, folderNode.entry.id);

            await loginPage.login(acsUser.username, acsUser.password);
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();

            await apiService.loginWithProfile('admin');
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
            await expect(await contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED_BY)).toBe(`${acsUser.firstName} ${acsUser.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED)).toMatch(/(ago|few)/);

            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.DISPLAY_NAME)).toBe(pdfFile.name);
            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.SIZE)).toBe(`105.02 KB`);
            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED_BY)).toBe(`${acsUser.firstName} ${acsUser.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);

            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.DISPLAY_NAME)).toBe(docxFile.name);
            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.SIZE)).toBe(`11.81 KB`);
            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED_BY))
                .toBe(`${acsUser.firstName} ${acsUser.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);

            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.DISPLAY_NAME)).toBe(testFile.name);
            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.SIZE)).toBe(`14 Bytes`);
            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED_BY))
                .toBe(`${acsUser.firstName} ${acsUser.lastName}`);

            await expect(await contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);
        });

        // eslint-disable-next-line ban/ban
        xit('[C280129] Should keep Gallery View when accessing a folder', async () => {
            await contentServicesPage.navigateToCardFolder(folderName);

            await expect(await contentServicesPage.getCardElementShowedInPage()).toBe(1);
            await expect(await contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
        });

        it('[C280130] Should be able to go back to List View', async () => {
            await contentServicesPage.clickGridViewButton();
            await contentServicesPage.checkAcsContainer();
            await contentServicesPage.openFolder(folderName);
            await contentServicesPage.checkRowIsDisplayed(pdfFile.name);
        });

        it('[C261993] Should be able to sort Gallery Cards by display name', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.DISPLAY_NAME);
            await contentServicesPage.checkListIsSortedByNameColumn('asc');
        });

        it('[C261995] Should be able to sort Gallery Cards by author', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED_BY);
            await contentServicesPage.checkListIsSortedByAuthorColumn('asc');
        });

        it('[C261996] Should be able to sort Gallery Cards by created date', async () => {
            await contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED);
            await contentServicesPage.checkListIsSortedByCreatedColumn('asc');
        });
   });
});
