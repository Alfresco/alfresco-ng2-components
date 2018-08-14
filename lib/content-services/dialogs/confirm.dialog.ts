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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'adf-confirm-dialog',
    template: `
        <h1 mat-dialog-title>{{ title | translate }}</h1>
        <mat-dialog-content>
            <p>{{ message | translate }}</p>
        </mat-dialog-content>
        <mat-dialog-actions>
            <span class="spacer"></span>
            <button id="adf-confirm-accept" mat-button color="primary" [mat-dialog-close]="true">{{ yesLabel | translate }}</button>
            <button id="adf-confirm-cancel" mat-button [mat-dialog-close]="false" cdkFocusInitial>{{ noLabel | translate }}</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .spacer { flex: 1 1 auto; }

        .adf-confirm-dialog .mat-dialog-actions .mat-button-wrapper {
            text-transform: uppercase;
        }
    `],
    host: { 'class': 'adf-confirm-dialog' },
    encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {

    title: string;
    message: string;
    yesLabel: string;
    noLabel: string;

    constructor(@Inject(MAT_DIALOG_DATA) data) {
        data = data || {};
        this.title = data.title || 'ADF_CONFIRM_DIALOG.CONFIRM';
        this.message = data.message || 'ADF_CONFIRM_DIALOG.MESSAGE';
        this.yesLabel = data.yesLabel || 'ADF_CONFIRM_DIALOG.YES_LABEL';
        this.noLabel = data.noLabel || 'ADF_CONFIRM_DIALOG.NO_LABEL';
    }
}
