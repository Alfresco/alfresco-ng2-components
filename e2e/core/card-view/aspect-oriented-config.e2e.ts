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

import { browser } from 'protractor';

import { LoginPage } from '../../pages/adf/loginPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '../../actions/ACS/upload.actions';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { check } from '../../util/material';

describe('Aspect oriented config', () => {

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();
    const configEditorPage = new ConfigEditorPage();
    let contentServicesPage = new ContentServicesPage();

    let acsUser = new AcsUserModel();

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

        await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.clickConfigEditorButton();
        configEditorPage.clickClearButton();
        done();
    });

    afterEach(async (done) => {
        viewerPage.clickCloseButton();
        contentServicesPage.checkAcsContainer();
        browser.refresh();
        contentServicesPage.checkAcsContainer();
        done();
    });

    it('[C261117] Should be possible restrict the display properties of one an aspect', () => {

        configEditorPage.enterBigConfigurationText('{  "presets": {' +
            '        "default": [{' +
            '            "title": "IMAGE",' +
            '            "items": [' +
            '                {' +
            '                    "aspect": "exif:exif", "properties": [ "exif:pixelXDimension", "exif:pixelYDimension", "exif:isoSpeedRatings"]' +
            '                }' +
            '            ]' +
            '        }]' +
            '    }' +
            '  }');

        configEditorPage.clickSaveButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadataGroup('IMAGE');
        metadataViewPage.checkPropertyIsVisible('properties.exif:pixelXDimension', 'textitem');
        metadataViewPage.checkPropertyIsVisible('properties.exif:pixelYDimension', 'textitem');
        metadataViewPage.checkPropertyIsNotVisible('properties.exif:isoSpeedRatings', 'textitem');

        metadataViewPage.editIconClick();

        metadataViewPage.checkPropertyIsVisible('properties.exif:isoSpeedRatings', 'textitem');
    });

    it('[C260185] Should ignore not existing aspect when present in the configuration', () => {

        configEditorPage.enterBigConfigurationText('   {' +
            '        "presets": {' +
            '            "default": {' +
            '                "exif:exif": "*",' +
            '                "cm:versionable": "*",' +
            '                "not:exists": "*"' +
            '            }' +
            '        }' +
            '    }');

        configEditorPage.clickSaveButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        metadataViewPage.checkMetadataGroupIsPresent('properties');
        metadataViewPage.checkMetadataGroupIsPresent('Versionable');
        metadataViewPage.checkMetadataGroupIsNotPresent('exists');
    });

    it('[C260183] Should show all the aspect if the content-metadata configuration is NOT provided', () => {

        configEditorPage.enterBigConfigurationText('{ }');

        configEditorPage.clickSaveButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        metadataViewPage.checkMetadataGroupIsPresent('properties');
        metadataViewPage.checkMetadataGroupIsPresent('Versionable');
        metadataViewPage.checkMetadataGroupIsPresent('Titled');
        metadataViewPage.checkMetadataGroupIsPresent('Auditable');
        metadataViewPage.checkMetadataGroupIsPresent('Author');
        metadataViewPage.checkMetadataGroupIsPresent('Content');
    });

    it('[C260182] Should show all the aspects if the default configuration contains the star symbol', () => {

        configEditorPage.enterBigConfigurationText('{' +
            '    "presets": {' +
            '        "default": "*"' +
            '    }' +
            '}');

        configEditorPage.clickSaveButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        metadataViewPage.checkMetadataGroupIsPresent('properties');
        metadataViewPage.checkMetadataGroupIsPresent('Versionable');
        metadataViewPage.checkMetadataGroupIsPresent('Titled');
        metadataViewPage.checkMetadataGroupIsPresent('Auditable');
        metadataViewPage.checkMetadataGroupIsPresent('Author');
        metadataViewPage.checkMetadataGroupIsPresent('Content');
    });

    it('[C268899] Should be possible use a Translation key as Title of a metadata group', () => {

        configEditorPage.enterBigConfigurationText('{' +
            '  "presets": {' +
            '    "default": [' +
            '      {' +
            '        "title": "GROUP-TITLE1-TRANSLATION-KEY",' +
            '        "items": [' +
            '          {' +
            '            "aspect": "exif:exif",' +
            '            "properties": "*"' +
            '          }' +
            '        ]' +
            '      },' +
            '      {' +
            '        "title": "GROUP-TITLE2-TRANSLATION-KEY",' +
            '        "items": [' +
            '          {' +
            '            "aspect": "exif:exif",' +
            '            "properties": "*"' +
            '          }' +
            '        ]' +
            '      }' +
            '    ]' +
            '  }' +
            '}');

        configEditorPage.clickSaveButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkMetadataGroupIsPresent('GROUP-TITLE1-TRANSLATION-KEY');
        metadataViewPage.checkMetadataGroupIsPresent('GROUP-TITLE2-TRANSLATION-KEY');

        expect(metadataViewPage.getMetadataGroupTitle('GROUP-TITLE1-TRANSLATION-KEY')).toBe('CUSTOM TITLE TRANSLATION ONE');
        expect(metadataViewPage.getMetadataGroupTitle('GROUP-TITLE2-TRANSLATION-KEY')).toBe('CUSTOM TITLE TRANSLATION TWO');

    });

    it('[C279968] Should be possible use a custom preset', () => {

        configEditorPage.enterBigConfigurationText('{' +
            '    "presets": {' +
            '        "custom-preset": {' +
            '            "exif:exif": "*",' +
            '            "cm:versionable": "*"' +
            '        }' +
            '    }' +
            '}');

        configEditorPage.clickSaveButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        check(metadataViewPage.presetSwitch);

        metadataViewPage.enterPresetText('custom-preset');

        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkMetadataGroupIsPresent('properties');
        metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        metadataViewPage.checkMetadataGroupIsPresent('Versionable');
    });
});
