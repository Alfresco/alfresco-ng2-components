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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Optional, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { TypeofPipe } from '../../../pipes/typeof.pipe';
import { DataTableService } from '../../services/datatable.service';

@Component({
    standalone: true,
    imports: [CommonModule, MatIconModule, TypeofPipe],
    selector: 'adf-icon-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container *ngIf="value$ | async as value">
            <mat-icon *ngIf="(value | adfTypeof) === 'string'" aria-hidden="true">{{ value }}</mat-icon>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class IconCellComponent extends DataTableCellComponent implements OnInit {
    constructor(@Optional() dataTableService: DataTableService) {
        super(dataTableService);
    }

    ngOnInit(): void {
        if (this.column?.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column, this.resolverFn));
        }
    }
}
