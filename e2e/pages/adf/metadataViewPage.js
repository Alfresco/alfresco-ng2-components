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

var Util = require('../../util/util');

var MetadataViewPage = function () {

    var title = element(by.css("div[info-drawer-title]"));
    var expandedAspect = element(by.css("mat-expansion-panel-header[aria-expanded='true']"));
    var aspectTitle = by.css("mat-panel-title");
    var name = element(by.css("span[data-automation-id='card-textitem-value-name'] span"));
    var creator = element(by.css("span[data-automation-id='card-textitem-value-createdByUser.displayName'] span"));
    var createdDate = element(by.css("span[data-automation-id='card-dateitem-createdAt'] span"));
    var modifier = element(by.css("span[data-automation-id='card-textitem-value-modifiedByUser.displayName'] span"));
    var modifiedDate = element(by.css("span[data-automation-id='card-dateitem-modifiedAt'] span"));
    var mimetypeName = element(by.css("span[data-automation-id='card-textitem-value-content.mimeTypeName']"));
    var size = element(by.css("span[data-automation-id='card-textitem-value-content.sizeInBytes']"));
    var description = element(by.css("span[data-automation-id='card-textitem-value-properties.cm:description'] span"));
    var author = element(by.css("span[data-automation-id='card-textitem-value-properties.cm:author'] span"));
    var titleProperty = element(by.css("span[data-automation-id='card-textitem-value-properties.cm:title'] span"));
    var editIcon = element(by.css("button[data-automation-id='meta-data-card-toggle-edit']"));
    var informationButton = element(by.css("button[data-automation-id='meta-data-card-toggle-expand']"));
    var informationSpan = element(by.css("span[data-automation-id='meta-data-card-toggle-expand-label']"));
    var informationIcon = element(by.css("span[data-automation-id='meta-data-card-toggle-expand-label'] ~ mat-icon"));
    var rightChevron = element(by.css("div[class*='header-pagination-after']"));
    var displayEmptySwitch = element(by.id("adf-metadata-empty"));
    var readonlySwitch = element(by.id("adf-metadata-readonly"));
    var multiSwitch = element(by.id("adf-metadata-multi"));
    var presetSwitch = element(by.id('adf-toggle-custom-preset'));
    var defaultPropertiesSwitch = element(by.id('adf-metadata-default-properties'));

    this.getTitle = function () {
        Util.waitUntilElementIsVisible(title);
        return title.getText();
    };

    this.getExpandedAspectName = function () {
        Util.waitUntilElementIsVisible(expandedAspect);
        return expandedAspect.element(aspectTitle).getText();
    };

    this.getName = function () {
        Util.waitUntilElementIsVisible(name);
        return name.getText();
    };

    this.getCreator = function () {
        Util.waitUntilElementIsVisible(creator);
        return creator.getText();
    };

    this.getCreatedDate = function () {
        Util.waitUntilElementIsVisible(createdDate);
        return createdDate.getText();
    };

    this.getModifier = function () {
        Util.waitUntilElementIsVisible(modifier);
        return modifier.getText();
    };

    this.getModifiedDate = function () {
        Util.waitUntilElementIsVisible(modifiedDate);
        return modifiedDate.getText();
    };

    this.getMimetypeName = function () {
        Util.waitUntilElementIsVisible(mimetypeName);
        return mimetypeName.getText();
    };

    this.getSize = function () {
        Util.waitUntilElementIsVisible(size);
        return size.getText();
    };

    this.getDescription = function () {
        Util.waitUntilElementIsVisible(description);
        return description.getText();
    };

    this.getAuthor = function () {
        Util.waitUntilElementIsVisible(author);
        return author.getText();
    };

    this.getTitleProperty = function () {
        Util.waitUntilElementIsVisible(titleProperty);
        return titleProperty.getText();
    };

    this.editIconIsDisplayed = function () {
        return Util.waitUntilElementIsVisible(editIcon);
    };

    this.editIconIsNotDisplayed = function () {
        return Util.waitUntilElementIsNotVisible(editIcon);
    };

    this.editIconClick = function () {
        Util.waitUntilElementIsVisible(editIcon);
        return editIcon.click();
    };

    this.informationButtonIsDisplayed = function () {
        Util.waitUntilElementIsVisible(informationButton);
        Util.waitUntilElementIsClickable(informationButton);
    };

    this.informationButtonIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(informationButton);
    };

    this.clickOnInformationButton = function () {
        this.informationButtonIsDisplayed();
        informationButton.click();
        return this;
    };

    this.getInformationButtonText = function () {
        Util.waitUntilElementIsVisible(informationSpan);
        return informationSpan.getText();
    };

    this.getInformationIconText = function () {
        Util.waitUntilElementIsVisible(informationIcon);
        return informationIcon.getText();
    };

    this.clickOnPropertiesTab = function () {
        let propertiesTab = element(by.cssContainingText(".adf-info-drawer-layout-content div.mat-tab-labels div .mat-tab-label-content", "Properties"));
        Util.waitUntilElementIsVisible(propertiesTab);
        propertiesTab.click();
        return this;
    };

    this.clickRightChevron = function () {
        Util.waitUntilElementIsVisible(rightChevron);
        rightChevron.click();
        return this;
    };

    this.clickRightChevronToGetToTab = (tabName) => {
        element.all(by.css('.mat-tab-label'))
            .map((element) => element.getAttribute('innerText'))
            .then((texts) => {
                for (let text of texts) {
                    if (text === tabName) {
                        break;
                    }
                    this.clickRightChevron();
                }
            });
    };

    this.getEditIconTooltip = function () {
        return editIcon.getAttribute('title');
    };

    this.getInformationButtonTooltip = function () {
        return informationSpan.getAttribute('title');
    };

    this.editPropertyIconIsDisplayed = function (propertyName) {
        var editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(editPropertyIcon);
    };

    this.updatePropertyIconIsDisplayed = function (propertyName) {
        var updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(updatePropertyIcon);
    };

    this.clickUpdatePropertyIcon = function (propertyName) {
        var updatePropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-update-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(updatePropertyIcon);
        return updatePropertyIcon.click();
    };

    this.clickClearPropertyIcon = function (propertyName) {
        var clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(clearPropertyIcon);
        return clearPropertyIcon.click();
    };

    this.enterPropertyText = function (propertyName, text) {
        const textField = element(by.css('input[data-automation-id="card-textitem-editinput-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear().sendKeys(text);
        return this;
    };

    this.enterPresetText = function (text) {
        const presetField = element(by.css('input[data-automation-id="adf-text-custom-preset"]'));
        Util.waitUntilElementIsVisible(presetField);
        presetField.sendKeys('');
        presetField.clear().sendKeys(text);
        const applyButton = element(by.css('button[id="adf-metadata-aplly"]'));
        applyButton.click();
        return this;
    };

    this.enterDescriptionText = function (text) {
        const textField = element(by.css('textarea[data-automation-id="card-textitem-edittextarea-properties.cm:description"]'));
        Util.waitUntilElementIsVisible(textField);
        textField.sendKeys('');
        textField.clear().sendKeys(text);
        return this;
    };

    this.getPropertyText = function (propertyName, type) {
        let propertyType = !type ? 'textitem' : type;
        const textField = element(by.css('span[data-automation-id="card-' + propertyType + '-value-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(textField);
        return textField.getText();
    };

    this.clearPropertyIconIsDisplayed = function (propertyName) {
        var clearPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-reset-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(clearPropertyIcon);
    };

    this.clickEditPropertyIcons = function (propertyName) {
        var editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(editPropertyIcon);
        editPropertyIcon.click();
    };

    this.getPropertyIconTooltip = function (propertyName) {
        var editPropertyIcon = element(by.css('mat-icon[data-automation-id="card-textitem-edit-icon-' + propertyName + '"]'));
        return editPropertyIcon.getAttribute('title');
    };

    this.clickMetadatGroup = function (groupName) {
        var group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        Util.waitUntilElementIsVisible(group);
        group.click();
    };

    this.checkkMetadatGroupIsPresent = function (groupName) {
        var group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return Util.waitUntilElementIsVisible(group);
    };

    this.checkkMetadatGroupIsNotPresent = function (groupName) {
        var group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"]'));
        return Util.waitUntilElementIsNotVisible(group);
    };

    this.chekMetadatGroupIsExpand = function (groupName) {
        var group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        Util.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).toContain('mat-expanded')
    };

    this.chekMetadatGroupIsNotExpand = function (groupName) {
        var group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header'));
        Util.waitUntilElementIsVisible(group);
        expect(group.getAttribute('class')).not.toContain('mat-expanded')
    };

    this.getkMetadatGroupTitle = function (groupName) {
        var group = element(by.css('mat-expansion-panel[data-automation-id="adf-metadata-group-' + groupName + '"] > mat-expansion-panel-header > span > mat-panel-title'));
        Util.waitUntilElementIsVisible(group);
        return group.getText();
    };

    /**
     * disables displayEmpty
     */
    this.disableDisplayEmpty = function () {
        Util.waitUntilElementIsVisible(displayEmptySwitch);
        displayEmptySwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                displayEmptySwitch.click();
                expect(displayEmptySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables displayEmpty
     */
    this.enableDisplayEmpty = function () {
        Util.waitUntilElementIsVisible(displayEmptySwitch);
        displayEmptySwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                displayEmptySwitch.click();
                expect(displayEmptySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables Readonly
     */
    this.disableReadonly = function () {
        Util.waitUntilElementIsVisible(readonlySwitch);
        readonlySwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                readonlySwitch.click();
                expect(readonlySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables Readonly
     */
    this.enableReadonly = function () {
        Util.waitUntilElementIsVisible(readonlySwitch);
        readonlySwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                readonlySwitch.click();
                expect(readonlySwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables multi
     */
    this.disableMulti = function () {
        Util.waitUntilElementIsVisible(multiSwitch);
        multiSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                multiSwitch.click();
                expect(multiSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables multi
     */
    this.enableMulti = function () {
        Util.waitUntilElementIsVisible(multiSwitch);
        multiSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                multiSwitch.click();
                expect(multiSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables preset
     */
    this.disablePreset = function () {
        Util.waitUntilElementIsVisible(presetSwitch);
        presetSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                presetSwitch.click();
                expect(presetSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables preset
     */
    this.enablePreset = function () {
        Util.waitUntilElementIsVisible(presetSwitch);
        presetSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                presetSwitch.click();
                expect(presetSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables preset
     */
    this.disabledDefaultProperties = function () {
        Util.waitUntilElementIsVisible(defaultPropertiesSwitch);
        defaultPropertiesSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                defaultPropertiesSwitch.click();
                expect(defaultPropertiesSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables preset
     */
    this.enabledDefaultProperties = function () {
        Util.waitUntilElementIsVisible(defaultPropertiesSwitch);
        defaultPropertiesSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                defaultPropertiesSwitch.click();
                expect(defaultPropertiesSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    this.checkPopertyIsVisible = function (propertyName, type) {
        var property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        Util.waitUntilElementIsVisible(property);
    };

    this.checkPopertyIsNotVisible = function (propertyName, type) {
        var property = element(by.css('div[data-automation-id="card-' + type + '-label-' + propertyName + '"]'));
        Util.waitUntilElementIsNotVisible(property);
    };
};

module.exports = MetadataViewPage;
