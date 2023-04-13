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

import { Component, Optional, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { DataTableService } from '../../services/datatable.service';

@Component({
    selector: 'adf-filesize-cell',
    template: `
        <ng-container *ngIf="(value$ | async | adfFileSize) as fileSize">
            <span
                [title]="tooltip"
                >{{ fileSize }}</span
            >
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-filesize-cell' }
})
export class FileSizeCellComponent extends DataTableCellComponent {
    constructor(@Optional() dataTableService: DataTableService) {
        super(dataTableService);
    }
}
