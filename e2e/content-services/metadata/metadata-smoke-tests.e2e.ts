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

import { LoginPage, LocalStorageUtil, BrowserActions, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import { browser } from 'protractor';
import resources = require('../../util/resources');
import dateFormat = require('dateformat');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Metadata component', () => {

    const METADATA = {
        DATA_FORMAT: 'mmm d, yyyy',
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

    const acsUser = new AcsUserModel();

    const folderName = 'Metadata Folder';

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });

    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');
        Object.assign(pngFileModel, pngUploadedFile.entry);
        pngFileModel.update(pngUploadedFile.entry);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    describe('Viewer Metadata', () => {

        beforeAll(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
            await LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
                presets: {
                    default: {
                        'exif:exif': '*'
                    }
                }
            }));
        });

        beforeEach(async () => {
            await viewerPage.viewFile(pngFileModel.name);
            await viewerPage.checkFileIsLoaded();
        });

        afterEach(async () => {
            await viewerPage.clickCloseButton();
            await contentServicesPage.waitForTableBody();
        });

        it('[C245652] Should be possible to display a file\'s properties', async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();

            await expect(await metadataViewPage.getTitle()).toEqual(METADATA.TITLE);
            await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
            await expect(await metadataViewPage.getExpandedAspectName()).toEqual(METADATA.DEFAULT_ASPECT);
            await expect(await metadataViewPage.getName()).toEqual(pngFileModel.name);
            await expect(await metadataViewPage.getCreator()).toEqual(pngFileModel.getCreatedByUser().displayName);
            await expect(await metadataViewPage.getCreatedDate()).toEqual(dateFormat(pngFileModel.createdAt, METADATA.DATA_FORMAT));
            await expect(await metadataViewPage.getModifier()).toEqual(pngFileModel.getCreatedByUser().displayName);
            await expect(await metadataViewPage.getModifiedDate()).toEqual(dateFormat(pngFileModel.createdAt, METADATA.DATA_FORMAT));
            await expect(await metadataViewPage.getMimetypeName()).toEqual(pngFileModel.getContent().mimeTypeName);
            await expect(await metadataViewPage.getSize()).toEqual(pngFileModel.getContent().getSizeInBytes());

            await metadataViewPage.editIconIsDisplayed();
            await metadataViewPage.informationButtonIsDisplayed();
            await expect(await metadataViewPage.getInformationButtonText()).toEqual(METADATA.LESS_INFO_BUTTON);
            await expect(await metadataViewPage.getInformationIconText()).toEqual(METADATA.ARROW_UP);
        });

        it('[C272769] Should be possible to display more details when clicking on More Information button', async () => {
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.informationButtonIsDisplayed();
            await metadataViewPage.clickOnInformationButton();
            await expect(await metadataViewPage.getInformationButtonText()).toEqual(METADATA.MORE_INFO_BUTTON);
            await expect(await metadataViewPage.getInformationIconText()).toEqual(METADATA.ARROW_DOWN);
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
            await metadataViewPage.editPropertyIconIsDisplayed('name');
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
            await metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');

            await expect(await metadataViewPage.getPropertyIconTooltip('name')).toEqual('Edit');
            await expect(await metadataViewPage.getPropertyIconTooltip('properties.cm:title')).toEqual('Edit');
            await expect(await metadataViewPage.getPropertyIconTooltip('properties.cm:description')).toEqual('Edit');

            await metadataViewPage.clickEditPropertyIcons('name');
            await metadataViewPage.updatePropertyIconIsDisplayed('name');
            await metadataViewPage.clearPropertyIconIsDisplayed('name');

            await metadataViewPage.enterPropertyText('name', 'exampleText');
            await metadataViewPage.clickClearPropertyIcon('name');
            await expect(await metadataViewPage.getPropertyText('name')).toEqual(resources.Files.ADF_DOCUMENTS.PNG.file_name);

            await metadataViewPage.clickEditPropertyIcons('name');
            await metadataViewPage.enterPropertyText('name', 'exampleText.png');
            await metadataViewPage.clickUpdatePropertyIcon('name');
            await expect(await metadataViewPage.getPropertyText('name')).toEqual('exampleText.png');

            await metadataViewPage.clickEditPropertyIcons('properties.cm:title');
            await metadataViewPage.enterPropertyText('properties.cm:title', 'example title');
            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('example title');

            await metadataViewPage.clickEditPropertyIcons('properties.cm:description');
            await metadataViewPage.enterDescriptionText('example description');
            await metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
            await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('example description');

            await viewerPage.clickCloseButton();
            await contentServicesPage.waitForTableBody();

            await viewerPage.viewFile('exampleText.png');
            await viewerPage.clickInfoButton();
            await viewerPage.checkInfoSideBarIsDisplayed();
            await metadataViewPage.clickOnPropertiesTab();
            await metadataViewPage.editIconIsDisplayed();

            await expect(await metadataViewPage.getPropertyText('name')).toEqual('exampleText.png');
            await expect(await metadataViewPage.getPropertyText('properties.cm:title')).toEqual('example title');
            await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('example description');

            await metadataViewPage.editIconClick();
            await metadataViewPage.clickEditPropertyIcons('name');
            await metadataViewPage.enterPropertyText('name', resources.Files.ADF_DOCUMENTS.PNG.file_name);
            await metadataViewPage.clickUpdatePropertyIcon('name');
            await expect(await metadataViewPage.getPropertyText('name')).toEqual(resources.Files.ADF_DOCUMENTS.PNG.file_name);
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

            await metadataViewPage.clickEditPropertyIcons('properties.exif:software');
            await metadataViewPage.enterPropertyText('properties.exif:software', 'test custom text software');
            await metadataViewPage.clickUpdatePropertyIcon('properties.exif:software');
            await expect(await metadataViewPage.getPropertyText('properties.exif:software')).toEqual('test custom text software');

            await metadataViewPage.clickEditPropertyIcons('properties.exif:isoSpeedRatings');
            await metadataViewPage.enterPropertyText('properties.exif:isoSpeedRatings', 'test custom text isoSpeedRatings');
            await metadataViewPage.clickUpdatePropertyIcon('properties.exif:isoSpeedRatings');
            await expect(await metadataViewPage.getPropertyText('properties.exif:isoSpeedRatings')).toEqual('test custom text isoSpeedRatings');

            await metadataViewPage.clickEditPropertyIcons('properties.exif:fNumber');
            await metadataViewPage.enterPropertyText('properties.exif:fNumber', 22);
            await metadataViewPage.clickUpdatePropertyIcon('properties.exif:fNumber');
            await expect(await metadataViewPage.getPropertyText('properties.exif:fNumber')).toEqual('22');
        });

    });

    describe('Folder metadata', () => {

        beforeAll(async () => {
            await uploadActions.createFolder(folderName, '-my-');

            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();

        });

        it('[C261157] Should be possible use the metadata component When the node is a Folder', async () => {
            await contentServicesPage.metadataContent(folderName);

            await expect(await metadataViewPage.getPropertyText('name')).toEqual(folderName);
            await expect(await metadataViewPage.getPropertyText('createdByUser.displayName')).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C261158] Should be possible edit the metadata When the node is a Folder', async () => {
            await contentServicesPage.metadataContent(folderName);

            await metadataViewPage.editIconClick();

            await metadataViewPage.clickEditPropertyIcons('name');
            await metadataViewPage.enterPropertyText('name', 'newnameFolder');
            await metadataViewPage.clickClearPropertyIcon('name');
            await expect(await metadataViewPage.getPropertyText('name')).toEqual(folderName);

            await metadataViewPage.clickEditPropertyIcons('name');
            await metadataViewPage.enterPropertyText('name', 'newnameFolder');
            await metadataViewPage.clickUpdatePropertyIcon('name');
            await expect(await metadataViewPage.getPropertyText('name')).toEqual('newnameFolder');

            await metadataViewPage.clickEditPropertyIcons('name');
            await metadataViewPage.enterPropertyText('name', folderName);
            await metadataViewPage.clickUpdatePropertyIcon('name');
            await expect(await metadataViewPage.getPropertyText('name')).toEqual(folderName);
        });

    });

    it('[C279960] Should show the last username modifier when modify a File', async () => {
        await loginPage.loginToContentServices(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await BrowserActions.getUrl(browser.params.testConfig.adf.url + `/(overlay:files/${pngFileModel.id}/view)`);

        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        await metadataViewPage.editIconClick();

        await metadataViewPage.clickEditPropertyIcons('properties.cm:description');
        await metadataViewPage.enterDescriptionText('check author example description');
        await metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
        await expect(await metadataViewPage.getPropertyText('properties.cm:description')).toEqual('check author example description');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await navigationBarPage.clickContentServicesButton();

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
