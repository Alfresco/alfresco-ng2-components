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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '@alfresco/adf-core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

    message = 'I ♥️ ADF';
    withAction = false;
    actionOutput = '';
    snackBarConfigObject = '';

    configForm: FormGroup;

    snackBarConfig: MatSnackBarConfig = new MatSnackBarConfig();

    directions = [
        { value: 'ltr', title: 'Left to right' },
        { value: 'rtl', title: 'Right to left' }
    ];

    horizontalPositions = [
        { value: 'start', title: 'Start' },
        { value: 'center', title: 'Center' },
        { value: 'end', title: 'End' },
        { value: 'left', title: 'Left' },
        { value: 'right', title: 'Right' }
    ];

    verticalPositions = [
        { value: 'top', title: 'Top' },
        { value: 'bottom', title: 'Bottom' }
    ];

    defaultDuration = 20000;

    private onDestroy$ = new Subject<boolean>();

    constructor(private notificationService: NotificationService,
                private formBuilder: FormBuilder) {
        this.snackBarConfig.duration = this.defaultDuration;
    }

    ngOnInit() {
        this.configForm = this.formBuilder.group({
            direction: new FormControl(''),
            horizontalPosition: new FormControl(''),
            verticalPosition: new FormControl(''),
            duration: new FormControl('')
        });

        this.configForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(configFormValues =>
                this.setSnackBarConfig(configFormValues)
            );
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    setSnackBarConfig(configFormValues: any) {

        if (configFormValues.announcementMessage) {
            this.snackBarConfig.announcementMessage = configFormValues.announcementMessage;
        }
        if (configFormValues.direction) {
            this.snackBarConfig.direction = configFormValues.direction;

        }
        if (configFormValues.duration) {
            this.snackBarConfig.duration = configFormValues.duration;

        }
        if (configFormValues.horizontalPosition) {
            this.snackBarConfig.horizontalPosition = configFormValues.horizontalPosition;
        }
        if (configFormValues.verticalPosition) {
            this.snackBarConfig.verticalPosition = configFormValues.verticalPosition;
        }
    }

    sendCustomConfig() {
        this.actionOutput = '';
        this.snackBarConfigObject = `{"direction": "${this.snackBarConfig.direction}",
                                    "duration": "${this.snackBarConfig.duration}",
                                    "horizontalPosition": "${ this.snackBarConfig.horizontalPosition}",
                                    "verticalPosition": "${ this.snackBarConfig.verticalPosition}"}`;
        if (this.message) {
            if (this.withAction) {
                this.notificationService
                    .openSnackMessageAction(this.message, 'Some action', this.snackBarConfig)
                    .onAction()
                    .subscribe(() => this.actionOutput = 'Action clicked');
            } else {
                this.notificationService.openSnackMessage(this.message, this.snackBarConfig);
            }
        }
    }

    dismissSnackBar() {
        this.notificationService.dismissSnackMessageAction();
    }

    quickError() {
        this.notificationService.showError(this.message, 'Fix');
    }

    quickInfo() {
        this.notificationService.showInfo(this.message);
    }

    quickWarning() {
        this.notificationService.showWarning(this.message, 'Undo');
    }
}
