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
import { Observable } from 'rxjs/Rx';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { FormService, EcmModelService, FormFieldOption } from 'ng2-activiti-form';

@Injectable()
export class InMemoryFormService extends FormService {

    restFieldValues: Map<string, Map<string, FormFieldOption[]>> = new Map();

    constructor(ecmModelService: EcmModelService,
                apiService: AlfrescoApiService,
                logService: LogService) {
        super(ecmModelService, apiService, logService);
    }

    /** @override */
    getRestFieldValues(taskId: string, field: string): Observable<FormFieldOption[]> {
        // return super.getRestFieldValues(taskId, field);
        console.log(`getRestFieldValues: ${taskId} => ${field}`);
        return new Observable<FormFieldOption[]>(observer => {
            let values: FormFieldOption[] = [];
            const fields = this.restFieldValues.get(taskId);
            if (fields) {
                values = fields.get(field) || [];
            }
            console.log(values);
            observer.next(values);
        });
    }

}
