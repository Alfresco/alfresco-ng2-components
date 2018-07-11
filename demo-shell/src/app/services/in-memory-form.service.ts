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

import { Injectable } from '@angular/core';
import { AppConfigService, AlfrescoApiService, EcmModelService, LogService,
         FormFieldOption, FormService, FormValues, FormModel,
         FormOutcomeModel, FormOutcomeEvent } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';

interface ProcessServiceData {
    rest: {
        fields: Array<{
            processId?: string,
            taskId?: string,
            fieldId?: string,
            values?: Array<{
                id: string,
                name: string
            }>
        }>
    };
}
//
@Injectable()
export class InMemoryFormService extends FormService {

    private data: ProcessServiceData;

    executeOutcome = new Subject<FormOutcomeEvent>();

    constructor(appConfig: AppConfigService,
                ecmModelService: EcmModelService,
                apiService: AlfrescoApiService,
                protected logService: LogService) {
        super(ecmModelService, apiService, logService);
        this.data = appConfig.get<ProcessServiceData>('activiti');
    }

    /** @override */
    getRestFieldValues(taskId: string, field: string): Observable<any> {
        // Uncomment this to use original call
        // return super.getRestFieldValues(taskId, fieldId);

        this.logService.log(`getRestFieldValues: ${taskId} => ${field}`);
        return new Observable<FormFieldOption[]>(observer => {
            const currentField = this.data.rest.fields.find(
                f => f.taskId === taskId && f.fieldId === field
            );
            if ( currentField ) {
                const values: FormFieldOption[] = currentField.values || [];
                this.logService.log(values);
                observer.next(values);
            }
        });
    }

    parseForm(json: any, data?: FormValues, readOnly: boolean = false): FormModel {
        if (json) {
            const form = new FormModel(json, data, readOnly, this);
            if (!json.fields) {
                form.outcomes = [
                    new FormOutcomeModel(form, {
                        id: '$custom',
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
        return new Observable<FormFieldOption[]>(observer => {
            const field = this.data.rest.fields.find(
                f => f.processId === processDefinitionId && f.fieldId === fieldId
            );
            const values: FormFieldOption[] = field.values || [];
            this.logService.log(values);
            observer.next(values);
        });
    }
}
