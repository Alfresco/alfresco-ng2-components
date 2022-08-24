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

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    EditJsonDialogComponent,
    EditJsonDialogSettings
} from './edit-json.dialog';

@Component({
    selector: 'adf-edit-json-dialog',
    template: `<button (click)="openDialog()">
        Open dialog
    </button>`
})
export class EditJsonDialogStorybookComponent implements OnInit, OnChanges {
    private settings: EditJsonDialogSettings;

    @Input()
    title: string;

    @Input()
    editable: boolean;

    @Input()
    value: string;

    constructor(private dialog: MatDialog) {}

    ngOnInit() {
        this.settings = {
            title: this.title,
            editable: this.editable,
            value: JSON.stringify(this.value, null, '  ')
        };
    }

    ngOnChanges() {
        this.settings = {
            title: this.title,
            editable: this.editable,
            value: JSON.stringify(this.value, null, '  ')
        };
    }

    openDialog() {
        this.dialog
            .open(EditJsonDialogComponent, {
                data: this.settings,
                minWidth: `50%`
            })
            .afterClosed()
            .subscribe((value: string) => {
                if (value) {
                this.settings.value = JSON.stringify(
                                        JSON.parse(value),
                                        null,
                                        '  ');
                }
            });
    }
}
