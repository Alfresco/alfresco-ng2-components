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

import { ContainerColumnModel } from './../core/container-column.model';
import { ContainerModel } from './../core/container.model';
import { FormFieldTypes } from './../core/form-field-types';
import { FormFieldModel } from './../core/form-field.model';

export class ContainerWidgetComponentModel extends ContainerModel {

    columns: ContainerColumnModel[] = [];
    isExpanded: boolean = true;
    rowspan: number = 1;
    colspan: number = 1;

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

    constructor(field: FormFieldModel) {
        super(field);

        if (this.field) {
            this.columns = this.field.columns || [];
            this.isExpanded = !this.isCollapsedByDefault();
            this.colspan = field.colspan;
            this.rowspan = field.rowspan;
        }
    }
}
