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
import { Observable, from } from 'rxjs';
import { AdfHttpClient } from '@alfresco/adf-core/api';

export const JSON_TYPE = ['application/json'];

export interface OAuth2RequestParams {
    url: string;
    httpMethod?: string;
    pathParams?: any;
    queryParams?: any;
    bodyParam?: any;
}

@Injectable({ providedIn: 'root' })
export class OAuth2Service {
    constructor(private adfHttpClient: AdfHttpClient) {}

    request<T>(opts: OAuth2RequestParams): Observable<T> {
        const { httpMethod, url, bodyParam, queryParams } = opts;
        return from(
            this.adfHttpClient.request(
                url,
                {
                    httpMethod,
                    queryParams,
                    headerParams: {},
                    formParams: {},
                    bodyParam,
                    returnType: Object
                }
            )
        );
    }

    get<T>(opts: OAuth2RequestParams): Observable<T> {
        return this.request({
            ...opts,
            httpMethod: 'GET'
        });
    }

    put<T>(opts: OAuth2RequestParams): Observable<T> {
        return this.request({
            ...opts,
            httpMethod: 'PUT'
        });
    }

    post<T>(opts: OAuth2RequestParams): Observable<T> {
        return this.request({
            ...opts,
            httpMethod: 'POST'
        });
    }

    delete<T>(opts: OAuth2RequestParams): Observable<T> {
        return this.request({
            ...opts,
            httpMethod: 'DELETE'
        });
    }
}
