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

import { Component, Input, ViewChild, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NotificationModel, NOTIFICATION_TYPE } from '../models/notification.model';
import { MatMenuTrigger } from '@angular/material/menu';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { Pagination } from '@alfresco/js-api';

@Component({
    selector: 'adf-notification-history',
    styleUrls: ['notification-history.component.scss'],
    templateUrl: 'notification-history.component.html'
})
export class NotificationHistoryComponent implements OnDestroy, OnInit, AfterViewInit {

    public static MAX_NOTIFICATION_STACK_LENGTH = 100;

    @ViewChild(MatMenuTrigger, { static: true })
    trigger: MatMenuTrigger;

    /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
    @Input()
    menuPositionX: string = 'after';

    /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
    @Input()
    menuPositionY: string = 'below';

    onDestroy$ = new Subject<boolean>();
    notifications: NotificationModel[] = [];
    paginatedNotifications = [];
    pagination: Pagination;

    constructor(
        private notificationService: NotificationService,
        public storageService: StorageService,
        public cd: ChangeDetectorRef) {

    }

    ngOnInit() {
        this.notifications = JSON.parse(this.storageService.getItem('notifications')) || [];
    }

    ngAfterViewInit(): void {
        this.notificationService.notifications$
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((notification: NotificationModel) => {
            this.addNewNotification(notification);
            this.cd.detectChanges();
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    addNewNotification(notification: NotificationModel) {
        this.notifications.unshift(notification);

        if (this.notifications.length > NotificationHistoryComponent.MAX_NOTIFICATION_STACK_LENGTH) {
            this.notifications.shift();
        }

        this.saveNotifications();
        this.resetPagination();
        this.updatePagination();
    }

    saveNotifications() {
        this.storageService.setItem('notifications', JSON.stringify(this.notifications.filter((notification) =>
            notification.type !== NOTIFICATION_TYPE.RECURSIVE
        )));
    }

    onMenuOpened() {
        this.resetPagination();
        this.updatePagination();
    }

    onKeyPress(event: KeyboardEvent) {
        this.closeUserModal(event);
    }

    private closeUserModal($event: KeyboardEvent) {
        if ($event.keyCode === 27) {
            this.trigger.closeMenu();
        }
    }

    markAsRead() {
        this.notifications = [];
        this.paginatedNotifications = [];
        this.resetPagination();
        this.storageService.removeItem('notifications');
    }

    updatePagination() {
        this.pagination.totalItems = this.notifications.length;
        this.pagination.skipCount = this.pagination.maxItems + this.pagination.skipCount;
        this.pagination.hasMoreItems = this.notifications.length > this.pagination.skipCount;
        this.paginatedNotifications = this.notifications.slice(0, this.pagination.skipCount);
    }

    hasMoreNotifications(): boolean {
        return this.pagination && this.pagination.hasMoreItems;
    }

    onNotificationClick(notification: NotificationModel) {
        if (notification.clickCallBack) {
            notification.clickCallBack(notification.args);
            this.trigger.closeMenu();
        }
    }

    private resetPagination() {
        this.pagination = {
            skipCount: 0,
            maxItems: 5,
            totalItems: 0,
            hasMoreItems: false
        };
    }
}
