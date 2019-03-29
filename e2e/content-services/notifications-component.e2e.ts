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

import { LoginPage } from '../pages/adf/loginPage';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import TestConfig = require('../test.config');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NotificationPage } from '../pages/adf/notificationPage';
import { browser } from 'protractor';

describe('Notifications Component', () => {

    let loginPage = new LoginPage();
    let notificationPage = new NotificationPage();

    let acsUser = new AcsUserModel();

    beforeAll(async (done) => {

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        notificationPage.goToNotificationsPage();

        notificationPage.enterDurationField(3000);

        done();
    });

    afterEach( () => {
        browser.executeScript(`document.querySelector('button[data-automation-id="notification-custom-dismiss-button"]').click();`);
        notificationPage.enterDurationField(3000);
    });

    it('[C279977] Should show notification when the message is not empty and button is clicked', () => {
        notificationPage.enterMessageField('Notification test');
        notificationPage.clickNotificationButton();
        notificationPage.checkNotificationSnackBarIsDisplayedWithMessage('Notification test');
    });

    it('[C279979] Should not show notification when the message is empty and button is clicked', () => {
        notificationPage.clearMessage();
        notificationPage.clickNotificationButton();
        notificationPage.checkNotificationSnackBarIsNotDisplayed();
    });

    it('[C279978] Should show notification with action when the message is not empty and button is clicked', () => {
        notificationPage.enterMessageField('Notification test');
        notificationPage.clickActionToggle();
        notificationPage.clickNotificationButton();
        notificationPage.checkNotificationSnackBarIsDisplayedWithMessage('Notification test');
        notificationPage.clickActionButton();
        notificationPage.checkActionEvent();
        notificationPage.clickActionToggle();
    });

    it('[C279981] Should show notification with action when the message is not empty and custom configuration button is clicked', () => {
        notificationPage.enterMessageField('Notification test');
        notificationPage.clickNotificationButton();
        notificationPage.checkNotificationSnackBarIsDisplayed();
    });

    it('[C279987] Should show custom notification during a limited time when a duration is added', () => {
        notificationPage.enterMessageField('Notification test');
        notificationPage.enterDurationField(1000);
        notificationPage.clickNotificationButton();
        notificationPage.checkNotificationSnackBarIsDisplayed();
        browser.sleep(1500);
        notificationPage.checkNotificationSnackBarIsNotDisplayed();
    });

    it('[C280000] Should show notification with action when the message is not empty and custom button is clicked', () => {
        notificationPage.enterMessageField('Notification test');
        notificationPage.clickActionToggle();
        notificationPage.clickNotificationButton();
        notificationPage.checkNotificationSnackBarIsDisplayedWithMessage('Notification test');
        notificationPage.clickActionButton();
        notificationPage.checkActionEvent();
        notificationPage.clickActionToggle();
    });

    it('[C280001] Should meet configuration when a custom notification is set', () => {
        notificationPage.enterMessageField('Notification test');
        notificationPage.enterDurationField(1000);
        notificationPage.selectHorizontalPosition('Right');
        notificationPage.selectVerticalPosition('Top');
        notificationPage.selectDirection('Left to right');
        notificationPage.clickNotificationButton();
        expect(notificationPage.getConfigObject()).toBe('{"direction": "ltr", "duration": "1000", "horizontalPosition": "right", "verticalPosition": "top"}');
    });
});
