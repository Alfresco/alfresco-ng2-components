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

import { LoginPage } from '../pages/adf/loginPage';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { IconsPage } from '../pages/adf/iconsPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';

import TestConfig = require('../test.config');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Universal Icon component', function () {

    let loginPage = new LoginPage();
    let acsUser = new AcsUserModel();
    let navigationBarPage = new NavigationBarPage();
    let iconsPage = new IconsPage();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    beforeEach(async (done) => {
        navigationBarPage.navigateToIconsPage();
        done();
    });

    it('[C291872] Should display the icons on the page', () => {

        expect(iconsPage.locateLigatureIcon('folder').isDisplayed()).toBe(true, 'Ligature icon is not displayed');

        expect(iconsPage.locateCustomIcon('adf:move_file').isDisplayed()).toBe(true, 'Named icon is not displayed');

        expect(iconsPage.locateCustomIcon('adf:folder').isDisplayed()).toBe(true, 'Thumbnail service icon is not displayed');
    });

});
