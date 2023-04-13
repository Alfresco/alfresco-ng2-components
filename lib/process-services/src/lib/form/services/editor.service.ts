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
import { FormModelsApi } from '@alfresco/js-api';
import { catchError, map } from 'rxjs/operators';
import { FormDefinitionModel } from '../model/form-definition.model';

@Injectable({
    providedIn: 'root'
})
export class EditorService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    private _editorApi: FormModelsApi;
    get editorApi(): FormModelsApi {
        this._editorApi = this._editorApi ?? new FormModelsApi(this.apiService.getInstance());
        return this._editorApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }

    /**
     * Saves a form.
     *
     * @param formId ID of the form to save
     * @param formModel Model data for the form
     * @returns Data for the saved form
     */
    saveForm(formId: number, formModel: FormDefinitionModel): Observable<any> {
        return from(
            this.editorApi.saveForm(formId, formModel)
        );
    }

    /**
     * Gets a form definition.
     *
     * @param formId ID of the target form
     * @returns Form definition
     */
    getFormDefinitionById(formId: number): Observable<any> {
        return from(this.editorApi.getForm(formId))
            .pipe(
                map(this.toJson),
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
        let errMsg = EditorService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : EditorService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }

}
