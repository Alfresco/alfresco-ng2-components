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

import { Component, Inject, ViewEncapsulation, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '@alfresco/adf-core';

@Component({
    selector: 'adf-confirm-dialog',
    templateUrl: './confirm.dialog.html',
    styleUrls: ['./confirm.dialog.scss'],
    host: { 'class': 'adf-confirm-dialog' },
    encapsulation: ViewEncapsulation.None
})
export class ConfirmDialogComponent {

    title: string;
    message: string;
    yesLabel: string;
    thirdOption: string;
    noLabel: string;
    htmlContent: string;

    constructor(@Inject(MAT_DIALOG_DATA) data,
                private sanitizer: DomSanitizer,
                private storageService: StorageService) {
        data = data || {};
        this.title = data.title || 'ADF_CONFIRM_DIALOG.CONFIRM';
        this.message = data.message || 'ADF_CONFIRM_DIALOG.MESSAGE';
        this.yesLabel = data.yesLabel || 'ADF_CONFIRM_DIALOG.YES_LABEL';
        this.thirdOption = data.thirdOption;
        this.noLabel = data.noLabel || 'ADF_CONFIRM_DIALOG.NO_LABEL';
        this.htmlContent = data.htmlContent;
    }

    public sanitizedHtmlContent() {
        return this.sanitizer.sanitize(SecurityContext.HTML, this.htmlContent);
    }

    public updateAll() {
        const userPrefix = this.storageService.getItem('USER_PROFILE') || 'GUEST';
        this.storageService.setItem(`${userPrefix}__ConfirmAll`, 'true');
    }
}
