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

import { Input, ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataRow } from '@alfresco/adf-core';

@Component({
    selector: 'adf-name-location-cell',
    template: `
        <div class="adf-name-location-cell-name adf-datatable-cell-value" [title]="name">{{ name }}</div>
        <div class="adf-name-location-cell-location adf-datatable-cell-value" [title]="path">{{ path }}</div>
    `,
    styleUrls: ['./name-location-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'adf-name-location-cell adf-datatable-content-cell' }
})
export class NameLocationCellComponent implements OnInit {

    name: string = '';
    path: string = '';

    @Input()
    row: DataRow;

    ngOnInit() {
        if (this.row) {
            this.name = this.row.getValue('name');

            const fullPath = this.row.getValue('path');
            if (fullPath) {
                this.path = fullPath.name || '';
            }
        }
    }
}
