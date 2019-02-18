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

import { Util } from '../../util/util';
import { browser, by, element, promise } from 'protractor';

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

    getTitle(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.title);
        return this.title.getText();
    }

    getExpandedAspectName(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.expandedAspect);
        return this.expandedAspect.element(this.aspectTitle).getText();
    }

    getName(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.name);
        return this.name.getText();
    }

    getCreator(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.creator);
        return this.creator.getText();
    }

    getCreatedDate(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.createdDate);
        return this.createdDate.getText();
    }

    getModifier(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.modifier);
        return this.modifier.getText();
    }

    getModifiedDate(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.modifiedDate);
        return this.modifiedDate.getText();
    }

    getMimetypeName(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.mimetypeName);
        return this.mimetypeName.getText();
    }

    getSize(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.size);
        return this.size.getText();
    }

    getDescription(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.description);
        return this.description.getText();
    }

    getAuthor(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.author);
        return this.author.getText();
    }

    getTitleProperty(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.titleProperty);
        return this.titleProperty.getText();
    }

    editIconIsDisplayed(): promise.Promise<boolean> {
        return Util.waitUntilElementIsVisible(this.editIcon);
    }

    editIconIsNotDisplayed(): promise.Promise<any> {
        return Util.waitUntilElementIsNotVisible(this.editIcon);
    }

    editIconClick(): promise.Promise<void> {
        Util.waitUntilElementIsVisible(this.editIcon);
        return this.editIcon.click();
    }

    informationButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.informationButton);
        Util.waitUntilElementIsClickable(this.informationButton);
    }

    informationButtonIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.informationButton);
    }

    clickOnInformationButton(): MetadataViewPage {
        this.informationButtonIsDisplayed();
        browser.sleep(600);
        this.informationButton.click();
        return this;
    }

    getInformationButtonText(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.informationSpan);
        return this.informationSpan.getText();
    }

    getInformationIconText(): promise.Promise<string> {
        Util.waitUntilElementIsVisible(this.informationIcon);
        return this.informationIcon.getText();
    }

    clickOnPropertiesTab(): MetadataViewPage {
        let propertiesTab = element(by.cssContainingText(`.adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content`, `Properties`));
        Util.waitUntilElementIsVisible(propertiesTab);
        propertiesTab.click();
        return this;
    }

    clickRightChevron(): MetadataViewPage {
        Util.waitUntilElementIsVisible(this.rightChevron);
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
        let editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(editPropertyIcon);
    }

    updatePropertyIconIsDisplayed(propertyName: string) {
        let updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(updatePropertyIcon);
    }

    clickUpdatePropertyIcon(propertyName: string): promise.Promise<void> {
        let updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(updatePropertyIcon);
        return updatePropertyIcon.click();
    }

    clickClearPropertyIcon(propertyName: string): promise.Promise<void> {
        let clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(clearPropertyIcon);
        return clearPropertyIcon.click();
    }

    enterPropertyText(propertyName: string, text: string | number): MetadataViewPage {
        const textField = element(by.css('input[data-automation-id="card-textitem-editinput-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    enterPresetText(text: string): MetadataViewPage {
        const presetField = element(by.css('input[data-automation-id="adf-text-custom-preset"]'));
        Util.waitUntilElementIsVisible(presetField);
        presetField.sendKeys('');
        presetField.clear();
        presetField.sendKeys(text);
        const applyButton = element(by.css('button[id="adf-metadata-aplly"]'));
        applyButton.click();
        return this;
    }

    enterDescriptionText(text: string): MetadataViewPage {
        const textField = element(by.css('textarea[data-automation-id="card-textitem-edittextarea-properties.cm:description"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    getPropertyText(propertyName: string, type?: string): promise.Promise<string> {
        const propertyType = type || 'textitem';
        const textField = element(by.css('span[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]'));

        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    clearPropertyIconIsDisplayed(propertyName: string) {
        let clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(clearPropertyIcon);
    }

    clickEditPropertyIcons(propertyName: string) {
        let editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        Util.waitUntilElementIsClickable(editPropertyIcon);
        editPropertyIcon.click();
    }

    getPropertyIconTooltip(propertyName: string): promise.Promise<string> {
        let editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        return editPropertyIcon.getAttribute('title');
    }

    clickMetadataGroup(groupName: string) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        Util.waitUntilElementIsVisible(group);
        group.click();
    }

    checkMetadataGroupIsPresent(groupName: string): promise.Promise<boolean> {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return Util.waitUntilElementIsVisible(group);
    }

    checkMetadataGroupIsNotPresent(groupName: string): promise.Promise<any> {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return Util.waitUntilElementIsNotVisible(group);
    }

    checkMetadataGroupIsExpand(groupName: string) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        Util.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).toContain('mat-expanded');
    }

    checkMetadataGroupIsNotExpand(groupName: string) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        Util.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).not.toContain('mat-expanded');
    }

    getMetadataGroupTitle(groupName: string): promise.Promise<string> {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title'));
        Util.waitUntilElementIsVisible(group);
        return group.getText();
    }

    checkPropertyIsVisible(propertyName: string, type: string) {
        let property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(property);
    }

    checkPropertyIsNotVisible(propertyName: string, type: string) {
        let property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        Util.waitUntilElementIsNotVisible(property);
    }
}
