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
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

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
    displayEmptySwitch = element(by.id(`adf-metadata-empty`));
    readonlySwitch = element(by.id(`adf-metadata-readonly`));
    multiSwitch = element(by.id(`adf-metadata-multi`));
    presetSwitch = element(by.id('adf-toggle-custom-preset'));
    defaultPropertiesSwitch = element(by.id('adf-metadata-default-properties'));
    closeButton = element(by.cssContainingText('button.mat-button span', 'Close'));
    displayAspect = element(by.css(`input[placeholder='Display Aspect']`));
    applyAspect = element(by.cssContainingText(`button span.mat-button-wrapper`, 'Apply Aspect'));

    getTitle(): promise.Promise<string> {
        return BrowserActions.getText(this.title);
    }

    getExpandedAspectName(): promise.Promise<string> {
        return BrowserActions.getText(this.expandedAspect.element(this.aspectTitle));
    }

    getName(): promise.Promise<string> {
        return BrowserActions.getText(this.name);
    }

    getCreator(): promise.Promise<string> {
        return BrowserActions.getText(this.creator);
    }

    getCreatedDate(): promise.Promise<string> {
        return BrowserActions.getText(this.createdDate);
    }

    getModifier(): promise.Promise<string> {
        return BrowserActions.getText(this.modifier);
    }

    getModifiedDate(): promise.Promise<string> {
        return BrowserActions.getText(this.modifiedDate);
    }

    getMimetypeName(): promise.Promise<string> {
        return BrowserActions.getText(this.mimetypeName);
    }

    getSize(): promise.Promise<string> {
        return BrowserActions.getText(this.size);
    }

    getDescription(): promise.Promise<string> {
        return BrowserActions.getText(this.description);
    }

    getAuthor(): promise.Promise<string> {
        return BrowserActions.getText(this.author);
    }

    getTitleProperty() {
        BrowserActions.getText(this.titleProperty);
    }

    editIconIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.editIcon);
    }

    editIconIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.editIcon);
    }

    editIconClick() {
        BrowserActions.clickExecuteScript('button[data-automation-id="meta-data-card-toggle-edit"]');
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
        BrowserActions.click(this.informationButton);
        return this;
    }

    getInformationButtonText(): promise.Promise<string> {
        return BrowserActions.getText(this.informationSpan);
    }

    getInformationIconText(): promise.Promise<string> {
        return BrowserActions.getText(this.informationIcon);
    }

    clickOnPropertiesTab(): MetadataViewPage {
        BrowserActions.closeMenuAndDialogs();
        const propertiesTab = element(by.cssContainingText(`.adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content`, `Properties`));
        BrowserActions.click(propertiesTab);
        return this;
    }

    getEditIconTooltip(): promise.Promise<string> {
        return this.editIcon.getAttribute('title');
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
        return BrowserActions.click(updatePropertyIcon);
    }

    clickClearPropertyIcon(propertyName: string): promise.Promise<void> {
        const clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        return BrowserActions.click(clearPropertyIcon);
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
        BrowserActions.click(applyButton);
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

        return BrowserActions.getText(textField);
    }

    clearPropertyIconIsDisplayed(propertyName: string) {
        const clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(clearPropertyIcon);
    }

    clickEditPropertyIcons(propertyName: string) {
        const editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        BrowserActions.click(editPropertyIcon);
    }

    getPropertyIconTooltip(propertyName: string): promise.Promise<string> {
        const editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        return editPropertyIcon.getAttribute('title');
    }

    clickMetadataGroup(groupName: string) {
        const group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        BrowserActions.click(group);
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
        return BrowserActions.getText(group);
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
        BrowserActions.click(this.closeButton);
    }

    typeAspectName(aspectName) {
        BrowserVisibility.waitUntilElementIsVisible(this.displayAspect);
        this.displayAspect.clear();
        this.displayAspect.sendKeys(aspectName);
    }

    clickApplyAspect() {
        BrowserActions.click(this.applyAspect);
    }
}
