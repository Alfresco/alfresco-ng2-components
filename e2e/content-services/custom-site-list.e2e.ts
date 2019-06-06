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

import { LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { ObjectPickerPage } from '../pages/adf/demo-shell/node-selector/objectPicker.page';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

xdescribe('Custom Site List', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const objectPickerPage = new ObjectPickerPage();
    const acsUser = new AcsUserModel();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf.url
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        loginPage.loginToContentServicesUsingUserModel(acsUser);
        navigationBarPage.clickNodeSelectorButton();
        browser.ignoreSynchronization = true;
        objectPickerPage.checkObjectPickerTitleIsDisplayed();
        objectPickerPage.clickCustomSiteListPanel();
        objectPickerPage.checkCustomSiteListExpanded();
        objectPickerPage.enterTextInSiteGuid('-mysites-');
        objectPickerPage.enterTextInSiteTitle('File Libraries');
        objectPickerPage.clickAddButton();
        objectPickerPage.contentListPage().dataTablePage().doubleClickRowByContent('Builds');
        objectPickerPage.contentListPage().dataTablePage().tableIsLoaded();
        done();
    });

    // skipping the test as known issue exists ADF-4264
    it('[C307035] Should update the breadcrumb current folder to chosen location', () => {
        expect(objectPickerPage.breadCrumbDropdownPage().checkCurrentFolderName('Builds')).toBe(true);
        objectPickerPage.sitesDropdownPage().selectLocation('File Libraries');
        objectPickerPage.sitesDropdownPage().checkSelectedSiteIsDisplayed('File Libraries');
        expect(objectPickerPage.breadCrumbDropdownPage().checkCurrentFolderName('File Libraries')).toBe(true);
    });
});
