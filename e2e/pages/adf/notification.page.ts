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

import { element, by, browser, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions, DropdownPage } from '@alfresco/adf-testing';

export class NotificationPage {

    messageField: ElementFinder = element(by.css('input[data-automation-id="notification-message"]'));
    durationField: ElementFinder = element(by.css('input[data-automation-id="notification-duration"]'));
    actionToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="notification-action-toggle"]'));
    notificationSnackBar: ElementFinder = element.all(by.css('simple-snack-bar')).first();
    actionOutput: ElementFinder = element(by.css('div[data-automation-id="notification-action-output"]'));
    notificationsPage: ElementFinder = element(by.css('.app-sidenav-link[data-automation-id="Notifications"]'));
    notificationConfig: ElementFinder = element(by.css('p[data-automation-id="notification-custom-object"]'));

    horizontalPositionDropdown = new DropdownPage(element(by.css('mat-select[data-automation-id="notification-horizontal-position"]')));
    verticalPositionDropdown = new DropdownPage(element(by.css('mat-select[data-automation-id="notification-vertical-position"]')));
    directionDropdown = new DropdownPage(element(by.css('mat-select[data-automation-id="notification-direction"]')));

    async checkNotifyContains(message): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element.all(by.cssContainingText('simple-snack-bar', message)).first());
    }

    async goToNotificationsPage(): Promise<void> {
        await BrowserActions.click(this.notificationsPage);
    }

    getConfigObject(): Promise<string> {
        return BrowserActions.getText(this.notificationConfig);
    }

    async checkNotificationSnackBarIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.notificationSnackBar);
    }

    async checkNotificationSnackBarIsDisplayedWithMessage(message): Promise<void> {
        const notificationSnackBarMessage: ElementFinder = element(by.cssContainingText('simple-snack-bar', message));
        await BrowserVisibility.waitUntilElementIsVisible(notificationSnackBarMessage);
    }

    async checkNotificationSnackBarIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.notificationSnackBar);
    }

    async enterMessageField(text): Promise<void> {
        await BrowserActions.clearSendKeys(this.messageField, text);
    }

    async enterDurationField(time): Promise<void> {
        await BrowserActions.clearSendKeys(this.durationField, time);
    }

    async selectHorizontalPosition(selectItem): Promise<void> {
        await this.horizontalPositionDropdown.clickDropdown();
        await this.horizontalPositionDropdown.selectOption(selectItem);
    }

    async selectVerticalPosition(selectItem): Promise<void> {
        await this.verticalPositionDropdown.clickDropdown();
        await this.verticalPositionDropdown.selectOption(selectItem);
    }

    async selectDirection(selectItem): Promise<void> {
        await this.directionDropdown.clickDropdown();
        await this.directionDropdown.selectOption(selectItem);
    }

    async clickNotificationButton(): Promise<void> {
        const button: ElementFinder = element(by.css('button[data-automation-id="notification-custom-config-button"]'));
        await BrowserActions.click(button);
    }

    async checkActionEvent(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.actionOutput);
    }

    async clickActionToggle(): Promise<void> {
        await BrowserActions.click(this.actionToggle);
    }

    async clickActionButton(): Promise<void> {
        await browser.executeScript(`document.querySelector("simple-snack-bar > div > button").click();`);
    }

    async clearMessage(): Promise<void> {
        await BrowserActions.clearSendKeys(this.messageField, '');
    }
}
