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

import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { LogService } from '../services/log.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ClipboardService {

    constructor(
        @Inject(DOCUMENT) private document: any,
        private logService: LogService,
        private notificationService: NotificationService) {}

    isTargetValid(target: HTMLInputElement | HTMLTextAreaElement) {
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            return !target.hasAttribute('disabled');
        }

        this.logService.error(`${target} should be input or textarea`);
        return false;
    }

    copyToClipboard(target: HTMLInputElement | HTMLTextAreaElement, message?: string) {
        if (this.isTargetValid(target)) {
            try {
                target.select();
                target.setSelectionRange(0, target.value.length);
                this.document.execCommand('copy');
                this.notify(message);
            } catch (error) {
                this.logService.error(error);
            }
        }
    }

    private notify(message) {
        if (message) {
            this.notificationService.openSnackMessage(message);
        }
    }

}
