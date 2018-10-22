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

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material';
import { TranslationService } from './translation.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    static DEFAULT_DURATION_MESSAGE: number = 5000;

    constructor(private snackBar: MatSnackBar,
                private translationService: TranslationService) {
    }

    /**
     * Opens a SnackBar notification to show a message.
     * @param message The message (or resource key) to show.
     * @param config Time before notification disappears after being shown or MatSnackBarConfig object
     * @returns Information/control object for the SnackBar
     */
    openSnackMessage(message: string, config: number | MatSnackBarConfig = NotificationService.DEFAULT_DURATION_MESSAGE): MatSnackBarRef<any> {

        const translatedMessage = this.translationService.instant(message);

        if (typeof config === 'number') {
            config = {
                duration: config
            };
        }

        return this.snackBar.open(translatedMessage, null, config);
    }

    /**
     * Opens a SnackBar notification with a message and a response button.
     * @param message The message (or resource key) to show.
     * @param action Caption for the response button
     * @param config Time before notification disappears after being shown or MatSnackBarConfig object
     * @returns Information/control object for the SnackBar
     */
    openSnackMessageAction(message: string, action: string, config: number | MatSnackBarConfig = NotificationService.DEFAULT_DURATION_MESSAGE): MatSnackBarRef<any> {

        const translatedMessage = this.translationService.instant(message);

        if (typeof config === 'number') {
            config = {
                duration: config
            };
        }

        return this.snackBar.open(translatedMessage, action, config);
    }

    /**
     *  dismiss the notification snackbar
     */
    dismissSnackMessageAction() {
        return this.snackBar.dismiss();
    }
}
