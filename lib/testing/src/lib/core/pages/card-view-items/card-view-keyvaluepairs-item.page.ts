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
import { by, element } from 'protractor';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';

export class CardViewKeyValuePairsItemPage {

    valueInputLocator = by.css('input[data-automation-id*="card-key-value-pairs-value-input"]');
    nameInputLocator = by.css('input[data-automation-id*="card-key-value-pairs-name-input"]');
    deleteButton = by.css('button[class*="adf-card-view__key-value-pairs__remove-btn"]');
    addButton = by.className('adf-card-view__key-value-pairs__add-btn');
    rowLocator = by.className('adf-card-view__key-value-pairs__row ng-star-inserted');
    item;

    constructor(item) {
        this.item = element(by.xpath(`//div[@data-automation-id="card-key-value-pairs-label-${item}"]/ancestor::adf-card-view-boolitem`));
    }

    setNameOnRowByNumber(name, rowNumber) {
        const nameInputField = this.getRowByNumber(rowNumber).element(this.nameInputLocator);
        BrowserVisibility.waitUntilElementIsVisible(nameInputField);
        nameInputField.sendKeys(name);
        return this;
    }

    setValueOnRowByNumber(value, rowNumber) {
        const valueInputField = this.getRowByNumber(rowNumber).element(this.valueInputLocator);
        BrowserVisibility.waitUntilElementIsVisible(valueInputField);
        valueInputField.sendKeys(value);
        return this;
    }

    deletePairsValuesByRowNumber(rowNumber) {
        BrowserActions.click(this.getRowByNumber(rowNumber).element(this.deleteButton));
        return this;
    }

    clickOnAddButton() {
        BrowserActions.click(this.item.element(this.addButton));
        return this;
    }

    getRowByNumber(rowNumber) {
        return this.item.all(this.rowLocator).get(rowNumber);
    }

}
