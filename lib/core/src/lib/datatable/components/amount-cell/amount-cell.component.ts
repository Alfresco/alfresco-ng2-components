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

import { ChangeDetectionStrategy, Component, ViewEncapsulation, Input, DEFAULT_CURRENCY_CODE, inject, computed } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { CurrencyConfig } from '../../data/data-column.model';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    imports: [CurrencyPipe],
    selector: 'adf-amount-cell',
    templateUrl: './amount-cell.component.html',
    host: { class: 'adf-datatable-content-cell' },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmountCellComponent extends DataTableCellComponent {
    @Input()
    currencyConfig: CurrencyConfig;

    private readonly defaultCurrencyCode: string = inject(DEFAULT_CURRENCY_CODE);
    readonly defaultCurrencyConfig: CurrencyConfig = {
        code: this.defaultCurrencyCode,
        display: 'symbol',
        digitsInfo: undefined,
        locale: undefined
    };

    private readonly rawAmountValue = toSignal(this.value$);

    readonly amountValue = computed<number | null>(() => {
        const value = this.rawAmountValue();

        if (value == null || value === '') {
            return null;
        }

        const numericValue = Number(value);

        return Number.isFinite(numericValue) ? numericValue : null;
    });
}
