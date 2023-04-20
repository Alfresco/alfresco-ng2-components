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

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    EditJsonDialogComponent,
    EditJsonDialogSettings
} from './edit-json.dialog';

@Component({
    selector: 'adf-edit-json-dialog-storybook',
    template: `<button mat-raised-button (click)="openDialog()">
        Open dialog
    </button>`
})
export class EditJsonDialogStorybookComponent implements OnInit, OnChanges {
    @Input()
    title: string;

    @Input()
    editable: boolean;

    @Input()
    value: string;

    private _settings: EditJsonDialogSettings;

    set settings(newSettings: EditJsonDialogSettings) {
        this._settings = {
            title: newSettings.title,
            editable: newSettings.editable,
            value: JSON.stringify(newSettings.value, null, '  ')
        };
    }

    constructor(private dialog: MatDialog) {}

    ngOnInit() {
        this.settings = {
            title: this.title,
            editable: this.editable,
            value: this.value
        };
    }

    ngOnChanges() {
        this.settings = {
            title: this.title,
            editable: this.editable,
            value: this.value
        };
    }

    openDialog() {
        this.dialog
            .open(EditJsonDialogComponent, {
                data: this._settings,
                minWidth: `50%`
            })
            .afterClosed()
            .subscribe((value: string) => {
                if (value) {
                    this._settings.value = JSON.stringify(
                        JSON.parse(value),
                        null,
                        '  '
                    );
                }
            });
    }
}
