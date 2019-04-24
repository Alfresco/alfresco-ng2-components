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

import { browser, by, element, promise } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class MetadataViewPage {

    title = element(by.css(`div[info-drawer-title]`));
    expandedAspect = element(by.css(`mat-expansion-panel-header[aria-expanded='true']`));
    aspectTitle = by.css(`mat-panel-title`);
    name = element(by.css(`span[data-automation-id='card-textitem-value-name'] span`));
    creator = element(by.css(`span[data-automation-id='card-textitem-value-createdByUser.displayName'] span`));
    createdDate = element(by.css(`span[data-automation-id='card-dateitem-createdAt'] span`));
    modifier = element(by.css(`span[data-automation-id='card-textitem-value-modifiedByUser.displayName'] span`));
    modifiedDate = element(by.css(`span[data-automation-id='card-dateitem-modifiedAt'] span`));
    mimetypeName = element(by.css(`span[data-automation-id='card-textitem-value-content.mimeTypeName']`));
    size = element(by.css(`span[data-automation-id='card-textitem-value-content.sizeInBytes']`));
    description = element(by.css(`span[data-automation-id='card-textitem-value-properties.cm:description'] span`));
    author = element(by.css(`span[data-automation-id='card-textitem-value-properties.cm:author'] span`));
    titleProperty = element(by.css(`span[data-automation-id='card-textitem-value-properties.cm:title'] span`));
    editIcon = element(by.css(`button[data-automation-id='meta-data-card-toggle-edit']`));
    informationButton = element(by.css(`button[data-automation-id='meta-data-card-toggle-expand']`));
    informationSpan = element(by.css(`span[data-automation-id='meta-data-card-toggle-expand-label']`));
    informationIcon = element(by.css(`span[data-automation-id='meta-data-card-toggle-expand-label'] ~ mat-icon`));
    rightChevron = element(by.css(`div[class*='header-pagination-after']`));
    displayEmptySwitch = element(by.id(`adf-metadata-empty`));
    readonlySwitch = element(by.id(`adf-metadata-readonly`));
    multiSwitch = element(by.id(`adf-metadata-multi`));
    presetSwitch = element(by.id('adf-toggle-custom-preset'));
    defaultPropertiesSwitch = element(by.id('adf-metadata-default-properties'));
    closeButton = element(by.cssContainingText('button.mat-button span', 'Close'));

    getTitle(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.title);
        return this.title.getText();
    }

    getExpandedAspectName(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.expandedAspect);
        return this.expandedAspect.element(this.aspectTitle).getText();
    }

    getName(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.name);
        return this.name.getText();
    }

    getCreator(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.creator);
        return this.creator.getText();
    }

    getCreatedDate(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.createdDate);
        return this.createdDate.getText();
    }

    getModifier(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.modifier);
        return this.modifier.getText();
    }

    getModifiedDate(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.modifiedDate);
        return this.modifiedDate.getText();
    }

    getMimetypeName(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.mimetypeName);
        return this.mimetypeName.getText();
    }

    getSize(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.size);
        return this.size.getText();
    }

    getDescription(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.description);
        return this.description.getText();
    }

    getAuthor(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.author);
        return this.author.getText();
    }

    getTitleProperty(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.titleProperty);
        return this.titleProperty.getText();
    }

    editIconIsDisplayed(): promise.Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.editIcon);
    }

    editIconIsNotDisplayed(): promise.Promise<any> {
        return BrowserVisibility.waitUntilElementIsNotVisible(this.editIcon);
    }

    editIconClick(): promise.Promise<void> {
        BrowserVisibility.waitUntilElementIsVisible(this.editIcon);
        BrowserVisibility.waitUntilElementIsClickable(this.editIcon);
        return this.editIcon.click();
    }

    informationButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.informationButton);
        BrowserVisibility.waitUntilElementIsClickable(this.informationButton);
    }

    informationButtonIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.informationButton);
    }

    clickOnInformationButton(): MetadataViewPage {
        this.informationButtonIsDisplayed();
        browser.sleep(600);
        this.informationButton.click();
        return this;
    }

    getInformationButtonText(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.informationSpan);
        return this.informationSpan.getText();
    }

    getInformationIconText(): promise.Promise<string> {
        BrowserVisibility.waitUntilElementIsVisible(this.informationIcon);
        return this.informationIcon.getText();
    }

    clickOnPropertiesTab(): MetadataViewPage {
        const propertiesTab = element(by.cssContainingText(`.adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content`, `Properties`));
        BrowserVisibility.waitUntilElementIsVisible(propertiesTab);
        propertiesTab.click();
        return this;
    }

    clickRightChevron(): MetadataViewPage {
        BrowserVisibility.waitUntilElementIsVisible(this.rightChevron);
        this.rightChevron.click();
        return this;
    }

    getEditIconTooltip(): promise.Promise<string> {
        return this.editIcon.getAttribute('title');
    }

    getInformationButtonTooltip(): promise.Promise<string> {
        return this.informationSpan.getAttribute('title');
    }

    editPropertyIconIsDisplayed(propertyName: string) {
        const editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsPresent(editPropertyIcon);
    }

    updatePropertyIconIsDisplayed(propertyName: string) {
        const updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(updatePropertyIcon);
    }

    clickUpdatePropertyIcon(propertyName: string): promise.Promise<void> {
        const updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(updatePropertyIcon);
        return updatePropertyIcon.click();
    }

    clickClearPropertyIcon(propertyName: string): promise.Promise<void> {
        const clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(clearPropertyIcon);
        return clearPropertyIcon.click();
    }

    enterPropertyText(propertyName: string, text: string | number): MetadataViewPage {
        const textField = element(by.css('input[data-automation-id="card-textitem-editinput-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    enterPresetText(text: string): MetadataViewPage {
        const presetField = element(by.css('input[data-automation-id="adf-text-custom-preset"]'));
        BrowserVisibility.waitUntilElementIsVisible(presetField);
        presetField.sendKeys('');
        presetField.clear();
        presetField.sendKeys(text);
        const applyButton = element(by.css('button[id="adf-metadata-aplly"]'));
        applyButton.click();
        return this;
    }

    enterDescriptionText(text: string): MetadataViewPage {
        const textField = element(by.css('textarea[data-automation-id="card-textitem-edittextarea-properties.cm:description"]'));
        BrowserVisibility.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    getPropertyText(propertyName: string, type?: string): promise.Promise<string> {
        const propertyType = type || 'textitem';
        const textField = element(by.css('span[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]'));

        BrowserVisibility.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    clearPropertyIconIsDisplayed(propertyName: string) {
        const clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(clearPropertyIcon);
    }

    clickEditPropertyIcons(propertyName: string) {
        const editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsClickable(editPropertyIcon);
        editPropertyIcon.click();
    }

    getPropertyIconTooltip(propertyName: string): promise.Promise<string> {
        const editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        return editPropertyIcon.getAttribute('title');
    }

    clickMetadataGroup(groupName: string) {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(group);
        group.click();
    }

    checkMetadataGroupIsPresent(groupName: string): promise.Promise<boolean> {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return BrowserVisibility.waitUntilElementIsVisible(group);
    }

    checkMetadataGroupIsNotPresent(groupName: string): promise.Promise<any> {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return BrowserVisibility.waitUntilElementIsNotVisible(group);
    }

    checkMetadataGroupIsExpand(groupName: string) {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        BrowserVisibility.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).toContain('mat-expanded');
    }

    checkMetadataGroupIsNotExpand(groupName: string) {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        BrowserVisibility.waitUntilElementIsPresent(group);
        expect(group.getAttribute('class')).not.toContain('mat-expanded');
    }

    getMetadataGroupTitle(groupName: string): promise.Promise<string> {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title'));
        BrowserVisibility.waitUntilElementIsPresent(group);
        return group.getText();
    }

    checkPropertyIsVisible(propertyName: string, type: string) {
        const property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(property);
    }

    checkPropertyIsNotVisible(propertyName: string, type: string) {
        const property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsNotVisible(property);
    }

    clickCloseButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.closeButton);
        this.closeButton.click();
    }
}
