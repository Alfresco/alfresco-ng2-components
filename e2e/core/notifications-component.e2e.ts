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

import { createApiService, LoginPage, UserModel, UsersActions } from '@alfresco/adf-testing';
import { NotificationDemoPage } from '../core/pages/notification.page';
import { browser } from 'protractor';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('Notifications Component', () => {

    const loginPage = new LoginPage();
    const notificationPage = new NotificationDemoPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let acsUser: UserModel;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        acsUser = await usersActions.createUser();

        await apiService.login(acsUser.username, acsUser.password);

        await loginPage.login(acsUser.username, acsUser.password);

        await notificationPage.goToNotificationsPage();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    beforeEach(async () => {
        await notificationPage.enterDurationField(3000);
    });

    afterEach(async () => {
        await notificationPage.snackbarPage.waitForSnackBarToClose();
        await browser.executeScript(`document.querySelector('button[data-automation-id="notification-custom-dismiss-button"]').click();`);
    });

    it('[C279979] Should not show notification when the message is empty and button is clicked', async () => {
        await notificationPage.clearMessage();
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.isNotificationSnackBarDisplayed()).toEqual(false);
    });

    it('[C279977] Should show notification when the message is not empty and button is clicked', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.getSnackBarMessage()).toEqual('test');
    });

    it('[C279978] Should show notification with action when the message is not empty and button is clicked', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.clickActionToggle();
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.getSnackBarMessage()).toEqual('test');
        await notificationPage.clickActionButton();
        await notificationPage.checkActionEvent();
        await notificationPage.clickActionToggle();
    });

    it('[C279981] Should show notification with action when the message is not empty and custom configuration button is clicked', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.isNotificationSnackBarDisplayed()).toEqual(true);
    });

    it('[C280000] Should show notification with action when the message is not empty and custom button is clicked', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.clickActionToggle();
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.isNotificationSnackBarDisplayed()).toEqual(true);
        await expect(await notificationPage.snackbarPage.getSnackBarMessage()).toEqual('test');
        await notificationPage.snackbarPage.waitForSnackBarToClose();
        await notificationPage.clickNotificationButton();
        await notificationPage.clickActionButton();
        await notificationPage.checkActionEvent();
        await notificationPage.clickActionToggle();
    });

    it('[C694098] Should show a decorative icon when the message and the icon fields are not empty and button is clicked', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.enterDecorativeIconField('folder');
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.getSnackBarDecorativeIcon()).toEqual('folder');
    });

    it('[C279987] Should show custom notification during a limited time when a duration is added', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.enterDurationField(1000);
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.snackbarPage.isNotificationSnackBarDisplayed()).toEqual(true);
        await browser.sleep(2000);
        await expect(await notificationPage.snackbarPage.isNotificationSnackBarDisplayed()).toEqual(false);
    });

    it('[C280001] Should meet configuration when a custom notification is set', async () => {
        await notificationPage.enterMessageField('test');
        await notificationPage.enterDurationField(1000);
        await notificationPage.selectHorizontalPosition('Right');
        await notificationPage.selectVerticalPosition('Top');
        await notificationPage.selectDirection('Left to right');
        await notificationPage.clickNotificationButton();
        await expect(await notificationPage.getConfigObject()).toBe('{"direction": "ltr", "duration": "1000", "horizontalPosition": "right", "verticalPosition": "top"}');
    });
});
