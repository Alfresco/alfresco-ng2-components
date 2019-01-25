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

import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { PathInfoEntity } from '@alfresco/js-api';
import { DataTableCellComponent } from './datatable-cell.component';
import { AlfrescoApiService } from '../../../services/alfresco-api.service';

@Component({
    selector: 'adf-location-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <a href="" [title]="tooltip" [routerLink]="link">
                {{ value$ | async }}
            </a>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-location-cell' }
})
export class LocationCellComponent extends DataTableCellComponent
    implements OnInit {
    @Input()
    link: any[];

    constructor(apiService: AlfrescoApiService) {
        super(apiService);
    }

    /** @override */
    ngOnInit() {
        if (this.column && this.column.key && this.row && this.data) {
            const path: PathInfoEntity = this.data.getValue(
                this.row,
                this.column
            );

            if (path && path.name && path.elements) {
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
