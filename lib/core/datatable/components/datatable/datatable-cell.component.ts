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

import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import { DataColumn } from '../../data/data-column.model';
import { DataRow } from '../../data/data-row.model';
import { DataTableAdapter } from '../../data/datatable-adapter';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'adf-datatable-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <span *ngIf="copyContent; else defaultCell"
                adf-clipboard="CLIPBOARD.CLICK_TO_COPY"
                [clipboard-notification]="'CLIPBOARD.SUCCESS_COPY'"
                [attr.aria-label]="value$ | async"
                [title]="tooltip"
                class="adf-datatable-cell-value"
                >{{ value$ | async }}</span>
        </ng-container>
        <ng-template #defaultCell>
            <span
                [attr.aria-label]="value$ | async"
                [title]="tooltip"
                class="adf-datatable-cell-value"
            >{{ value$ | async }}</span>
        </ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class DataTableCellComponent implements OnInit, OnDestroy {
    /** Data table adapter instance. */
    @Input()
    data: DataTableAdapter;

    /** Data that defines the column. */
    @Input()
    column: DataColumn;

    /** Data that defines the row. */
    @Input()
    row: DataRow;

    value$ = new BehaviorSubject<any>('');

    /** Enables/disables a Clipboard directive to allow copying of the cell's content. */
    @Input()
    copyContent: boolean;

    /** Text for the cell's tooltip. */
    @Input()
    tooltip: string;

    /** Custom resolver function which is used to parse dynamic column objects */
    @Input()
    resolverFn: (row: DataRow, col: DataColumn) => any  = null;

    protected onDestroy$ = new Subject<boolean>();

    constructor(protected alfrescoApiService: AlfrescoApiService) {}

    ngOnInit() {
        this.updateValue();
        this.alfrescoApiService.nodeUpdated
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(node => {
                if (this.row) {
                    if (this.row['node'].entry.id === node.id) {
                        this.row['node'].entry = node;
                        this.row['cache'][this.column.key] = this.column.key.split('.').reduce((source, key) => source[key], node);
                        this.updateValue();
                    }
                }
            });
    }

    protected updateValue() {
        if (this.column && this.column.key && this.row && this.data) {
            const value = this.data.getValue(this.row, this.column, this.resolverFn);

            this.value$.next(value);

            if (!this.tooltip) {
                this.tooltip = value;
            }
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
