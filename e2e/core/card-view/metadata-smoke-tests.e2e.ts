/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { browser } from 'protractor';

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { ContentListPage } from '../../pages/adf/dialog/contentListPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('Metadata component', () => {

    const METADATA = {
        DATA_FORMAT: 'mmm dd yyyy',
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
    const contentListPage = new ContentListPage();

    let acsUser = new AcsUserModel();

    let folderName = 'Metadata Folder';

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async (done) => {

        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        Object.assign(pngFileModel, pngUploadedFile.entry);

        pngFileModel.update(pngUploadedFile.entry);

        done();
    });

    beforeEach(() => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.navigateToDocumentList();
    });

    it('[C245652] Should be possible to display a file\'s properties', () => {
        viewerPage.viewFile(pngFileModel.name);

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        expect(metadataViewPage.getTitle()).toEqual(METADATA.TITLE);
        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
        expect(metadataViewPage.getExpandedAspectName()).toEqual(METADATA.DEFAULT_ASPECT);
        expect(metadataViewPage.getName()).toEqual(pngFileModel.name);
        expect(metadataViewPage.getCreator()).toEqual(pngFileModel.getCreatedByUser().displayName);
        expect(metadataViewPage.getCreatedDate()).toEqual(dateFormat(pngFileModel.createdAt, METADATA.DATA_FORMAT));
        expect(metadataViewPage.getModifier()).toEqual(pngFileModel.getCreatedByUser().displayName);
        expect(metadataViewPage.getModifiedDate()).toEqual(dateFormat(pngFileModel.createdAt, METADATA.DATA_FORMAT));
        expect(metadataViewPage.getMimetypeName()).toEqual(pngFileModel.getContent().mimeTypeName);
        expect(metadataViewPage.getSize()).toEqual(pngFileModel.getContent().getSizeInBytes());

        metadataViewPage.editIconIsDisplayed();
        metadataViewPage.informationButtonIsDisplayed();
        expect(metadataViewPage.getInformationButtonText()).toEqual(METADATA.LESS_INFO_BUTTON);
        expect(metadataViewPage.getInformationIconText()).toEqual(METADATA.ARROW_UP);

        viewerPage.clickCloseButton();
    });

    it('[C272769] Should be possible to display more details when clicking on More Information button', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();
        expect(metadataViewPage.getInformationButtonText()).toEqual(METADATA.MORE_INFO_BUTTON);
        expect(metadataViewPage.getInformationIconText()).toEqual(METADATA.ARROW_DOWN);

        viewerPage.clickCloseButton();
    });

    it('[C270952] Should be possible to open/close properties using info icon', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab().informationButtonIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        expect(viewerPage.getActiveTab()).toEqual(METADATA.COMMENTS_TAB);
        metadataViewPage.clickOnPropertiesTab();
        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
        expect(metadataViewPage.getEditIconTooltip()).toEqual(METADATA.EDIT_BUTTON_TOOLTIP);

        viewerPage.clickCloseButton();
    });

    it('[C245654] Should be possible edit the basic Metadata Info of a Document', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.editIconClick();

        metadataViewPage.editPropertyIconIsDisplayed('name');
        metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
        metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');

        expect(metadataViewPage.getPropertyIconTooltip('name', 'edit')).toEqual('Edit');
        expect(metadataViewPage.getPropertyIconTooltip('properties.cm:title', 'edit')).toEqual('Edit');
        expect(metadataViewPage.getPropertyIconTooltip('properties.cm:description', 'edit')).toEqual('Edit');

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.updatePropertyIconIsDisplayed('name');
        metadataViewPage.clearPropertyIconIsDisplayed('name');

        metadataViewPage.enterPropertyText('name', 'exampleText');
        metadataViewPage.clickClearPropertyIcon('name');
        expect(metadataViewPage.getPropertyText('name')).toEqual(resources.Files.ADF_DOCUMENTS.PNG.file_name);

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterPropertyText('name', 'exampleText.png');
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getPropertyText('name')).toEqual('exampleText.png');

        metadataViewPage.clickEditPropertyIcons('properties.cm:title');
        metadataViewPage.enterPropertyText('properties.cm:title', 'example title');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
        expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('example title');

        metadataViewPage.clickEditPropertyIcons('properties.cm:description');
        metadataViewPage.enterDescriptionText('example description');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
        expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('example description');

        viewerPage.clickCloseButton();

        viewerPage.viewFile('exampleText.png');
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(metadataViewPage.getPropertyText('name')).toEqual('exampleText.png');
        expect(metadataViewPage.getPropertyText('properties.cm:title')).toEqual('example title');
        expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('example description');

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterPropertyText('name', resources.Files.ADF_DOCUMENTS.PNG.file_name);
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getPropertyText('name')).toEqual(resources.Files.ADF_DOCUMENTS.PNG.file_name);

        viewerPage.clickCloseButton();
    });

    it('[C279960] Should show the last username modifier when modify a File', async (done) => {
        let fileUrl;

        viewerPage.viewFile(pngFileModel.name);

        fileUrl = await browser.getCurrentUrl();

        loginPage.loginToContentServices(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        browser.get(fileUrl);

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('properties.cm:description');
        metadataViewPage.enterDescriptionText('check author example description');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
        expect(metadataViewPage.getPropertyText('properties.cm:description')).toEqual('check author example description');

        browser.get(fileUrl);

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        expect(metadataViewPage.getPropertyText('modifiedByUser.displayName')).toEqual('Administrator');
        done();
    });

    it('[C261157] Should be possible use the metadata component When the node is a Folder', () => {
        contentListPage.metadataContent(folderName);

        expect(metadataViewPage.getPropertyText('name')).toEqual(folderName);
        expect(metadataViewPage.getPropertyText('createdByUser.displayName')).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
    });

    it('[C261158] Should be possible edit the metadata When the node is a Folder', () => {
        contentListPage.metadataContent(folderName);

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterPropertyText('name', 'newnameFolder');
        metadataViewPage.clickClearPropertyIcon('name');
        expect(metadataViewPage.getPropertyText('name')).toEqual(folderName);

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterPropertyText('name', 'newnameFolder');
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getPropertyText('name')).toEqual('newnameFolder');

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterPropertyText('name', folderName);
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getPropertyText('name')).toEqual(folderName);
    });

    it('[C260181] Should be possible edit all the metadata aspect', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadataGroup('EXIF');

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('properties.exif:software');
        metadataViewPage.enterPropertyText('properties.exif:software', 'test custom text software');
        metadataViewPage.clickUpdatePropertyIcon('properties.exif:software');
        expect(metadataViewPage.getPropertyText('properties.exif:software')).toEqual('test custom text software');

        metadataViewPage.clickEditPropertyIcons('properties.exif:isoSpeedRatings');
        metadataViewPage.enterPropertyText('properties.exif:isoSpeedRatings', 'test custom text isoSpeedRatings');
        metadataViewPage.clickUpdatePropertyIcon('properties.exif:isoSpeedRatings');
        expect(metadataViewPage.getPropertyText('properties.exif:isoSpeedRatings')).toEqual('test custom text isoSpeedRatings');

        metadataViewPage.clickEditPropertyIcons('properties.exif:fNumber');
        metadataViewPage.enterPropertyText('properties.exif:fNumber', 22);
        metadataViewPage.clickUpdatePropertyIcon('properties.exif:fNumber');
        expect(metadataViewPage.getPropertyText('properties.exif:fNumber')).toEqual('22');
    });

});
