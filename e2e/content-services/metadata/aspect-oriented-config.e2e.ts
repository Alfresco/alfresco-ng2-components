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

import { LoginPage, UploadActions, LocalStorageUtil } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import { browser } from 'protractor';
import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { check } from '../../util/material';

describe('Aspect oriented config', () => {

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const modelOneName = 'modelOne', emptyAspectName = 'emptyAspect';
    const defaultModel = 'cm', defaultEmptyPropertiesAspect = 'taggable', aspectName = 'Taggable';

    const acsUser = new AcsUserModel();

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    let uploadActions;

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
        uploadActions = new UploadActions(this.alfrescoJsApi);

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        try {
            await this.alfrescoJsApi.core.customModelApi.createCustomModel('ACTIVE', modelOneName, modelOneName, modelOneName, modelOneName);
        } catch (e) {
        }

        try {
            await this.alfrescoJsApi.core.customModelApi.createCustomAspect(modelOneName, emptyAspectName, null, emptyAspectName, emptyAspectName);
        } catch (e) {
        }

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const uploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        const aspects = await this.alfrescoJsApi.core.nodesApi.getNode(uploadedFile.entry.id);

        aspects.entry.aspectNames.push(modelOneName.concat(':', emptyAspectName));

        aspects.entry.aspectNames.push(defaultModel.concat(':', defaultEmptyPropertiesAspect));

        await this.alfrescoJsApi.core.nodesApi.updateNode(uploadedFile.entry.id, { aspectNames: aspects.entry.aspectNames });

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    afterEach(async () => {
        await viewerPage.clickCloseButton();
        await contentServicesPage.checkAcsContainer();

    });

    it('[C261117] Should be possible restrict the display properties of one an aspect', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
            presets: {
                default: [
                    {
                        title: 'IMAGE',
                        items: [
                            {
                                aspect: 'exif:exif',
                                properties: [
                                    'exif:pixelXDimension',
                                    'exif:pixelYDimension',
                                    'exif:isoSpeedRatings'
                                ]
                            }
                        ]
                    }
                ]
            }
        }));

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.clickMetadataGroup('IMAGE');
        await metadataViewPage.checkPropertyIsVisible('properties.exif:pixelXDimension', 'textitem');
        await metadataViewPage.checkPropertyIsVisible('properties.exif:pixelYDimension', 'textitem');
        await metadataViewPage.checkPropertyIsNotVisible('properties.exif:isoSpeedRatings', 'textitem');

        await metadataViewPage.editIconClick();

        await metadataViewPage.checkPropertyIsVisible('properties.exif:isoSpeedRatings', 'textitem');
    });

    it('[C260185] Should ignore not existing aspect when present in the configuration', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
            presets: {
                default: {
                    'exif:exif': '*',
                    'cm:versionable': '*',
                    'not:exists': '*'
                }
            }
        }));

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsPresent('Versionable');
        await metadataViewPage.checkMetadataGroupIsNotPresent('exists');
    });

    it('[C260183] Should show all the aspect if the content-metadata configuration is NOT provided', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', '{}');

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsPresent('Versionable');
    });

    it('[C260182] Should show all the aspects if the default configuration contains the star symbol', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', JSON.stringify({
            presets: {
                default: '*'
            }
        }));

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsPresent('Versionable');
    });

    it('[C268899] Should be possible use a Translation key as Title of a metadata group', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', '{' +
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

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsPresent('GROUP-TITLE1-TRANSLATION-KEY');
        await metadataViewPage.checkMetadataGroupIsPresent('GROUP-TITLE2-TRANSLATION-KEY');

        await expect(await metadataViewPage.getMetadataGroupTitle('GROUP-TITLE1-TRANSLATION-KEY')).toBe('CUSTOM TITLE TRANSLATION ONE');
        await expect(await metadataViewPage.getMetadataGroupTitle('GROUP-TITLE2-TRANSLATION-KEY')).toBe('CUSTOM TITLE TRANSLATION TWO');

    });

    it('[C279968] Should be possible use a custom preset', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', '{' +
            '    "presets": {' +
            '        "custom-preset": {' +
            '            "exif:exif": "*",' +
            '            "cm:versionable": "*"' +
            '        }' +
            '    }' +
            '}');

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await check(metadataViewPage.presetSwitch);

        await metadataViewPage.enterPresetText('custom-preset');

        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsPresent('properties');
        await metadataViewPage.checkMetadataGroupIsPresent('Versionable');
    });

    it('[C299186] The aspect without properties is not displayed', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', '{' +
            '    "presets": { "' + modelOneName +
            '       ": { "' + modelOneName + ':' + emptyAspectName +
            '            ":"*"' +
            '        }' +
            '    }' +
            '}');

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsNotPresent(emptyAspectName);
    });

    it('[C299187] The aspect with empty properties is displayed when edit', async () => {

        await LocalStorageUtil.setConfigField('content-metadata', '{' +
            '    "presets": { "' + defaultModel +
            '       ": { "' + defaultModel + ':' + defaultEmptyPropertiesAspect +
            '            ":"*"' +
            '        }' +
            '    }' +
            '}');

        await navigationBarPage.clickContentServicesButton();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await metadataViewPage.informationButtonIsDisplayed();
        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.checkMetadataGroupIsNotPresent(aspectName);

        await metadataViewPage.editIconClick();

        await metadataViewPage.checkMetadataGroupIsPresent(aspectName);
    });
});
