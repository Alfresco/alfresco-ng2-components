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

import {
    HttpClient as JsApiHttpClient,
    RequestOptions
} from '@alfresco/js-api';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JsApiAngularHttpClient implements JsApiHttpClient {

    constructor(private httpClient: HttpClient) {}

    request<T = any>(url: string, options: RequestOptions): Promise<T> {

        const responseType = this.getResponseType(options);
        const params = new HttpParams({ fromObject: this.removeUndefinedValues(options.queryParams) });

        return this.httpClient.request(
            options.httpMethod,
            url,
            {
            ...(options.bodyParam ? { body: options.bodyParam } : {}),
            ...(options.headerParams ? { headers: new HttpHeaders(options.headerParams) } : {}),
            observe: 'body',
            ...(options.queryParams ? { params } : {}),
            ...(responseType ? { responseType } : {})
        }).toPromise() as unknown as Promise<T>;
    }

    // Poor man's sanitizer
    private removeUndefinedValues(obj: {[key: string]: any}) {
        const newObj = {};
        Object.keys(obj).forEach((key) => {
            if (obj[key] === Object(obj[key])) {
                newObj[key] = this.removeUndefinedValues(obj[key]);
            } else if (obj[key] !== undefined && obj[key] !== null) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    }

    private getResponseType(options: RequestOptions): 'arraybuffer' | 'blob' | 'json' | 'text' | null {

        const isBlobType = options.returnType?.toString().toLowerCase() === 'blob' || options.responseType?.toString().toLowerCase() === 'blob';

        if (isBlobType) {
            return 'blob';
        } else if (options.returnType === 'String') {
            return 'text';
        }

        return null;
    }

    post<T = any>(url: string, options: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'POST',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    put<T = any>(url: string, options: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'PUT',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    get<T = any>(url: string, options: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'GET',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    delete<T = void>(url: string, options: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'DELETE',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    /** @deprecated */
    callApi(url: string, options: RequestOptions): Promise<any> {
        return this.request(url, options);
    }

    /** @deprecated */
    callCustomApi(url: string, options: RequestOptions): Promise<any> {
        return this.request(url, options);
    }

}
