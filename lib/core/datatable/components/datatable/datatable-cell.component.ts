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
import { Subscription, BehaviorSubject } from 'rxjs';
import { Node } from '@alfresco/js-api';

@Component({
    selector: 'adf-datatable-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <span [attr.aria-label]="value$ | async" [title]="tooltip" class="adf-datatable-cell-value">{{
                value$ | async
            }}</span>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-cell' }
})
export class DataTableCellComponent implements OnInit, OnDestroy {
    @Input()
    data: DataTableAdapter;

    @Input()
    column: DataColumn;

    @Input()
    row: DataRow;

    value$ = new BehaviorSubject<any>('');

    @Input()
    tooltip: string;

    private sub: Subscription;

    constructor(protected api: AlfrescoApiService) {}

    ngOnInit() {
        this.updateValue();

        this.sub = this.api.nodeUpdated.subscribe((node: Node) => {
            if (this.row) {
                const { entry } = this.row['node'];

                if (entry === node) {
                    this.row['node'] = { entry };
                    this.updateValue();
                }
            }
        });
    }

    protected updateValue() {
        if (this.column && this.column.key && this.row && this.data) {
            const value = this.data.getValue(this.row, this.column);

            this.value$.next(value);

            if (!this.tooltip) {
                this.tooltip = value;
            }
        }
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }
}
