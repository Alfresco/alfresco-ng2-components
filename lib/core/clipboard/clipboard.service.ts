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

import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LogService } from '../services/log.service';
import { NotificationService } from '../notifications/services/notification.service';

@Injectable()
export class ClipboardService {

    constructor(
        @Inject(DOCUMENT) private document: any,
        private logService: LogService,
        private notificationService: NotificationService) {}

    /**
     * Checks if the target element can have its text copied.
     * @param target Target HTML element
     * @returns True if the text can be copied, false otherwise
     */
    isTargetValid(target: HTMLInputElement | HTMLTextAreaElement) {
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            return !target.hasAttribute('disabled');
        }
        return false;
    }

    /**
     * Copies text from an HTML element to the clipboard.
     * @param target HTML element to be copied
     * @param message Snackbar message to alert when copying happens
     */
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

    /**
     * Copies a text string to the clipboard.
     * @param content Text to copy
     * @param message Snackbar message to alert when copying happens
     */
    copyContentToClipboard(content: string, message: string) {
        try {
            document.addEventListener('copy', (e: ClipboardEvent) => {
                e.clipboardData.setData('text/plain', (content));
                e.preventDefault();
                document.removeEventListener('copy', null);
              });
            document.execCommand('copy');
            this.notify(message);
        } catch (error) {
            this.logService.error(error);
        }
    }

    private notify(message) {
        if (message) {
            this.notificationService.openSnackMessage(message);
        }
    }

}
