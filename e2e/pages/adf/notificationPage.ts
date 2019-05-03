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

import { element, by, protractor, browser, until } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class NotificationPage {

    messageField = element(by.css('input[data-automation-id="notification-message"]'));
    horizontalPosition = element(by.css('mat-select[data-automation-id="notification-horizontal-position"]'));
    verticalPosition = element(by.css('mat-select[data-automation-id="notification-vertical-position"]'));
    durationField = element(by.css('input[data-automation-id="notification-duration"]'));
    direction = element(by.css('mat-select[data-automation-id="notification-direction"]'));
    actionToggle = element(by.css('mat-slide-toggle[data-automation-id="notification-action-toggle"]'));
    notificationSnackBar = element.all(by.css('simple-snack-bar')).first();
    actionOutput = element(by.css('div[data-automation-id="notification-action-output"]'));
    selectionDropDown = element.all(by.css('.mat-select-panel')).first();
    notificationsPage = element(by.css('a[data-automation-id="Notifications"]'));
    notificationConfig = element(by.css('p[data-automation-id="notification-custom-object"]'));

    checkNotifyContains(message) {
        BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('simple-snack-bar', message)));
        return this;
    }

    goToNotificationsPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.notificationsPage);
        this.notificationsPage.click();
    }

    getConfigObject() {
        BrowserVisibility.waitUntilElementIsVisible(this.notificationConfig);
        return this.notificationConfig.getText();
    }

    checkNotificationSnackBarIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.notificationSnackBar);
        return this;
    }

    checkNotificationSnackBarIsDisplayedWithMessage(message) {
        const notificationSnackBarMessage = element(by.cssContainingText('simple-snack-bar', message));
        BrowserVisibility.waitUntilElementIsVisible(notificationSnackBarMessage);
        return this;
    }

    checkNotificationSnackBarIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.notificationSnackBar);
        return this;
    }

    enterMessageField(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.messageField);
        this.messageField.clear();
        this.messageField.sendKeys(text);
    }

    enterDurationField(time) {
        BrowserVisibility.waitUntilElementIsVisible(this.durationField);
        this.durationField.clear();
        this.durationField.sendKeys(time);
    }

    selectHorizontalPosition(selectedItem) {
        const selectItem = element(by.cssContainingText('span[class="mat-option-text"]', selectedItem));
        this.horizontalPosition.click();
        BrowserVisibility.waitUntilElementIsVisible(this.selectionDropDown);
        selectItem.click();
    }

    selectVerticalPosition(selectedItem) {
        const selectItem = element(by.cssContainingText('span[class="mat-option-text"]', selectedItem));
        this.verticalPosition.click();
        BrowserVisibility.waitUntilElementIsVisible(this.selectionDropDown);
        selectItem.click();
    }

    selectDirection(selectedItem) {
        const selectItem = element(by.cssContainingText('span[class="mat-option-text"]', selectedItem));
        this.direction.click();
        BrowserVisibility.waitUntilElementIsVisible(this.selectionDropDown);
        selectItem.click();
    }

    clickNotificationButton() {
        const button = browser.wait(until.elementLocated(by.css('button[data-automation-id="notification-custom-config-button"]')));
        button.click();
    }

    checkActionEvent() {
        BrowserVisibility.waitUntilElementIsVisible(this.actionOutput);
        return this;
    }

    clickActionToggle() {
        BrowserVisibility.waitUntilElementIsVisible(this.actionToggle);
        this.actionToggle.click();
    }

    clickActionButton() {
        browser.executeScript(`document.querySelector("simple-snack-bar > div > button").click();`);
    }

    clearMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.messageField);
        this.messageField.clear();
        this.messageField.sendKeys('a');
        this.messageField.sendKeys(protractor.Key.BACK_SPACE);
    }
}
