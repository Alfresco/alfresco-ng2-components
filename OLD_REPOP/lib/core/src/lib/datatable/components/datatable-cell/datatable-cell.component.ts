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

import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataTableAdapter } from '../../data/datatable-adapter';
import { BehaviorSubject } from 'rxjs';
import { DataTableService } from '../../services/datatable.service';
import { CommonModule } from '@angular/common';
import { ClipboardDirective } from '../../../clipboard/clipboard.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TruncatePipe } from '../../../pipes/truncate.pipe';

@Component({
    selector: 'adf-datatable-cell',
    imports: [CommonModule, ClipboardDirective, TruncatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <span
                *ngIf="copyContent; else defaultCell"
                adf-clipboard="CLIPBOARD.CLICK_TO_COPY"
                [clipboard-notification]="'CLIPBOARD.SUCCESS_COPY'"
                [attr.aria-label]="value$ | async"
                [title]="tooltip"
                class="adf-datatable-cell-value"
                >{{ column?.maxTextLength ? (value$ | async | truncate : column?.maxTextLength) : (value$ | async) }}</span
            >
        </ng-container>
        <ng-template #defaultCell>
            <span [title]="tooltip" class="adf-datatable-cell-value">{{
                column?.maxTextLength ? (value$ | async | truncate : column?.maxTextLength) : (value$ | async)
            }}</span>
        </ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class DataTableCellComponent implements OnInit {
    /** Data table adapter instance. */
    @Input({ required: true })
    data: DataTableAdapter;

    /** Data that defines the column. */
    @Input({ required: true })
    column: DataColumn;

    /** Data that defines the row. */
    @Input({ required: true })
    row: DataRow;

    /** Enables/disables a Clipboard directive to allow copying of the cell's content. */
    @Input()
    copyContent: boolean;

    /** Text for the cell's tooltip. */
    @Input()
    tooltip: string;

    /** Custom resolver function which is used to parse dynamic column objects */
    @Input()
    resolverFn: (row: DataRow, col: DataColumn) => any = null;

    protected destroyRef = inject(DestroyRef);
    protected dataTableService = inject(DataTableService, { optional: true });
    value$ = new BehaviorSubject<any>('');

    ngOnInit() {
        this.updateValue();
        this.subscribeToRowUpdates();
    }

    protected updateValue() {
        if (this.column?.key && this.row && this.data) {
            const value = this.data.getValue(this.row, this.column, this.resolverFn);

            this.value$.next(value);

            if (!this.tooltip) {
                this.tooltip = value;
            }
        }
    }

    private subscribeToRowUpdates() {
        if (!this.dataTableService || !this.row.obj) {
            return;
        }

        this.dataTableService.rowUpdate.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
            if (data?.id === this.row?.id && data.obj) {
                this.row.obj = data.obj;
                this.row['cache'][this.column.key] = this.getNestedPropertyValue(data.obj, this.column.key);

                this.updateValue();
            }
        });
    }

    private getNestedPropertyValue(obj: any, path: string) {
        return path.split('.').reduce((source, key) => (source ? source[key] : ''), obj);
    }
}
