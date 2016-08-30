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

import { FormWidgetModel } from './form-widget.model';
import { FormFieldMetadata } from './form-field-metadata';
import { ContainerColumnModel } from './container-column.model';
import { FormFieldTypes } from './form-field-types';
import { FormModel } from './form.model';
import { FormFieldModel } from './form-field.model';

// TODO: inherit FormFieldModel
export class ContainerModel extends FormWidgetModel {

    fieldType: string;
    id: string;
    name: string;
    type: string;
    tab: string;
    numberOfColumns: number = 1;
    params: FormFieldMetadata = {};

    columns: ContainerColumnModel[] = [];
    isExpanded: boolean = true;

    isGroup(): boolean {
        return this.type === FormFieldTypes.GROUP;
    }

    isCollapsible(): boolean {
        let allowCollapse = false;

        if (this.isGroup() && this.params['allowCollapse']) {
            allowCollapse = <boolean> this.params['allowCollapse'];
        }

        return allowCollapse;
    }

    isCollapsedByDefault(): boolean {
        let collapseByDefault = false;

        if (this.isCollapsible() && this.params['collapseByDefault']) {
            collapseByDefault = <boolean> this.params['collapseByDefault'];
        }

        return collapseByDefault;
    }

    constructor(form: FormModel, json?: any) {
        super(form, json);

        if (json) {
            this.fieldType = json.fieldType;
            this.id = json.id;
            this.name = json.name;
            this.type = json.type;
            this.tab = json.tab;
            this.numberOfColumns = <number> json.numberOfColumns;
            this.params = <FormFieldMetadata> json.params || {};

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
        }
    }
}
