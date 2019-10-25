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
import { baseHost , WidgetComponent } from './../widget.component';
import { ContainerWidgetComponentModel } from './container.widget.model';

@Component({
    selector: 'container-widget',
    templateUrl: './container.widget.html',
    styleUrls: ['./container.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class ContainerWidgetComponent extends WidgetComponent implements OnInit, AfterViewInit {

    content: ContainerWidgetComponentModel;

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
        }
    }

    /**
     * Serializes column fields
     */
    get fields(): FormFieldModel[] {
        const fields = [];

        let rowContainsElement = true,
            rowIndex = 0;

        while (rowContainsElement) {
            rowContainsElement = false;
            for (let i = 0; i < this.content.columns.length; i++ ) {
                const field = this.content.columns[i].fields[rowIndex];
                if (field) {
                    rowContainsElement = true;
                }

                fields.push(field);
            }
            rowIndex++;
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
        return (100 / this.content.json.numberOfColumns) * colspan + '%';
    }
}
