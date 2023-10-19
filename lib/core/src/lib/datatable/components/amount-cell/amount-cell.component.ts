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
    OnInit,
    DEFAULT_CURRENCY_CODE,
    Inject
} from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { DataTableService } from '../../services/datatable.service';
import { CurrencyConfig } from '../../data/data-column.model';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'adf-amount-cell',
    templateUrl: './amount-cell.component.html',
    host: { class: 'adf-datatable-content-cell' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountCellComponent extends DataTableCellComponent implements OnInit {

    @Input()
    currencyConfig: CurrencyConfig;

    readonly defaultCurrencyConfig: CurrencyConfig = {
        code: this.defaultCurrencyCode,
        display: 'symbol',
        digitsInfo: undefined,
        locale: undefined
    };

    constructor(
        @Optional() dataTableService: DataTableService,
        @Inject(DEFAULT_CURRENCY_CODE) private readonly defaultCurrencyCode: string
    ) {
        super(dataTableService);
    }

    ngOnInit() {
        if (this.column?.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column, this.resolverFn));
        }
    }
}
