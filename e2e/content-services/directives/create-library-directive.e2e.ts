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

import { LoginPage, BrowserActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { CreateLibraryDialog } from '../../pages/adf/dialog/createLibraryDialog';
import { CustomSources } from '../../pages/adf/demo-shell/customSourcesPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { browser } from 'protractor';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { StringUtil } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Create library directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const createLibraryDialog = new CreateLibraryDialog();
    const customSourcesPage = new CustomSources();
    const navigationBarPage = new NavigationBarPage();

    const visibility = {
        public: 'Public',
        private: 'Private',
        moderated: 'Moderated'
    };

    let createSite;

    const acsUser = new AcsUserModel();

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        createSite = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(20).toLowerCase(),
            visibility: 'PUBLIC'
        });

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await contentServicesPage.goToDocumentList();
        await contentServicesPage.openCreateLibraryDialog();

    });

    afterEach(async () => {
        await BrowserActions.closeMenuAndDialogs();
    });

    it('[C290158] Should display the Create Library defaults', async () => {
        await expect(await createLibraryDialog.getTitle()).toMatch('Create Library');
        await expect(await createLibraryDialog.isNameDisplayed()).toBe(true, 'Name input field is not displayed');
        await expect(await createLibraryDialog.isLibraryIdDisplayed()).toBe(true, 'Library ID field is not displayed');
        await expect(await createLibraryDialog.isDescriptionDisplayed()).toBe(true, 'Library description is not displayed');
        await expect(await createLibraryDialog.isPublicDisplayed()).toBe(true, 'Public radio button is not displayed');
        await expect(await createLibraryDialog.isPrivateDisplayed()).toBe(true, 'Private radio button is not displayed');
        await expect(await createLibraryDialog.isModeratedDisplayed()).toBe(true, 'Moderated radio button is not displayed');
        await expect(await createLibraryDialog.isCreateEnabled()).toBe(false, 'Create button is not disabled');
        await expect(await createLibraryDialog.isCancelEnabled()).toBe(true, 'Cancel button is disabled');
        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.public, 'The default visibility is not public');
    });

    it('[C290159] Should close the dialog when clicking Cancel button', async () => {
        const libraryName = 'cancelLibrary';

        await createLibraryDialog.typeLibraryName(libraryName);

        await createLibraryDialog.clickCancel();

        await createLibraryDialog.waitForDialogToClose();
    });

    it('[C290160] Should create a public library', async () => {
        const libraryName = StringUtil.generateRandomString();
        const libraryDescription = StringUtil.generateRandomString();
        await createLibraryDialog.typeLibraryName(libraryName);
        await createLibraryDialog.typeLibraryDescription(libraryDescription);
        await createLibraryDialog.selectPublic();

        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.public, 'The visibility is not public');

        await createLibraryDialog.clickCreate();
        await createLibraryDialog.waitForDialogToClose();

        await expect(await createLibraryDialog.isDialogOpen()).not.toBe(true, 'The Create Library dialog is not closed');

        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectMySitesSourceType();
        await customSourcesPage.checkRowIsDisplayed(libraryName);

        await expect(await customSourcesPage.getStatusCell(libraryName)).toMatch('PUBLIC', 'Wrong library status.');
    });

    it('[C290173] Should create a private library', async () => {
        const libraryName = StringUtil.generateRandomString();
        const libraryDescription = StringUtil.generateRandomString();
        await createLibraryDialog.typeLibraryName(libraryName);
        await createLibraryDialog.typeLibraryDescription(libraryDescription);
        await createLibraryDialog.selectPrivate();

        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.private, 'The visibility is not private');

        await createLibraryDialog.clickCreate();
        await createLibraryDialog.waitForDialogToClose();

        await expect(await createLibraryDialog.isDialogOpen()).not.toBe(true, 'The Create Library dialog is not closed');

        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectMySitesSourceType();
        await customSourcesPage.checkRowIsDisplayed(libraryName);

        await expect(await customSourcesPage.getStatusCell(libraryName)).toMatch('PRIVATE', 'Wrong library status.');
    });

    it('[C290174, C290175] Should create a moderated library with a given Library ID', async () => {
        const libraryName = StringUtil.generateRandomString();
        const libraryId = StringUtil.generateRandomString();
        const libraryDescription = StringUtil.generateRandomString();
        await createLibraryDialog.typeLibraryName(libraryName);
        await createLibraryDialog.typeLibraryId(libraryId);
        await createLibraryDialog.typeLibraryDescription(libraryDescription);
        await createLibraryDialog.selectModerated();

        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.moderated, 'The visibility is not moderated');

        await createLibraryDialog.clickCreate();
        await createLibraryDialog.waitForDialogToClose();

        await expect(await createLibraryDialog.isDialogOpen()).not.toBe(true, 'The Create Library dialog is not closed');

        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectMySitesSourceType();
        await customSourcesPage.checkRowIsDisplayed(libraryName);

        await expect(await customSourcesPage.getStatusCell(libraryName)).toMatch('MODERATED', 'Wrong library status.');
    });

    it('[C290163] Should disable Create button when a mandatory field is not filled in', async () => {
        const inputValue = StringUtil.generateRandomString();

        await createLibraryDialog.typeLibraryName(inputValue);
        await createLibraryDialog.clearLibraryId();
        await expect(await createLibraryDialog.isCreateEnabled()).not.toBe(true, 'The Create button is enabled');
        await createLibraryDialog.clearLibraryName();

        await createLibraryDialog.typeLibraryId(inputValue);
        await expect(await createLibraryDialog.isCreateEnabled()).not.toBe(true, 'The Create button is enabled');
        await createLibraryDialog.clearLibraryId();

        await createLibraryDialog.typeLibraryDescription(inputValue);
        await expect(await createLibraryDialog.isCreateEnabled()).not.toBe(true, 'The Create button is enabled');
    });

    it('[C290164] Should auto-fill in the Library Id built from library name', async () => {
        const name: string[] = ['abcd1234', 'ab cd 12 34', 'ab cd&12+34_@link/*'];
        const libraryId: string[] = ['abcd1234', 'ab-cd-12-34', 'ab-cd1234link'];

        for (let i = 0; i < 3; i++) {
            await createLibraryDialog.typeLibraryName(name[i]);
            await expect(await createLibraryDialog.getLibraryIdText()).toMatch(libraryId[i]);
            await createLibraryDialog.clearLibraryName();
        }
    });

    it('[C290176] Should not accept special characters for Library Id', async () => {
        const name = 'My Library';
        const libraryId: string[] = ['My New Library', 'My+New+Library123!', '<>'];

        await createLibraryDialog.typeLibraryName(name);

        for (let i = 0; i < 3; i++) {
            await createLibraryDialog.typeLibraryId(libraryId[i]);
            await expect(await createLibraryDialog.isErrorMessageDisplayed()).toBe(true, 'Error message is not displayed');
            await expect(await createLibraryDialog.getErrorMessage()).toMatch('Use numbers and letters only');
        }
    });

    it('[C291985] Should not accept less than 2 characters for Library name', async () => {
        const name = 'x';
        const libraryId = 'my-library-id';

        await createLibraryDialog.typeLibraryName(name);
        await createLibraryDialog.typeLibraryId(libraryId);
        await expect(await createLibraryDialog.isErrorMessageDisplayed()).toBe(true, 'Error message is not displayed');
        await expect(await createLibraryDialog.getErrorMessage()).toMatch('Title must be at least 2 characters long');
    });

    it('[C291793] Should display error for Name field filled in with spaces only', async () => {
        const name = '    ';
        const libraryId = StringUtil.generateRandomString();

        await createLibraryDialog.typeLibraryName(name);
        await createLibraryDialog.typeLibraryId(libraryId);

        await expect(await createLibraryDialog.isErrorMessageDisplayed()).toBe(true, 'Error message is not displayed');
        await expect(await createLibraryDialog.getErrorMessage()).toMatch("Library name can't contain only spaces");
    });

    it('[C290177] Should not accept a duplicate Library Id', async () => {
        const name = 'My Library';
        const libraryId = StringUtil.generateRandomString();

        await createLibraryDialog.typeLibraryName(name);
        await createLibraryDialog.typeLibraryId(libraryId);
        await createLibraryDialog.clickCreate();
        await createLibraryDialog.waitForDialogToClose();

        await contentServicesPage.openCreateLibraryDialog();

        await createLibraryDialog.typeLibraryName(name);
        await createLibraryDialog.typeLibraryId(libraryId);
        await expect(await createLibraryDialog.isErrorMessageDisplayed()).toBe(true, 'Error message is not displayed');
        await expect(await createLibraryDialog.getErrorMessage()).toMatch("This Library ID isn't available. Try a different Library ID.");
    });

    it('[C290178] Should accept the same library name but different Library Ids', async () => {
        const name = createSite.entry.title;
        const libraryId = StringUtil.generateRandomString();

        await createLibraryDialog.typeLibraryName(name.toUpperCase());
        await createLibraryDialog.typeLibraryId(libraryId);

        await createLibraryDialog.waitForLibraryNameHint();
        await expect(await createLibraryDialog.getLibraryNameHint()).toMatch('Library name already in use', 'The library name hint is wrong');

        await createLibraryDialog.clickCreate();
        await createLibraryDialog.waitForDialogToClose();

        await expect(await createLibraryDialog.isDialogOpen()).not.toBe(true, 'The Create library dialog remained open');
    });

    it('[C290179] Should not accept more than the expected characters for input fields', async () => {
        const name = StringUtil.generateRandomString(257);
        const libraryId = StringUtil.generateRandomString(73);
        const libraryDescription = StringUtil.generateRandomString(513);

        await createLibraryDialog.typeLibraryName(name);
        await createLibraryDialog.typeLibraryId(libraryId);
        await createLibraryDialog.typeLibraryDescription(libraryDescription);

        await createLibraryDialog.selectPublic();

        await expect(await createLibraryDialog.getErrorMessages(0)).toMatch('Use 256 characters or less for title');
        await expect(await createLibraryDialog.getErrorMessages(1)).toMatch('Use 72 characters or less for the URL name');
        await expect(await createLibraryDialog.getErrorMessages(2)).toMatch('Use 512 characters or less for description');
    });
});
