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

import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarData } from './snack-bar-data';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-snackbar-content',
    imports: [MatIconModule, TranslatePipe, MatButtonModule],
    templateUrl: './snackbar-content.component.html',
    styleUrls: ['./snackbar-content.component.scss'],
    host: {
        class: 'mat-simple-snackbar'
    }
})
export class SnackbarContentComponent {
    constructor(public snackBarRef: MatSnackBarRef<SnackbarContentComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {
        if (!data) {
            this.data = { message: '' };
        }
    }

    onIconClicked(): void {
        this.data.callActionOnIconClick ? this.snackBarRef.dismissWithAction() : this.snackBarRef.dismiss();
    }
}
