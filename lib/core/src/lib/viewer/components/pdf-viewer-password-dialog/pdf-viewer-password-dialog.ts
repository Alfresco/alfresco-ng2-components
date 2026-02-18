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

import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { IconModule } from '../../../icon/icon.module';

declare const pdfjsLib: any;

@Component({
    selector: 'adf-pdf-viewer-password-dialog',
    templateUrl: './pdf-viewer-password-dialog.html',
    styleUrls: ['./pdf-viewer-password-dialog.scss'],
    imports: [MatDialogModule, IconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, TranslatePipe, NgIf, MatButtonModule],
    encapsulation: ViewEncapsulation.None
})
export class PdfPasswordDialogComponent implements OnInit {
    private readonly dialogRef = inject<MatDialogRef<PdfPasswordDialogComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);

    passwordFormControl: UntypedFormControl;

    ngOnInit() {
        this.passwordFormControl = new UntypedFormControl('', [Validators.required]);
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
