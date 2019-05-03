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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { catchError, map } from 'rxjs/operators';
import { FormDefinitionSelectorCloudModel } from '../models/form-definition-selector-cloud.model';
import { from, Observable, throwError } from 'rxjs';
import { BaseCloudService } from '../../services/base-cloud.service';

@Injectable({
    providedIn: 'root'
})
export class FormDefinitionSelectorCloudService extends BaseCloudService {

    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    constructor(private apiService: AlfrescoApiService,
                private appConfigService: AppConfigService,
                private logService: LogService) {
        super();
        this.contextRoot = this.appConfigService.get('bpmHost', '');
    }

    /**
     * Get all forms of an app.
     * @param appName Name of the application
     * @returns Details of the forms
     */
    getForms(appName: string): Observable<FormDefinitionSelectorCloudModel[]> {

        const queryUrl = this.buildGetFormsUrl(appName);
        const bodyParam = {}, pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {}, contentTypes = ['application/json'], accepts = ['application/json'];
        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                queryUrl, 'GET', pathParams, queryParams,
                headerParams, formParams, bodyParam,
                contentTypes, accepts, null, null)
        ).pipe(
            map((data: any) => {
                return data.map((formData: any) => {
                    return <FormDefinitionSelectorCloudModel> formData.formRepresentation;
                });
            }),
            catchError((err) => this.handleError(err))
        );
    }

    private buildGetFormsUrl(appName: string): any {
        return `${this.getBasePath(appName)}/form/v1/forms`;
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
