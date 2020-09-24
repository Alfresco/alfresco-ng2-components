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

/* tslint:disable:component-selector  */

import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { FormFieldModel } from './../core/form-field.model';
import { WidgetComponent } from './../widget.component';
import { ContainerWidgetComponentModel } from './container.widget.model';

@Component({
    selector: 'container-widget',
    templateUrl: './container.widget.html',
    styleUrls: ['./container.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class ContainerWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit {

    content: ContainerWidgetComponentModel;
    numberOfColumns: number;

    constructor(public formService: FormService) {
        super(formService);
    }

    onExpanderClicked() {
        if (this.content && this.content.isCollapsible()) {
            this.content.isExpanded = !this.content.isExpanded;
        }
    }

    ngOnInit() {
        if (this.field) {
            this.content = new ContainerWidgetComponentModel(this.field);
            this.numberOfColumns = (this.content.json?.numberOfColumns || 1) > (this.content.columns?.length || 1) ?
                (this.content.json?.numberOfColumns || 1) :
                (this.content.columns?.length || 1);
        }
    }

    /**
     * Serializes column fields
     */
    get fields(): FormFieldModel[] {
        const fields = [];
        const toBeComputed = [];
        const rowspanOffset = [];
        let size = 0;
        for (let i = 0; i < this.numberOfColumns; i++) {
            toBeComputed.push(this.content.columns[i]?.fields?.length || 0);
            rowspanOffset[i] = 0;
            size += (this.content.columns[i]?.fields?.length || 0);
        }

        for (let i = 0; i < size; i++) {
            let fieldExist = false;
            let columnIndex = 0;
            while (columnIndex < this.numberOfColumns) {
                let field;
                if (rowspanOffset[columnIndex] > 0) {
                    rowspanOffset[columnIndex] = rowspanOffset[columnIndex] - 1;
                } else {
                    const rowToCompute = (this.content.columns[columnIndex]?.fields?.length || 0) - toBeComputed[columnIndex];
                    field = this.content.columns[columnIndex]?.fields[rowToCompute];
                    fields.push(field);
                    if (field) {
                        fieldExist = true;
                    }
                    for (let k = 0; k < (field?.colspan || 1); k++) {
                        rowspanOffset[columnIndex + k] = field?.rowspan > 0 ? field?.rowspan - 1 : 0;
                    }
                    toBeComputed[columnIndex] = toBeComputed[columnIndex] - 1;
                }
                columnIndex = columnIndex + (field?.colspan || 1);
            }
            if (!fieldExist) {
                // delete last row and exit
                for (let j = 0; j < this.numberOfColumns; j++) {
                    fields.pop();
                }
                i = size;
            }
        }
        return fields;
    }

    /**
     * Calculate the column width based on the numberOfColumns and current field's colspan property
     *
     * @param field
     */
    getColumnWith(field: FormFieldModel): string {
        const colspan = field ? field.colspan : 1;
        return (100 / this.content.json.numberOfColumns) * colspan + '';
    }
}
