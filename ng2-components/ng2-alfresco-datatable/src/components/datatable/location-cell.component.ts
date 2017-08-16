/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { PathInfoEntity } from 'alfresco-js-api';
import { DataTableCellComponent } from './datatable-cell.component';

@Component({
    selector: 'adf-location-cell',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <ng-container>
            <a href="" [title]="tooltip" [routerLink]="link">
                {{ displayText }}
            </a>
        </ng-container>
    `,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-location-cell' }
})
export class LocationCellComponent extends DataTableCellComponent implements OnInit {

    @Input()
    tooltip: string = '';

    @Input()
    link: any[];

    @Input()
    displayText: string = '';

    /** @override */
    ngOnInit() {
        if (!this.value && this.column && this.column.key && this.row && this.data) {
            const path: PathInfoEntity = this.data.getValue(this.row, this.column);
            if (path) {
                this.value = path;
                this.displayText = path.name.split('/').pop();
                this.tooltip = path.name;

                const parent = path.elements[path.elements.length - 1];
                this.link = [ this.column.format, parent.id ];
            }
        }
    }
}
