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

import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { RouterModule } from '@angular/router';
import { PathInfo } from '../../../models/path.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    imports: [RouterModule],
    selector: 'adf-location-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <a [title]="tooltip" [routerLink]="link">
            {{ locationValue() }}
        </a>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-location-cell adf-datatable-content-cell' }
})
export class LocationCellComponent extends DataTableCellComponent {
    @Input()
    link: (string | number)[];

    readonly locationValue = toSignal(this.value$);

    protected updateValue(): void {
        if (this.column?.key && this.column?.format && this.row && this.data) {
            const path: PathInfo = this.data.getValue(this.row, this.column, this.resolverFn);

            if (path?.name && path?.elements) {
                this.value$.next(path.name.split('/').pop());

                if (!this.tooltip) {
                    this.tooltip = path.name;
                }

                const parent = path.elements[path.elements.length - 1];
                this.link = [this.column.format, parent.id];
            }
        }
    }
}
