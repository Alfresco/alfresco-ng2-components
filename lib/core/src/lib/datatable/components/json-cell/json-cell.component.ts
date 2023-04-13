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

import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, Input, Optional } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { MatDialog } from '@angular/material/dialog';
import { EditJsonDialogComponent, EditJsonDialogSettings } from '../../../dialogs/edit-json/edit-json.dialog';
import { DataTableService } from '../../services/datatable.service';

@Component({
    selector: 'adf-json-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngIf="value$ | async as value; else editEmpty">
            <button mat-button color="primary" (click)="view()">json</button>
        </ng-container>

        <ng-template #editEmpty>
            <button *ngIf="editable" mat-button color="primary" (click)="view()">json</button>
        </ng-template>
    `,
    styleUrls: ['./json-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class JsonCellComponent extends DataTableCellComponent implements OnInit {

    /** Editable JSON. */
    @Input()
    editable: boolean = false;

    constructor(
        private dialog: MatDialog,
        @Optional() dataTableService: DataTableService
    ) {
        super(dataTableService);
    }

    ngOnInit() {
        if (this.column && this.column.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column, this.resolverFn));
        }
    }

    view() {
        const rawValue: string | any = this.data.getValue(this.row, this.column, this.resolverFn);
        const value = typeof rawValue === 'object'
            ? JSON.stringify(rawValue || {}, null, 2)
            : rawValue;

        const settings: EditJsonDialogSettings = {
            title: this.column.title,
            editable: this.editable,
            value
        };

        this.dialog.open(EditJsonDialogComponent, {
            data: settings,
            minWidth: '50%',
            minHeight: '50%'
        }).afterClosed().subscribe((/*result: string*/) => {
            if (typeof rawValue === 'object') {
                // todo: update cell value as object
            } else {
                // todo: update cell value as string
            }
        });
    }
}
