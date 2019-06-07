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
import { BrowserVisibility, BrowserActions, CardViewComponentPage, FormControllersPage } from '@alfresco/adf-testing';

export class CardViewDemoPage {

    cardViewComponentPage = new CardViewComponentPage();
    formControllerPage = new FormControllersPage();
    cardViewTextItemFieldName = 'name';
    cardViewIntItemFieldName = 'int';
    cardViewFloatItemFieldName = 'float';
    cardViewSelectItemFieldName = 'select';
    cardViewBooleanItemFieldName = 'boolean';
    cardViewValueKeyPairsItemFieldName = 'key-value-pairs';
    consoleLog = element(by.className('adf-console'));
    editableSwitch = element(by.id('adf-toggle-editable'));
    resetButton = element(by.css(`#adf-reset-card-log`));

    cardViewTextItemField() {
        return this.cardViewComponentPage.cardViewTextItem(this.cardViewTextItemFieldName);
    }

    cardViewIntItemField() {
        return this.cardViewComponentPage.cardViewTextItem(this.cardViewIntItemFieldName);
    }

    cardViewFloatItemField() {
        return this.cardViewComponentPage.cardViewTextItem(this.cardViewFloatItemFieldName);
    }

    cardViewSelectItemField() {
        return this.cardViewComponentPage.cardViewSelectItem(this.cardViewSelectItemFieldName);
    }

    cardViewBooleanItemField() {
        return this.cardViewComponentPage.cardViewBooleanItem(this.cardViewBooleanItemFieldName);
    }

    cardViewValueKeyPairsItemField() {
        return this.cardViewComponentPage.cardViewValueKeyPairsItem(this.cardViewValueKeyPairsItemFieldName);
    }

    waitForOutput() {
        BrowserVisibility.waitUntilElementIsVisible(this.consoleLog);
        return this;
    }

    getOutputText(index) {
        return BrowserActions.getText(this.consoleLog.all(by.css('p')).get(index));
    }

    disableEdit() {
        this.formControllerPage.disableToggle(this.editableSwitch);
    }

    clickOnResetButton() {
        BrowserActions.click(this.resetButton);
        return this;
    }

}
