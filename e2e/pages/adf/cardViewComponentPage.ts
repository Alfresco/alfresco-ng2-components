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

import { by, element, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CardViewComponentPage {

    addButton: ElementFinder = element(by.className('adf-card-view__key-value-pairs__add-btn'));
    selectValue = 'mat-option';
    textField: ElementFinder = element(by.css(`input[data-automation-id='card-textitem-editinput-name']`));
    intField: ElementFinder = element(by.css(`input[data-automation-id='card-textitem-editinput-int']`));
    floatField: ElementFinder = element(by.css(`input[data-automation-id='card-textitem-editinput-float']`));
    valueInputField: ElementFinder = element(by.xpath(`//*[contains(@id,'input') and @placeholder='Value']`));
    nameInputField: ElementFinder = element(by.xpath(`//*[contains(@id,'input') and @placeholder='Name']`));
    consoleLog: ElementFinder = element(by.className('adf-console'));
    deleteButton: ElementFinder = element.all(by.className('adf-card-view__key-value-pairs__remove-btn')).first();
    select: ElementFinder = element(by.css('mat-select[data-automation-class="select-box"]'));
    checkbox: ElementFinder = element(by.css(`mat-checkbox[data-automation-id='card-boolean-boolean']`));
    resetButton: ElementFinder = element(by.css(`#adf-reset-card-log`));
    listContent: ElementFinder = element(by.css('.mat-select-panel'));
    editableSwitch: ElementFinder = element(by.id('adf-toggle-editable'));
    clearDateSwitch: ElementFinder = element(by.id('adf-toggle-clear-date'));
    noneOptionSwitch: ElementFinder = element(by.id('adf-toggle-none-option'));

    async clickOnAddButton(): Promise<void> {
        await BrowserActions.click(this.addButton);
    }

    async clickOnResetButton(): Promise<void> {
        await BrowserActions.click(this.resetButton);
    }

    async clickOnTextField(): Promise<void> {
        const toggleText: ElementFinder = element(by.css(`div[data-automation-id='card-textitem-edit-toggle-name']`));
        await BrowserActions.click(toggleText);
        await BrowserVisibility.waitUntilElementIsVisible(this.textField);
    }

    async clickOnTextClearIcon(): Promise<void> {
        const clearIcon: ElementFinder = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-name"]`));
        await BrowserActions.click(clearIcon);
    }

    async clickOnTextSaveIcon(): Promise<void> {
        const saveIcon: ElementFinder = element(by.css(`mat-icon[data-automation-id="card-textitem-update-name"]`));
        await BrowserActions.click(saveIcon);
    }

    getTextFieldText(): Promise<string> {
        const textField: ElementFinder = element(by.css(`span[data-automation-id="card-textitem-value-name"]`));
        return BrowserActions.getText(textField);
    }

    async enterTextField(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.textField);
        await BrowserActions.clearSendKeys(this.textField, text);
    }

    async clickOnIntField(): Promise<void> {
        const toggleText: ElementFinder = element(by.css('div[data-automation-id="card-textitem-edit-toggle-int"]'));
        await BrowserActions.click(toggleText);
        await BrowserVisibility.waitUntilElementIsVisible(this.intField);
    }

    async clickOnIntClearIcon(): Promise<void> {
        const clearIcon: ElementFinder = element(by.css('mat-icon[data-automation-id="card-textitem-reset-int"]'));
        await BrowserActions.click(clearIcon);
    }

    async clickOnIntSaveIcon(): Promise<void> {
        const saveIcon: ElementFinder = element(by.css('mat-icon[data-automation-id="card-textitem-update-int"]'));
        await BrowserActions.click(saveIcon);
    }

    async enterIntField(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.intField);
        await BrowserActions.clearSendKeys(this.intField, text);
    }

    getIntFieldText(): Promise<string> {
        const textField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-int"]'));
        return BrowserActions.getText(textField);
    }

    getErrorInt(): Promise<string> {
        const errorElement: ElementFinder = element(by.css('mat-error[data-automation-id="card-textitem-error-int"]'));
        return BrowserActions.getText(errorElement);
    }

    async clickOnFloatField(): Promise<void> {
        const toggleText: ElementFinder = element(by.css('div[data-automation-id="card-textitem-edit-toggle-float"]'));
        await BrowserActions.click(toggleText);
        await BrowserVisibility.waitUntilElementIsVisible(this.floatField);
    }

    async clickOnFloatClearIcon(): Promise<void> {
        const clearIcon: ElementFinder = element(by.css(`mat-icon[data-automation-id="card-textitem-reset-float"]`));
        await BrowserActions.click(clearIcon);
    }

    async clickOnFloatSaveIcon(): Promise<void> {
        const saveIcon: ElementFinder = element(by.css(`mat-icon[data-automation-id="card-textitem-update-float"]`));
        await BrowserActions.click(saveIcon);
    }

    async enterFloatField(text): Promise<void> {
        await BrowserActions.clearSendKeys(this.floatField, text);
    }

    getFloatFieldText(): Promise<string> {
        const textField: ElementFinder = element(by.css('span[data-automation-id="card-textitem-value-float"]'));
        return BrowserActions.getText(textField);
    }

    getErrorFloat(): Promise<string> {
        const errorElement: ElementFinder = element(by.css('mat-error[data-automation-id="card-textitem-error-float"]'));
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
        return BrowserActions.getText(this.consoleLog.all(by.css('p')).get(index));
    }

    async deletePairsValues(): Promise<void> {
        await BrowserActions.click(this.deleteButton);
    }

    async clickSelectBox(): Promise<void> {
        await BrowserActions.click(this.select);
        await BrowserVisibility.waitUntilElementIsVisible(this.listContent);
    }

    async checkboxClick(): Promise<void> {
        await BrowserActions.click(this.checkbox);
    }

    async selectValueFromComboBox(index): Promise<void> {
        const value: ElementFinder = element.all(by.className(this.selectValue)).get(index);
        await BrowserActions.click(value);
    }

    async disableEdit(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.editableSwitch);

        const check = await this.editableSwitch.getAttribute('class');
        if (check.indexOf('mat-checked') > -1) {
            await BrowserActions.click(this.editableSwitch);
            await expect(await this.editableSwitch.getAttribute('class')).not.toContain('mat-checked');
        }
    }

    async getDateValue(): Promise<string> {
        const dateValue = element(by.css('span[data-automation-id="card-date-value-date"]'));
        return dateValue.getText();
    }

    async getDateTimeValue(): Promise<string> {
        const dateTimeValue = element(by.css('span[data-automation-id="card-datetime-value-datetime"]'));
        return dateTimeValue.getText();
    }

    async clearDateField(): Promise<void> {
        const clearDateButton = element(by.css('mat-icon[data-automation-id="datepicker-date-clear-date"]'));
        await BrowserActions.click(clearDateButton);
    }

    async clearDateTimeField(): Promise<void> {
        const clearDateButton = element(by.css('mat-icon[data-automation-id="datepicker-date-clear-datetime"]'));
        await BrowserActions.click(clearDateButton);
    }

    async enableClearDate(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.clearDateSwitch);

        const switchClass = await this.clearDateSwitch.getAttribute('class');
        if (switchClass.indexOf('mat-checked') === -1) {
            await this.clearDateSwitch.click();
            const clearDateChecked = element(by.css('mat-slide-toggle[id="adf-toggle-clear-date"][class*="mat-checked"]'));
            await BrowserVisibility.waitUntilElementIsVisible(clearDateChecked);
        }
    }

    async enableNoneOption(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noneOptionSwitch);

        const switchClass = await this.noneOptionSwitch.getAttribute('class');
        if (switchClass.indexOf('mat-checked') === -1) {
            await this.noneOptionSwitch.click();
            const noneOptionChecked = element(by.css('mat-slide-toggle[id="adf-toggle-none-option"][class*="mat-checked"]'));
            await BrowserVisibility.waitUntilElementIsVisible(noneOptionChecked);
        }
    }

}
