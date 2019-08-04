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

import { by, element, ElementFinder } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';
import { BrowserVisibility } from '../utils/browser-visibility';

export class NotificationHistoryPage {

    notificationList: ElementFinder = element(by.id('adf-notification-history-list'));

    async isNotificationListOpen() {
        return await BrowserVisibility.waitUntilElementIsPresent(this.notificationList);
    }

    async clickNotificationButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(element(by.id('adf-notification-history-open-button')));
        await BrowserVisibility.waitUntilElementIsVisible(this.notificationList);
    }

    async clickMarkAsRead(): Promise<void> {
        const isOpen = await this.isNotificationListOpen();
        if (!isOpen) {
            await this.clickNotificationButton();
        }
        await BrowserActions.click(element(by.id('adf-notification-history-mark-as-read')));
    }

    private async checkNotificationIsPresent(text: string) {
        const notificationListText = await BrowserActions.getText(this.notificationList);
        return notificationListText.includes(text);
    }

    private async checkNotificationIsNotPresent(text: string) {
        const notificationListText = await BrowserActions.getText(this.notificationList);
        return notificationListText.indexOf(text) === -1;
    }

    async checkNotifyContains(text: string) {
        const isOpen = await this.isNotificationListOpen();
        if (!isOpen) {
            await this.clickNotificationButton();
        }
        const textExists = await this.checkNotificationIsPresent(text);
        expect(textExists).toBe(true, `Notifications list does not contain: ${text}`);
        await BrowserActions.closeMenuAndDialogs();
    }

    async checkNotifyNotContains(text: string): Promise<void> {
        const isOpen = await this.isNotificationListOpen();
        if (!isOpen) {
            await this.clickNotificationButton();
        }
        await this.checkNotificationIsNotPresent(text);
        await BrowserActions.closeMenuAndDialogs();
    }
}
