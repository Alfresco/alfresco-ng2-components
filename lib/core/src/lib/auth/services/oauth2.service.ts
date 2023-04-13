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
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { Observable, from } from 'rxjs';
import { Oauth2Auth } from '@alfresco/js-api';

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
    constructor(private alfrescoApiService: AlfrescoApiService) {}

    get apiClient(): Oauth2Auth {
        return this.alfrescoApiService.getInstance().oauth2Auth;
    }

    request<T>(opts: OAuth2RequestParams): Observable<T> {
        return from(
            this.apiClient.callCustomApi(
                opts.url,
                opts.httpMethod,
                opts.pathParams,
                opts.queryParams,
                {},
                {},
                opts.bodyParam,
                JSON_TYPE,
                JSON_TYPE,
                Object
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
