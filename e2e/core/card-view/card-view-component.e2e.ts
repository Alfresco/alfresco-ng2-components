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

import { element, by } from 'protractor';

import { LoginPage } from '../../pages/adf/loginPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';

import TestConfig = require('../../test.config');
import { CardViewComponentPage } from '../../pages/adf/cardViewComponentPage';
import { Util } from '../../util/util';

describe('CardView Component', () => {
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const cardViewPageComponent = new CardViewComponentPage();
    const metadataViewPage = new MetadataViewPage();

    beforeAll(async (done) => {
        loginPage.loginToContentServices(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        navigationBarPage.clickCardViewButton();

        done();
    });

    afterEach(() => {
        cardViewPageComponent.clickOnResetButton();
    });

    describe('key-value pair ', () => {

        it('[C279938] Should the label be present', () => {
            let label = element(by.css('div[data-automation-id="card-key-value-pairs-label-key-value-pairs"]'));

            Util.waitUntilElementIsPresent(label);
        });

        it('[C279898] Should be possible edit key-value pair properties', () => {
            cardViewPageComponent.clickOnAddButton();
            cardViewPageComponent.setName('testName');
            cardViewPageComponent.setValue('testValue');
            cardViewPageComponent.clickOnAddButton();
            cardViewPageComponent.waitForOutput();
            expect(cardViewPageComponent.getOutputText(0)).toBe('[CardView Key-Value Pairs Item] - [{"name":"testName","value":"testValue"}]');

            cardViewPageComponent.deletePairsValues();

            expect(cardViewPageComponent.getOutputText(1)).toBe('[CardView Key-Value Pairs Item] - []');
        });
    });

    describe('SelectBox', () => {

        it('[C279939] Should the label be present', () => {
            let label = element(by.css('div[data-automation-id="card-select-label-select"]'));

            Util.waitUntilElementIsPresent(label);
        });

        it('[C279899] Should be possible edit selectBox item', () => {
            cardViewPageComponent.clickSelectBox();
            cardViewPageComponent.selectValueFromComboBox(1);

            expect(cardViewPageComponent.getOutputText(0))
                .toBe('[CardView Select Item] - two');
        });
    });

    describe('Text', () => {

        it('[C279937] Should the label be present', () => {
            let label = element(by.css('div[data-automation-id="card-textitem-label-name"]'));

            Util.waitUntilElementIsPresent(label);
        });

        it('[C279943] Should be present a default value', () => {
            expect(cardViewPageComponent.getTextFieldText()).toBe('Spock');
        });

        it('[C279934] Should be possible edit text item', () => {
            cardViewPageComponent
                .clickOnTextField()
                .enterTextField('example')
                .clickOnTextSaveIcon();

            expect(cardViewPageComponent.getOutputText(0)).toBe('[CardView Text Item] - example');
        });

        it('[C279944] Should be possible undo text item modify when click on the clear button', () => {
            cardViewPageComponent
                .clickOnTextField()
                .enterTextField('example')
                .clickOnTextClearIcon();

            expect(cardViewPageComponent.getTextFieldText()).toBe('Spock');
        });
    });

    describe('Int', () => {

        it('[C279940] Should the label be present', () => {
            let label = element(by.css('div[data-automation-id="card-textitem-label-int"]'));

            Util.waitUntilElementIsPresent(label);
        });

        it('[C279945] Should be present a default value', () => {
            expect(cardViewPageComponent.getIntFieldText()).toBe('213');
        });

        it('[C279946] Should be possible edit int item', () => {
            cardViewPageComponent
                .clickOnIntField()
                .enterIntField('99999')
                .clickOnIntSaveIcon();

            expect(cardViewPageComponent.getOutputText(0)).toBe('[CardView Int Item] - 99999');
        });

        it('[C279947] Should not be possible add string value to the int item', () => {
            cardViewPageComponent
                .clickOnIntField()
                .enterIntField('string value')
                .clickOnIntSaveIcon();

            expect(cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279948] Should not be possible add float value to the int item', () => {
            cardViewPageComponent
                .clickOnIntField()
                .enterIntField('0.22')
                .clickOnIntSaveIcon();

            expect(cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279949] Should not be possible have an empty value', () => {
            cardViewPageComponent
                .clickOnIntField()
                .enterIntField(' ')
                .clickOnIntSaveIcon();

            expect(cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279950] Should return an error when the value is > 2147483647', () => {
            cardViewPageComponent
                .clickOnIntField()
                .enterIntField('214748367')
                .clickOnIntSaveIcon();

            expect(cardViewPageComponent.getOutputText(0)).toBe('[CardView Int Item] - 214748367');

            cardViewPageComponent
                .clickOnIntField()
                .enterIntField('2147483648')
                .clickOnIntSaveIcon();

            expect(cardViewPageComponent.getErrorInt()).toBe('Use an integer format');
        });

        it('[C279951] Should be possible undo item modify when click on the clear button', () => {
            cardViewPageComponent
                .clickOnIntField()
                .enterIntField('999')
                .clickOnIntClearIcon();

            expect(cardViewPageComponent.getIntFieldText()).toBe('213');
        });
    });

    describe('Float', () => {

        it('[C279941] Should the label be present', () => {
            let label = element(by.css('div[data-automation-id="card-textitem-label-float"]'));

            Util.waitUntilElementIsPresent(label);
        });

        it('[C279952] Should be present a default value', () => {
            expect(cardViewPageComponent.getFloatFieldText()).toBe('9.9');
        });

        it('[C279953] Should be possible edit float item', () => {
            cardViewPageComponent
                .clickOnFloatField()
                .enterFloatField('77.33')
                .clickOnFloatSaveIcon();

            expect(cardViewPageComponent.getOutputText(0)).toBe('[CardView Float Item] - 77.33');
        });

        it('[C279954] Should not be possible add string value to the float item', () => {
            cardViewPageComponent
                .clickOnFloatField()
                .enterFloatField('string value')
                .clickOnFloatSaveIcon();

            expect(cardViewPageComponent.getErrorFloat()).toBe('Use a number format');
        });

        it('[C279955] Should be possible undo item item modify when click on the clear button', () => {
            cardViewPageComponent
                .clickOnFloatField()
                .enterFloatField('77.33')
                .clickOnFloatClearIcon();

            expect(cardViewPageComponent.getFloatFieldText()).toBe('9.9');
        });

        it('[C279956] Should not be possible have an empty value', () => {
            cardViewPageComponent
                .clickOnFloatField()
                .enterFloatField(' ')
                .clickOnFloatSaveIcon();

            expect(cardViewPageComponent.getErrorFloat()).toBe('Use a number format');
        });

    });

    describe('Boolean', () => {

        it('[C279942] Should the label be present', () => {
            let label = element(by.css('div[data-automation-id="card-boolean-label-boolean"]'));

            Util.waitUntilElementIsPresent(label);
        });

        it('[C279957] Should be possible edit the checkbox value when click on it', () => {
            cardViewPageComponent.checkboxClick();

            expect(cardViewPageComponent.getOutputText(0)).toBe('[CardView Boolean Item] - false');

            cardViewPageComponent.checkboxClick();

            expect(cardViewPageComponent.getOutputText(1)).toBe('[CardView Boolean Item] - true');
        });
    });

    describe('Date and DateTime', () => {

        it('[C279961] Should the label be present', () => {
            let labelDate = element(by.css('div[data-automation-id="card-dateitem-label-date"]'));

            Util.waitUntilElementIsPresent(labelDate);

            let labelDatetime = element(by.css('div[data-automation-id="card-dateitem-label-datetime"]'));

            Util.waitUntilElementIsPresent(labelDatetime);
        });

        it('[C279962] Should be present a default value', () => {
            expect(metadataViewPage.getPropertyText('date', 'date')).toEqual('24.12.1983');
            expect(metadataViewPage.getPropertyText('datetime', 'datetime')).toEqual('Dec 24 1983 10:00');
        });

    });

    it('[C279936] Should not be possible edit any parameter when editable property is false', () => {
        cardViewPageComponent.disableEdit();

        let editIconText = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-name"]'));
        let editIconInt = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-int"]'));
        let editIconFloat = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-float"]'));
        let editIconKey = element(by.css('mat-icon[data-automation-id="card-key-value-pairs-button-key-value-pairs"]'));
        let editIconData = element(by.css('mat-datetimepicker-toggle'));

        Util.waitUntilElementIsNotVisible(editIconText);
        Util.waitUntilElementIsNotVisible(editIconInt);
        Util.waitUntilElementIsNotVisible(editIconFloat);
        Util.waitUntilElementIsNotVisible(editIconKey);
        Util.waitUntilElementIsNotVisible(editIconData);
    });
});
