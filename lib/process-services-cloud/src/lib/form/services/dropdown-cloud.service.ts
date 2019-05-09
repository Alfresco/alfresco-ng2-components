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
import { from, throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LogService, AlfrescoApiService, FormFieldOption } from '@alfresco/adf-core';

@Injectable()
export class DropdownCloudService {

    contentTypes = ['application/json'];
    accepts = ['application/json'];
    returnType = Object;

    constructor(
        private logService: LogService,
        private apiService: AlfrescoApiService
    ) {}

    getDropDownJsonData(url: string): Observable<FormFieldOption[]> {
        return from(this.apiService.getInstance()
        .oauth2Auth.callCustomApi(url, 'GET',
            null, null, null,
            null, null,
            this.contentTypes, this.accepts,
            this.returnType, null, null)
        ).pipe(
            map((res: any) => {
                return res;
            }),
            catchError((err) => this.handleError(err))
        );
    }

    private handleError(error: any): any {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
