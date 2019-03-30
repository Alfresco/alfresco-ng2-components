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

import { by, element, protractor } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class EditProcessFilterDialog {

    componentElement = element(by.css('adf-cloud-process-filter-dialog-cloud'));
    title = element(by.id('adf-process-filter-dialog-title'));
    filterNameInput = element(by.id('adf-filter-name-id'));
    saveButtonLocator = by.id('adf-save-button-id');
    cancelButtonLocator = by.id('adf-cancel-button-id');

    clickOnSaveButton() {
        const saveButton = this.componentElement.element(this.saveButtonLocator);
        BrowserVisibility.waitUntilElementIsVisible(saveButton);
        saveButton.click();
        BrowserVisibility.waitUntilElementIsNotVisible(this.componentElement);
        return this;
    }

    checkSaveButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.componentElement.element(this.saveButtonLocator));
        return this.componentElement.element(this.saveButtonLocator).isEnabled();
    }

    clickOnCancelButton() {
        const cancelButton = this.componentElement.element(this.cancelButtonLocator);
        BrowserVisibility.waitUntilElementIsVisible(cancelButton);
        cancelButton.click();
        BrowserVisibility.waitUntilElementIsNotVisible(this.componentElement);
        return this;
    }

    checkCancelButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.componentElement.element(this.cancelButtonLocator));
        return this.componentElement.element(this.cancelButtonLocator).isEnabled();
    }

    getFilterName() {
        BrowserVisibility.waitUntilElementIsVisible(this.filterNameInput);
        return this.filterNameInput.getAttribute('value');
    }

    setFilterName(filterName) {
        this.clearFilterName();
        this.filterNameInput.sendKeys(filterName);
        return this;
    }

    clearFilterName() {
        BrowserVisibility.waitUntilElementIsVisible(this.filterNameInput);
        this.filterNameInput.click();
        this.filterNameInput.getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filterNameInput.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }

    getTitle() {
        BrowserVisibility.waitUntilElementIsVisible(this.title);
        return this.title.getText();
    }

}
