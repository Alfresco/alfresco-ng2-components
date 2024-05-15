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

import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogComponentData } from './dialog-data.interface';
import { BehaviorSubject } from 'rxjs';
import { DialogSize } from './dialog.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    imports: [CommonModule, MaterialModule, TranslateModule],
    selector: 'adf-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
    isConfirmButtonDisabled$ = new BehaviorSubject<boolean>(false);
    isCloseButtonHidden: boolean;
    isCancelButtonHidden: boolean;
    dialogSize: DialogSize;
    confirmButtonTitle: string;
    cancelButtonTitle: string;
    disableSubmitButton = false;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: DialogComponentData,
        public dialogRef: MatDialogRef<DialogComponent>
    ) {
        if (data) {
            this.isCancelButtonHidden = data.isCancelButtonHidden || false;
            this.isCloseButtonHidden = data.isCloseButtonHidden || false;
            this.dialogSize = data.dialogSize || DialogSize.MEDIUM;
            this.confirmButtonTitle = data.confirmButtonTitle || 'COMMON.APPLY';
            this.cancelButtonTitle = data.cancelButtonTitle || 'COMMON.CANCEL';

            if (data.isConfirmButtonDisabled$) {
                data.isConfirmButtonDisabled$.subscribe((value) => this.isConfirmButtonDisabled$.next(value));
            }
        }
    }

    onConfirm() {
        this.isConfirmButtonDisabled$.next(true);
        this.dialogRef.close();
    }
}
