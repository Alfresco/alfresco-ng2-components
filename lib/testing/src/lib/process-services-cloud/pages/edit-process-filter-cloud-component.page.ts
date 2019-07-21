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
import { browser, by, element, protractor } from 'protractor';
import { EditProcessFilterDialogPage } from './dialog/edit-process-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { ElementArrayFinder, ElementFinder } from 'protractor/built/element';

export class EditProcessFilterCloudComponentPage {

    customiseFilter: ElementFinder = element(by.id('adf-edit-process-filter-title-id'));
    selectedOption: ElementArrayFinder = element.all(by.css('mat-option[class*="mat-selected"]')).first();
    saveButton: ElementFinder = element(by.css('button[data-automation-id="adf-filter-action-save"]'));
    saveAsButton: ElementFinder = element(by.css('button[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton: ElementFinder = element(by.css('button[data-automation-id="adf-filter-action-delete"]'));

    editProcessFilterDialogPage = new EditProcessFilterDialogPage();

    editProcessFilterDialog() {
        return this.editProcessFilterDialogPage;
    }

    async clickCustomiseFilterHeader() {
        await BrowserActions.click(this.customiseFilter);
        return this;
    }

    async checkCustomiseFilterHeaderIsExpanded() {
        const expansionPanelExtended = element.all(by.css('mat-expansion-panel-header[class*="mat-expanded"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(expansionPanelExtended);
        const content = element.all(by.css('div[class*="mat-expansion-panel-content "][style*="visible"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(content);
        return this;
    }

    async setStatusFilterDropDown(option) {
        this.clickOnDropDownArrow('status');

        const statusElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(statusElement);
        return this;
    }

    async getStateFilterDropDownValue() : Promise<string>{
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='status'] span")));
    }

    async setSortFilterDropDown(option) {
        this.clickOnDropDownArrow('sort');

        const sortElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(sortElement);
        return this;
    }

    async getSortFilterDropDownValue() : Promise<string>{
        const sortLocator = element.all(by.css("mat-form-field[data-automation-id='sort'] span")).first();
        return BrowserActions.getText(sortLocator);
    }

    async setOrderFilterDropDown(option) {
        this.clickOnDropDownArrow('order');

        const orderElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(orderElement);
        browser.sleep(1000);
        return this;
    }

    async getOrderFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='order'] span")));
    }

    async clickOnDropDownArrow(option) {
        const dropDownArrow = element.all(by.css("mat-form-field[data-automation-id='" + option + "'] div[class='mat-select-arrow-wrapper']")).first();
        await BrowserVisibility.waitUntilElementIsVisible(dropDownArrow);
        await BrowserActions.click(dropDownArrow);
        await BrowserVisibility.waitUntilElementIsVisible(this.selectedOption);
    }

    async setAppNameDropDown(option) {
        this.clickOnDropDownArrow('appName');

        const appNameElement = element.all(by.cssContainingText('mat-option span', option)).first();
        await BrowserActions.click(appNameElement);
        return this;
    }

    async checkAppNamesAreUnique() {
        const appNameList = element.all(by.css('mat-option[data-automation-id="adf-cloud-edit-process-property-optionsappName"] span'));
        const appTextList: any = await BrowserActions.getText(appNameList);
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

    async getProperty(property) {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        return locator.getAttribute('value');
    }

    async setProperty(property, option) {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.clear();
        locator.sendKeys(option);
        locator.sendKeys(protractor.Key.ENTER);
        return this;
    }

    async checkSaveButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this;
    }

    async checkSaveAsButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this;
    }

    async checkDeleteButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this;
    }

    async checkDeleteButtonIsNotDisplayed() {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.deleteButton);
        return this;
    }

    async checkSaveButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    async checkSaveAsButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this.saveAsButton.isEnabled();
    }

    async checkDeleteButtonIsEnabled() {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this.deleteButton.isEnabled();
    }

    async clickSaveAsButton() {
        const disabledButton = element(by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
        await BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        await BrowserActions.click(this.saveAsButton);
        return this.editProcessFilterDialogPage;
    }

    async clickDeleteButton() {
        await BrowserActions.click(this.deleteButton);
        return this;
    }

    async clickSaveButton() {
        const disabledButton = element(by.css(("button[id='adf-save-as-id'][disabled]")));
        await BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        await BrowserActions.click(this.saveAsButton);
        return this;
    }
}
