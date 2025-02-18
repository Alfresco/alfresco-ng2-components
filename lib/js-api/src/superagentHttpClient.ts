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

import { FetchOptions, FetchResponse, ofetch } from 'ofetch';
import { Authentication } from './authentication/authentication';
import { RequestOptions, HttpClient, SecurityOptions, Emitters } from './api-clients/http-client.interface';
import { Oauth2 } from './authentication/oauth2';
import { BasicAuth } from './authentication/basicAuth';
import { isBrowser, paramToString } from './utils';

export class SuperagentHttpClient implements HttpClient {
    /**
     * The default HTTP timeout for all API calls.
     */
    timeout: number | { deadline?: number; response?: number } = undefined;

    post<T = any>(url: string, options: RequestOptions, securityOptions: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'POST' }, securityOptions, emitters);
    }

    put<T = any>(url: string, options: RequestOptions, securityOptions: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'PUT' }, securityOptions, emitters);
    }

    get<T = any>(url: string, options: RequestOptions, securityOptions: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'GET' }, securityOptions, emitters);
    }

    delete<T = void>(url: string, options: RequestOptions, securityOptions: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'DELETE' }, securityOptions, emitters);
    }

    request<T = any>(url: string, options: RequestOptions, securityOptions: SecurityOptions, emitters: Emitters): Promise<T> {
        const { returnType } = options;
        const { eventEmitter, apiClientEmitter } = emitters;

        const { urlWithParams, fetchOptions } = this.buildRequest({
            ...options,
            url,
            securityOptions
        });

        const controller = new AbortController();
        fetchOptions.signal = controller.signal;

        const promise = new Promise<T>((resolve, reject) => {
            ofetch(urlWithParams, fetchOptions)
                .then(async (response: Response) => {
                    if (response.ok) {
                        if (securityOptions.isBpmRequest) {
                            const hasSetCookie = Object.prototype.hasOwnProperty.call(response.headers, 'set-cookie');
                            if (response.headers && hasSetCookie) {
                                securityOptions.authentications.cookie = response.headers.get('set-cookie');
                            }
                        }
                        let data: T;
                        if (response.headers.get('content-type') === 'text/html') {
                            data = await SuperagentHttpClient.deserialize(response);
                        } else {
                            data = await SuperagentHttpClient.deserialize(response, returnType);
                        }

                        eventEmitter.emit('success', data);
                        resolve(data);
                    } else {
                        apiClientEmitter.emit('error', response);
                        eventEmitter.emit('error', response);

                        if (response.status === 401) {
                            apiClientEmitter.emit('unauthorized');
                            eventEmitter.emit('unauthorized');
                        }

                        response.text().then((text) => {
                            reject(Object.assign(new Error(text), { status: response.status }));
                        });
                    }
                })
                .catch((error: any) => {
                    apiClientEmitter.emit('error', error);
                    eventEmitter.emit('error', error);
                    reject(error);
                });
        });

        return promise;
    }

    private buildRequest({
        httpMethod,
        url,
        queryParams,
        headerParams,
        formParams,
        bodyParam,
        contentType,
        accept,
        responseType,
        returnType,
        securityOptions
    }: RequestOptions & { securityOptions: SecurityOptions }) {
        const urlWithParams = new URL(url);
        urlWithParams.search = new URLSearchParams(SuperagentHttpClient.normalizeParams(queryParams)).toString();

        // Create a Headers object and add default and normalized header params
        const headers = new Headers();
        for (const key in securityOptions.defaultHeaders) {
            if (Object.prototype.hasOwnProperty.call(securityOptions.defaultHeaders, key)) {
                headers.append(key, securityOptions.defaultHeaders[key]);
            }
        }
        const normHeaders = SuperagentHttpClient.normalizeParams(headerParams);
        for (const key in normHeaders) {
            if (Object.prototype.hasOwnProperty.call(normHeaders, key)) {
                headers.append(key, normHeaders[key]);
            }
        }

        const fetchOptions: FetchOptions = { method: httpMethod };

        const { isBpmRequest, authentications, enableCsrf, withCredentials = false } = securityOptions;
        this.applyAuthToRequest(headers, authentications);

        if (isBpmRequest && enableCsrf) {
            this.setCsrfToken(headers);
        }

        if (withCredentials) {
            fetchOptions.credentials = 'include';
        }
        if (isBpmRequest && securityOptions.authentications.cookie) {
            if (!isBrowser()) {
                headers.set('Cookie', securityOptions.authentications.cookie);
            }
        }
        if (contentType && contentType !== 'multipart/form-data') {
            headers.set('Content-Type', contentType);
        } else if (!headers.has('Content-Type') && contentType !== 'multipart/form-data') {
            headers.set('Content-Type', 'application/json');
        }

        if (contentType === 'application/x-www-form-urlencoded') {
            fetchOptions.body = new URLSearchParams(SuperagentHttpClient.normalizeParams(formParams)).toString();
        } else if (contentType === 'multipart/form-data') {
            const formData = new FormData();
            const normalizedParams = SuperagentHttpClient.normalizeParams(formParams);
            for (const key in normalizedParams) {
                if (Object.prototype.hasOwnProperty.call(normalizedParams, key)) {
                    formData.append(key, normalizedParams[key]);
                }
            }
            fetchOptions.body = formData;
        } else if (bodyParam) {
            fetchOptions.body = JSON.stringify(bodyParam);
        }

        if (accept) {
            headers.set('Accept', accept);
        }
        if (returnType === 'blob' || returnType === 'Blob' || responseType === 'blob' || responseType === 'Blob') {
            fetchOptions.responseType = 'blob';
        } else if (returnType === 'String') {
            fetchOptions.responseType = 'text';
        }

        const parsedHeaders: Record<string, string> = {};

        headers.forEach((value, key) => {
            parsedHeaders[key] = value;
        });

        fetchOptions.headers = parsedHeaders;

        return { urlWithParams: urlWithParams.toString(), fetchOptions };
    }

    /**
     * Applies authentication headers to the request.
     * @param fetchOptions The fetch options object.
     * @param authentications authentications
     */
    private applyAuthToRequest(headers: Headers, authentications: Authentication) {
        if (authentications) {
            switch (authentications.type) {
                case 'basic': {
                    const basicAuth: BasicAuth = authentications.basicAuth;
                    if (basicAuth.username || basicAuth.password) {
                        headers.set('Authorization', 'Basic ' + btoa(basicAuth.username + ':' + basicAuth.password));
                    }
                    break;
                }
                case 'activiti': {
                    if (authentications.basicAuth.ticket) {
                        headers.set('Authorization', authentications.basicAuth.ticket);
                    }
                    break;
                }
                case 'oauth2': {
                    const oauth2: Oauth2 = authentications.oauth2;
                    if (oauth2.accessToken) {
                        headers.set('Authorization', 'Bearer ' + oauth2.accessToken);
                    }
                    break;
                }
                default:
                    throw new Error('Unknown authentication type: ' + authentications.type);
            }
        }
    }

    setCsrfToken(headers: Headers): void {
        const token = SuperagentHttpClient.createCSRFToken();
        headers.set('X-CSRF-TOKEN', token);

        if (!isBrowser()) {
            headers.set('Cookie', 'CSRF-TOKEN=' + token + ';path=/');
        }

        try {
            document.cookie = 'CSRF-TOKEN=' + token + ';path=/';
        } catch (err) {
            /* continue regardless of error */
        }
    }

    private static createCSRFToken(a?: any): string {
        return a
            ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
            : ([1e16] + (1e16).toString()).replace(/[01]/g, SuperagentHttpClient.createCSRFToken);
    }

    /**
     * Deserializes an HTTP response body into a value of the specified type.
     * @param response A fetch response object.
     * @param returnType The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns A value of the specified type.
     */
    private static async deserialize(response: FetchResponse<unknown>, returnType?: any): Promise<any> {
        if (response === null) {
            return null;
        }

        let parsedBody: unknown;

        try {
            parsedBody = await response.json();
        } catch (error) {
            parsedBody = await response.text();
        }

        if (returnType) {
            if (returnType === 'blob' && isBrowser()) {
                return response.blob();
            } else if (returnType === 'blob' && !isBrowser()) {
                return response.arrayBuffer();
            } else {
                if (Array.isArray(parsedBody)) {
                    return parsedBody.map((element) => new returnType(element));
                } else {
                    return new returnType(await parsedBody);
                }
            }
        }

        return parsedBody;
    }

    /**
     * Normalizes parameter values:
     * <ul>
     * <li>remove nils</li>
     * <li>keep files and arrays</li>
     * <li>format to string with `paramToString` for other cases</li>
     * </ul>
     * @param params The parameters as object properties.
     * @returns normalized parameters.
     */
    private static normalizeParams(params: { [key: string]: any }): { [key: string]: any } {
        const newParams: { [key: string]: any } = {};

        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key) && params[key] !== undefined && params[key] !== null) {
                const value = params[key];
                if (SuperagentHttpClient.isFileParam(value) || Array.isArray(value)) {
                    newParams[key] = value;
                } else {
                    newParams[key] = paramToString(value);
                }
            }
        }
        return newParams;
    }

    /**
     * Checks whether the given parameter value represents file-like content.
     * @param param The parameter to check.
     * @returns <code>true</code> if <code>param</code> represents a file.
     */
    private static isFileParam(param: any): boolean {
        // Buffer in Node.js
        if (typeof Buffer === 'function' && (param instanceof Buffer || param.path)) {
            return true;
        }
        // Blob in browser
        if (typeof Blob === 'function' && param instanceof Blob) {
            return true;
        }
        // File in browser (it seems File object is also instance of Blob, but keep this for safe)
        if (typeof File === 'function' && param instanceof File) {
            return true;
        }
        // Safari fix
        if (typeof File === 'object' && param instanceof File) {
            return true;
        }

        return false;
    }
}
