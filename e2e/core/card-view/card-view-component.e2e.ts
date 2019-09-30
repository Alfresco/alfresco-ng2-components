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

import { element, by, browser } from 'protractor';

import { LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';

import { CardViewComponentPage } from '../../pages/adf/cardViewComponentPage';
import { BrowserVisibility } from '@alfresco/adf-testing';

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

    describe('key-value pair ', () => {

        it('[C279938] Should the label be present', async () => {
            const label = element(by.css('div[data-automation-id="card-key-value-pairs-label-key-value-pairs"]'));

            await BrowserVisibility.waitUntilElementIsPresent(label);
        });

        it('[C279898] Should be possible edit key-value pair properties', async () => {
            await cardViewPageComponent.clickOnAddButton();
            await cardViewPageComponent.setName('testName');
            await cardViewPageComponent.setValue('testValue');
            await cardViewPageComponent.clickOnAddButton();
            await cardViewPageComponent.waitForOutput();
            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Key-Value Pairs Item] - [{"name":"testName","value":"testValue"}]');

            await cardViewPageComponent.deletePairsValues();

            await expect(await cardViewPageComponent.getOutputText(1)).toBe('[CardView Key-Value Pairs Item] - []');
        });
    });

    describe('SelectBox', () => {

        it('[C279939] Should the label be present', async () => {
            const label = element(by.css('div[data-automation-id="card-select-label-select"]'));

            await BrowserVisibility.waitUntilElementIsPresent(label);
        });

        it('[C279899] Should be possible edit selectBox item', async () => {
            await cardViewPageComponent.clickSelectBox();
            await cardViewPageComponent.selectValueFromComboBox(1);

            await expect(await cardViewPageComponent.getOutputText(0))
                .toBe('[CardView Select Item] - two');
        });

        it('[C312448] Should be able to enable None option', async () => {
            await cardViewPageComponent.enableNoneOption();
            await cardViewPageComponent.clickSelectBox();
            await cardViewPageComponent.selectValueFromComboBox(0);

            await expect(cardViewPageComponent.getOutputText(0))
                .toBe('[CardView Select Item] - null');
        });
    });

    describe('Text', () => {

        it('[C279937] Should the label be present', async () => {
            const label = element(by.css('div[data-automation-id="card-textitem-label-name"]'));

            await BrowserVisibility.waitUntilElementIsPresent(label);
        });

        it('[C279943] Should be present a default value', async () => {
            await expect(await cardViewPageComponent.getTextFieldText()).toBe('Spock');
        });

        it('[C279934] Should be possible edit text item', async () => {
            await cardViewPageComponent.clickOnTextField();
            await cardViewPageComponent.enterTextField('example');
            await cardViewPageComponent.clickOnTextSaveIcon();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Text Item] - example');
        });

        it('[C279944] Should be possible undo text item modify when click on the clear button', async () => {
            await cardViewPageComponent.clickOnTextField();
            await cardViewPageComponent.enterTextField('example');
            await cardViewPageComponent.clickOnTextClearIcon();

            await expect(await cardViewPageComponent.getTextFieldText()).toBe('Spock');
        });
    });

    describe('Int', () => {

        it('[C279940] Should the label be present', async () => {
            const label = element(by.css('div[data-automation-id="card-textitem-label-int"]'));

            await BrowserVisibility.waitUntilElementIsPresent(label);
        });

        it('[C279945] Should be present a default value', async () => {
            await expect(await cardViewPageComponent.getIntFieldText()).toBe('213');
        });

        it('[C279946] Should be possible edit int item', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('99999');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Int Item] - 99999');
        });

        it('[C279947] Should not be possible add string value to the int item', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('string value');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279948] Should not be possible add float value to the int item', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('0.22');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279949] Should not be possible have an empty value', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField(' ');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279950] Should return an error when the value is > 2147483647', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('214748367');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Int Item] - 214748367');

            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('2147483648');
            await cardViewPageComponent.clickOnIntSaveIcon();

            await expect(await cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279951] Should be possible undo item modify when click on the clear button', async () => {
            await cardViewPageComponent.clickOnIntField();
            await cardViewPageComponent.enterIntField('999');
            await cardViewPageComponent.clickOnIntClearIcon();

            await expect(await cardViewPageComponent.getIntFieldText()).toBe('213');
        });
    });

    describe('Float', () => {

        it('[C279941] Should the label be present', async () => {
            const label = element(by.css('div[data-automation-id="card-textitem-label-float"]'));

            await BrowserVisibility.waitUntilElementIsPresent(label);
        });

        it('[C279952] Should be present a default value', async () => {
            await expect(await cardViewPageComponent.getFloatFieldText()).toBe('9.9');
        });

        it('[C279953] Should be possible edit float item', async () => {
            await cardViewPageComponent.clickOnFloatField();
            await cardViewPageComponent.enterFloatField('77.33');
            await cardViewPageComponent.clickOnFloatSaveIcon();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Float Item] - 77.33');
        });

        it('[C279954] Should not be possible add string value to the float item', async () => {
            await cardViewPageComponent.clickOnFloatField();
            await cardViewPageComponent.enterFloatField('string value');
            await cardViewPageComponent.clickOnFloatSaveIcon();

            await expect(await cardViewPageComponent.getErrorFloat()).toBe('Use a number format');
        });

        it('[C279955] Should be possible undo item item modify when click on the clear button', async () => {
            await cardViewPageComponent.clickOnFloatField();
            await cardViewPageComponent.enterFloatField('77.33');
            await cardViewPageComponent.clickOnFloatClearIcon();

            await expect(await cardViewPageComponent.getFloatFieldText()).toBe('9.9');
        });

        it('[C279956] Should not be possible have an empty value', async () => {
            await cardViewPageComponent.clickOnFloatField();
            await cardViewPageComponent.enterFloatField(' ');
            await cardViewPageComponent.clickOnFloatSaveIcon();

            await expect(await cardViewPageComponent.getErrorFloat()).toBe('Use a number format');
        });

    });

    describe('Boolean', () => {

        it('[C279942] Should the label be present', async () => {
            const label = element(by.css('div[data-automation-id="card-boolean-label-boolean"]'));

            await BrowserVisibility.waitUntilElementIsPresent(label);
        });

        it('[C279957] Should be possible edit the checkbox value when click on it', async () => {
            await cardViewPageComponent.checkboxClick();

            await expect(await cardViewPageComponent.getOutputText(0)).toBe('[CardView Boolean Item] - false');

            await cardViewPageComponent.checkboxClick();

            await expect(await cardViewPageComponent.getOutputText(1)).toBe('[CardView Boolean Item] - true');
        });
    });

    describe('Date and DateTime', () => {

        it('[C279961] Should the label be present', async () => {
            const labelDate = element(by.css('div[data-automation-id="card-dateitem-label-date"]'));

            await BrowserVisibility.waitUntilElementIsPresent(labelDate);

            const labelDatetime = element(by.css('div[data-automation-id="card-dateitem-label-datetime"]'));

            await BrowserVisibility.waitUntilElementIsPresent(labelDatetime);
        });

        it('[C279962] Should be present a default value', async () => {
            await expect(await metadataViewPage.getPropertyText('date', 'date')).toEqual('12/24/83');
            await expect(await metadataViewPage.getPropertyText('datetime', 'datetime')).toEqual('Dec 24, 1983, 10:00');
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

    it('[C279936] Should not be possible edit any parameter when editable property is false', async () => {
        await cardViewPageComponent.disableEdit();

        const editIconText = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-name"]'));
        const editIconInt = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-int"]'));
        const editIconFloat = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-float"]'));
        const editIconKey = element(by.css('mat-icon[data-automation-id="card-key-value-pairs-button-key-value-pairs"]'));
        const editIconData = element(by.css('mat-datetimepicker-toggle'));

        await BrowserVisibility.waitUntilElementIsNotVisible(editIconText);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconInt);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconFloat);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconKey);
        await BrowserVisibility.waitUntilElementIsNotVisible(editIconData);
    });
});
