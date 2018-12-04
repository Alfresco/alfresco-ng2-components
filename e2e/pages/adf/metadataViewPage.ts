/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { by, element } from 'protractor';

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

    getTitle() {
        Util.waitUntilElementIsVisible(this.title);
        return this.title.getText();
    }

    getExpandedAspectName() {
        Util.waitUntilElementIsVisible(this.expandedAspect);
        return this.expandedAspect.element(this.aspectTitle).getText();
    }

    getName() {
        Util.waitUntilElementIsVisible(this.name);
        return this.name.getText();
    }

    getCreator() {
        Util.waitUntilElementIsVisible(this.creator);
        return this.creator.getText();
    }

    getCreatedDate() {
        Util.waitUntilElementIsVisible(this.createdDate);
        return this.createdDate.getText();
    }

    getModifier() {
        Util.waitUntilElementIsVisible(this.modifier);
        return this.modifier.getText();
    }

    getModifiedDate() {
        Util.waitUntilElementIsVisible(this.modifiedDate);
        return this.modifiedDate.getText();
    }

    getMimetypeName() {
        Util.waitUntilElementIsVisible(this.mimetypeName);
        return this.mimetypeName.getText();
    }

    getSize() {
        Util.waitUntilElementIsVisible(this.size);
        return this.size.getText();
    }

    getDescription() {
        Util.waitUntilElementIsVisible(this.description);
        return this.description.getText();
    }

    getAuthor() {
        Util.waitUntilElementIsVisible(this.author);
        return this.author.getText();
    }

    getTitleProperty() {
        Util.waitUntilElementIsVisible(this.titleProperty);
        return this.titleProperty.getText();
    }

    editIconIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.editIcon);
    }

    editIconIsNotDisplayed() {
        return Util.waitUntilElementIsNotVisible(this.editIcon);
    }

    editIconClick() {
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

    clickOnInformationButton() {
        this.informationButtonIsDisplayed();
        this.informationButton.click();
        return this;
    }

    getInformationButtonText() {
        Util.waitUntilElementIsVisible(this.informationSpan);
        return this.informationSpan.getText();
    }

    getInformationIconText() {
        Util.waitUntilElementIsVisible(this.informationIcon);
        return this.informationIcon.getText();
    }

    clickOnPropertiesTab() {
        let propertiesTab = element(by.cssContainingText(`.adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content`, `Properties`));
        Util.waitUntilElementIsVisible(propertiesTab);
        propertiesTab.click();
        return this;
    }

    clickRightChevron() {
        Util.waitUntilElementIsVisible(this.rightChevron);
        this.rightChevron.click();
        return this;
    }

    getEditIconTooltip() {
        return this.editIcon.getAttribute('title');
    }

    getInformationButtonTooltip() {
        return this.informationSpan.getAttribute('title');
    }

    editPropertyIconIsDisplayed(propertyName) {
        let editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(editPropertyIcon);
    }

    updatePropertyIconIsDisplayed(propertyName) {
        let updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(updatePropertyIcon);
    }

    clickUpdatePropertyIcon(propertyName) {
        let updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(updatePropertyIcon);
        return updatePropertyIcon.click();
    }

    clickClearPropertyIcon(propertyName) {
        let clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(clearPropertyIcon);
        return clearPropertyIcon.click();
    }

    enterPropertyText(propertyName, text) {
        const textField = element(by.css('input[data-automation-id="card-textitem-editinput-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    enterPresetText(text) {
        const presetField = element(by.css('input[data-automation-id="adf-text-custom-preset"]'));
        Util.waitUntilElementIsVisible(presetField);
        presetField.sendKeys('');
        presetField.clear();
        presetField.sendKeys(text);
        const applyButton = element(by.css('button[id="adf-metadata-aplly"]'));
        applyButton.click();
        return this;
    }

    enterDescriptionText(text) {
        const textField = element(by.css('textarea[data-automation-id="card-textitem-edittextarea-properties.cm:description"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear();
        textField.sendKeys(text);
        return this;
    }

    getPropertyText(propertyName, type) {
        let propertyType = !type ? 'textitem' : type;
        const textField = element(by.css('span[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    }

    clearPropertyIconIsDisplayed(propertyName) {
        let clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(clearPropertyIcon);
    }

    clickEditPropertyIcons(propertyName) {
        let editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(editPropertyIcon);
        editPropertyIcon.click();
    }

    getPropertyIconTooltip(propertyName) {
        let editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        return editPropertyIcon.getAttribute('title');
    }

    clickMetadataGroup(groupName) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        Util.waitUntilElementIsVisible(group);
        group.click();
    }

    checkMetadataGroupIsPresent(groupName) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return Util.waitUntilElementIsVisible(group);
    }

    checkMetadataGroupIsNotPresent(groupName) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return Util.waitUntilElementIsNotVisible(group);
    }

    checkMetadataGroupIsExpand(groupName) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        Util.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).toContain('mat-expanded');
    }

    checkMetadataGroupIsNotExpand(groupName) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        Util.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).not.toContain('mat-expanded');
    }

    getMetadataGroupTitle(groupName) {
        let group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title'));
        Util.waitUntilElementIsVisible(group);
        return group.getText();
    }

    /**
     * disables displayEmpty
     */
    disableDisplayEmpty() {
        Util.waitUntilElementIsVisible(this.displayEmptySwitch);
        this.displayEmptySwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                this.displayEmptySwitch.click();
                expect(this.displayEmptySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        });
    }

    /**
     * enables displayEmpty
     */
    enableDisplayEmpty() {
        Util.waitUntilElementIsVisible(this.displayEmptySwitch);
        this.displayEmptySwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary') {
                this.displayEmptySwitch.click();
                expect(this.displayEmptySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        });
    }

    /**
     * disables Readonly
     */
    disableReadonly() {
        Util.waitUntilElementIsVisible(this.readonlySwitch);
        this.readonlySwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                this.readonlySwitch.click();
                expect(this.readonlySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        });
    }

    /**
     * enables Readonly
     */
    enableReadonly() {
        Util.waitUntilElementIsVisible(this.readonlySwitch);
        this.readonlySwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary') {
                this.readonlySwitch.click();
                expect(this.readonlySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        });
    }

    /**
     * disables multi
     */
    disableMulti() {
        Util.waitUntilElementIsVisible(this.multiSwitch);
        this.multiSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                this.multiSwitch.click();
                expect(this.multiSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        });
    }

    /**
     * enables multi
     */
    enableMulti() {
        Util.waitUntilElementIsVisible(this.multiSwitch);
        this.multiSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary') {
                this.multiSwitch.click();
                expect(this.multiSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        });
    }

    /**
     * disables preset
     */
    disablePreset() {
        Util.waitUntilElementIsVisible(this.presetSwitch);
        this.presetSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                this.presetSwitch.click();
                expect(this.presetSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        });
    }

    /**
     * enables preset
     */
    enablePreset() {
        Util.waitUntilElementIsVisible(this.presetSwitch);
        this.presetSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary') {
                this.presetSwitch.click();
                expect(this.presetSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        });
    }

    /**
     * disables preset
     */
    disabledDefaultProperties() {
        Util.waitUntilElementIsVisible(this.defaultPropertiesSwitch);
        this.defaultPropertiesSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                this.defaultPropertiesSwitch.click();
                expect(this.defaultPropertiesSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        });
    }

    /**
     * enables preset
     */
    enabledDefaultProperties() {
        Util.waitUntilElementIsVisible(this.defaultPropertiesSwitch);
        this.defaultPropertiesSwitch.getAttribute('class').then((check) => {
            if (check === 'mat-slide-toggle mat-primary') {
                this.defaultPropertiesSwitch.click();
                expect(this.defaultPropertiesSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        });
    }

    checkPropertyIsVisible(propertyName, type) {
        let property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(property);
    }

    checkPropertyIsNotVisible(propertyName, type) {
        let property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        Util.waitUntilElementIsNotVisible(property);
    }
}
