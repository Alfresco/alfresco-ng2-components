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

var CardViewPage = function () {

    var title = element(by.css("div[info-drawer-title]"));
    var activeTab = element(by.css("div[class*='mat-tab-label-active']"));
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
    var editIcon = element(by.css("button[data-automation-id='mata-data-card-toggle-edit']"));
    var informationButton = element(by.css("button[data-automation-id='mata-data-card-toggle-expand']"));
    var informationSpan = element(by.css("span[data-automation-id='mata-data-card-toggle-expand-label']"));
    var informationIcon = element(by.css("span[data-automation-id='mata-data-card-toggle-expand-label'] ~ mat-icon"));
    var uploadNewVersionButton = element(by.css("input[data-automation-id='upload-single-file']"));
    var rightChevron = element(by.css("div[class*='header-pagination-after']"));

    this.getTitle = function () {
        Util.waitUntilElementIsVisible(title);
        return title.getText();
    };

    this.getActiveTab = function () {
        Util.waitUntilElementIsVisible(activeTab);
        return activeTab.getText();
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

    this.editIconIsDisplayed = function() {
        Util.waitUntilElementIsVisible(editIcon);
        return editIcon.getText();
    };

    this.informationButtonIsDisplayed = function() {
        Util.waitUntilElementIsVisible(informationSpan);
        return informationSpan.getText();
    };

    this.clickOnInformationButton = function() {
        Util.waitUntilElementIsVisible(informationButton);
        Util.waitUntilElementIsClickable(informationButton);
        informationButton.click();
        return this;
    };

    this.getInformationButtonText = function() {
        Util.waitUntilElementIsVisible(informationSpan);
        return informationSpan.getText();
    };

    this.getInformationIconText = function() {
        Util.waitUntilElementIsVisible(informationIcon);
        return informationIcon.getText();
    };

    this.clickOnVersionsTab = function() {
        this.clickRightChevronToGetToTab('Versions');
        var versionsTab = element(by.cssContainingText("div[id*='mat-tab-label']", "Versions"));
        Util.waitUntilElementIsVisible(versionsTab);
        versionsTab.click();
        return this;
    };

    this.clickOnPropertiesTab = function() {
        var propertiesTab = element(by.cssContainingText("div[class='mat-tab-labels'] div", "Properties"));
        Util.waitUntilElementIsVisible(propertiesTab);
        propertiesTab.click();
        return this;
    };

    this.clickRightChevron = function() {
        Util.waitUntilElementIsVisible(rightChevron);
        rightChevron.click();
        return this;
    };

    this.clickRightChevronToGetToTab = (tabName) => {
        element.all(by.css('.mat-tab-label'))
            .map((element) => element.getAttribute('innerText'))
            .then((texts) => {
                for (let text of texts) {
                    if (text === tabName ) {
                        break;
                    }
                    this.clickRightChevron();
                }
            });
    };

    this.checkUploadVersionsButtonIsDisplayed = function() {
        Util.waitUntilElementIsVisible(uploadNewVersionButton);
        return this;
    };

    this.checkVersionIsDisplayed = function(version) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText("h4[class*='adf-version-list-item-name']", version)));
        return this;
    };

    this.getEditIconTooltip = function () {
        return editIcon.getAttribute('title');
    };

    this.getInformationButtonTooltip = function () {
        return informationSpan.getAttribute('title');
    };
};

module.exports = CardViewPage;
