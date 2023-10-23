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

import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
    Input,
    Optional,
    OnInit
} from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { DataTableService } from '../../services/datatable.service';
import { DecimalConfig } from '../../data/data-column.model';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'adf-number-cell',
    templateUrl: './number-cell.component.html',
    host: { class: 'adf-datatable-content-cell' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberCellComponent extends DataTableCellComponent implements OnInit {

    @Input()
    decimalConfig: DecimalConfig;

    readonly defaultDecimalConfig: DecimalConfig = {
        digitsInfo: undefined,
        locale: undefined
    };

    constructor(@Optional() dataTableService: DataTableService) {
        super(dataTableService);
    }

    ngOnInit() {
        if (this.column?.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column, this.resolverFn));
        }
    }
}
