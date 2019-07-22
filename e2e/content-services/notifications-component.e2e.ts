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

import { LoginPage } from '@alfresco/adf-testing';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NotificationPage } from '../pages/adf/notificationPage';
import { browser } from 'protractor';

describe('Notifications Component',  () => {

    const loginPage = new LoginPage();
    const notificationHistoryPage = new NotificationPage();

    const acsUser = new AcsUserModel();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf.url
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await notificationHistoryPage.goToNotificationsPage();

        await notificationHistoryPage.enterDurationField(3000);

        done();
    });

    afterEach( async() => {
        browser.executeScript(`document.querySelector('button[data-automation-id="notification-custom-dismiss-button"]').click();`);
        await notificationHistoryPage.enterDurationField(3000);
    });

    it('[C279977] Should show notification when the message is not empty and button is clicked', async () => {
        await notificationHistoryPage.enterMessageField('Notification test');
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.checkNotificationSnackBarIsDisplayedWithMessage('Notification test');
    });

    it('[C279979] Should not show notification when the message is empty and button is clicked', async () => {
        await notificationHistoryPage.clearMessage();
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.checkNotificationSnackBarIsNotDisplayed();
    });

    it('[C279978] Should show notification with action when the message is not empty and button is clicked', async () => {
        await notificationHistoryPage.enterMessageField('Notification test');
        await notificationHistoryPage.clickActionToggle();
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.checkNotificationSnackBarIsDisplayedWithMessage('Notification test');
        await notificationHistoryPage.clickActionButton();
        await notificationHistoryPage.checkActionEvent();
        await notificationHistoryPage.clickActionToggle();
    });

    it('[C279981] Should show notification with action when the message is not empty and custom configuration button is clicked', async () => {
        await notificationHistoryPage.enterMessageField('Notification test');
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.checkNotificationSnackBarIsDisplayed();
    });

    it('[C279987] Should show custom notification during a limited time when a duration is added', async () => {
        await notificationHistoryPage.enterMessageField('Notification test');
        await notificationHistoryPage.enterDurationField(1000);
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.checkNotificationSnackBarIsDisplayed();
        await browser.sleep(1500);
        await notificationHistoryPage.checkNotificationSnackBarIsNotDisplayed();
    });

    it('[C280000] Should show notification with action when the message is not empty and custom button is clicked', async () => {
        await notificationHistoryPage.enterMessageField('Notification test');
        await notificationHistoryPage.clickActionToggle();
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.checkNotificationSnackBarIsDisplayedWithMessage('Notification test');
        await notificationHistoryPage.checkNotificationSnackBarIsNotDisplayed();
        await notificationHistoryPage.clickNotificationButton();
        await notificationHistoryPage.clickActionButton();
        await notificationHistoryPage.checkActionEvent();
        await notificationHistoryPage.clickActionToggle();
    });

    it('[C280001] Should meet configuration when a custom notification is set', async () => {
        await notificationHistoryPage.enterMessageField('Notification test');
        await notificationHistoryPage.enterDurationField(1000);
        await notificationHistoryPage.selectHorizontalPosition('Right');
        await notificationHistoryPage.selectVerticalPosition('Top');
        await notificationHistoryPage.selectDirection('Left to right');
        await notificationHistoryPage.clickNotificationButton();
        expect(await notificationHistoryPage.getConfigObject()).toBe('{"direction": "ltr", "duration": "1000", "horizontalPosition": "right", "verticalPosition": "top"}');
    });
});
