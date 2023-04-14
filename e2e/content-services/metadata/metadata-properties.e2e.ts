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

import { createApiService,
    CheckboxPage,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { ContentServicesPage } from '../../core/pages/content-services.page';

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

        const pdfUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        Object.assign(pngFileModel, pdfUploadedFile.entry);

        pngFileModel.update(pdfUploadedFile.entry);

        await loginPage.login(acsUser.username, acsUser.password);

        await navigationBarPage.navigateToContentServices();
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

        await CheckboxPage.check(metadataViewPage.displayEmptySwitch);

        await metadataViewPage.checkPropertyIsVisible('properties.exif:flash', 'boolean');
        await metadataViewPage.checkPropertyIsVisible('properties.exif:model', 'textitem');
    });

    it('[C260179] Should not be possible edit the basic property when readOnly is true', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await CheckboxPage.check(metadataViewPage.readonlySwitch);

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

        await CheckboxPage.check(metadataViewPage.multiSwitch);

        await metadataViewPage.clickMetadataGroup('properties');

        await metadataViewPage.checkMetadataGroupIsExpand('EXIF');
        await metadataViewPage.checkMetadataGroupIsExpand('properties');
   });

    it('[C280559] Should show/hide the default metadata properties when displayDefaultProperties is true/false', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await CheckboxPage.uncheck(metadataViewPage.defaultPropertiesSwitch);

        await metadataViewPage.checkMetadataGroupIsNotPresent('properties');
        await metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        await metadataViewPage.checkMetadataGroupIsExpand('EXIF');

        await CheckboxPage.check(metadataViewPage.defaultPropertiesSwitch);

        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsExpand('properties');
    });

    it('[C280560] Should show/hide the more properties button when displayDefaultProperties is true/false', async () => {
        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.informationButtonIsDisplayed();

        await CheckboxPage.uncheck(metadataViewPage.defaultPropertiesSwitch);

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
        await CheckboxPage.check(metadataViewPage.displayEmptySwitch);

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
