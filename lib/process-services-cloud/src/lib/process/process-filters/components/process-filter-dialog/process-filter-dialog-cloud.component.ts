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

import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'adf-cloud-process-filter-dialog-cloud',
    imports: [TranslateModule, MatButtonModule, MatCardModule, MatInputModule, ReactiveFormsModule, MatDialogModule],
    templateUrl: './process-filter-dialog-cloud.component.html',
    styleUrls: ['./process-filter-dialog-cloud.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ProcessFilterDialogCloudComponent {
    public readonly dialogRef = inject(MatDialogRef<ProcessFilterDialogCloudComponent>);
    public readonly data = inject(MAT_DIALOG_DATA);

    public static ACTION_SAVE = 'SAVE';
    defaultIcon = 'inbox';

    filterForm = new FormGroup({
        name: new FormControl(this.data.name, [Validators.required])
    });

    onSaveClick() {
        this.dialogRef.close({
            action: ProcessFilterDialogCloudComponent.ACTION_SAVE,
            icon: this.defaultIcon,
            name: this.filterForm.controls.name.value
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }
}
