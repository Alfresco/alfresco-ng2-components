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

import {
    createApiService,
    BrowserActions,
    LocalStorageUtil,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { format } from 'date-fns';

describe('Metadata component', () => {
    const METADATA = {
        DATA_FORMAT: 'PP',
        TITLE: 'Details',
        COMMENTS_TAB: 'COMMENTS',
        PROPERTY_TAB: 'PROPERTIES',
        DEFAULT_ASPECT: 'Properties',
        MORE_INFO_BUTTON: 'More information',
        LESS_INFO_BUTTON: 'Less information',
        ARROW_DOWN: 'keyboard_arrow_down',
        ARROW_UP: 'keyboard_arrow_up',
        EDIT_BUTTON_TOOLTIP: 'Edit'
    };

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();

    let acsUser: UserModel;

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });

    const apiService = createApiService();
    const uploadActions = new UploadActions(apiService);
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();
        await apiService.login(acsUser.username, acsUser.password);
        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');
        Object.assign(pngFileModel, pngUploadedFile.entry);
        pngFileModel.update(pngUploadedFile.entry);
    });

    describe('Viewer Metadata', () => {
        beforeAll(async () => {
            await loginPage.login(acsUser.username, acsUser.password);
            await navigationBarPage.navigateToContentServices();
            await contentServicesPage.waitForTableBody();
            await LocalStorageUtil.setConfigField(
                'content-metadata',
                JSON.stringify({
                    presets: {
                        default: {
                            'exif:exif': '*'
                        }
                    }
                })
            );
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
        });

        beforeEach(async () => {
            await viewerPage.viewFile(pngFileModel.name);
            await viewerPage.checkFileIsLoaded();
        });

        afterEach(async () => {
            await viewerPage.clickCloseButton();
            await contentServicesPage.waitForTableBody();
        });

        it("[C245652] Should be possible to display a file's properties", async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();

            const title = await metadataViewPage.getTitle();
            const activeTab = await viewerPage.getActiveTab();
            const expandedAspectName = await metadataViewPage.getExpandedAspectName();
            const name = await metadataViewPage.getName();
            const creator = await metadataViewPage.getCreator();
            const createdDate = await metadataViewPage.getCreatedDate();
            const modifier = await metadataViewPage.getModifier();
            const modifiedDate = await metadataViewPage.getModifiedDate();
            const mimeTypeName = await metadataViewPage.getMimetypeName();
            const size = await metadataViewPage.getSize();

            expect(title).toEqual(METADATA.TITLE);
            expect(activeTab).toEqual(METADATA.PROPERTY_TAB);
            expect(expandedAspectName).toEqual(METADATA.DEFAULT_ASPECT);
            expect(name).toEqual(pngFileModel.name);
            expect(creator).toEqual(pngFileModel.getCreatedByUser().displayName);
            expect(createdDate).toEqual(format(new Date(pngFileModel.createdAt), METADATA.DATA_FORMAT), pngFileModel.createdAt);
            expect(modifier).toEqual(pngFileModel.getCreatedByUser().displayName);
            expect(modifiedDate).toEqual(format(new Date(pngFileModel.createdAt), METADATA.DATA_FORMAT), pngFileModel.createdAt);
            expect(mimeTypeName).toEqual(pngFileModel.getContent().mimeTypeName);
            expect(size).toEqual(pngFileModel.getContent().getSizeInBytes());

            await metadataViewPage.editIconIsDisplayed();
            await metadataViewPage.informationButtonIsDisplayed();

            const informationButtonText = await metadataViewPage.getInformationButtonText();
            const informationIconText = await metadataViewPage.getInformationIconText();

            expect(informationButtonText).toEqual(METADATA.MORE_INFO_BUTTON);
            expect(informationIconText).toEqual(METADATA.ARROW_DOWN);
        });

        it('[C272769] Should be possible to display more details when clicking on More Information button', async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.informationButtonIsDisplayed();
            await metadataViewPage.clickOnInformationButton();

            const informationButtonText = await metadataViewPage.getInformationButtonText();
            const informationIconText = await metadataViewPage.getInformationIconText();

            expect(informationButtonText).toEqual(METADATA.LESS_INFO_BUTTON);
            expect(informationIconText).toEqual(METADATA.ARROW_UP);
        });

        it('[C270952] Should be possible to open/close properties using info icon', async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.informationButtonIsDisplayed();
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsNotDisplayed();
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await expect(await viewerPage.getActiveTab()).toEqual(METADATA.COMMENTS_TAB);
            await metadataViewPage.clickOnPropertiesTab();
            await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
            await expect(await metadataViewPage.getEditIconTooltip()).toEqual(METADATA.EDIT_BUTTON_TOOLTIP);
        });

        it('[C245654] Should be possible edit the basic Metadata Info of a Document', async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.editIconIsDisplayed();

            await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

            await metadataViewPage.editIconClick();
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:name');
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');

            await expect(await metadataViewPage.getPropertyIconTooltip('properties.cm:name')).toEqual('Edit');
            await expect(await metadataViewPage.getPropertyIconTooltip('properties.cm:title')).toEqual('Edit');
            await expect(await metadataViewPage.getPropertyIconTooltip('properties.cm:description')).toEqual('Edit');

            await metadataViewPage.enterPropertyText('properties.cm:name', 'exampleText');
            await metadataViewPage.clickResetMetadata();
            await expect(await metadataViewPage.getPropertyText('properties.cm:name')).toEqual(
                browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name
            );

            await metadataViewPage.enterPropertyText('properties.cm:name', 'exampleText.png');
            await metadataViewPage.enterPropertyText('properties.cm:title', 'example title');
            await metadataViewPage.enterDescriptionText('example description');

            await expect(await metadataViewPage.getPropertyText('properties.cm:name')).toEqual('exampleText.png');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('example title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('example description');
            await metadataViewPage.clickSaveMetadata();

            await viewerPage.clickCloseButton();
            await contentServicesPage.waitForTableBody();

            await viewerPage.viewFile('exampleText.png');
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.editIconIsDisplayed();

            await expect(await metadataViewPage.getPropertyText('properties.cm:name')).toEqual('exampleText.png');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('example title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('example description');

            await metadataViewPage.editIconClick();
            await metadataViewPage.enterPropertyText('properties.cm:name', browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name);
            await expect(await metadataViewPage.getPropertyText('properties.cm:name')).toEqual(
                browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name
            );
            await metadataViewPage.clickSaveMetadata();
        });

        it('[C260181] Should be possible edit all the metadata aspect', async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.editIconIsDisplayed();

            await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

            await metadataViewPage.clickOnInformationButton();

            await metadataViewPage.clickMetadataGroup('EXIF');

            await metadataViewPage.editIconClick();

            await metadataViewPage.enterPropertyText('properties.exif:software', 'test custom text software');
            await metadataViewPage.enterPropertyText('properties.exif:isoSpeedRatings', 'test custom text isoSpeedRatings');
            await metadataViewPage.enterPropertyText('properties.exif:fNumber', 22);
            await metadataViewPage.clickSaveMetadata();

            await expect(await metadataViewPage.getPropertyText('properties.exif:isoSpeedRatings')).toEqual('test custom text isoSpeedRatings');
            await expect(await metadataViewPage.getPropertyText('properties.exif:software')).toEqual('test custom text software');
            await expect(await metadataViewPage.getPropertyText('properties.exif:fNumber')).toEqual('22');
        });
    });

    it('[C279960] Should show the last username modifier when modify a File', async () => {
        await loginPage.loginWithProfile('admin');

        await BrowserActions.getUrl(browser.baseUrl + `/files(overlay:files/${pngFileModel.id}/view)`);

        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        await metadataViewPage.editIconClick();

        await metadataViewPage.enterDescriptionText('check author example description');
        await metadataViewPage.clickSaveMetadata();
        await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('check author example description');

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(acsUser.username, acsUser.password);
        await navigationBarPage.navigateToContentServices();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.checkFileIsLoaded();

        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await expect(await metadataViewPage.getPropertyText('modifiedByUser.displayName')).toEqual('Administrator');

        await viewerPage.clickCloseButton();
        await contentServicesPage.waitForTableBody();
    });
});
