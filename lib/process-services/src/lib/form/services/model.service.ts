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
import { ModelsApi } from '@alfresco/js-api';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ModelService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    private _modelsApi: ModelsApi;
    get modelsApi(): ModelsApi {
        this._modelsApi = this._modelsApi ?? new ModelsApi(this.apiService.getInstance());
        return this._modelsApi;
    }

    constructor(private apiService: AlfrescoApiService, private logService: LogService) {
    }

    /**
     * Create a Form.
     *
     * @param formName Name of the new form
     * @returns The new form
     */
    createForm(formName: string): Observable<any> {
        const dataModel = {
            name: formName,
            description: '',
            modelType: 2,
            stencilSet: 0
        };

        return from(
            this.modelsApi.createModel(dataModel)
        );
    }

    /**
     * Gets all the forms.
     *
     * @returns List of form models
     */
    getForms(): Observable<any> {
        const opts = {
            modelType: 2
        };

        return from(this.modelsApi.getModels(opts))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Creates a JSON array representation of form data.
     *
     * @param res Object representing form data
     * @returns JSON data
     */
    toJsonArray(res: any) {
        if (res) {
            return res.data || [];
        }
        return [];
    }

    /**
     * Searches for a form by name.
     *
     * @param name The form name to search for
     * @returns Form model(s) matching the search name
     */
    searchFrom(name: string): Observable<any> {
        const opts = {
            modelType: 2
        };

        return from(
            this.modelsApi.getModels(opts)
        )
            .pipe(
                map((forms: any) => forms.data.find((formData) => formData.name === name)),
                catchError((err) => this.handleError(err))
            );
    }


    /**
     * Gets the form definition with a given name.
     *
     * @param name The form name
     * @returns Form definition
     */
    getFormDefinitionByName(name: string): Observable<any> {
        const opts = {
            filter: 'myReusableForms',
            filterText: name,
            modelType: 2
        };

        return from(this.modelsApi.getModels(opts))
            .pipe(
                map(this.getFormId),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Gets the ID of a form.
     *
     * @param form Object representing a form
     * @returns ID string
     */
    getFormId(form: any): string {
        let result = null;

        if (form && form.data && form.data.length > 0) {
            result = form.data[0].id;
        }

        return result;
    }
    /**
     * Reports an error message.
     *
     * @param error Data object with optional `message` and `status` fields for the error
     * @returns Error message
     */
    private handleError(error: any): Observable<any> {
        let errMsg = ModelService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : ModelService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }

}
