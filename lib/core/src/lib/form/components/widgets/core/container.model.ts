/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FormFieldModel } from './form-field.model';
import { FormWidgetModel } from './form-widget.model';
import { ContainerColumnModel } from './container-column.model';
import { FormFieldTypes } from './form-field-types';

export class ContainerModel extends FormWidgetModel {
    field: FormFieldModel;

    readonly columns: ContainerColumnModel[] = [];
    isExpanded: boolean = true;
    readonly rowspan: number = 1;
    readonly colspan: number = 1;

    constructor(field: FormFieldModel) {
        super(field.form, field.json);

        if (field) {
            this.field = field;
            this.columns = field.columns || [];
            this.isExpanded = !this.isCollapsedByDefault;
            this.colspan = field.colspan;
            this.rowspan = field.rowspan;
        }
    }

    get isVisible(): boolean {
        return this.field.isVisible;
    }

    get isTypeFieldGroup(): boolean {
        return this.type === FormFieldTypes.GROUP;
    }

    get isCollapsible(): boolean {
        return this.isTypeFieldGroup && (this.field.params?.allowCollapse ?? false);
    }

    get isCollapsedByDefault(): boolean {
        return this.isTypeFieldGroup && (this.field.params?.collapseByDefault ?? false);
    }

    get hideHeader(): boolean {
        return this.isTypeFieldGroup && (this.field.params?.hideHeader ?? false);
    }
}
