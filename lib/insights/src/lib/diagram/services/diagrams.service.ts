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
import { catchError } from 'rxjs/operators';
import { ModelJsonBpmnApi } from '@alfresco/js-api';

@Injectable({ providedIn: 'root' })
export class DiagramsService {

    private _modelJsonBpmnApi: ModelJsonBpmnApi;
    get modelJsonBpmnApi(): ModelJsonBpmnApi {
        this._modelJsonBpmnApi = this._modelJsonBpmnApi ?? new ModelJsonBpmnApi(this.apiService.getInstance());
        return this._modelJsonBpmnApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    getProcessDefinitionModel(processDefinitionId: string): Observable<any> {
        return from(this.modelJsonBpmnApi.getModelJSON(processDefinitionId))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    getRunningProcessDefinitionModel(processInstanceId: string): Observable<any> {
        return from(this.modelJsonBpmnApi.getModelJSONForProcessDefinition(processInstanceId))
            .pipe(
                catchError((err) => this.handleError(err))
            );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
