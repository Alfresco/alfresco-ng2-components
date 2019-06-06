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

import { BrowserVisibility, BreadCrumbDropdownPage, SitesDropdownPage, DocumentListPage, BrowserActions } from '@alfresco/adf-testing';
import { element, by } from 'protractor';

export class ObjectPickerPage {

    title = element(by.cssContainingText('ng-component main h1', 'Object picker'));
    customSiteListPanel = element(by.css(`mat-expansion-panel[data-automation-id='custom-site-list-panel']`));
    customSiteListExpanded = element(by.css(`mat-expansion-panel[class*='mat-expanded'][data-automation-id='custom-site-list-panel']`));
    siteGuid = this.customSiteListPanel.element(by.css(`input[data-automation-id='site-guid-input']`));
    siteTitle = this.customSiteListPanel.element(by.css(`input[data-automation-id='site-title-input']`));
    addButton = this.customSiteListPanel.element(by.css(`button[data-automation-id='add-button']`));
    breadCrumbDropdown = new BreadCrumbDropdownPage(this.customSiteListPanel);
    sitesDropdown = new SitesDropdownPage(this.customSiteListPanel);
    contentList = new DocumentListPage(this.customSiteListPanel);

    checkObjectPickerTitleIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.title);
    }

    clickCustomSiteListPanel() {
        BrowserActions.click(this.customSiteListPanel);
    }

    checkCustomSiteListExpanded() {
        BrowserVisibility.waitUntilElementIsVisible(this.customSiteListExpanded);
    }

    enterTextInSiteGuid(text) {
        BrowserActions.clearSendKeys(this.siteGuid, text);
    }

    enterTextInSiteTitle(text) {
        BrowserActions.clearSendKeys(this.siteTitle, text);
    }

    clickAddButton() {
        BrowserActions.click(this.addButton);
    }

    breadCrumbDropdownPage() {
        return this.breadCrumbDropdown;
    }

    sitesDropdownPage() {
        return this.sitesDropdown;
    }

    contentListPage() {
        return this.contentList;
    }

}
