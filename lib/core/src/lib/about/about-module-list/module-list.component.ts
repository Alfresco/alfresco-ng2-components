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
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';

interface ModuleInfo {
    title: string;
    version: string;
}

@Component({
    selector: 'adf-about-module-list',
    templateUrl: './module-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TranslatePipe, MatTableModule]
})
export class ModuleListComponent {
    columns = [
        {
            columnDef: 'title',
            header: 'ABOUT.MODULES.NAME',
            cell: (row: ModuleInfo) => `${row.title}`
        },
        {
            columnDef: 'version',
            header: 'ABOUT.MODULES.VERSION',
            cell: (row: ModuleInfo) => `${row.version}`
        }
    ];

    displayedColumns = this.columns.map((x) => x.columnDef);

    @Input({ required: true })
    data: Array<ModuleInfo> = [];
}
