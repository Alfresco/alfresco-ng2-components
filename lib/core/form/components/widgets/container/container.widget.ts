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

/* eslint-disable @angular-eslint/component-selector */

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
    fields: FormFieldModel[];

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
            this.getNumberOfColumnsFromTheBiggestBetweenJsonAndColumnsLengthOrOne();
            this.fields = this.getFields();
        }
    }

    private getNumberOfColumnsFromTheBiggestBetweenJsonAndColumnsLengthOrOne() {
        this.numberOfColumns = (this.content.json?.numberOfColumns || 1) > (this.content.columns?.length || 1) ?
            (this.content.json?.numberOfColumns || 1) :
            (this.content.columns?.length || 1);
    }

    /**
     * Serializes column fields
     */
    private getFields(): FormFieldModel[] {
        const serialisedFormFields: FormFieldModel[] = [];
        const maxColumnFieldsSize = this.getMaxColumnFieldSize();
        for (let rowIndex = 0; rowIndex < maxColumnFieldsSize; rowIndex++) {
            this.content?.columns.flatMap((currentColumn) => {
                if (!!currentColumn?.fields[rowIndex]) {
                    serialisedFormFields.push(currentColumn?.fields[rowIndex]);
                } else {
                    const firstRowElementColSpan = currentColumn?.fields[0]?.colspan;
                    if (!!firstRowElementColSpan && rowIndex > 0 ) {
                        for (let i = 0; i < firstRowElementColSpan; i++) {
                            serialisedFormFields.push(null);
                        }
                    }
                }
            });
        }

        return serialisedFormFields;
    }

    private getMaxColumnFieldSize(): number {
        let maxFieldSize = 0;
        if (this.content?.columns?.length > 0) {
            maxFieldSize = this.content?.columns?.reduce((prevColumn, currentColumn) => {
                return currentColumn.fields.length > prevColumn?.fields?.length ? currentColumn : prevColumn;
            })?.fields?.length;
        }
        return maxFieldSize;
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
