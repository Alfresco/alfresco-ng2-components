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

import { Component, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from '../datatable-cell/datatable-cell.component';
import { FileSizePipe } from '../../../pipes';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'adf-filesize-cell',
    imports: [FileSizePipe, AsyncPipe],
    template: `
        @let value = value$ | async;
        <span [title]="value | adfFileSize" class="adf-datatable-cell-value">{{ value | adfFileSize }}</span>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-filesize-cell' },
    providers: [FileSizePipe]
})
export class FileSizeCellComponent extends DataTableCellComponent {}
