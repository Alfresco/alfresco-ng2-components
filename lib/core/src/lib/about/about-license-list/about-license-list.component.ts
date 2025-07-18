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
import { LicenseData } from '../interfaces';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'adf-about-license-list',
    templateUrl: './about-license-list.component.html',
    styleUrls: ['./about-license-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TranslatePipe, MatTableModule]
})
export class AboutLicenseListComponent {
    columns = [
        {
            columnDef: 'property',
            header: 'ABOUT.LICENSE.PROPERTY',
            cell: (row: LicenseData) => `${row.property}`
        },
        {
            columnDef: 'value',
            header: 'ABOUT.LICENSE.VALUE',
            cell: (row: LicenseData) => `${row.value}`
        }
    ];

    displayedColumns = this.columns.map((x) => x.columnDef);

    @Input({ required: true })
    data: LicenseData[] = [];
}
