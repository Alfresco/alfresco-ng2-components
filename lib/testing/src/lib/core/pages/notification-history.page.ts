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

import { by, element } from 'protractor';
import { BrowserActions } from '../utils/browser-actions';
import { ElementFinder } from 'protractor';

export class NotificationHistoryPage {

    notificationList: ElementFinder = element(by.css('#adf-notification-history-list'));

    async clickNotificationButton(): Promise<void> {
        await BrowserActions.clickExecuteScript('#adf-notification-history-open-button');
    }

    async clickMarkAsRead(): Promise<void> {
        await BrowserActions.click(element(by.css('#adf-notification-history-mark-as-read')));
    }

    async checkNotificationIsPresent(text: string): Promise<void> {
        const notificationLisText = await BrowserActions.getText(this.notificationList);
        await expect(notificationLisText).toContain(text);
    }

    async checkNotificationIsNotPresent(text: string): Promise<void> {
        const notificationLisText = await BrowserActions.getText(this.notificationList);
        await expect(notificationLisText).not.toContain(text);
    }

    async checkNotifyContains(text: string): Promise<void> {
        await this.clickNotificationButton();
        await this.checkNotificationIsPresent(text);
        await this.clickMarkAsRead();
    }

    async checkNotifyNotContains(text: string): Promise<void> {
        await this.clickNotificationButton();
        await this.checkNotificationIsNotPresent(text);
        await BrowserActions.closeMenuAndDialogs();
    }
}
