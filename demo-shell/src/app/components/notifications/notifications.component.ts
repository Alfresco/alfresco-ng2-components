/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

    message = 'I ♥️ ADF';
    withAction = false;
    actionOutput = '';

    constructor(private notificationService: NotificationService) {}

    send() {
        this.actionOutput = '';

        if (this.message) {
            if (this.withAction) {
                this.notificationService
                    .openSnackMessageAction(this.message, 'Some action')
                    .onAction()
                    .subscribe(() => this.actionOutput = 'Action clicked');
            } else {
                this.notificationService.openSnackMessage(this.message);
            }
        }
    }
}
