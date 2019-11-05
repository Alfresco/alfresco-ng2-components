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

import { Component, ViewEncapsulation } from '@angular/core';
import { DataTableCellComponent } from './datatable-cell.component';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';

@Component({
    selector: 'adf-filesize-cell',
    template: `
        <ng-container *ngIf="(value$ | async | adfFileSize) as fileSize">
            <span
                [title]="tooltip"
                [attr.aria-label]="fileSize"
                >{{ fileSize }}</span
            >
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-filesize-cell' }
})
export class FileSizeCellComponent extends DataTableCellComponent {
    constructor(alfrescoApiService: AlfrescoApiService) {
        super(alfrescoApiService);
    }
}
