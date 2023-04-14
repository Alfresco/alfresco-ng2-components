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

import { createApiService, BrowserActions, LoginPage, StringUtil, UserModel, UsersActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { CreateLibraryDialogPage } from '../../core/pages/dialog/create-library-dialog.page';
import { CustomSourcesPage } from '../../core/pages/custom-sources.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { SitesApi } from '@alfresco/js-api';

describe('Create library directive', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const createLibraryDialog = new CreateLibraryDialogPage();
    const customSourcesPage = new CustomSourcesPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    const visibility = {
        public: 'Public',
        private: 'Private',
        moderated: 'Moderated'
    };

    let createSite;

    let acsUser: UserModel;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser();

        const sitesApi = new SitesApi(apiService.getInstance());
        createSite = await sitesApi.createSite({
            title: StringUtil.generateRandomString(20).toLowerCase(),
            visibility: 'PUBLIC'
        });

        await loginPage.login(acsUser.username, acsUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('admin');

        const sitesApi = new SitesApi(apiService.getInstance());
        await sitesApi.deleteSite(createSite.entry.id, { permanent: true });

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
        await expect(await createLibraryDialog.libraryTitle.getText()).toMatch('Create Library');
        await expect(await createLibraryDialog.libraryNameField.isDisplayed()).toBe(true, 'Name input field is not displayed');
        await expect(await createLibraryDialog.libraryIdField.isDisplayed()).toBe(true, 'Library ID field is not displayed');
        await expect(await createLibraryDialog.libraryDescriptionField.isDisplayed()).toBe(true, 'Library description is not displayed');
        await expect(await createLibraryDialog.publicRadioButton.isDisplayed()).toBe(true, 'Public radio button is not displayed');
        await expect(await createLibraryDialog.privateRadioButton.isDisplayed()).toBe(true, 'Private radio button is not displayed');
        await expect(await createLibraryDialog.moderatedRadioButton.isDisplayed()).toBe(true, 'Moderated radio button is not displayed');
        await expect(await createLibraryDialog.createButton.isEnabled()).toBe(false, 'Create button is not disabled');
        await expect(await createLibraryDialog.cancelButton.isEnabled()).toBe(true, 'Cancel button is disabled');
        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.public, 'The default visibility is not public');
    });

    it('[C290159] Should close the dialog when clicking Cancel button', async () => {
        const libraryName = 'cancelLibrary';

        await createLibraryDialog.libraryNameField.typeText(libraryName);
        await createLibraryDialog.cancelButton.click();
        await createLibraryDialog.libraryDialog.waitNotPresent(60000);
    });

    it('[C290160] Should create a public library', async () => {
        const libraryName = StringUtil.generateRandomString();
        const libraryDescription = StringUtil.generateRandomString();

        await createLibraryDialog.libraryNameField.typeText(libraryName);
        await createLibraryDialog.libraryDescriptionField.typeText(libraryDescription);
        await createLibraryDialog.publicRadioButton.click();

        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.public, 'The visibility is not public');

        await createLibraryDialog.createButton.click();
        await createLibraryDialog.libraryDialog.waitNotPresent(60000);

        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectMySitesSourceType();
        await customSourcesPage.checkRowIsDisplayed(libraryName);

        await expect(await customSourcesPage.getStatusCell(libraryName)).toMatch('PUBLIC', 'Wrong library status.');
    });

    it('[C290173] Should create a private library', async () => {
        const libraryName = StringUtil.generateRandomString();
        const libraryDescription = StringUtil.generateRandomString();

        await createLibraryDialog.libraryNameField.typeText(libraryName);
        await createLibraryDialog.libraryDescriptionField.typeText(libraryDescription);
        await createLibraryDialog.privateRadioButton.click();

        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.private, 'The visibility is not private');

        await createLibraryDialog.createButton.click();
        await createLibraryDialog.libraryDialog.waitNotPresent(60000);

        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectMySitesSourceType();
        await customSourcesPage.checkRowIsDisplayed(libraryName);

        await expect(await customSourcesPage.getStatusCell(libraryName)).toMatch('PRIVATE', 'Wrong library status.');
    });

    it('[C290174, C290175] Should create a moderated library with a given Library ID', async () => {
        const libraryName = StringUtil.generateRandomString();
        const libraryId = StringUtil.generateRandomString();
        const libraryDescription = StringUtil.generateRandomString();
        await createLibraryDialog.libraryNameField.typeText(libraryName);
        await createLibraryDialog.libraryIdField.typeText(libraryId);
        await createLibraryDialog.libraryDescriptionField.typeText(libraryDescription);
        await createLibraryDialog.moderatedRadioButton.click();

        await expect(await createLibraryDialog.getSelectedRadio()).toMatch(visibility.moderated, 'The visibility is not moderated');

        await createLibraryDialog.createButton.click();
        await createLibraryDialog.libraryDialog.waitNotPresent(60000);

        await customSourcesPage.navigateToCustomSources();
        await customSourcesPage.selectMySitesSourceType();
        await customSourcesPage.checkRowIsDisplayed(libraryName);

        await expect(await customSourcesPage.getStatusCell(libraryName)).toMatch('MODERATED', 'Wrong library status.');
    });

    it('[C290163] Should disable Create button when a mandatory field is not filled in', async () => {
        const inputValue = StringUtil.generateRandomString();

        await createLibraryDialog.libraryNameField.typeText(inputValue);
        await createLibraryDialog.libraryIdField.clearInput();
        await expect(await createLibraryDialog.createButton.isEnabled()).not.toBe(true, 'The Create button is enabled');
        await createLibraryDialog.libraryNameField.clearInput();

        await createLibraryDialog.libraryIdField.typeText(inputValue);
        await expect(await createLibraryDialog.createButton.isEnabled()).not.toBe(true, 'The Create button is enabled');
        await createLibraryDialog.libraryIdField.clearInput();

        await createLibraryDialog.libraryDescriptionField.typeText(inputValue);
        await expect(await createLibraryDialog.createButton.isEnabled()).not.toBe(true, 'The Create button is enabled');
    });

    it('[C290164] Should auto-fill in the Library Id built from library name', async () => {
        const name: string[] = ['abcd1234', 'ab cd 12 34', 'ab cd&12+34_@link/*'];
        const libraryId: string[] = ['abcd1234', 'ab-cd-12-34', 'ab-cd1234link'];

        for (let i = 0; i < 3; i++) {
            await createLibraryDialog.libraryNameField.typeText(name[i]);
            await createLibraryDialog.libraryIdField.waitHasValue(libraryId[i]);
            await createLibraryDialog.libraryNameField.clearInput();
        }
    });

    it('[C290176] Should not accept special characters for Library Id', async () => {
        const name = 'My Library';
        const libraryId: string[] = ['My New Library', 'My+New+Library123!', '<>'];

        await createLibraryDialog.libraryNameField.typeText(name);

        for (let i = 0; i < 3; i++) {
            await createLibraryDialog.libraryIdField.typeText(libraryId[i]);
            await createLibraryDialog.errorMessage.waitVisible(60000);
            await expect(await createLibraryDialog.errorMessage.getText()).toMatch('Use numbers and letters only');
        }
    });

    it('[C291985] Should not accept less than 2 characters for Library name', async () => {
        const name = 'x';
        const libraryId = 'my-library-id';

        await createLibraryDialog.libraryNameField.typeText(name);
        await createLibraryDialog.libraryIdField.typeText(libraryId);
        await createLibraryDialog.errorMessage.waitVisible(60000);
        await expect(await createLibraryDialog.errorMessage.getText()).toMatch('Title must be at least 2 characters long');
    });

    it('[C291793] Should display error for Name field filled in with spaces only', async () => {
        const name = '    ';
        const libraryId = StringUtil.generateRandomString();

        await createLibraryDialog.libraryNameField.typeText(name);
        await createLibraryDialog.libraryIdField.typeText(libraryId);

        await createLibraryDialog.errorMessage.waitVisible(60000);
        await expect(await createLibraryDialog.errorMessage.getText()).toMatch('Library name can\'t contain only spaces');
    });

    it('[C290177] Should not accept a duplicate Library Id', async () => {
        const name = 'My Library';
        const libraryId = StringUtil.generateRandomString();

        await createLibraryDialog.libraryNameField.typeText(name);
        await createLibraryDialog.libraryIdField.typeText(libraryId);
        await createLibraryDialog.createButton.click();
        await createLibraryDialog.libraryDialog.waitNotPresent(60000);

        await contentServicesPage.openCreateLibraryDialog();

        await createLibraryDialog.libraryNameField.typeText(name);
        await createLibraryDialog.libraryIdField.typeText(libraryId);
        await createLibraryDialog.errorMessage.waitVisible(60000);
        await expect(await createLibraryDialog.errorMessage.getText()).toMatch('This Library ID isn\'t available. Try a different Library ID.');
    });

    it('[C290178] Should accept the same library name but different Library Ids', async () => {
        const name = createSite.entry.title;
        const libraryId = StringUtil.generateRandomString();

        await createLibraryDialog.libraryNameField.typeText(name.toUpperCase());
        await createLibraryDialog.libraryIdField.typeText(libraryId);

        await createLibraryDialog.libraryNameHint.waitVisible();
        await expect(await createLibraryDialog.libraryNameHint.getText()).toMatch('Library name already in use', 'The library name hint is wrong');

        await createLibraryDialog.createButton.click();
        await createLibraryDialog.libraryDialog.waitNotPresent(60000);
    });

    it('[C290179] Should not accept more than the expected characters for input fields', async () => {
        const name = StringUtil.generateRandomString(257);
        const libraryId = StringUtil.generateRandomString(73);
        const libraryDescription = StringUtil.generateRandomString(513);

        await createLibraryDialog.libraryNameField.typeText(name);
        await createLibraryDialog.libraryIdField.typeText(libraryId);
        await createLibraryDialog.libraryDescriptionField.typeText(libraryDescription);

        await createLibraryDialog.publicRadioButton.click();

        await expect(await createLibraryDialog.getErrorMessages(0)).toMatch('Use 256 characters or less for title');
        await expect(await createLibraryDialog.getErrorMessages(1)).toMatch('Use 72 characters or less for the URL name');
        await expect(await createLibraryDialog.getErrorMessages(2)).toMatch('Use 512 characters or less for description');
    });
});
