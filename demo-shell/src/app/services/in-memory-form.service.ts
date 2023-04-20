/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Injectable } from '@angular/core';
import { AppConfigService, LogService,
         FormFieldOption, FormService, FormValues, FormModel,
         FormOutcomeModel, FormOutcomeEvent } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';

interface ProcessServiceData {
    rest: {
        fields: Array<{
            processId?: string;
            taskId?: string;
            fieldId?: string;
            values?: Array<{
                id: string;
                name: string;
            }>;
        }>;
    };
}
//
@Injectable()
export class InMemoryFormService extends FormService {

    private data: ProcessServiceData;

    executeOutcome = new Subject<FormOutcomeEvent>();

    constructor(appConfig: AppConfigService,
                protected logService: LogService) {
        super();
        this.data = appConfig.get<ProcessServiceData>('activiti');
    }

    /** @override */
    getRestFieldValues(taskId: string, field: string): Observable<any> {
        // Uncomment this to use original call
        // return super.getRestFieldValues(taskId, fieldId);

        this.logService.log(`getRestFieldValues: ${taskId} => ${field}`);
        return new Observable<FormFieldOption[]>((observer) => {
            const currentField = this.data.rest.fields.find(
                (f) => f.taskId === taskId && f.fieldId === field
            );
            if ( currentField ) {
                const values: FormFieldOption[] = currentField.values || [];
                this.logService.log(values);
                observer.next(values);
            }
        });
    }

    parseForm(json: any, data?: FormValues, readOnly: boolean = false, prefixedSpace: boolean = true): FormModel {
        if (json) {
            const flattenForm = {
                ...json.formRepresentation,
                ...json.formRepresentation.formDefinition
            };
            delete flattenForm.formDefinition;

            const formValues: FormValues = {};
            (data || []).forEach(variable => {
                formValues[variable.name] = variable.value;
            });

            const form = new FormModel(flattenForm, formValues, readOnly, this, prefixedSpace);
            if (!json.fields) {
                form.outcomes = [
                    new FormOutcomeModel(form, {
                        id: '$save',
                        name: FormOutcomeModel.SAVE_ACTION,
                        isSystem: true
                    })
                ];
            }
            return form;
        }
        return null;
    }

    /** @override */
    getRestFieldValuesByProcessId(processDefinitionId: string, fieldId: string): Observable<any> {
        //  Uncomment this to use original call
        //  return super.getRestFieldValuesByProcessId(processDefinitionId, fieldId);

        this.logService.log(`getRestFieldValuesByProcessId: ${processDefinitionId} => ${fieldId}`);
        return new Observable<FormFieldOption[]>((observer) => {
            const field = this.data.rest.fields.find(
                (currentField) => currentField.processId === processDefinitionId && currentField.fieldId === fieldId
            );
            const values: FormFieldOption[] = field.values || [];
            this.logService.log(values);
            observer.next(values);
        });
    }
}
