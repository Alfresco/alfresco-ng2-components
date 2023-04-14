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
    LocalStorageUtil,
    LoginPage,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { CustomModelApi, NodesApi } from '@alfresco/js-api';

describe('Aspect oriented config', () => {

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();
    const contentServicesPage = new ContentServicesPage();
    const modelOneName = 'modelOne'; const emptyAspectName = 'emptyAspect';
    const defaultModel = 'cm'; const defaultEmptyPropertiesAspect = 'taggable'; const aspectName = 'Taggable';

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);
    const nodesApi = new NodesApi(apiService.getInstance());
    const customModelApi = new CustomModelApi(apiService.getInstance());

    let acsUser: UserModel;

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });
    let uploadActions;

    beforeAll(async () => {
        uploadActions = new UploadActions(apiService);

        await apiService.loginWithProfile('admin');

        try {
            await customModelApi.createCustomModel('ACTIVE', modelOneName, modelOneName, modelOneName, modelOneName);
        } catch (e) {
        }

        try {
            await customModelApi.createCustomAspect(modelOneName, emptyAspectName, null, emptyAspectName, emptyAspectName);
        } catch (e) {
        }

        acsUser = await usersActions.createUser();

        await apiService.login(acsUser.username, acsUser.password);

        const uploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        await loginPage.login(acsUser.username, acsUser.password);

        const aspects = await nodesApi.getNode(uploadedFile.entry.id);

        aspects.entry.aspectNames.push(modelOneName.concat(':', emptyAspectName));

        aspects.entry.aspectNames.push(defaultModel.concat(':', defaultEmptyPropertiesAspect));

        await nodesApi.updateNode(uploadedFile.entry.id, { aspectNames: aspects.entry.aspectNames });
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

        await navigationBarPage.navigateToContentServices();

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

        await navigationBarPage.navigateToContentServices();

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

        await navigationBarPage.navigateToContentServices();

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

        await navigationBarPage.navigateToContentServices();

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

        await navigationBarPage.navigateToContentServices();

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

        await navigationBarPage.navigateToContentServices();

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();

        await CheckboxPage.check(metadataViewPage.presetSwitch);

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

        await navigationBarPage.navigateToContentServices();

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

        await navigationBarPage.navigateToContentServices();

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
