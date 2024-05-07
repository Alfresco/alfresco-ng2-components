/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Inject, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export enum DialogSize {
    LARGE = 'adf-large',
    MEDIUM = 'adf-medium',
    SMALL = 'adf-small'
  }

@Component({
    selector: 'adf-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
    /**
     * Emitted when the edit/create folder give error for example a folder with same name already exist
     */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Emitted when the edit/create folder is successfully created/modified
     */
    @Output()
    success: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    title: string;
    description: string;
    isConfirmButtonDisabled: boolean;
    large: boolean;
    disableSubmitButton = false;
    dialogSize: DialogSize;
    confirmButtonTitle: string;
    cancelButtonTitle: string;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: any,
        public dialogRef: MatDialogRef<DialogComponent>
    ) {
        if (data) {
            this.title = data.title;
            this.description = data.description;
            this.isConfirmButtonDisabled = data.isConfirmButtonDisabled;
            this.dialogSize = data.dialogSize || '';
            this.confirmButtonTitle = data.confirmButtonTitle || 'ADF-ASPECT-LIST.DIALOG.APPLY';
            this.cancelButtonTitle = data.cancelButtonTitle || 'ADF-ASPECT-LIST.DIALOG.CANCEL';
        }
    }

    onConfirm() {
        this.success.emit();
    }

    onCancel() {
        this.cancel.emit();
        this.dialogRef.close();
    }
}
