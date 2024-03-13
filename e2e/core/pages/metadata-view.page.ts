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
import { BrowserActions, BrowserVisibility, DropdownPage, TestElement, Logger, materialLocators } from '@alfresco/adf-testing';

export class MetadataViewPage {
    title = $(`div[info-drawer-title]`);
    expandedAspect = $(`${materialLocators.Expansion.panel.header.root}[aria-expanded='true']`);
    aspectTitle = materialLocators.Panel.title;
    name = $(`[data-automation-id='card-textitem-value-properties.cm:name']`);
    creator = $(`[data-automation-id='card-textitem-value-createdByUser.displayName']`);
    createdDate = $(`span[data-automation-id='card-dateitem-createdAt']`);
    modifier = $(`[data-automation-id='card-textitem-value-modifiedByUser.displayName']`);
    modifiedDate = $(`span[data-automation-id='card-dateitem-modifiedAt']`);
    mimetypeName = $(`[data-automation-id='card-textitem-value-content.mimeTypeName']`);
    size = $(`[data-automation-id='card-textitem-value-content.sizeInBytes']`);
    description = $(`span[data-automation-id='card-textitem-value-properties.cm:description']`);
    author = $(`[data-automation-id='card-textitem-value-properties.cm:author']`);
    editIcon = $(`button[data-automation-id='meta-data-card-toggle-edit']`);
    editIconGeneral = $(`button[data-automation-id='meta-data-general-info-edit']`);
    displayEmptySwitch = $(`#adf-metadata-empty`);
    readonlySwitch = $(`#adf-metadata-readonly`);
    multiSwitch = $(`#adf-metadata-multi`);
    defaultPropertiesSwitch = $('#adf-metadata-default-properties');
    closeButton = element(by.cssContainingText(`button${materialLocators.Button.class} span`, 'Close'));
    displayAspect = $(`input[data-placeholder='Display Aspect']`);
    applyAspect = element(by.cssContainingText(`button span${materialLocators.Button.wrapper}`, 'Apply Aspect'));
    saveMetadataButton = $(`[data-automation-id='save-metadata']`);
    saveGeneralMetadataButton = $(`[data-automation-id='save-general-info-metadata']`);
    resetMetadataButton = $(`[data-automation-id='reset-metadata']`);

    private getMetadataGroupLocator = async (groupName: string): Promise<ElementFinder> =>
        $(`[data-automation-id="adf-metadata-group-${groupName}"]`);
    private getMetadataGroupEditIconLocator = async (groupName: string): Promise<ElementFinder> =>
        $(`[data-automation-id="adf-metadata-group-${groupName}"]`).$(this.editIcon.locator().value);
    private getExpandedMetadataGroupLocator = async (groupName: string): Promise<ElementFinder> =>
        $(`[data-automation-id="adf-metadata-group-${groupName}"] > ${materialLocators.Expansion.panel.header.root}`);

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

    async editIconIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.editIcon);
    }

    async editIconIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.editIcon);
    }

    async isEditGeneralIconDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.editIconGeneral);
    }

    async clickEditIconGeneral(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.editIconGeneral);
        await BrowserActions.click(this.editIconGeneral);
    }

    async clickOnPropertiesTab(): Promise<void> {
        const propertiesTab = element(
            by.cssContainingText(`.adf-info-drawer-layout-content div${materialLocators.Tab.labels.class} div ${materialLocators.Tab.label.content.class}`, `Properties`)
        );
        await BrowserActions.click(propertiesTab);
    }

    async getEditIconTooltip(): Promise<string> {
        return BrowserActions.getAttribute(this.editIcon, 'title');
    }

    async enterPropertyText(propertyName: string, text: string | number): Promise<void> {
        const textField = $('input[data-automation-id="card-textitem-value-' + propertyName + '"]');
        await BrowserActions.clearSendKeys(textField, text.toString());
        await textField.sendKeys(protractor.Key.ENTER);
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

    async clickMetadataGroup(groupName: string): Promise<void> {
        const group = await this.getMetadataGroupLocator(groupName);
        await BrowserActions.click(group);
    }

    async clickMetadataGroupEditIcon(groupName: string): Promise<void> {
        const group = await this.getMetadataGroupEditIconLocator(groupName);
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
        await expect(await BrowserActions.getAttribute(group, 'class')).toContain(materialLocators.Expanded.root);
    }

    async checkMetadataGroupIsNotExpand(groupName: string): Promise<void> {
        const group = await this.getExpandedMetadataGroupLocator(groupName);
        await expect(await BrowserActions.getAttribute(group, 'class')).not.toContain(materialLocators.Expanded.root);
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
            const isPresent = await type.isPresent();
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
        const nodeType = TestElement.byCss(`div[data-automation-id="header-nodeType"] ${materialLocators.Select.trigger}`);
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
            return this.changeContentType(option, attempt + 1, maxAttempt);
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

    async clickSaveGeneralMetadata(): Promise<void> {
        await BrowserActions.click(this.saveGeneralMetadataButton);
    }
}
