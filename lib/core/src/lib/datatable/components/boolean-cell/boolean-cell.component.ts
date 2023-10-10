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

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { CommonModule } from '@angular/common';
import { DataTableService } from '../../services/datatable.service';
import { Subscription } from 'rxjs';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'adf-boolean-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngIf="value !== null">
            <span [title]="tooltip" class="adf-boolean-cell-value">
                {{ value }}
            </span>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-boolean-cell adf-datatable-content-cell' }
})
export class BooleanCellComponent extends DataTableCellComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    value: boolean | null = null;

    constructor(@Optional() dataTableService: DataTableService) {
        super(dataTableService);
    }

    ngOnInit() {
        this.handleValueChanges();
        if (this.column?.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column, this.resolverFn));
        }
    }

    private handleValueChanges() {
        this.subscription = this.value$.subscribe((value) => {
            this.value = this.isBoolean(value) ? value : null;
        });
    }

    private isBoolean(value: any): boolean {
        return value === true || value === false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
