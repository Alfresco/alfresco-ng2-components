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

import { Component, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NodeEntry } from '@alfresco/js-api';
import { AddPermissionDialogData } from './add-permission-dialog-data.interface';
import { AddPermissionComponent } from '../add-permission/add-permission.component';

@Component({
    selector: 'adf-add-permission-dialog',
    templateUrl: './add-permission-dialog.component.html',
    styleUrls: ['./add-permission-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPermissionDialogComponent {

    @ViewChild('addPermission')
    addPermissionComponent: AddPermissionComponent;

    currentSelection: NodeEntry[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data: AddPermissionDialogData) {
    }

    onSelect(items: NodeEntry[]) {
        this.currentSelection = items;
    }

    onAddClicked() {
        this.data.confirm.next(this.currentSelection);
        this.data.confirm.complete();
    }
}
