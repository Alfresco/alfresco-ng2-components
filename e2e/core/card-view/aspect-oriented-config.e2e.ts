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

import LoginPage = require('../../pages/adf/loginPage');
import ViewerPage = require('../../pages/adf/viewerPage');
import CardViewPage = require('../../pages/adf/metadataViewPage');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');
import { ConfigEditorPage } from '../../pages/adf/configEditorPage';

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import ContentServicesPage = require('../../pages/adf/contentServicesPage');

describe('Aspect oriented config', () => {

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new CardViewPage();
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

    beforeEach(async(done) => {
        navigationBarPage.clickConfigEditorButton();
        configEditorPage.clickClearMetadataButton();
        done();
    });

    afterEach(async(done) => {
        viewerPage.clickCloseButton();
        contentServicesPage.checkAcsContainer();
        browser.refresh();
        contentServicesPage.checkAcsContainer();
        done();
    });

    it('[C261117] Should be possible restrict the display properties of one an aspect', () => {

        configEditorPage.enterMetadataConfiguration('{  "presets": {' +
            '        "default": [{' +
            '            "title": "IMAGE",' +
            '            "items": [' +
            '                {' +
            '                    "aspect": "exif:exif", "properties": [ "exif:pixelXDimension", "exif:pixelYDimension", "exif:isoSpeedRatings"]' +
            '                }' +
            '            ]' +
            '        }]' +
            '    }');

        configEditorPage.clickSaveMetadataButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadatGroup('IMAGE');
        metadataViewPage.checkPopertyIsVisible('properties.exif:pixelXDimension', 'textitem');
        metadataViewPage.checkPopertyIsVisible('properties.exif:pixelYDimension', 'textitem');
        metadataViewPage.checkPopertyIsNotVisible('properties.exif:isoSpeedRatings', 'textitem');

        metadataViewPage.editIconClick();

        metadataViewPage.checkPopertyIsVisible('properties.exif:isoSpeedRatings', 'textitem');
    });

    it('[C260185] Should ignore not existing aspect when present in the configuration', () => {

        configEditorPage.enterMetadataConfiguration('   {' +
            '        "presets": {' +
            '            "default": {' +
            '                "exif:exif": "*",' +
            '                "cm:versionable": "*",' +
            '                "not:exists": "*"' +
            '            }' +
            '        }' +
            '    }');

        configEditorPage.clickSaveMetadataButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkkMetadatGroupIsPresent('EXIF');
        metadataViewPage.checkkMetadatGroupIsPresent('properties');
        metadataViewPage.checkkMetadatGroupIsPresent('Versionable');
        metadataViewPage.checkkMetadatGroupIsNotPresent('exists');
    });

    it('[C260183] Should show all the aspect if the content-metadata configuration is NOT provided' , () => {

        configEditorPage.enterMetadataConfiguration('{ }');

        configEditorPage.clickSaveMetadataButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkkMetadatGroupIsPresent('EXIF');
        metadataViewPage.checkkMetadatGroupIsPresent('properties');
        metadataViewPage.checkkMetadatGroupIsPresent('Versionable');
        metadataViewPage.checkkMetadatGroupIsPresent('Titled');
        metadataViewPage.checkkMetadatGroupIsPresent('Auditable');
        metadataViewPage.checkkMetadatGroupIsPresent('Author');
        metadataViewPage.checkkMetadatGroupIsPresent('Content');
    });

    it('[C260182] Should show all the aspects if the default configuration contains the * symbol' , () => {

        configEditorPage.enterMetadataConfiguration('{' +
            '    "presets": {' +
            '        "default": "*"' +
            '    }' +
            '}');

        configEditorPage.clickSaveMetadataButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkkMetadatGroupIsPresent('EXIF');
        metadataViewPage.checkkMetadatGroupIsPresent('properties');
        metadataViewPage.checkkMetadatGroupIsPresent('Versionable');
        metadataViewPage.checkkMetadatGroupIsPresent('Titled');
        metadataViewPage.checkkMetadatGroupIsPresent('Auditable');
        metadataViewPage.checkkMetadatGroupIsPresent('Author');
        metadataViewPage.checkkMetadatGroupIsPresent('Content');
    });

    it('[C268899] Should be possible use a Translation key as Title of a metadata group' , () => {

        configEditorPage.enterMetadataConfiguration('{' +
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
            '            "aspect": "kitten:food",' +
            '            "properties": [' +
            '              "kitten:favourite-food",' +
            '              "kitten:recommended-food"' +
            '            ]' +
            '          }' +
            '        ]' +
            '      }' +
            '    ]' +
            '  }' +
            '}');

        configEditorPage.clickSaveMetadataButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkkMetadatGroupIsPresent('GROUP-TITLE1-TRANSLATION-KEY');
        metadataViewPage.checkkMetadatGroupIsPresent('GROUP-TITLE2-TRANSLATION-KEY');

        expect(metadataViewPage.getkMetadatGroupTitle('GROUP-TITLE1-TRANSLATION-KEY')).toBe('CUSTOM TITLE TRANSLATION ONE');
        expect(metadataViewPage.getkMetadatGroupTitle('GROUP-TITLE2-TRANSLATION-KEY')).toBe('CUSTOM TITLE TRANSLATION TWO');

    });

    it('[C279968] Should be possible use a custom preset' , () => {

        configEditorPage.enterMetadataConfiguration('{' +
            '    "presets": {' +
            '        "custom-preset": {' +
            '            "exif:exif": "*",' +
            '            "cm:versionable": "*"' +
            '        }' +
            '    }' +
            '}');

        configEditorPage.clickSaveMetadataButton();

        navigationBarPage.clickContentServicesButton();

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.enablePreset();

        metadataViewPage.enterPresetText('custom-preset');

        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkkMetadatGroupIsPresent('properties');
        metadataViewPage.checkkMetadatGroupIsPresent('EXIF');
        metadataViewPage.checkkMetadatGroupIsPresent('Versionable');
    });
});
