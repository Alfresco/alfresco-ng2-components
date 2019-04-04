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

import { FormValues } from './widgets/core/form-values';
import { TabModel } from './widgets/core/tab.model';
import { FormWidgetModel } from './widgets/core/form-widget.model';
import { FormOutcomeModel } from './widgets/core/form-outcome.model';
import { FormFieldModel } from './widgets/core/form-field.model';
import { ContainerModel } from './widgets/core/container.model';

export abstract class FormBaseModel {

    static UNSET_TASK_NAME: string = 'Nameless task';
    static SAVE_OUTCOME: string = '$save';
    static COMPLETE_OUTCOME: string = '$complete';
    static START_PROCESS_OUTCOME: string = '$startProcess';

    json: any;
    isValid: boolean;

    values: FormValues = {};
    tabs: TabModel[] = [];
    fields: FormWidgetModel[] = [];
    outcomes: FormOutcomeModel[] = [];

    className: string;
    readOnly: boolean = false;
    taskName;

    hasTabs(): boolean {
        return this.tabs && this.tabs.length > 0;
    }

    hasFields(): boolean {
        return this.fields && this.fields.length > 0;
    }

    hasOutcomes(): boolean {
        return this.outcomes && this.outcomes.length > 0;
    }

    getFieldById(fieldId: string): FormFieldModel {
        return this.getFormFields().find((field) => field.id === fieldId);
    }

    // TODO: consider evaluating and caching once the form is loaded
    getFormFields(): FormFieldModel[] {
        const formFieldModel: FormFieldModel[] = [];

        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];

            if (field instanceof ContainerModel) {
                const container = <ContainerModel> field;
                formFieldModel.push(container.field);

                container.field.columns.forEach((column) => {
                    formFieldModel.push(...column.fields);
                });
            }
        }

        return formFieldModel;
    }

    abstract validateForm();
    abstract validateField(field: FormFieldModel);
    abstract onFormFieldChanged(field: FormFieldModel);
    abstract markAsInvalid();
}
