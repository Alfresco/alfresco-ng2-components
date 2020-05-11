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
import { browser, by, element, protractor, ElementFinder } from 'protractor';
import { EditProcessFilterDialogPage } from './dialog/edit-process-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../material/pages/dropdown.page';

export class EditProcessFilterCloudComponentPage {

    customiseFilter: ElementFinder = element(by.id('adf-edit-process-filter-title-id'));
    saveButton: ElementFinder = element(by.css('button[data-automation-id="adf-filter-action-save"]'));
    saveAsButton: ElementFinder = element(by.css('button[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton: ElementFinder = element(by.css('button[data-automation-id="adf-filter-action-delete"]'));
    filter: ElementFinder = element(by.css(`adf-cloud-edit-process-filter mat-expansion-panel-header`));

    private locatorAppNameDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-appName']`));
    private locatorStatusDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-status']`));
    private locatorSortDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-sort']`));
    private locatorOrderDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-process-property-order']`));

    appNameDropdown = new DropdownPage(this.locatorAppNameDropdown);
    statusDropdown = new DropdownPage(this.locatorStatusDropdown);
    sortDropdown = new DropdownPage(this.locatorSortDropdown);
    orderDropdown = new DropdownPage(this.locatorOrderDropdown);

    editProcessFilterDialogPage = new EditProcessFilterDialogPage();

    editProcessFilterDialog(): EditProcessFilterDialogPage {
        return this.editProcessFilterDialogPage;
    }

    async isFilterDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async openFilter(): Promise<void> {
        if (await this.isFilterDisplayed()) {
            await BrowserActions.click(this.customiseFilter);
            await browser.driver.sleep(1000);
        }
    }

    async checkCustomiseFilterHeaderIsExpanded(): Promise<void> {
        const expansionPanelExtended = element.all(by.css('mat-expansion-panel-header[class*="mat-expanded"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(expansionPanelExtended);
        const content = element.all(by.css('div[class*="mat-expansion-panel-content "][style*="visible"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(content);
    }

    async setStatusFilterDropDown(option: string): Promise<void> {
        await this.statusDropdown.selectDropdownOption(option);
    }

    async getStateFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='status'] span")));
    }

    async setSortFilterDropDown(option): Promise<void> {
        await this.sortDropdown.selectDropdownOption(option);
    }

    async getSortFilterDropDownValue(): Promise<string> {
        const sortLocator = element.all(by.css("mat-form-field[data-automation-id='sort'] span")).first();
        return BrowserActions.getText(sortLocator);
    }

    async setOrderFilterDropDown(option): Promise<void> {
        await this.orderDropdown.selectDropdownOption(option);
        await browser.sleep(1500);
    }

    async getOrderFilterDropDownValue(): Promise<string> {
        return BrowserActions.getText(element(by.css("mat-form-field[data-automation-id='order'] span")));
    }

    async setAppNameDropDown(option: string): Promise<void> {
        await this.appNameDropdown.selectDropdownOption(option);
    }

    async getApplicationSelected(): Promise<string> {
        const applicationDropdown = element(by.css(`[data-automation-id='adf-cloud-edit-process-property-appName']`));
        return applicationDropdown.getText();
    }

    async checkAppNamesAreUnique(): Promise<boolean> {
        const appNameList = element.all(by.css('mat-option[data-automation-id="adf-cloud-edit-process-property-optionsappName"] span'));
        const appTextList: any = await appNameList.getText();
        const uniqueArray = appTextList.filter((appName) => {
            const sameAppNameArray = appTextList.filter((eachApp) => eachApp === appName);
            return sameAppNameArray.length === 1;
        });
        return uniqueArray.length === appTextList.length;
    }

    async getNumberOfAppNameOptions(): Promise<number> {
        await this.appNameDropdown.clickDropdown();
        return this.appNameDropdown.getNumberOfOptions();
    }

    async isApplicationListLoaded(): Promise<boolean> {
        const emptyList = element(by.css(`[data-automation-id='adf-cloud-edit-process-property-appName'] .mat-select-placeholder`));
        return BrowserVisibility.waitUntilElementIsNotVisible(emptyList);
    }

    async setProcessInstanceId(option): Promise<void> {
        await this.setProperty('processInstanceId', option);
    }

    async setProcessDefinitionKey(option): Promise<void> {
        await this.setProperty('processDefinitionKey', option);
    }

    async setProcessName(option): Promise<void> {
        await this.setProperty('processName', option);
    }

    async getProcessInstanceId(): Promise<string> {
        return this.getProperty('processInstanceId');
    }

    async getProperty(property: string): Promise<string> {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        return locator.getAttribute('value');
    }

    async setProperty(property: string, option: string): Promise<void> {
        const locator = element.all(by.css('input[data-automation-id="adf-cloud-edit-process-property-' + property + '"]')).first();
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await locator.clear();
        await locator.sendKeys(option);
        await locator.sendKeys(protractor.Key.ENTER);
    }

    async checkSaveButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
    }

    async checkSaveAsButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
    }

    async checkDeleteButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
    }

    async checkDeleteButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.deleteButton);
    }

    async checkSaveButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    async checkSaveAsButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
        return this.saveAsButton.isEnabled();
    }

    async checkDeleteButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
        return this.deleteButton.isEnabled();
    }

    async clickSaveAsButton(): Promise<void> {
        const disabledButton = element(by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
        await BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        await BrowserActions.click(this.saveAsButton);
        await browser.driver.sleep(1000);
    }

    async clickDeleteButton(): Promise<void> {
        await BrowserActions.click(this.deleteButton);
    }

    async clickSaveButton(): Promise<void> {
        const disabledButton = element(by.css(("button[id='adf-save-as-id'][disabled]")));
        await BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        await BrowserActions.click(this.saveButton);
    }

    async setFilter({ name = '', status = '', sort = '', order = '', initiator = '', processName = '' }): Promise<void> {
        await this.openFilter();
        if (name)   { await this.setProcessName(name);            }
        if (status) { await this.setStatusFilterDropDown(status); }
        if (sort)   { await this.setSortFilterDropDown(sort);     }
        if (order)  { await this.setOrderFilterDropDown(order);   }
        if (initiator)  { await this.setProperty('initiator', initiator);   }
        if (processName)  { await this.setProcessName(processName);   }
        await this.openFilter();
    }
}
