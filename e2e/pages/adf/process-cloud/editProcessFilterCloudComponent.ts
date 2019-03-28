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
import { Util } from '../../../util/util';
import { by, element, protractor } from 'protractor';
import { EditProcessFilterDialog } from '../dialog/editProcessFilterDialog';

export class EditProcessFilterCloudComponent {

    customiseFilter = element(by.id('adf-edit-process-filter-title-id'));
    selectedOption = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    saveButton = element(by.css('button[data-automation-id="adf-filter-action-save"]'));
    saveAsButton = element(by.css('button[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton = element(by.css('button[data-automation-id="adf-filter-action-delete"]'));

    editProcessFilter = new EditProcessFilterDialog();

    editProcessFilterDialog() {
        return this.editProcessFilter;
    }

    clickCustomiseFilterHeader() {
        Util.waitUntilElementIsVisible(this.customiseFilter);
        this.customiseFilter.click();
        return this;
    }

    checkCustomiseFilterHeaderIsExpanded() {
        const expansionPanelExtended = element.all(by.css('mat-expansion-panel-header[class*="mat-expanded"]')).first();
        Util.waitUntilElementIsVisible(expansionPanelExtended);
        const content = element(by.css('div[class*="mat-expansion-panel-content "][style*="visible"]'));
        Util.waitUntilElementIsVisible(content);
        return this;
    }

    setStatusFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        const statusElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(statusElement);
        Util.waitUntilElementIsVisible(statusElement);
        statusElement.click();
        return this;
    }

    getStateFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='status'] span")).getText();
    }

    setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        const sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(sortElement);
        Util.waitUntilElementIsVisible(sortElement);
        sortElement.click();
        return this;
    }

    getSortFilterDropDownValue() {
        const sortLocator = element.all(by.css("mat-form-field[data-automation-id='sort'] span")).first();
        Util.waitUntilElementIsVisible(sortLocator);
        return sortLocator.getText();
    }

    setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        const orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(orderElement);
        Util.waitUntilElementIsVisible(orderElement);
        orderElement.click();
        return this;
    }

    getOrderFilterDropDownValue() {
        return element(by.css("mat-form-field[data-automation-id='order'] span")).getText();
    }

    clickOnDropDownArrow(option) {
        const dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class='mat-select-arrow-wrapper']")).first();
        Util.waitUntilElementIsVisible(dropDownArrow);
        Util.waitUntilElementIsClickable(dropDownArrow);
        dropDownArrow.click();
        Util.waitUntilElementIsVisible(this.selectedOption);
    }

    setAppNameDropDown(option) {
        this.clickOnDropDownArrow('appName');

        const appNameElement = element.all(by.cssContainingText('mat-option span', option)).first();
        Util.waitUntilElementIsClickable(appNameElement);
        Util.waitUntilElementIsVisible(appNameElement);
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
        Util.waitUntilElementIsVisible(locator);
        return locator.getAttribute('value');
    }

    setProperty(property, option) {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        Util.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    checkSaveButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    checkSaveAsButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.saveAsButton);
        return this;
    }

    checkDeleteButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        return this;
    }

    checkSaveButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    checkSaveAsButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.saveAsButton);
        return this.saveAsButton.isEnabled();
    }

    checkDeleteButtonIsEnabled() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        return this.deleteButton.isEnabled();
    }

    clickSaveAsButton() {
        const disabledButton = element(by.css(("button[id='adf-save-as-id'][disabled]")));
        Util.waitUntilElementIsClickable(this.saveAsButton);
        Util.waitUntilElementIsVisible(this.saveAsButton);
        Util.waitUntilElementIsNotVisible(disabledButton);
        this.saveAsButton.click();
        return this.editProcessFilter;
    }

    clickDeleteButton() {
        Util.waitUntilElementIsVisible(this.deleteButton);
        this.deleteButton.click();
        return this;
    }

    clickSaveButton() {
        const disabledButton = element(by.css(("button[id='adf-save-as-id'][disabled]")));
        Util.waitUntilElementIsClickable(this.saveButton);
        Util.waitUntilElementIsVisible(this.saveButton);
        Util.waitUntilElementIsNotVisible(disabledButton);
        this.saveButton.click();
        return this;
    }
}
