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

import { element, by, browser } from 'protractor';
import { BrowserVisibility, BrowserActions, DropdownPage, SnackbarPage } from '@alfresco/adf-testing';

export class NotificationDemoPage {

    snackbarPage = new SnackbarPage();

    messageField = element(by.css('input[data-automation-id="notification-message"]'));
    durationField = element(by.css('input[data-automation-id="notification-duration"]'));
    actionToggle = element(by.css('mat-slide-toggle[data-automation-id="notification-action-toggle"]'));
    notificationSnackBar = element.all(by.css('simple-snack-bar')).first();
    actionOutput = element(by.css('div[data-automation-id="notification-action-output"]'));
    notificationsPage = element(by.css('.app-sidenav-link[data-automation-id="Notifications"]'));
    notificationConfig = element(by.css('p[data-automation-id="notification-custom-object"]'));

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

    async isNotificationSnackBarDisplayed(): Promise<boolean> {
        return this.snackbarPage.isNotificationSnackBarDisplayed();
    }

    async getSnackBarMessage(): Promise<string> {
        return this.snackbarPage.getSnackBarMessage();
    }

    async waitForSnackBarToClose(): Promise<void> {
        await this.snackbarPage.waitForSnackBarToClose(15000);
    }

    async enterMessageField(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.messageField, text);
    }

    async enterDurationField(time: number): Promise<void> {
        await BrowserActions.clearSendKeys(this.durationField, time.toString());
    }

    async selectHorizontalPosition(selectItem: string): Promise<void> {
        await this.horizontalPositionDropdown.selectDropdownOption(selectItem);
    }

    async selectVerticalPosition(selectItem: string): Promise<void> {
        await this.verticalPositionDropdown.selectDropdownOption(selectItem);
    }

    async selectDirection(selectItem: string): Promise<void> {
        await this.directionDropdown.selectDropdownOption(selectItem);
    }

    async clickNotificationButton(): Promise<void> {
        const button = element(by.css('button[data-automation-id="notification-custom-config-button"]'));
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
        await BrowserActions.click(this.messageField);
        await BrowserActions.clearWithBackSpace(this.messageField);
    }
}
