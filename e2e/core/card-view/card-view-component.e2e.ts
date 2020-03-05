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

import { BrowserVisibility, LoginPage } from '@alfresco/adf-testing';
import { browser, by, element } from 'protractor';
import { CardViewComponentPage } from '../../pages/adf/card-view-component.page';
import { MetadataViewPage } from '../../pages/adf/metadata-view.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('CardView Component', () => {
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const cardViewPageComponent = new CardViewComponentPage();
    const metadataViewPage = new MetadataViewPage();

    beforeAll(async () => {
        await loginPage.loginToContentServices(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await navigationBarPage.clickCardViewButton();
   });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    afterEach(async () => {
        await cardViewPageComponent.clickOnResetButton();
    });

    describe('Int', () => {

        it('[C279946] Should be possible edit int item', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('99999');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Int Item] - 99999');
        });
    });

    describe('Boolean', () => {

        it('[C279957] Should be possible edit the checkbox value when click on it', async () => {
            await cardViewPageComponent.checkboxClick();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Boolean Item] - false');

            await cardViewPageComponent.checkboxClick();

            await expect(await cardViewPageComponent.getOutputText(1)).toBe('[CardView Boolean Item] - true');
        });
    });

    describe('Date and DateTime', () => {

        it('[C279962] Should be present a default value', async () => {
            await expect(await metadataViewPage.getPropertyText('date', 'date')).toEqual('12/24/83');
            await expect(await metadataViewPage.getPropertyText('datetime', 'datetime')).toEqual('12/24/83, 10:00 AM');
        });

        it('[C312447] Should be able to clear the date field', async () => {
            await cardViewPageComponent.enableClearDate();
            await cardViewPageComponent.clearDateField();
            await expect(await cardViewPageComponent.getDateValue()).toBe('', 'Date field should be cleared');
            await expect(cardViewPageComponent.getOutputText(0))
                .toBe('[CardView Date Item] - null');
            await cardViewPageComponent.clearDateTimeField();
            await expect(await cardViewPageComponent.getDateTimeValue()).toBe('', 'DateTime field should be cleared');
            await expect(cardViewPageComponent.getOutputText(1))
                .toBe('[CardView Datetime Item] - null');
        });
   });

    it('[C306895] Should display the form field as editable and clickable depending on the \'Editable\' toggle mode.', async () => {
        const message = 'clickable updated';
        await cardViewPageComponent.clickOnResetButton();
        await expect(await cardViewPageComponent.getClickableValue()).toContain('click here');

        await cardViewPageComponent.updateClickableField(message);
        await expect(await cardViewPageComponent.hasCardViewConsoleLog(message)).toContain(`[This is clickable ] - ${message}`);

        await cardViewPageComponent.clickOnResetButton();
        await cardViewPageComponent.updateClickableField('');
        await expect(await cardViewPageComponent.hasCardViewConsoleLog('[This is clickable ] -' )).toContain('[This is clickable ] -');
    });

    it('[C279936] Should not be possible edit any parameter when editable property is false', async () => {
        await cardViewPageComponent.disableEdit();

        const editIconText = element(by.css('button[data-automation-id="card-textitem-edit-icon-name"]'));
        const editIconInt = element(by.css('button[data-automation-id="card-textitem-edit-icon-int"]'));
        const editIconFloat = element(by.css('button[data-automation-id="card-textitem-edit-icon-float"]'));
        const editIconKey = element(by.css('mat-icon[data-automation-id="card-key-value-pairs-button-key-value-pairs"]'));
        const editIconData = element(by.css('mat-datetimepicker-toggle'));

        await BrowserVisibility.waitUntilElementIsNotVisible(editIconText);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconInt);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconFloat);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconKey);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconData);
    });
});
