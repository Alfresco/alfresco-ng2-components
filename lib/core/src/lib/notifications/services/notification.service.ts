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

import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslationService } from '../../translation/translation.service';
import { Subject } from 'rxjs';
import { NotificationModel } from '../models/notification.model';
import { info, warning, error } from '../helpers/notification.factory';
import { SnackbarContentComponent } from '../../snackbar-content';
import type { SnackBarData } from '../../snackbar-content/snack-bar-data';

const INFO_SNACK_CLASS = 'adf-info-snackbar';
const WARN_SNACK_CLASS = 'adf-warning-snackbar';
const ERROR_SNACK_CLASS = 'adf-error-snackbar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    notifications$: Subject<NotificationModel> = new Subject();

    constructor(private snackBar: MatSnackBar, private translationService: TranslationService) {}

    /**
     * Opens a SnackBar notification to show a message.
     *
     * @param message The message (or resource key) to show.
     * @param config Time before notification disappears after being shown or MatSnackBarConfig object
     * @param interpolateArgs The interpolation parameters to add for the translation
     * @returns Information/control object for the SnackBar
     */
    openSnackMessage(
        message: string,
        config?: number | MatSnackBarConfig<Omit<SnackBarData, 'actionLabel' | 'message'>>,
        interpolateArgs?: any
    ): MatSnackBarRef<any> {
        return this.dispatchNotification(message, null, config, interpolateArgs);
    }

    /**
     * Opens a SnackBar notification with a message and a response button.
     *
     * @param message The message (or resource key) to show.
     * @param action Caption for the response button
     * @param config Time before notification disappears after being shown or MatSnackBarConfig object
     * @param interpolateArgs The interpolation parameters to add for the translation
     * @returns Information/control object for the SnackBar
     */
    openSnackMessageAction(
        message: string,
        action: string,
        config?: number | MatSnackBarConfig<Omit<SnackBarData, 'actionLabel' | 'message'>>,
        interpolateArgs?: any
    ): MatSnackBarRef<any> {
        return this.dispatchNotification(message, action, config, interpolateArgs);
    }

    /**
     * Rase error message
     *
     * @param message Text message or translation key for the message.
     * @param action Action name
     * @param interpolateArgs The interpolation parameters to add for the translation
     * @param showAction True if action should be visible, false if not. Default: true.
     * @returns snackbar reference
     */
    showError(message: string, action?: string, interpolateArgs?: any, showAction = true): MatSnackBarRef<any> {
        return this.dispatchNotification(
            message,
            action,
            {
                panelClass: ERROR_SNACK_CLASS,
                data: {
                    showAction
                }
            },
            interpolateArgs
        );
    }

    /**
     * Rase info message
     *
     * @param message Text message or translation key for the message.
     * @param action Action name
     * @param interpolateArgs The interpolation parameters to add for the translation
     * @param showAction True if action should be visible, false if not. Default: true.
     * @returns snackbar reference
     */
    showInfo(message: string, action?: string, interpolateArgs?: any, showAction = true): MatSnackBarRef<any> {
        return this.dispatchNotification(
            message,
            action,
            {
                panelClass: INFO_SNACK_CLASS,
                data: {
                    showAction
                }
            },
            interpolateArgs
        );
    }

    /**
     * Rase warning message
     *
     * @param message Text message or translation key for the message.
     * @param action Action name
     * @param interpolateArgs The interpolation parameters to add for the translation
     * @param showAction True if action should be visible, false if not. Default: true.
     * @returns snackbar reference
     */
    showWarning(message: string, action?: string, interpolateArgs?: any, showAction = true): MatSnackBarRef<any> {
        return this.dispatchNotification(
            message,
            action,
            {
                panelClass: WARN_SNACK_CLASS,
                data: {
                    showAction
                }
            },
            interpolateArgs
        );
    }

    /**
     *  dismiss the notification snackbar
     */
    dismissSnackMessageAction(): void {
        this.snackBar.dismiss();
    }

    /**
     * Push new notification to Notification History
     *
     * @param notification - Notification model to be pushed.
     */
    pushToNotificationHistory(notification: NotificationModel) {
        this.notifications$.next(notification);
    }

    private dispatchNotification(
        message: string,
        action?: string,
        config?: number | MatSnackBarConfig<Omit<SnackBarData, 'actionLabel' | 'message'>>,
        interpolateArgs?: any
    ): MatSnackBarRef<any> {
        const translatedMessage: string = this.translationService.instant(message, interpolateArgs);
        const translatedAction: string = this.translationService.instant(action, interpolateArgs);
        const createNotification = this.getNotificationCreator(config);
        this.notifications$.next(createNotification(translatedMessage));
        return this.snackBar.openFromComponent<SnackbarContentComponent, SnackBarData>(SnackbarContentComponent, {
            ...(typeof config === 'number' && { duration: config }),
            panelClass: INFO_SNACK_CLASS,
            ...(typeof config === 'object' ? config : {}),
            data: {
                actionLabel: translatedAction,
                actionIcon: 'close',
                actionIconAriaLabel: 'CLOSE',
                message: translatedMessage,
                showAction: true,
                callActionOnIconClick: false,
                ...(typeof config === 'object' ? config.data : {})
            }
        });
    }

    private getNotificationCreator(config?: number | MatSnackBarConfig<Omit<SnackBarData, 'actionLabel' | 'message'>>) {
        let panelClass: string = null;
        if (typeof config === 'object') {
            panelClass = Array.isArray(config.panelClass) ? config.panelClass[0] : config.panelClass;
        }

        switch (panelClass) {
            case ERROR_SNACK_CLASS:
                return error;
            case WARN_SNACK_CLASS:
                return warning;
            default:
                return info;
        }
    }
}
