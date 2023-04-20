/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { $, by, element, Key, protractor, ElementFinder } from 'protractor';
import { BrowserActions, BrowserVisibility, DropdownPage, TestElement, Logger } from '@alfresco/adf-testing';

export class MetadataViewPage {

    title = $(`div[info-drawer-title]`);
    expandedAspect = $(`mat-expansion-panel-header[aria-expanded='true']`);
    aspectTitle = `mat-panel-title`;
    name = $(`[data-automation-id='card-textitem-value-properties.cm:name']`);
    creator = $(`[data-automation-id='card-textitem-value-createdByUser.displayName']`);
    createdDate = $(`span[data-automation-id='card-dateitem-createdAt']`);
    modifier = $(`[data-automation-id='card-textitem-value-modifiedByUser.displayName']`);
    modifiedDate = $(`span[data-automation-id='card-dateitem-modifiedAt']`);
    mimetypeName = $(`[data-automation-id='card-textitem-value-content.mimeTypeName']`);
    size = $(`[data-automation-id='card-textitem-value-content.sizeInBytes']`);
    description = $(`span[data-automation-id='card-textitem-value-properties.cm:description']`);
    author = $(`[data-automation-id='card-textitem-value-properties.cm:author']`);
    titleProperty = $(`span[data-automation-id='card-textitem-value-properties.cm:title'] span`);
    editIcon = $(`button[data-automation-id='meta-data-card-toggle-edit']`);
    informationButton = $(`button[data-automation-id='meta-data-card-toggle-expand']`);
    informationSpan = $(`span[data-automation-id='meta-data-card-toggle-expand-label']`);
    informationIcon = $(`span[data-automation-id='meta-data-card-toggle-expand-label'] ~ mat-icon`);
    displayEmptySwitch = $(`#adf-metadata-empty`);
    readonlySwitch = $(`#adf-metadata-readonly`);
    multiSwitch = $(`#adf-metadata-multi`);
    presetSwitch = $('#adf-toggle-custom-preset');
    defaultPropertiesSwitch = $('#adf-metadata-default-properties');
    closeButton = element(by.cssContainingText('button.mat-button span', 'Close'));
    displayAspect = $(`input[data-placeholder='Display Aspect']`);
    applyAspect = element(by.cssContainingText(`button span.mat-button-wrapper`, 'Apply Aspect'));
    saveMetadataButton = $(`[data-automation-id='save-metadata']`);
    resetMetadataButton = $(`[data-automation-id='reset-metadata']`);

    private getMetadataGroupLocator = async (groupName: string): Promise<ElementFinder> => $(`mat-expansion-panel[data-automation-id="adf-metadata-group-${groupName}"]`);
    private getExpandedMetadataGroupLocator = async (groupName: string): Promise<ElementFinder> => $(`mat-expansion-panel[data-automation-id="adf-metadata-group-${groupName}"] > mat-expansion-panel-header`);

    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.title);
    }

    async getExpandedAspectName(): Promise<string> {
        return BrowserActions.getText(this.expandedAspect.$(this.aspectTitle));
    }

    async getName(): Promise<string> {
        return BrowserActions.getInputValue(this.name);
    }

    async getCreator(): Promise<string> {
        return BrowserActions.getInputValue(this.creator);
    }

    async getCreatedDate(): Promise<string> {
        return BrowserActions.getText(this.createdDate);
    }

    async getModifier(): Promise<string> {
        return BrowserActions.getInputValue(this.modifier);
    }

    async getModifiedDate(): Promise<string> {
        return BrowserActions.getText(this.modifiedDate);
    }

    async getMimetypeName(): Promise<string> {
        return BrowserActions.getInputValue(this.mimetypeName);
    }

    async getSize(): Promise<string> {
        return BrowserActions.getInputValue(this.size);
    }

    async getDescription(): Promise<string> {
        return BrowserActions.getInputValue(this.description);
    }

    async getAuthor(): Promise<string> {
        return BrowserActions.getInputValue(this.author);
    }

    async getTitleProperty(): Promise<string> {
        return BrowserActions.getText(this.titleProperty);
    }

    async editIconIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.editIcon);
    }

    async editIconIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.editIcon);
    }

    async editIconClick(): Promise<void> {
        await BrowserActions.clickExecuteScript('button[data-automation-id="meta-data-card-toggle-edit"]');
    }

    async informationButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.informationButton);
    }

    async informationButtonIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.informationButton);
    }

    async clickOnInformationButton(): Promise<void> {
        await BrowserActions.click(this.informationButton);
    }

    async getInformationButtonText(): Promise<string> {
        return BrowserActions.getText(this.informationSpan);
    }

    async getInformationIconText(): Promise<string> {
        return BrowserActions.getText(this.informationIcon);
    }

    async clickOnPropertiesTab(): Promise<void> {
        const propertiesTab = element(by.cssContainingText(`.adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content`, `Properties`));
        await BrowserActions.click(propertiesTab);
    }

    async getEditIconTooltip(): Promise<string> {
        return BrowserActions.getAttribute(this.editIcon, 'title');
    }

    async editPropertyIconIsDisplayed(propertyName: string) {
        const editPropertyIcon = $('[data-automation-id="header-' + propertyName + '"] .adf-textitem-edit-icon');
        await BrowserVisibility.waitUntilElementIsPresent(editPropertyIcon);
    }

    async clickResetButton(): Promise<void> {
        const clearPropertyIcon = $('button[data-automation-id="reset-metadata"]');
        await BrowserActions.click(clearPropertyIcon);
    }

    async enterPropertyText(propertyName: string, text: string | number): Promise<void> {
        const textField = $('input[data-automation-id="card-textitem-value-' + propertyName + '"]');
        await BrowserActions.clearSendKeys(textField, text.toString());
        await textField.sendKeys(protractor.Key.ENTER);
    }

    async enterPresetText(text: string): Promise<void> {
        const presetField = $('input[data-automation-id="adf-text-custom-preset"]');
        await BrowserActions.clearSendKeys(presetField, text.toString());
        await presetField.sendKeys(protractor.Key.ENTER);
        const applyButton = $('button[id="adf-metadata-aplly"]');
        await BrowserActions.click(applyButton);
    }

    async enterDescriptionText(text: string): Promise<void> {
        const textField = $('textarea[data-automation-id="card-textitem-value-properties.cm:description"]');
        await BrowserActions.clearSendKeys(textField, text);
        await textField.sendKeys(Key.TAB);
    }

    async getPropertyText(propertyName: string, type?: string): Promise<string> {
        const propertyType = type || 'textitem';
        const textField = $('[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]');

        return BrowserActions.getInputValue(textField);
    }

    async getPropertyIconTooltip(propertyName: string): Promise<string> {
        const editPropertyIcon = $('[data-automation-id="header-' + propertyName + '"] .adf-textitem-edit-icon');
        return BrowserActions.getAttribute(editPropertyIcon, 'title');
    }

    async clickMetadataGroup(groupName: string): Promise<void> {
        const group = await this.getMetadataGroupLocator(groupName);
        await BrowserActions.click(group);
    }

    async checkMetadataGroupIsPresent(groupName: string): Promise<void> {
        const group = await this.getMetadataGroupLocator(groupName);
        await BrowserVisibility.waitUntilElementIsVisible(group);
    }

    async checkMetadataGroupIsNotPresent(groupName: string): Promise<void> {
        const group = await this.getMetadataGroupLocator(groupName);
        await BrowserVisibility.waitUntilElementIsNotVisible(group);
    }

    async checkMetadataGroupIsExpand(groupName: string): Promise<void> {
        const group = await this.getExpandedMetadataGroupLocator(groupName);
        await expect(await BrowserActions.getAttribute(group, 'class')).toContain('mat-expanded');
    }

    async checkMetadataGroupIsNotExpand(groupName: string): Promise<void> {
        const group = await this.getExpandedMetadataGroupLocator(groupName);
        await expect(await BrowserActions.getAttribute(group, 'class')).not.toContain('mat-expanded');
    }

    async getMetadataGroupTitle(groupName: string): Promise<string> {
        const group = $('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title');
        return BrowserActions.getText(group);
    }

    async checkPropertyIsVisible(propertyName: string, type: string): Promise<void> {
        const property = $('[data-automation-id="card-' + type + '-label-' + propertyName + '"]');
        await BrowserVisibility.waitUntilElementIsVisible(property);
    }

    async hasContentType(contentType: string, attempt = 0, maxAttempt = 3): Promise<boolean> {
        const contentTypeSelector = '[data-automation-id="select-readonly-value-nodeType"]';
        const type = TestElement.byText(contentTypeSelector, contentType);
        try {
            if (attempt > maxAttempt) {
                return false;
            }
            await type.waitVisible();
            const isPresent = type.isPresent();
            if (isPresent) {
                return true;
            }
            return this.hasContentType(contentType, attempt + 1, maxAttempt);
        } catch (e) {
            Logger.log(`re trying content type attempt :: ${attempt}`);
            return this.hasContentType(contentType, attempt + 1, maxAttempt);
        }
    }

    async checkPropertyDisplayed(propertyName: string, type?: string, attempt = 0, maxAttempt = 3): Promise<string> {
        try {
            if (attempt > maxAttempt) {
                return '';
            }
            const propertyType = type || 'textitem';
            await TestElement.byCss('[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]').waitVisible();
            return this.getPropertyText(propertyName);
        } catch (e) {
            Logger.log(`re trying custom property attempt :: ${attempt}`);
            return this.checkPropertyDisplayed(propertyName, type, attempt + 1, maxAttempt);
        }
    }

    async changeContentType(option: string, attempt = 0, maxAttempt = 3): Promise<boolean> {
        const nodeType = TestElement.byCss('div[data-automation-id="header-nodeType"] .mat-select-trigger');
        if (attempt > maxAttempt) {
            Logger.error(`content type select option not found. check acs version may be lesser than 7.0.0`);
            return false;
        }
        try {
            await nodeType.waitVisible();
            if (await nodeType.isPresent()) {
                await nodeType.click();
                const typesDropDownPage = new DropdownPage(nodeType.elementFinder);
                await typesDropDownPage.checkOptionIsDisplayed(option);
                await typesDropDownPage.selectOption(option);
                return true;
            }
            return this.changeContentType(option, attempt + 1, maxAttempt);
        } catch (error) {
            Logger.log(`re trying content type options attempt :: ${attempt}`);
            await BrowserActions.closeMenuAndDialogs();
            return  this.changeContentType(option, attempt + 1, maxAttempt);
        }
    }

    async checkConfirmDialogDisplayed(): Promise<void> {
        const confirmButton = TestElement.byCss('adf-content-type-dialog');
        await confirmButton.waitPresent();
    }

    async applyNodeProperties(): Promise<void> {
        const confirmButton = TestElement.byId('content-type-dialog-apply-button');
        await confirmButton.click();
    }

    async cancelNodeProperties(): Promise<void> {
        const cancelButton = TestElement.byId('content-type-dialog-actions-cancel');
        await cancelButton.click();
    }

    async checkPropertyIsNotVisible(propertyName: string, type: string): Promise<void> {
        await TestElement.byCss('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]').waitNotVisible();
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async typeAspectName(aspectName): Promise<void> {
        await BrowserActions.clearSendKeys(this.displayAspect, aspectName);
    }

    async clickApplyAspect(): Promise<void> {
        await BrowserActions.click(this.applyAspect);
    }

    async clickSaveMetadata(): Promise<void> {
        await BrowserActions.click(this.saveMetadataButton);
    }

    async clickResetMetadata(): Promise<void> {
        await BrowserActions.click(this.resetMetadataButton);
    }
}
