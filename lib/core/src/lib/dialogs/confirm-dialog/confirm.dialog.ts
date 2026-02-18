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

import { Component, SecurityContext, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogComponentProps {
    title?: string;
    message?: string;
    yesLabel?: string;
    thirdOptionLabel?: string;
    noLabel?: string;
    htmlContent?: string;
}

@Component({
    selector: 'adf-confirm-dialog',
    templateUrl: './confirm.dialog.html',
    styleUrls: ['./confirm.dialog.scss'],
    host: { class: 'adf-confirm-dialog' },
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [TranslatePipe, MatDialogModule, NgIf, MatButtonModule]
})
export class ConfirmDialogComponent {
    private readonly sanitizer = inject(DomSanitizer);
    private readonly data = inject<ConfirmDialogComponentProps>(MAT_DIALOG_DATA) ?? {};

    title: string;
    message: string;
    yesLabel: string;
    noLabel: string;
    thirdOptionLabel: string;
    htmlContent: string;

    constructor() {
        this.title = this.data.title || 'ADF_CONFIRM_DIALOG.TITLE';
        this.message = this.data.message || 'ADF_CONFIRM_DIALOG.MESSAGE';
        this.yesLabel = this.data.yesLabel || 'ADF_CONFIRM_DIALOG.YES_LABEL';
        this.thirdOptionLabel = this.data.thirdOptionLabel;
        this.noLabel = this.data.noLabel || 'ADF_CONFIRM_DIALOG.NO_LABEL';
        this.htmlContent = this.data.htmlContent;
    }

    sanitizedHtmlContent(): string {
        return this.sanitizer.sanitize(SecurityContext.HTML, this.htmlContent);
    }
}
