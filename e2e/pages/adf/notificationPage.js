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
var protractor = require("protractor");

var NotificationPage = function () {

    var messageField = element(by.css("input[data-automation-id='notification-message']"));
    var horizontalPosition = element(by.css("mat-select[data-automation-id='notification-horizontal-position']"));
    var verticalPosition = element(by.css("mat-select[data-automation-id='notification-vertical-position']"));
    var durationField = element(by.css("input[data-automation-id='notification-duration']"));
    var direction = element(by.css("mat-select[data-automation-id='notification-direction']"));
    var actionToggle = element(by.css("mat-slide-toggle[data-automation-id='notification-action-toggle']"));
    var notificationSnackBar = element.all(by.css("simple-snack-bar")).first();
    var actionOutput = element(by.css("div[data-automation-id='notification-action-output']"));
    var actionButton = element(by.css("simple-snack-bar > div > button"));
    var defaultNotificationButton = element(by.css("button[data-automation-id='notification-default-button']"));
    var customNotificationButton = element(by.css("button[data-automation-id='notification-custom-config-button']"));
    var selectionDropDown = element.all(by.css("div[class*='mat-select-content']")).first();
    var notificationsPage = element(by.css("a[data-automation-id='Notifications']"));
    var notificationConfig = element(by.css("p[data-automation-id='notification-custom-object']"));

    this.checkNotifyContains = function (message) {
        Util.waitUntilElementIsVisible(element(by.cssContainingText('simple-snack-bar', message)));
        return this;
    };

    this.goToNotificationsPage = function () {
        Util.waitUntilElementIsVisible(notificationsPage);
        notificationsPage.click();
    };

    this.getConfigObject = function () {
        Util.waitUntilElementIsVisible(notificationConfig);
        return notificationConfig.getText();
    };

    this.getSnackBarText = function () {
        return notificationSnackBar.getText();
    };

    this.checkNotificationSnackBarIsDisplayed = function () {
        Util.waitUntilElementIsVisible(notificationSnackBar);
        return this;
    };

    this.checkNotificationSnackBarIsDisplayedWithMessage = function (message) {
        let notificationSnackBarMessage = element(by.cssContainingText("simple-snack-bar", message));
        Util.waitUntilElementIsVisible(notificationSnackBarMessage);
        return this;
    };

    this.checkNotificationSnackBarIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(notificationSnackBar);
        return this;
    };

    this.enterMessageField = function (text) {
        Util.waitUntilElementIsVisible(messageField);
        messageField.clear().sendKeys(text);
    };

    this.enterDurationField = function (time) {
        Util.waitUntilElementIsVisible(durationField);
        durationField.clear().sendKeys(time);
    };

    this.selectHorizontalPosition = function (selectedItem) {
        var selectItem = element(by.cssContainingText("span[class='mat-option-text']", selectedItem));
        horizontalPosition.click();
        Util.waitUntilElementIsVisible(selectionDropDown);
        selectItem.click();
    };

    this.selectVerticalPosition = function (selectedItem) {
        var selectItem = element(by.cssContainingText("span[class='mat-option-text']", selectedItem));
        verticalPosition.click();
        Util.waitUntilElementIsVisible(selectionDropDown);
        selectItem.click();
    };

    this.selectDirection = function (selectedItem) {
        var selectItem = element(by.cssContainingText("span[class='mat-option-text']", selectedItem));
        direction.click();
        Util.waitUntilElementIsVisible(selectionDropDown);
        selectItem.click();
    };

    this.clickDefaultNotificationButton = function () {
        Util.waitUntilElementIsVisible(defaultNotificationButton);
        defaultNotificationButton.click();
    };

    this.clickCustomNotificationButton = function () {
        Util.waitUntilElementIsVisible(customNotificationButton);
        customNotificationButton.click();
    };

    this.checkActionEvent = function () {
        Util.waitUntilElementIsVisible(actionOutput);
        return this;
    };

    this.clickActionToggle = function () {
        Util.waitUntilElementIsVisible(actionToggle);
        actionToggle.click();
    };

    this.clickActionButton = function () {
        Util.waitUntilElementIsVisible(actionButton);
        Util.waitUntilElementIsClickable(actionButton);
        actionButton.click();
    };

    this.clearMessage = function (inputText) {
        Util.waitUntilElementIsVisible(messageField);
        for (var i = inputText.length; i >= 0; i--) {
            messageField.sendKeys(protractor.Key.BACK_SPACE);
        }
    };
};

module.exports = NotificationPage;
