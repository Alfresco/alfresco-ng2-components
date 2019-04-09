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

import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';

@Component({
    selector: 'adf-json-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <span class="adf-datatable-cell-value">
                <pre class="adf-datatable-json-cell">{{ value$ | async | json }}</pre>
            </span>
        </ng-container>
    `,
    styleUrls: ['./json-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-datatable-cell' }
})
export class JsonCellComponent extends DataTableCellComponent implements OnInit {

    ngOnInit() {
        if (this.column && this.column.key && this.row && this.data) {
            this.value$.next(this.data.getValue(this.row, this.column));
        }
    }
}
