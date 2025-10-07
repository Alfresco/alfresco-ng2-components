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

import { Component, Inject, InjectionToken, Injector, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AdditionalDialogActionButton, DialogData } from './dialog-data.interface';
import { BehaviorSubject } from 'rxjs';
import { DialogSize, DialogSizes } from './dialog.model';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const DIALOG_COMPONENT_DATA = new InjectionToken<any>('dialog component data');

@Component({
    selector: 'adf-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    imports: [CommonModule, TranslatePipe, MatIconModule, MatDialogModule, MatButtonModule],
    encapsulation: ViewEncapsulation.None
})
export class DialogComponent {
    isConfirmButtonDisabled$ = new BehaviorSubject<boolean>(false);
    isCloseButtonHidden: boolean;
    isCancelButtonHidden: boolean;
    confirmButtonTitle: string;
    cancelButtonTitle: string;
    dialogSize: DialogSizes;
    additionalActionButtons: AdditionalDialogActionButton[];
    dataOnConfirm: any;

    dataInjector: Injector;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: DialogData,
        public dialogRef: MatDialogRef<DialogComponent>
    ) {
        if (data) {
            this.isCancelButtonHidden = data.isCancelButtonHidden || false;
            this.isCloseButtonHidden = data.isCloseButtonHidden || false;
            this.dialogSize = data.dialogSize || DialogSize.Medium;
            this.confirmButtonTitle = data.confirmButtonTitle || 'COMMON.APPLY';
            this.cancelButtonTitle = data.cancelButtonTitle || 'COMMON.CANCEL';
            this.additionalActionButtons = data.additionalActionButtons;
            this.dialogRef.addPanelClass(`${this.dialogSize}-dialog-panel`);
            this.dataInjector = Injector.create({
                providers: [{ provide: DIALOG_COMPONENT_DATA, useValue: data.componentData }]
            });

            if (data.isConfirmButtonDisabled$) {
                data.isConfirmButtonDisabled$.pipe(takeUntilDestroyed()).subscribe((value) => this.isConfirmButtonDisabled$.next(value));
            }

            if (data.dataOnConfirm$) {
                data.dataOnConfirm$.pipe(takeUntilDestroyed()).subscribe((value) => (this.dataOnConfirm = value));
            }
        }
    }

    onConfirm() {
        this.isConfirmButtonDisabled$.next(true);
        this.dialogRef.close(this.dataOnConfirm || true);
    }
}
