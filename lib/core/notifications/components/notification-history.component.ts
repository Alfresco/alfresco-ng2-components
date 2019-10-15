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

import { Component, Input, ViewChild, OnDestroy } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NotificationModel } from '../models/notification.model';
import { MatMenuTrigger } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Component({
    selector: 'adf-notification-history',
    styleUrls: ['notification-history.component.scss'],
    templateUrl: 'notification-history.component.html'
})
export class NotificationHistoryComponent implements OnDestroy {

    onDestroy$ = new Subject<boolean>();

    notifications: NotificationModel[] = [];

    MAX_NOTIFICATION_STACK_LENGTH = 100;

    @ViewChild(MatMenuTrigger)
    trigger: MatMenuTrigger;

    /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
    @Input()
    menuPositionX: string = 'after';

    /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
    @Input()
    menuPositionY: string = 'below';

    constructor(
        private notificationService: NotificationService, public storageService: StorageService) {
        this.notifications = JSON.parse(storageService.getItem('notifications')) || [];
        this.notificationService.notifications$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((message) => {
                this.notifications.push(message);

                if (this.notifications.length > this.MAX_NOTIFICATION_STACK_LENGTH) {
                    this.notifications.shift();
                }

                storageService.setItem('notifications', JSON.stringify(this.notifications));
            });
    }

    isEmptyNotification(): boolean {
        return (!this.notifications || this.notifications.length === 0);
    }

    onKeyPress(event: KeyboardEvent) {
        this.closeUserModal(event);
    }

    markAsRead() {
        this.storageService.setItem('notifications', '');
        this.notifications = [];
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    private closeUserModal($event: KeyboardEvent) {
        if ($event.keyCode === 27) {
            this.trigger.closeMenu();
        }
    }
}
