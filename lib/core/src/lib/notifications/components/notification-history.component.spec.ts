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

import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { setupTestBed } from '../../testing/setup-test-bed';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { NotificationHistoryComponent } from './notification-history.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../../common/services/storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationModel, NOTIFICATION_TYPE } from '../models/notification.model';

describe('Notification History Component', () => {

    let fixture: ComponentFixture<NotificationHistoryComponent>;
    let component: NotificationHistoryComponent;
    let element: HTMLElement;
    let notificationService: NotificationService;
    let overlayContainerElement: HTMLElement;
    let storage: StorageService;

    const openNotification = () => {
        fixture.detectChanges();
        const button = element.querySelector<HTMLButtonElement>('#adf-notification-history-open-button');
        button.click();
        fixture.detectChanges();
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationHistoryComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        storage = TestBed.inject(StorageService);
        notificationService = TestBed.inject(NotificationService);
        component.notifications = [];
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
        overlayContainerElement = oc.getContainerElement();
    }));

    afterEach(() => {
        storage.removeItem(NotificationHistoryComponent.NOTIFICATION_STORAGE);
        fixture.destroy();
    });

    describe('ui ', () => {

        it('should empty message be present when there are no notifications in the history', (done) => {
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(overlayContainerElement.querySelector('#adf-notification-history-component-no-message')).toBeDefined();
                done();
            });
        });

        it('should remove notification when mark all as read is clicked', (done) => {
            fixture.detectChanges();
            notificationService.showInfo('Example Message Removed');
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(component.notifications.length).toBe(1);
                const markAllAsRead = overlayContainerElement.querySelector<HTMLButtonElement>('#adf-notification-history-mark-as-read');
                markAllAsRead.click();
                fixture.detectChanges();
                expect(storage.getItem(NotificationHistoryComponent.NOTIFICATION_STORAGE)).toBeNull();
                expect(component.notifications.length).toBe(0);
                done();
            });
        });

        it('should message be present and empty message not be present when there are notifications in the history', (done) => {
            fixture.detectChanges();
            notificationService.showInfo('Example Message');
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(overlayContainerElement.querySelector('#adf-notification-history-component-no-message')).toBeNull();
                expect(overlayContainerElement.querySelector('.adf-notification-history-list').innerHTML).toContain('Example Message');
                done();
            });
        });

        it('should show message when pushed directly to Notification History', (done) => {
            const callBackSpy = jasmine.createSpy('callBack');
            fixture.detectChanges();
            notificationService.pushToNotificationHistory(
                {
                    clickCallBack: callBackSpy,
                    messages: ['My new message'],
                    datetime: new Date(),
                    type: NOTIFICATION_TYPE.RECURSIVE

                } as NotificationModel
            );
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const notification = overlayContainerElement.querySelector<HTMLButtonElement>('.adf-notification-history-menu-item');
                notification.click();
                expect(callBackSpy).toHaveBeenCalled();
                done();
            });
        }, 10000);

        it('should show load more button when there are more notifications', (done) => {
            fixture.detectChanges();
            notificationService.showInfo('Example Message 1');
            notificationService.showInfo('Example Message 2');
            notificationService.showInfo('Example Message 3');
            notificationService.showInfo('Example Message 4');
            notificationService.showInfo('Example Message 5');
            notificationService.showInfo('Example Message 6');
            openNotification();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const loadMoreButton = overlayContainerElement.querySelector<HTMLButtonElement>('.adf-notification-history-load-more');
                expect(component.paginatedNotifications.length).toBe(5);
                expect(loadMoreButton).toBeDefined();
                done();
            });
        });

        it('should read notifications from local storage', (done) => {
            storage.setItem(NotificationHistoryComponent.NOTIFICATION_STORAGE, JSON.stringify([{
                messages: ['My new message'],
                datetime: new Date(),
                type: NOTIFICATION_TYPE.RECURSIVE

            } as NotificationModel]));
            fixture.detectChanges();
            openNotification();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const notification = overlayContainerElement.querySelector<HTMLButtonElement>('.adf-notification-history-menu-item');
                expect(notification).toBeDefined();
                done();
            });
        }, 10000);

        it('should be able to change the maximum number of notifications displayed', (done) => {
            component.maxNotifications = 10;
            fixture.detectChanges();
            notificationService.showInfo('Example Message 1');
            notificationService.showInfo('Example Message 2');
            notificationService.showInfo('Example Message 3');
            notificationService.showInfo('Example Message 4');
            notificationService.showInfo('Example Message 5');
            notificationService.showInfo('Example Message 6');
            openNotification();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const notifications = overlayContainerElement.querySelectorAll('.adf-notification-history-menu-item');
                expect(notifications.length).toBe(6);
                done();
            });
        }, 45000);
    });
});
