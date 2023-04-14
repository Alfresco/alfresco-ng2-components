/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { element, by, browser, $, $$ } from 'protractor';
import { BrowserVisibility, BrowserActions, DropdownPage, SnackbarPage } from '@alfresco/adf-testing';

export class NotificationDemoPage {

    snackbarPage = new SnackbarPage();

    messageField = $('input[data-automation-id="notification-message"]');
    decorativeIconField = $('input[data-automation-id="notification-icon"]');
    durationField = $('input[data-automation-id="notification-duration"]');
    actionToggle = $('mat-slide-toggle[data-automation-id="notification-action-toggle"]');
    notificationSnackBar = $$('simple-snack-bar').first();
    actionOutput = $('div[data-automation-id="notification-action-output"]');
    notificationsPage = $('.app-sidenav-link[data-automation-id="Notifications"]');
    notificationConfig = $('p[data-automation-id="notification-custom-object"]');

    horizontalPositionDropdown = new DropdownPage($('mat-select[data-automation-id="notification-horizontal-position"]'));
    verticalPositionDropdown = new DropdownPage($('mat-select[data-automation-id="notification-vertical-position"]'));
    directionDropdown = new DropdownPage($('mat-select[data-automation-id="notification-direction"]'));

    async checkNotifyContains(message): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element.all(by.cssContainingText('simple-snack-bar', message)).first());
    }

    async goToNotificationsPage(): Promise<void> {
        await BrowserActions.click(this.notificationsPage);
    }

    getConfigObject(): Promise<string> {
        return BrowserActions.getText(this.notificationConfig);
    }

    async enterMessageField(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.messageField, text);
    }

    async enterDecorativeIconField(icon: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.decorativeIconField, icon);
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
        const button = $('button[data-automation-id="notification-custom-config-button"]');
        await BrowserActions.click(button);
    }

    async checkActionEvent(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.actionOutput);
    }

    async clickActionToggle(): Promise<void> {
        await BrowserActions.click(this.actionToggle);
    }

    async clickActionButton(): Promise<void> {
        await browser.executeScript(`document.querySelector("[data-automation-id='adf-snackbar-message-content-action-button']").click();`);
    }

    async clearMessage(): Promise<void> {
        await BrowserActions.click(this.messageField);
        await BrowserActions.clearWithBackSpace(this.messageField);
    }
}
