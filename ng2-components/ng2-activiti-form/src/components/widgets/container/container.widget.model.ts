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

import { ContainerModel } from './../core/container.model';
import { FormModel } from './../core/form.model';
import { ContainerColumnModel } from './container-column.model';
import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';

export class ContainerWidgetModel extends ContainerModel {

    numberOfColumns: number = 1;
    columns: ContainerColumnModel[] = [];
    isExpanded: boolean = true;

    isGroup(): boolean {
        return this.type === FormFieldTypes.GROUP;
    }

    isCollapsible(): boolean {
        let allowCollapse = false;

        if (this.isGroup() && this.field.params['allowCollapse']) {
            allowCollapse = <boolean> this.field.params['allowCollapse'];
        }

        return allowCollapse;
    }

    isCollapsedByDefault(): boolean {
        let collapseByDefault = false;

        if (this.isCollapsible() && this.field.params['collapseByDefault']) {
            collapseByDefault = <boolean> this.field.params['collapseByDefault'];
        }

        return collapseByDefault;
    }

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this.numberOfColumns = <number> json.numberOfColumns;

            let columnSize: number = 12;
            if (this.numberOfColumns > 1) {
                columnSize = 12 / this.numberOfColumns;
            }

            for (let i = 0; i < this.numberOfColumns; i++) {
                let col = new ContainerColumnModel();
                col.size = columnSize;
                this.columns.push(col);
            }

            if (json.fields) {
                Object.keys(json.fields).map(key => {
                    let fields = (json.fields[key] || []).map(f => new FormFieldModel(form, f));
                    let col = this.columns[parseInt(key, 10) - 1];
                    col.fields = fields;
                });
            }

            this.isExpanded = !this.isCollapsedByDefault();
            this.children = this.getFormFields();
        }
    }

    private getFormFields(): FormFieldModel[] {
        let result: FormFieldModel[] = [];

        for (let j = 0; j < this.columns.length; j++) {
            let column = this.columns[j];
            for (let k = 0; k < column.fields.length; k++) {
                let field = column.fields[k];
                result.push(field);
            }
        }

        return result;
    }

}
