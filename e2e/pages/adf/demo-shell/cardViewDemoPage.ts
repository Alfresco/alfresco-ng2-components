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
import { BrowserVisibility, BrowserActions, CardViewComponentPage } from '@alfresco/adf-testing';

export class CardViewDemoPage {

    cardViewComponentPage = new CardViewComponentPage();
    cardViewTextItemFieldName = 'name';
    consoleLog = element(by.className('adf-console'));
    editableSwitch = element(by.id('adf-toggle-editable'));
    resetButton = element(by.css(`#adf-reset-card-log`));

    cardViewTextItemField() {
        return this.cardViewComponentPage.cardViewTextItem(this.cardViewTextItemFieldName);
    }

    waitForOutput() {
        BrowserVisibility.waitUntilElementIsVisible(this.consoleLog);
        return this;
    }

    getOutputText(index) {
        return BrowserActions.getText(this.consoleLog.all(by.css('p')).get(index));
    }

    disableEdit() {
        BrowserVisibility.waitUntilElementIsVisible(this.editableSwitch);

        this.editableSwitch.getAttribute('class').then((check) => {
            if (check.indexOf('mat-checked') > -1) {
                this.editableSwitch.click();
                expect(this.editableSwitch.getAttribute('class')).not.toContain('mat-checked');
            }
        });
    }

    clickOnResetButton() {
        BrowserActions.click(this.resetButton);
        return this;
    }

}
