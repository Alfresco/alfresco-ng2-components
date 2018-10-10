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

import Util = require('../../util/util');

export class NotificationPage {

    messageField = element(by.css('input[data-automation-id="notification-message"]'));
    horizontalPosition = element(by.css('mat-select[data-automation-id="notification-horizontal-position"]'));
    verticalPosition = element(by.css('mat-select[data-automation-id="notification-vertical-position"]'));
    durationField = element(by.css('input[data-automation-id="notification-duration"]'));
    direction = element(by.css('mat-select[data-automation-id="notification-direction"]'));
    actionToggle = element(by.css('mat-slide-toggle[data-automation-id="notification-action-toggle"]'));
    notificationSnackBar = element.all(by.css('simple-snack-bar')).first();
    actionOutput = element(by.css('div[data-automation-id="notification-action-output"]'));
    actionButton = element(by.css('simple-snack-bar > div > button'));
    customNotificationButton = element(by.css('button[data-automation-id="notification-custom-config-button"]'));
    selectionDropDown = element.all(by.css('div[class*="mat-select-content"]')).first();
    notificationsPage = element(by.css('a[data-automation-id="Notifications"]'));
    notificationConfig = element(by.css('p[data-automation-id="notification-custom-object"]'));

    checkNotifyContains(message) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText('simple-snack-bar', message)));
        return this;
    }

    goToNotificationsPage() {
        Util.waitUntilElementIsVisible(this.notificationsPage);
        this.notificationsPage.click();
    }

    getConfigObject() {
        Util.waitUntilElementIsVisible(this.notificationConfig);
        return this.notificationConfig.getText();
    }

    checkNotificationSnackBarIsDisplayed() {
        Util.waitUntilElementIsVisible(this.notificationSnackBar);
        return this;
    }

    checkNotificationSnackBarIsDisplayedWithMessage(message) {
        let notificationSnackBarMessage = element(by.cssContainingText('simple-snack-bar', message));
        Util.waitUntilElementIsVisible(notificationSnackBarMessage);
        return this;
    }

    checkNotificationSnackBarIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.notificationSnackBar);
        return this;
    }

    enterMessageField(text) {
        Util.waitUntilElementIsVisible(this.messageField);
        this.messageField.clear().sendKeys(text);
    }

    enterDurationField(time) {
        Util.waitUntilElementIsVisible(this.durationField);
        this.durationField.clear().sendKeys(time);
    }

    selectHorizontalPosition(selectedItem) {
        let selectItem = element(by.cssContainingText('span[class="mat-option-text"]', selectedItem));
        this.horizontalPosition.click();
        Util.waitUntilElementIsVisible(this.selectionDropDown);
        selectItem.click();
    }

    selectVerticalPosition(selectedItem) {
        let selectItem = element(by.cssContainingText('span[class="mat-option-text"]', selectedItem));
        this.verticalPosition.click();
        Util.waitUntilElementIsVisible(this.selectionDropDown);
        selectItem.click();
    }

    selectDirection(selectedItem) {
        let selectItem = element(by.cssContainingText('span[class="mat-option-text"]', selectedItem));
        this.direction.click();
        Util.waitUntilElementIsVisible(this.selectionDropDown);
        selectItem.click();
    }

    clickNotificationButton() {
        Util.waitUntilElementIsVisible(this.customNotificationButton);
        this.customNotificationButton.click();
    }

    checkActionEvent() {
        Util.waitUntilElementIsVisible(this.actionOutput);
        return this;
    }

    clickActionToggle() {
        Util.waitUntilElementIsVisible(this.actionToggle);
        this.actionToggle.click();
    }

    clickActionButton() {
        this.actionButton.click();
    }

    clearMessage() {
        Util.waitUntilElementIsVisible(this.messageField);
        this.messageField.clear();
        this.messageField.sendKeys('a');
        this.messageField.sendKeys(protractor.Key.BACK_SPACE);
    }
}
