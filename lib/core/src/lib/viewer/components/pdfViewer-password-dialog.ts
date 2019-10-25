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

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

declare const pdfjsLib: any;

@Component({
    selector: 'adf-pdf-viewer-password-dialog',
    templateUrl: './pdfViewer-password-dialog.html',
    styleUrls: [ './pdfViewer-password-dialog.scss' ]
})
export class PdfPasswordDialogComponent implements OnInit {
    passwordFormControl: FormControl;

    constructor(
        private dialogRef: MatDialogRef<PdfPasswordDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit() {
        this.passwordFormControl = new FormControl('', [Validators.required]);
    }

    isError(): boolean {
        return this.data.reason === pdfjsLib.PasswordResponses.INCORRECT_PASSWORD;
    }

    isValid(): boolean {
        return !this.passwordFormControl.hasError('required');
    }

    submit(): void {
        this.dialogRef.close(this.passwordFormControl.value);
    }
}
