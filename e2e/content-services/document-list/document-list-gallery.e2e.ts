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
import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import { LoginPage, StringUtil } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { FileModel } from '../../models/ACS/fileModel';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const uploadActions = new UploadActions();
    let acsUser = null;
    const navBar = new NavigationBarPage();

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

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
            'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
        });

        const testFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.TEST.file_name,
            'location': resources.Files.ADF_DOCUMENTS.TEST.file_location
        });

        const docxFile = new FileModel({
            'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        const folderName = `MEESEEKS_${StringUtil.generateRandomString(5)}_LOOK_AT_ME`;
        let filePdfNode, fileTestNode, fileDocxNode, folderNode, filePDFSubNode;

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            funnyUser = await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
            await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
            filePdfNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, '-my-');
            fileTestNode = await uploadActions.uploadFile(this.alfrescoJsApi, testFile.location, testFile.name, '-my-');
            fileDocxNode = await uploadActions.uploadFile(this.alfrescoJsApi, docxFile.location, docxFile.name, '-my-');
            folderNode = await uploadActions.createFolder(this.alfrescoJsApi, folderName, '-my-');
            filePDFSubNode = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFile.location, pdfFile.name, folderNode.entry.id);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            done();
        });

        beforeEach(async () => {
            navBar.clickHomeButton();
            contentServicesPage.goToDocumentList();
            contentServicesPage.clickGridViewButton();
            contentServicesPage.checkCardViewContainerIsDisplayed();
        });

        it('[C280016] Should be able to choose Gallery View', () => {
            expect(contentServicesPage.getCardElementShowedInPage()).toBe(4);
        });

        it('[C280023] Gallery Card should show details', () => {
            expect(contentServicesPage.getDocumentCardIconForElement(folderName)).toContain('/assets/images/ft_ic_folder.svg');
            expect(contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
            expect(contentServicesPage.getDocumentCardIconForElement(docxFile.name)).toContain('/assets/images/ft_ic_ms_word.svg');
            expect(contentServicesPage.getDocumentCardIconForElement(testFile.name)).toContain('/assets/images/ft_ic_document.svg');
            contentServicesPage.checkMenuIsShowedForElementIndex(0);
            contentServicesPage.checkMenuIsShowedForElementIndex(1);
            contentServicesPage.checkMenuIsShowedForElementIndex(2);
            contentServicesPage.checkMenuIsShowedForElementIndex(3);
        });

        it('[C280069] Gallery Card should show attributes', () => {
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.DISPLAY_NAME);
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.SIZE);
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED_BY);
            contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED);

            expect(contentServicesPage.getAttributeValueForElement(folderName, cardProperties.DISPLAY_NAME)).toBe(folderName);
            expect(contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED)).toMatch(/(ago|few)/);

            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.DISPLAY_NAME)).toBe(pdfFile.name);
            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.SIZE)).toBe(`105.02 KB`);
            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);

            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.DISPLAY_NAME)).toBe(docxFile.name);
            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.SIZE)).toBe(`81.05 KB`);
            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);

            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.DISPLAY_NAME)).toBe(testFile.name);
            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.SIZE)).toBe(`14 Bytes`);
            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED_BY)).toBe(`${funnyUser.entry.firstName} ${funnyUser.entry.lastName}`);

            expect(contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED)).toMatch(/(ago|few)/);
        });

        it('[C280129] Should keep Gallery View when accessing a folder', () => {
            contentServicesPage.navigateToCardFolder(folderName);

            expect(contentServicesPage.getCardElementShowedInPage()).toBe(1);
            expect(contentServicesPage.getDocumentCardIconForElement(pdfFile.name)).toContain('/assets/images/ft_ic_pdf.svg');
        });

        it('[C280130] Should be able to go back to List View', () => {
            contentServicesPage.clickGridViewButton();
            contentServicesPage.checkAcsContainer();
            contentServicesPage.doubleClickRow(folderName);
            contentServicesPage.checkRowIsDisplayed(pdfFile.name);
        });

        it('[C261993] Should be able to sort Gallery Cards by display name', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.DISPLAY_NAME);
            contentServicesPage.checkListIsSortedByNameColumn('asc');
        });

        it('[C261994] Should be able to sort Gallery Cards by size', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.SIZE);
            contentServicesPage.checkListIsSortedBySizeColumn('asc');
        });

        it('[C261995] Should be able to sort Gallery Cards by author', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED_BY);
            contentServicesPage.checkListIsSortedByAuthorColumn('asc');
        });

        it('[C261996] Should be able to sort Gallery Cards by created date', () => {
            contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED);
            contentServicesPage.checkListIsSortedByCreatedColumn('asc');
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
            if (filePdfNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, filePdfNode.entry.id);
            }
            if (fileTestNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileTestNode.entry.id);
            }
            if (fileDocxNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, fileDocxNode.entry.id);
            }
            if (filePDFSubNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, filePDFSubNode.entry.id);
            }
            if (folderNode) {
                await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, folderNode.entry.id);
            }
            done();
        });
    });

});
