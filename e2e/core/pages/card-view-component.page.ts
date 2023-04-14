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

import { $, by, element } from 'protractor';
import {
    BrowserVisibility,
    BrowserActions,
    CardTextItemPage,
    DropdownPage,
    CardBooleanItemPage
} from '@alfresco/adf-testing';

export class CardViewComponentPage {

    addButton = element(by.className('adf-card-view__key-value-pairs__add-btn'));
    nameCardTextItem = new CardTextItemPage('name');
    booleanCardBooleanItem = new CardBooleanItemPage('boolean');
    intField = $(`input[data-automation-id='card-textitem-editinput-int']`);
    floatField = $(`input[data-automation-id='card-textitem-editinput-float']`);
    valueInputField = element(by.xpath(`//*[contains(@id,'input') and @placeholder='Value']`));
    nameInputField = element(by.xpath(`//*[contains(@id,'input') and @placeholder='Name']`));
    consoleLog = element(by.className('app-console'));
    deleteButton = element.all(by.className('adf-card-view__key-value-pairs__remove-btn')).first();
    resetButton = $(`#adf-reset-card-log`);
    editableSwitch = $('#app-toggle-editable');
    clearDateSwitch = $('#app-toggle-clear-date');
    noneOptionSwitch = $('#app-toggle-none-option');
    clickableField = $(`[data-automation-id="card-textitem-toggle-click"]`);

    selectDropdown = new DropdownPage($('mat-select[data-automation-class="select-box"]'));

    async clickOnAddButton(): Promise<void> {
        await BrowserActions.click(this.addButton);
    }

    async checkNameTextLabelIsPresent(): Promise<void> {
        await this.nameCardTextItem.checkLabelIsPresent();
    }

    async getNameTextFieldText(): Promise<string> {
        return this.nameCardTextItem.getFieldValue();
    }

    async enterNameTextField(text: string): Promise<void> {
        await this.nameCardTextItem.enterTextField(text);
    }

    async clickOnNameTextSaveIcon(): Promise<void> {
        await this.nameCardTextItem.clickOnSaveButton();
    }

    async clickOnNameTextClearIcon(): Promise<void> {
        await this.nameCardTextItem.clickOnClearButton();
    }

    async clickOnResetButton(): Promise<void> {
        await BrowserActions.click(this.resetButton);
    }

    async clickOnIntField(): Promise<void> {
        const toggleText = $('div[data-automation-id="card-textitem-toggle-int"]');
        await BrowserActions.click(toggleText);
        await BrowserVisibility.waitUntilElementIsVisible(this.intField);
    }

    async clickOnIntClearIcon(): Promise<void> {
        const clearIcon = $('button[data-automation-id="card-textitem-reset-int"]');
        await BrowserActions.click(clearIcon);
    }

    async clickOnIntSaveIcon(): Promise<void> {
        const saveIcon = $('button[data-automation-id="card-textitem-update-int"]');
        await BrowserActions.click(saveIcon);
    }

    async enterIntField(text): Promise<void> {
        await BrowserActions.clearSendKeys(this.intField, text);
    }

    getIntFieldText(): Promise<string> {
        const textField = $('span[data-automation-id="card-textitem-value-int"]');
        return BrowserActions.getText(textField);
    }

    getErrorInt(): Promise<string> {
        const errorElement = $('mat-error[data-automation-id="card-textitem-error-int"]');
        return BrowserActions.getText(errorElement);
    }

    async clickOnFloatField(): Promise<void> {
        const toggleText = $('div[data-automation-id="card-textitem-toggle-float"]');
        await BrowserActions.click(toggleText);
        await BrowserVisibility.waitUntilElementIsVisible(this.floatField);
    }

    async clickOnFloatClearIcon(): Promise<void> {
        const clearIcon = $(`button[data-automation-id="card-textitem-reset-float"]`);
        await BrowserActions.click(clearIcon);
    }

    async clickOnFloatSaveIcon(): Promise<void> {
        const saveIcon = $(`button[data-automation-id="card-textitem-update-float"]`);
        await BrowserActions.click(saveIcon);
    }

    async enterFloatField(text): Promise<void> {
        await BrowserActions.clearSendKeys(this.floatField, text);
    }

    getFloatFieldText(): Promise<string> {
        const textField = $('span[data-automation-id="card-textitem-value-float"]');
        return BrowserActions.getText(textField);
    }

    getErrorFloat(): Promise<string> {
        const errorElement = $('mat-error[data-automation-id="card-textitem-error-float"]');
        return BrowserActions.getText(errorElement);
    }

    async setName(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.nameInputField, name);
    }

    async setValue(value): Promise<void> {
        await BrowserActions.clearSendKeys(this.valueInputField, value);
    }

    async waitForOutput(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.consoleLog);
    }

    getOutputText(index: number): Promise<string> {
        return BrowserActions.getText(this.consoleLog.$$('p').get(index));
    }

    async deletePairsValues(): Promise<void> {
        await BrowserActions.click(this.deleteButton);
    }

    async clickSelectBox(): Promise<void> {
        await this.selectDropdown.clickDropdown();
        await this.selectDropdown.checkOptionsPanelIsDisplayed();
    }

    async checkboxClick(): Promise<void> {
        await this.booleanCardBooleanItem.checkboxClick();
    }

    async checkBooleanLabelIsPresent(): Promise<void> {
        await this.booleanCardBooleanItem.checkLabelIsPresent();
    }

    async selectValueFromComboBox(index): Promise<void> {
        await this.selectDropdown.selectOptionFromIndex(index);
    }

    async disableEdit(): Promise<void> {
        const check = await BrowserActions.getAttribute(this.editableSwitch, 'class');
        if (check.indexOf('mat-checked') > -1) {
            await BrowserActions.click(this.editableSwitch);
            await expect(await BrowserActions.getAttribute(this.editableSwitch, 'class')).not.toContain('mat-checked');
        }
    }

    async getDateValue(): Promise<string> {
        const dateValue = $('span[data-automation-id="card-date-value-date"]');
        return dateValue.getText();
    }

    async getDateTimeValue(): Promise<string> {
        const dateTimeValue = $('span[data-automation-id="card-datetime-value-datetime"]');
        return dateTimeValue.getText();
    }

    async clearDateField(): Promise<void> {
        const clearDateButton = $('mat-icon[data-automation-id="datepicker-date-clear-date"]');
        await BrowserActions.click(clearDateButton);
    }

    async clearDateTimeField(): Promise<void> {
        const clearDateButton = $('mat-icon[data-automation-id="datepicker-date-clear-datetime"]');
        await BrowserActions.click(clearDateButton);
    }

    async enableClearDate(): Promise<void> {
        const switchClass = await BrowserActions.getAttribute(this.editableSwitch, 'class');
        if (switchClass.indexOf('mat-checked') === -1) {
            await this.clearDateSwitch.click();
            const clearDateChecked = $('mat-slide-toggle[id="app-toggle-clear-date"][class*="mat-checked"]');
            await BrowserVisibility.waitUntilElementIsVisible(clearDateChecked);
        }
    }

    async enableNoneOption(): Promise<void> {
        const switchClass = await BrowserActions.getAttribute(this.noneOptionSwitch, 'class');
        if (switchClass.indexOf('mat-checked') === -1) {
            await this.noneOptionSwitch.click();
            const noneOptionChecked = $('mat-slide-toggle[id="app-toggle-none-option"][class*="mat-checked"]');
            await BrowserVisibility.waitUntilElementIsVisible(noneOptionChecked);
        }
    }

    async isErrorNotDisplayed(): Promise<boolean> {
        const errorElement = $('mat-error[data-automation-id="card-textitem-error-int"]');
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(errorElement);
            return true;
        } catch {
            return false;
        }
    }

    async getClickableValue(): Promise<string> {
        return this.clickableField.getText();
    }

    async updateClickableField(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.clickableField);
        await BrowserActions.click(this.clickableField);
        const inputField = $('input[data-automation-id="card-textitem-editinput-click"]');
        await BrowserVisibility.waitUntilElementIsPresent(inputField);
        await BrowserActions.clearSendKeys(inputField, text);
        const save = $('[data-automation-id="card-textitem-update-click"]');
        await BrowserVisibility.waitUntilElementIsVisible(save);
        await BrowserActions.click(save);
    }

    async hasCardViewConsoleLog(text: string): Promise<string> {
        const cardViewConsole = element(by.cssContainingText('.app-console', text));
        await BrowserVisibility.waitUntilElementIsVisible(cardViewConsole);
        return cardViewConsole.getText();
    }

    async clearIntField(): Promise<void> {
        await this.intField.clear();
    }

}
