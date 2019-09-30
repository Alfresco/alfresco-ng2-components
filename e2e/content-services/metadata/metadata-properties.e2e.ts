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

import { LoginPage, UploadActions } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { check, uncheck } from '../../util/material';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

describe('CardView Component - properties', () => {

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
    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const contentServicesPage = new ContentServicesPage();

    const acsUser = new AcsUserModel();

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

        const pdfUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        Object.assign(pngFileModel, pdfUploadedFile.entry);

        pngFileModel.update(pdfUploadedFile.entry);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();

    });

    afterEach(async () => {
        await viewerPage.clickCloseButton();
    });

    it('[C246516] Should show/hide the empty metadata when the property displayEmpty is true/false', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.clickMetadataGroup('EXIF');

        await metadataViewPage.checkPropertyIsVisible('properties.exif:flash', 'boolean');
        await metadataViewPage.checkPropertyIsNotVisible('properties.exif:model', 'textitem');

        await check(metadataViewPage.displayEmptySwitch);

        await metadataViewPage.checkPropertyIsVisible('properties.exif:flash', 'boolean');
        await metadataViewPage.checkPropertyIsVisible('properties.exif:model', 'textitem');
    });

    it('[C260179] Should not be possible edit the basic property when readOnly is true', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await check(metadataViewPage.readonlySwitch);

        await metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C268965] Should multi property allow expand multi accordion at the same time when set', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsNotExpand('EXIF');
        await metadataViewPage.checkMetadataGroupIsNotExpand('properties');

        await metadataViewPage.clickMetadataGroup('properties');

        await metadataViewPage.checkMetadataGroupIsNotExpand('EXIF');
        await metadataViewPage.checkMetadataGroupIsExpand('properties');

        await metadataViewPage.clickMetadataGroup('EXIF');

        await metadataViewPage.checkMetadataGroupIsExpand('EXIF');
        await metadataViewPage.checkMetadataGroupIsNotExpand('properties');

        await check(metadataViewPage.multiSwitch);

        await metadataViewPage.clickMetadataGroup('properties');

        await metadataViewPage.checkMetadataGroupIsExpand('EXIF');
        await metadataViewPage.checkMetadataGroupIsExpand('properties');

    });

    it('[C280559] Should show/hide the default metadata properties when displayDefaultProperties is true/false', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await uncheck(metadataViewPage.defaultPropertiesSwitch);

        await metadataViewPage.checkMetadataGroupIsNotPresent('properties');
        await metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        await metadataViewPage.checkMetadataGroupIsExpand('EXIF');

        await check(metadataViewPage.defaultPropertiesSwitch);

        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsExpand('properties');
    });

    it('[C280560] Should show/hide the more properties button when displayDefaultProperties is true/false', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.informationButtonIsDisplayed();

        await uncheck(metadataViewPage.defaultPropertiesSwitch);

        await metadataViewPage.informationButtonIsNotDisplayed();
    });

    it('[C307975] Should be able to choose which aspect to show expanded in the info-drawer', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.typeAspectName('EXIF');
        await metadataViewPage.clickApplyAspect();

        await metadataViewPage.checkMetadataGroupIsExpand('EXIF');
        await metadataViewPage.checkMetadataGroupIsNotExpand('properties');
        await check(metadataViewPage.displayEmptySwitch);

        await metadataViewPage.checkPropertyIsVisible('properties.exif:flash', 'boolean');
        await metadataViewPage.checkPropertyIsVisible('properties.exif:model', 'textitem');

        await metadataViewPage.typeAspectName('nonexistent');
        await metadataViewPage.clickApplyAspect();
        await metadataViewPage.checkMetadataGroupIsNotPresent('nonexistent');

        await metadataViewPage.typeAspectName('Properties');
        await metadataViewPage.clickApplyAspect();
        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsExpand('properties');
    });
});
