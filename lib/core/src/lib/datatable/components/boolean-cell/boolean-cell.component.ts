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

import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-boolean-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <span [title]="title()">{{ boolValue() }}</span> `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-content-cell' }
})
export class BooleanCellComponent extends DataTableCellComponent {
    private readonly booleanValue = toSignal(this.value$);

    readonly boolValue = computed(() => {
        const value = this.booleanValue();
        return this.transformBoolean(value);
    });

    private transformBoolean(value: unknown): string {
        if (value === true || value === 'true') {
            return 'true';
        }
        if (value === false || value === 'false') {
            return 'false';
        }
        return '';
    }
}
