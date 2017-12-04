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

import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PathInfoEntity } from 'alfresco-js-api';
import { DataTableCellComponent } from '@alfresco/adf-core';

@Component({
    selector: 'adf-name-location-cell',
    templateUrl: './name-location-cell.component.html',
    styleUrls: ['./name-location-cell.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'adf-name-location-cell' }
})
export class NameLocationCellComponent extends DataTableCellComponent implements OnInit {

    link: any[];
    location: string = '';
    fileName: string = '';

    ngOnInit() {
        if (this.row) {
            this.extractName();
            this.extractLocation();
        }
    }

    private extractName() {
        this.fileName = this.data.getValue(this.row, this.column);
    }

    private extractLocation() {
        const path: PathInfoEntity = this.row.getValue('path');
        
        if (path && path.name && path.elements) {
            this.location = path.name;

            if (!this.tooltip) {
                this.tooltip = path.name;
            }

            const parent = path.elements[path.elements.length - 1];
            this.link = [ this.column.format, parent.id ];
        }        
    }
}
