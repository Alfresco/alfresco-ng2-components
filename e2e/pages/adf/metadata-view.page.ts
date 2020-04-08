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

import { by, element, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class MetadataViewPage {

    title: ElementFinder = element(by.css(`div[info-drawer-title]`));
    expandedAspect: ElementFinder = element(by.css(`mat-expansion-panel-header[aria-expanded='true']`));
    aspectTitle = by.css(`mat-panel-title`);
    name: ElementFinder = element(by.css(`[data-automation-id='card-textitem-value-name']`));
    creator: ElementFinder = element(by.css(`[data-automation-id='card-textitem-value-createdByUser.displayName']`));
    createdDate: ElementFinder = element(by.css(`span[data-automation-id='card-dateitem-createdAt'] span`));
    modifier: ElementFinder = element(by.css(`[data-automation-id='card-textitem-value-modifiedByUser.displayName']`));
    modifiedDate: ElementFinder = element(by.css(`span[data-automation-id='card-dateitem-modifiedAt'] span`));
    mimetypeName: ElementFinder = element(by.css(`[data-automation-id='card-textitem-value-content.mimeTypeName']`));
    size: ElementFinder = element(by.css(`[data-automation-id='card-textitem-value-content.sizeInBytes']`));
    description: ElementFinder = element(by.css(`span[data-automation-id='card-textitem-value-properties.cm:description']`));
    author: ElementFinder = element(by.css(`[data-automation-id='card-textitem-value-properties.cm:author']`));
    titleProperty: ElementFinder = element(by.css(`span[data-automation-id='card-textitem-value-properties.cm:title'] span`));
    editIcon: ElementFinder = element(by.css(`button[data-automation-id='meta-data-card-toggle-edit']`));
    informationButton: ElementFinder = element(by.css(`button[data-automation-id='meta-data-card-toggle-expand']`));
    informationSpan: ElementFinder = element(by.css(`span[data-automation-id='meta-data-card-toggle-expand-label']`));
    informationIcon: ElementFinder = element(by.css(`span[data-automation-id='meta-data-card-toggle-expand-label'] ~ mat-icon`));
    displayEmptySwitch: ElementFinder = element(by.id(`adf-metadata-empty`));
    readonlySwitch: ElementFinder = element(by.id(`adf-metadata-readonly`));
    multiSwitch: ElementFinder = element(by.id(`adf-metadata-multi`));
    presetSwitch: ElementFinder = element(by.id('adf-toggle-custom-preset'));
    defaultPropertiesSwitch: ElementFinder = element(by.id('adf-metadata-default-properties'));
    closeButton: ElementFinder = element(by.cssContainingText('button.mat-button span', 'Close'));
    displayAspect: ElementFinder = element(by.css(`input[placeholder='Display Aspect']`));
    applyAspect: ElementFinder = element(by.cssContainingText(`button span.mat-button-wrapper`, 'Apply Aspect'));
    saveMetadataButton: ElementFinder = element(by.css(`[data-automation-id='save-metadata']`));
    resetMetadataButton: ElementFinder = element(by.css(`[data-automation-id='reset-metadata']`));

    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.title);
    }

    async getExpandedAspectName(): Promise<string> {
        return BrowserActions.getText(this.expandedAspect.element(this.aspectTitle));
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
        const propertiesTab: ElementFinder = element(by.cssContainingText(`.adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content`, `Properties`));
        await BrowserActions.click(propertiesTab);
    }

    async getEditIconTooltip(): Promise<string> {
        return this.editIcon.getAttribute('title');
    }

    async editPropertyIconIsDisplayed(propertyName: string) {
        const editPropertyIcon: ElementFinder = element(by.css('[data-automation-id="header-' + propertyName + '"] .adf-textitem-edit-icon'));
        await BrowserVisibility.waitUntilElementIsPresent(editPropertyIcon);
    }

    async clickResetButton(): Promise<void> {
        // await browser.actions().mouseMove(this.involvePeopleButton).click().perform();
        const clearPropertyIcon: ElementFinder = element(by.css('button[data-automation-id="reset-metadata"]'));
        await BrowserActions.click(clearPropertyIcon);
    }

    async enterPropertyText(propertyName: string, text: string | number): Promise<void> {
        const textField: ElementFinder = element(by.css('input[data-automation-id="card-textitem-value-' + propertyName + '"]'));
        await BrowserActions.clearSendKeys(textField, text.toString());
    }

    async enterPresetText(text: string): Promise<void> {
        const presetField: ElementFinder = element(by.css('input[data-automation-id="adf-text-custom-preset"]'));
        await BrowserActions.clearSendKeys(presetField, text);
        const applyButton: ElementFinder = element(by.css('button[id="adf-metadata-aplly"]'));
        await BrowserActions.click(applyButton);
    }

    async enterDescriptionText(text: string): Promise<void> {
        const textField: ElementFinder = element(by.css('textarea[data-automation-id="card-textitem-value-properties.cm:description"]'));
        await BrowserActions.clearSendKeys(textField, text);
    }

    async getPropertyText(propertyName: string, type?: string): Promise<string> {
        const propertyType = type || 'textitem';
        const textField: ElementFinder = element(by.css('[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]'));

        return BrowserActions.getInputValue(textField);
    }

    async getPropertyIconTooltip(propertyName: string): Promise<string> {
        const editPropertyIcon: ElementFinder = element(by.css('[data-automation-id="header-' + propertyName + '"] .adf-textitem-edit-icon'));
        return editPropertyIcon.getAttribute('title');
    }

    async clickMetadataGroup(groupName: string): Promise<void> {
        const group: ElementFinder = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        await BrowserActions.click(group);
    }

    async checkMetadataGroupIsPresent(groupName: string): Promise<void> {
        const group: ElementFinder = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(group);
    }

    async checkMetadataGroupIsNotPresent(groupName: string): Promise<void> {
        const group: ElementFinder = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(group);
    }

    async checkMetadataGroupIsExpand(groupName: string): Promise<void> {
        const group: ElementFinder = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        await BrowserVisibility.waitUntilElementIsVisible(group);
        await expect(await group.getAttribute('class')).toContain('mat-expanded');
    }

    async checkMetadataGroupIsNotExpand(groupName: string): Promise<void> {
        const group: ElementFinder = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        await BrowserVisibility.waitUntilElementIsPresent(group);
        await expect(await group.getAttribute('class')).not.toContain('mat-expanded');
    }

    async getMetadataGroupTitle(groupName: string): Promise<string> {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title'));
        return BrowserActions.getText(group);
    }

    async checkPropertyIsVisible(propertyName: string, type: string): Promise<void> {
        const property: ElementFinder = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(property);
    }

    async checkPropertyIsNotVisible(propertyName: string, type: string): Promise<void> {
        const property: ElementFinder = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(property);
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
