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
    HttpClientConfig, paramToString,
    RequestOptions
} from '@alfresco/js-api';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

/** tslint:disable-next line */
export class BaseJsApiAngularHttpClient implements JsApiHttpClient {
    public basePath: string;

    constructor(
        public config: HttpClientConfig,
        private httpClient: HttpClient
    ) {
        this.basePath = `${this.config.host}/${this.config.contextRoot}${this.config.servicePath}`;
    }

    request<T = any>(options: RequestOptions): Promise<T> {

        const responseType = this.getResponseType(options);
        const params = new HttpParams({ fromObject: this.removeUndefinedValues(options.queryParams) });

        return this.httpClient.request(
            options.httpMethod,
            options.url,
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

    private getResponseType(options: RequestOptions): 'arraybuffer' | 'blob' | 'json' | 'text' {
        let responseType = null;

        if (options.returnType?.toString().toLowerCase() === 'blob' || options.responseType?.toString().toLowerCase() === 'blob') {
            responseType = 'blob';
        } else if (options.returnType === 'String') {
            responseType = 'text';
        }

        return responseType;
    }

    post<T = any>(options: RequestOptions): Promise<T> {
        return this.request<T>({
            ...options,
            httpMethod: 'POST',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    put<T = any>(options: RequestOptions): Promise<T> {
        return this.request<T>({
            ...options,
            httpMethod: 'PUT',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    get<T = any>(options: RequestOptions): Promise<T> {
        return this.request<T>({
            ...options,
            httpMethod: 'GET',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    delete<T = void>(options: RequestOptions): Promise<T> {
        return this.request<T>({
            ...options,
            httpMethod: 'DELETE',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        });
    }

    /** @deprecated */
    callApi(
        path: string,
        httpMethod: string,
        pathParams?: any,
        queryParams?: any,
        headerParams?: any,
        formParams?: any,
        bodyParam?: any,
        contentTypes?: string[],
        accepts?: string[],
        returnType?: any,
        contextRoot?: string,
        responseType?: string,
        url?: string
    ): Promise<any> {

        const basePath = contextRoot ? `${this.config.host}/${contextRoot}` : this.basePath;
        url = url ?? this.buildUrl(basePath, path, pathParams);

        return this.request({
            path,
            httpMethod,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts,
            returnType,
            contextRoot,
            responseType,
            url
        });
    }

    /** @deprecated */
    callCustomApi(
        fullPath: string,
        httpMethod: string,
        pathParams?: any,
        queryParams?: any,
        headerParams?: any,
        formParams?: any,
        bodyParam?: any,
        contentTypes?: string[],
        accepts?: string[],
        returnType?: any,
        contextRoot?: string,
        responseType?: string
    ): Promise<any> {
        const url = this.buildUrl(fullPath, '', pathParams);

        return this.request({
            path: fullPath,
            httpMethod,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts,
            returnType,
            contextRoot,
            responseType,
            url
        });
    }

    private buildUrl(basePath: string, path: string, pathParams: any): string {
        if (path && path !== '' && !path.match(/^\//)) {
            path = '/' + path;
        }
        let url = basePath + path;

        url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
            let value;
            if (pathParams.hasOwnProperty(key)) {
                value = paramToString(pathParams[key]);
            } else {
                value = fullMatch;
            }
            return encodeURIComponent(value);
        });
        return url;
    }
}
