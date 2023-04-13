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

import { AlfrescoApiService, LogService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { ProcessDefinitionsApi } from '@alfresco/js-api';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProcessDefinitionService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    private _processDefinitionsApi: ProcessDefinitionsApi;
    get processDefinitionsApi(): ProcessDefinitionsApi {
        this._processDefinitionsApi = this._processDefinitionsApi ?? new ProcessDefinitionsApi(this.apiService.getInstance());
        return this._processDefinitionsApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }


    /**
     * Gets values of fields populated by a REST backend using a process ID.
     *
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @returns Field values
     */
    getRestFieldValuesByProcessId(processDefinitionId: string, field: string): Observable<any> {
        return from(this.processDefinitionsApi.getRestFieldValues(processDefinitionId, field))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets column values of fields populated by a REST backend using a process ID.
     *
     * @param processDefinitionId Process identifier
     * @param field Field identifier
     * @param column Column identifier
     * @returns Field values
     */
    getRestFieldValuesColumnByProcessId(processDefinitionId: string, field: string, column?: string): Observable<any> {
        return from(this.processDefinitionsApi.getRestTableFieldValues(processDefinitionId, field, column))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Creates a JSON representation of form data.
     *
     * @param res Object representing form data
     * @returns JSON data
     */
    toJson(res: any) {
        if (res) {
            return res || {};
        }
        return {};
    }

    /**
     * Reports an error message.
     *
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Error message
     */
    private handleError(error: any): Observable<any> {
        let errMsg = ProcessDefinitionService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : ProcessDefinitionService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }

}
