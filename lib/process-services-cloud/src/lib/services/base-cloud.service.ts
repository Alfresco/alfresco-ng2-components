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

import { AlfrescoApiService, AppConfigService, LogService } from '@alfresco/adf-core';
import { Injectable, inject } from '@angular/core';
import { from, Observable } from 'rxjs';

export interface CallApiParams {
    path: string;
    httpMethod: string;
    pathParams?: any;
    queryParams?: any;
    headerParams?: any;
    formParams?: any;
    bodyParam?: any;
    contentTypes?: string[];
    accepts?: string[];
    returnType?: any;
    contextRoot?: string;
    responseType?: string;
}

@Injectable()
export class BaseCloudService {
    protected apiService = inject(AlfrescoApiService);
    protected appConfigService = inject(AppConfigService);
    protected logService = inject(LogService);

    protected defaultParams: CallApiParams = {
        path: '',
        httpMethod: '',
        contentTypes: ['application/json'],
        accepts: ['application/json']
    };

    getBasePath(appName: string): string {
        return appName
            ? `${this.contextRoot}/${appName}`
            : this.contextRoot;
    }

    protected post<T, R>(url: string, data?: T, queryParams?: any): Observable<R> {
        return from(
            this.callApi<R>({
                ...this.defaultParams,
                path: url,
                httpMethod: 'POST',
                bodyParam: data,
                queryParams
            })
        );
    }

    protected put<T, R>(url: string, data?: T): Observable<R> {
        return from(
            this.callApi<R>({
                ...this.defaultParams,
                path: url,
                httpMethod: 'PUT',
                bodyParam: data
            })
        );
    }

    protected delete(url: string): Observable<void> {
        return from(
            this.callApi<void>({
                ...this.defaultParams,
                path: url,
                httpMethod: 'DELETE'
            })
        );
    }

    protected get<T>(url: string, queryParams?: any): Observable<T> {
        return from(
            this.callApi<T>({
                ...this.defaultParams,
                path: url,
                httpMethod: 'GET',
                queryParams
            })
        );
    }

    protected callApi<T>(params: CallApiParams): Promise<T> {
        return this.apiService.getInstance()
            .oauth2Auth.callCustomApi(
                params.path,
                params.httpMethod,
                params.pathParams,
                params.queryParams,
                params.headerParams,
                params.formParams,
                params.bodyParam,
                params.contentTypes,
                params.accepts,
                params.returnType,
                params.contextRoot,
                params.responseType
            );
    }

    protected get contextRoot() {
        return this.appConfigService.get('bpmHost', '');
    }
}
