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

export class CardViewSelectItemPage {

    selectBox = by.css('mat-select[data-automation-class="select-box"]');
    listContent = element(by.css('.mat-select-panel'));
    selectValue = 'mat-option';
    item;

    constructor(item) {
        this.item = element(by.xpath(`//div[@data-automation-id="card-select-label-${item}"]/ancestor::adf-card-view-selectitem`));
    }

    selectValueFromComboBox(index) {
        const value = element.all(by.className(this.selectValue)).get(index);
        BrowserActions.click(value);
        return this;
    }

    clickSelectBox() {
        BrowserActions.click(this.item.element(this.selectBox));
        BrowserVisibility.waitUntilElementIsVisible(this.listContent);
        return this;
    }

}
