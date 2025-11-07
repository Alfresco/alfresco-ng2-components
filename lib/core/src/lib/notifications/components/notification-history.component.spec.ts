/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { NotificationHistoryComponent } from './notification-history.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../../common/services/storage.service';
import { NOTIFICATION_TYPE, NotificationModel } from '../models/notification.model';
import { UnitTestingUtils } from '../../testing/unit-testing-utils';
import { provideCoreAuthTesting } from '../../testing/noop-auth.module';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('Notification History Component', () => {
    let fixture: ComponentFixture<NotificationHistoryComponent>;
    let component: NotificationHistoryComponent;
    let notificationService: NotificationService;
    let overlayContainerElement: HTMLElement;
    let storage: StorageService;
    let testingUtils: UnitTestingUtils;

    const openNotification = () => {
        fixture.detectChanges();
        testingUtils.clickByCSS('#adf-notification-history-open-button');
        fixture.detectChanges();
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NotificationHistoryComponent, MatIconTestingModule],
            providers: [provideCoreAuthTesting()]
        });
        fixture = TestBed.createComponent(NotificationHistoryComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement, TestbedHarnessEnvironment.loader(fixture));

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
        const getMarkAllAsReadButton = (): HTMLButtonElement =>
            overlayContainerElement.querySelector<HTMLButtonElement>('[data-automation-id="adf-notification-history-mark-as-read"]');

        const getLoadMoreButton = (): HTMLButtonElement =>
            overlayContainerElement.querySelector<HTMLButtonElement>('[data-automation-id="adf-notification-history-load-more"]');

        const getNotificationElements = (): NodeListOf<HTMLButtonElement> =>
            overlayContainerElement.querySelectorAll<HTMLButtonElement>('.adf-notification-history-menu-item');

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
                getMarkAllAsReadButton().click();
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
                expect(overlayContainerElement.querySelector('.adf-notification-history-item-list').innerHTML).toContain('Example Message');
                done();
            });
        });

        it('should show message when pushed directly to Notification History', (done) => {
            const callBackSpy = jasmine.createSpy('callBack');
            fixture.detectChanges();
            notificationService.pushToNotificationHistory({
                clickCallBack: callBackSpy,
                messages: ['My new message'],
                datetime: new Date(),
                type: NOTIFICATION_TYPE.RECURSIVE
            } as NotificationModel);
            openNotification();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                getNotificationElements()[0].click();
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
                expect(component.paginatedNotifications.length).toBe(5);
                expect(getLoadMoreButton()).toBeDefined();
                done();
            });
        });

        it('should read notifications from local storage', (done) => {
            storage.setItem(
                NotificationHistoryComponent.NOTIFICATION_STORAGE,
                JSON.stringify([
                    {
                        messages: ['My new message'],
                        datetime: new Date(),
                        type: NOTIFICATION_TYPE.RECURSIVE
                    } as NotificationModel
                ])
            );
            fixture.detectChanges();
            openNotification();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                expect(getNotificationElements()[0]).toBeDefined();
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
                expect(getNotificationElements().length).toBe(6);
                done();
            });
        }, 45000);

        describe('focus change', () => {
            let markAllAsReadButton: HTMLButtonElement;
            let loadMoreButton: HTMLButtonElement;
            let notifications: NodeListOf<HTMLButtonElement>;

            beforeEach(fakeAsync(() => {
                spyOn(storage, 'getItem').and.returnValue(
                    JSON.stringify([
                        {
                            messages: ['My new message 1']
                        },
                        {
                            messages: ['My new message 2']
                        },
                        {
                            messages: ['My new message 3']
                        },
                        {
                            messages: ['My new message 4']
                        },
                        {
                            messages: ['My new message 5']
                        },
                        {
                            messages: ['My new message 6']
                        }
                    ] as NotificationModel[])
                );
                openNotification();
                tick();
                markAllAsReadButton = getMarkAllAsReadButton();
                loadMoreButton = getLoadMoreButton();
                notifications = getNotificationElements();
            }));

            it('should focus mark all as read button when menu has been opened', () => {
                expect(document.activeElement).toBe(markAllAsReadButton);
            });

            it('should focus load more button when pressing arrow up when mark all as read button is focused', () => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp'
                    })
                );
                expect(document.activeElement).toBe(loadMoreButton);
            });

            it('should focus first notification when pressing arrow down when mark all as read button is focused', () => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown'
                    })
                );
                expect(document.activeElement).toBe(notifications[0]);
            });

            it('should focus mark all as read button when pressing arrow up when first notification is focused', () => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown'
                    })
                );

                notifications[0].dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp'
                    })
                );
                expect(document.activeElement).toBe(markAllAsReadButton);
            });

            it('should focus second notification when pressing arrow down when first notification is focused', () => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown'
                    })
                );

                notifications[0].dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown'
                    })
                );
                expect(document.activeElement).toBe(notifications[1]);
            });

            it('should focus mark all as read button when pressing arrow down when load more button is focused', () => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp'
                    })
                );

                loadMoreButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowDown'
                    })
                );
                expect(document.activeElement).toBe(markAllAsReadButton);
            });

            it('should last paged notification when pressing arrow up when load more button is focused', () => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp'
                    })
                );

                loadMoreButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp'
                    })
                );
                expect(document.activeElement).toBe(notifications[4]);
            });

            it('should focus correct notification after loading more', fakeAsync(() => {
                markAllAsReadButton.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: 'ArrowUp'
                    })
                );

                loadMoreButton.click();
                fixture.detectChanges();
                tick();
                expect(document.activeElement).toBe(getNotificationElements()[5]);
            }));
        });
    });
});
