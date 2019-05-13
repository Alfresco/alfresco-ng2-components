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
import { EditProcessFilterDialogPage } from './dialog/edit-process-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class EditProcessFilterCloudComponentPage {

    customiseFilter = element(by.id('adf-edit-process-filter-title-id'));
    selectedOption = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    saveButton = element(by.css('button[data-automation-id="adf-filter-action-save"]'));
    saveAsButton = element(by.css('button[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton = element(by.css('button[data-automation-id="adf-filter-action-delete"]'));

    editProcessFilterDialogPage = new EditProcessFilterDialogPage();

    editProcessFilterDialog() {
        return this.editProcessFilterDialogPage;
    }

    clickCustomiseFilterHeader() {
        BrowserActions.click(this.customiseFilter);
        return this;
    }

    checkCustomiseFilterHeaderIsExpanded() {
        const expansionPanelExtended = element.all(by.css('mat-expansion-panel-header[class*="mat-expanded"]')).first();
        BrowserVisibility.waitUntilElementIsVisible(expansionPanelExtended);
        const content = element.all(by.css('div[class*="mat-expansion-panel-content "][style*="visible"]')).first();
        BrowserVisibility.waitUntilElementIsVisible(content);
        return this;
    }

    setStatusFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        const statusElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserActions.click(statusElement);
        return this;
    }

    getStateFilterDropDownValue() {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='status'] span")));
    }

    setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        const sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserActions.click(sortElement);
        return this;
    }

    getSortFilterDropDownValue() {
        const sortLocator = element.all(by.css("mat-form-field[data-automation-id='sort'] span")).first();
        return BrowserActions.getText(sortLocator);
    }

    setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        const orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserActions.click(orderElement);
        return this;
    }

    getOrderFilterDropDownValue() {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='order'] span")));
    }

    clickOnDropDownArrow(option) {
        const dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class='mat-select-arrow-wrapper']")).first();
        BrowserVisibility.waitUntilElementIsVisible(dropDownArrow);
        BrowserActions.click(dropDownArrow);
        BrowserVisibility.waitUntilElementIsVisible(this.selectedOption);
    }

    setAppNameDropDown(option) {
        this.clickOnDropDownArrow('appName');

        const appNameElement = element.all(by.cssContainingText('mat-option span', option)).first();
        BrowserVisibility.waitUntilElementIsClickable(appNameElement);
        BrowserVisibility.waitUntilElementIsVisible(appNameElement);
        appNameElement.click();
        return this;
    }

    async checkAppNamesAreUnique() {
        const appNameList = element.all(by.css('mat-option[data-automation-id="adf-cloud-edit-process-property-optionsappName"] span'));
        const appTextList: any = await appNameList.getText();
        const uniqueArray = appTextList.filter((appName) => {
            const sameAppNameArray = appTextList.filter((eachApp) => eachApp === appName);
            return sameAppNameArray.length === 1;
        });
        return uniqueArray.length === appTextList.length;
    }

    getNumberOfAppNameOptions() {
        this.clickOnDropDownArrow('appName');
        const dropdownOptions = element.all(by.css('.mat-select-panel mat-option'));
        return dropdownOptions.count();
    }

    setProcessInstanceId(option) {
        return this.setProperty('processInstanceId', option);
    }

    getProcessInstanceId() {
        return this.getProperty('processInstanceId');
    }

    getProperty(property) {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        BrowserVisibility.waitUntilElementIsVisible(locator);
        return locator.getAttribute('value');
    }

    setProperty(property, option) {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkSaveButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    checkSaveAsButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this;
    }

    checkDeleteButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this;
    }

    checkSaveButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    checkSaveAsButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this.saveAsButton.isEnabled();
    }

    checkDeleteButtonIsEnabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this.deleteButton.isEnabled();
    }

    clickSaveAsButton() {
        const disabledButton = element(by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
        BrowserVisibility.waitUntilElementIsClickable(this.saveAsButton);
        BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        this.saveAsButton.click();
        return this.editProcessFilterDialogPage;
    }

    clickDeleteButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        this.deleteButton.click();
        return this;
    }

    clickSaveButton() {
        const disabledButton = element(by.css(("button[id='adf-save-as-id'][disabled]")));
        BrowserVisibility.waitUntilElementIsClickable(this.saveButton);
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        this.saveButton.click();
        return this;
    }
}
