/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { EventEmitterInstance } from './../types';
import { Authentication } from '../authentication/authentication';

export interface RequestOptions {
    path: string;
    httpMethod?: string;
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
    url?: string;
    readonly accept?: string;
    readonly contentType?: string;
}

export interface HttpClientConfig {
    contextRoot?: string;
    host?: string; // Should be mandatory but can't make it because of AlfrescoApiConfig incompatibility 😕
    servicePath?: string; // Should be mandatory but can't make it because of AlfrescoApiConfig incompatibility 😕
}

export interface LegacyHttpClient {
    basePath: string;
    config: HttpClientConfig;

    request<T = any>(options: RequestOptions): Promise<T>;
    post<T = any>(options: RequestOptions): Promise<T>;
    put<T = any>(options: RequestOptions): Promise<T>;
    get<T = any>(options: RequestOptions): Promise<T>;
    delete<T = void>(options: RequestOptions): Promise<T>;
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
    ): Promise<any>;
    /** @deprecated */
    callCustomApi(
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
        responseType?: string
    ): Promise<any>;
}

export interface SecurityOptions {
    readonly isBpmRequest: boolean;
    readonly enableCsrf?: boolean;
    readonly withCredentials?: boolean;
    readonly authentications: Authentication;
    readonly defaultHeaders: Record<string, string>;
}

export interface Emitters {
    readonly eventEmitter: EventEmitterInstance;
    readonly apiClientEmitter: {
        on: EventEmitterInstance['on'];
        off: EventEmitterInstance['off'];
        once: EventEmitterInstance['once'];
        emit: EventEmitterInstance['emit'];
    };
}

export interface HttpClient {
    request<T = any>(url: string, options: RequestOptions, security: SecurityOptions, emitters: Emitters): Promise<T>;
    post<T = any>(url: string, options: RequestOptions, security: SecurityOptions, emitters: Emitters): Promise<T>;
    put<T = any>(url: string, options: RequestOptions, security: SecurityOptions, emitters: Emitters): Promise<T>;
    get<T = any>(url: string, options: RequestOptions, security: SecurityOptions, emitters: Emitters): Promise<T>;
    delete<T = void>(url: string, options: RequestOptions, security: SecurityOptions, emitters: Emitters): Promise<T>;
}
