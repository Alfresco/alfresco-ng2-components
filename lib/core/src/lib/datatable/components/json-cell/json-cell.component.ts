/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditJsonDialogComponent, EditJsonDialogSettings } from '../../../dialogs';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';

@Component({
    selector: 'adf-json-cell',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './json-cell.component.html',
    styleUrls: ['./json-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [AsyncPipe, MatButtonModule, NgIf],
    host: { class: 'adf-datatable-content-cell' }
})
export class JsonCellComponent extends DataTableCellComponent implements OnInit {
    /** Editable JSON. */
    @Input()
    editable: boolean = false;

    constructor(private dialog: MatDialog) {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

    view() {
        const rawValue: string | any = this.data.getValue(this.row, this.column, this.resolverFn);
        const value = typeof rawValue === 'object' ? JSON.stringify(rawValue || {}, null, 2) : rawValue;

        const settings: EditJsonDialogSettings = {
            title: this.column.title,
            editable: this.editable,
            value
        };

        this.dialog
            .open(EditJsonDialogComponent, {
                data: settings,
                minWidth: '50%',
                minHeight: '50%'
            })
            .afterClosed()
            .subscribe((/*result: string*/) => {
                if (typeof rawValue === 'object') {
                    // todo: update cell value as object
                } else {
                    // todo: update cell value as string
                }
            });
    }
}
