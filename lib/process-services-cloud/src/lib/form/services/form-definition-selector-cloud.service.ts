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
import { AlfrescoApiService, AppConfigService } from '@alfresco/adf-core';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { BaseCloudService } from '../../services/base-cloud.service';
import { FormRepresentation } from '../../services/form-fields.interfaces';
import { FormDefinitionSelectorCloudServiceInterface } from './form-definition-selector-cloud.service.interface';

@Injectable({
    providedIn: 'root'
})
export class FormDefinitionSelectorCloudService extends BaseCloudService implements FormDefinitionSelectorCloudServiceInterface {

    constructor(apiService: AlfrescoApiService,
                appConfigService: AppConfigService) {
        super(apiService, appConfigService);
    }

    /**
     * Get all forms of an app.
     *
     * @param appName Name of the application
     * @returns Details of the forms
     */
    getForms(appName: string): Observable<FormRepresentation[]> {
        const url = `${this.getBasePath(appName)}/form/v1/forms`;

        return this.get(url).pipe(
            map((data: any) => data.map((formData: any) => formData.formRepresentation))
        );
    }

    /**
     * Get all forms of an app.
     *
     * @param appName Name of the application
     * @returns Details of the forms
     */
    getStandAloneTaskForms(appName: string): Observable<FormRepresentation[]> {
        return from(this.getForms(appName)).pipe(
            map((data: any) => data.filter((formData: any) => formData.standalone || formData.standalone === undefined))
        );
    }
}
