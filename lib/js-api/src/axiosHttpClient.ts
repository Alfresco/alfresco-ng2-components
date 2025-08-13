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

import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { Authentication } from './authentication/authentication';
import { RequestOptions, HttpClient, SecurityOptions, Emitters } from './api-clients/http-client.interface';
import { Oauth2 } from './authentication/oauth2';
import { BasicAuth } from './authentication/basicAuth';
import { isBrowser, paramToString } from './utils';
import { EventEmitterInstance } from './types';

declare const Blob: any;
declare const Buffer: any;

const isProgressEvent = (event: ProgressEvent | unknown): event is ProgressEvent => (event as ProgressEvent)?.lengthComputable;

export class AxiosHttpClient implements HttpClient {
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

    async request<T = any>(url: string, options: RequestOptions, securityOptions: SecurityOptions, emitters: Emitters): Promise<T> {
        const { httpMethod, queryParams, headerParams, formParams, bodyParam, contentType, accept, responseType, returnType } = options;
        const { eventEmitter, apiClientEmitter } = emitters;

        const config = this.buildRequest(
            httpMethod,
            url,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentType,
            accept,
            responseType,
            eventEmitter,
            returnType,
            securityOptions
        );

        const source = axios.CancelToken.source();
        config.cancelToken = source.token;

        if (returnType === 'Binary') {
            config.responseType = 'arraybuffer';
        }

        const promise: any = axios(config)
            .then((response: AxiosResponse<T>) => {
                if (securityOptions.isBpmRequest) {
                    const hasSetCookie = response.headers['set-cookie'];
                    if (response.headers && hasSetCookie) {
                        // mutate the passed value from AlfrescoApiClient class for backward compatibility
                        securityOptions.authentications.cookie = hasSetCookie[0];
                    }
                }
                let data = {};
                if (response.headers['content-type']?.includes('text/html')) {
                    data = AxiosHttpClient.deserialize(response);
                } else {
                    data = AxiosHttpClient.deserialize(response, returnType);
                }

                eventEmitter.emit('success', data);
                return data;
            })
            .catch((error: AxiosError) => {
                apiClientEmitter.emit('error', error);
                eventEmitter.emit('error', error);

                if (error.response?.status === 401) {
                    apiClientEmitter.emit('unauthorized');
                    eventEmitter.emit('unauthorized');
                }

                if (error.response?.data) {
                    const responseError = error.response.data;
                    const enrichedError = Object.assign(error, {
                        message: typeof responseError === 'string' ? responseError : JSON.stringify(responseError)
                    });
                    throw enrichedError;
                } else {
                    throw { error };
                }
            });

        promise.abort = function () {
            eventEmitter.emit('abort');
            source.cancel('Request aborted');
            return this;
        };

        return promise;
    }

    private buildRequest(
        httpMethod: string,
        url: string,
        queryParams: { [key: string]: any },
        headerParams: { [key: string]: any },
        formParams: { [key: string]: any },
        // eslint-disable-next-line @typescript-eslint/ban-types
        bodyParam: string | Object,
        contentType: string,
        accept: string,
        responseType: string,
        eventEmitter: EventEmitterInstance,
        returnType: string,
        securityOptions: SecurityOptions
    ): AxiosRequestConfig {
        const { isBpmRequest, authentications, defaultHeaders = {}, enableCsrf, withCredentials = false } = securityOptions;

        const config: AxiosRequestConfig = {
            method: httpMethod as any,
            url,
            params: AxiosHttpClient.normalizeParams(queryParams),
            headers: {
                ...defaultHeaders,
                ...AxiosHttpClient.normalizeParams(headerParams)
            },
            timeout: typeof this.timeout === 'number' ? this.timeout : this.timeout?.response,
            withCredentials
        };

        // apply authentications
        this.applyAuthToRequest(config, authentications);

        if (isBpmRequest && enableCsrf) {
            this.setCsrfToken(config);
        }

        // add cookie for activiti
        if (isBpmRequest) {
            config.withCredentials = true;
            if (securityOptions.authentications.cookie) {
                if (!isBrowser()) {
                    config.headers = {
                        ...config.headers,
                        Cookie: securityOptions.authentications.cookie
                    };
                }
            }
        }

        if (contentType && contentType !== 'multipart/form-data') {
            config.headers = {
                ...config.headers,
                'Content-Type': contentType
            };
        } else if (!config.headers?.['Content-Type'] && contentType !== 'multipart/form-data') {
            config.headers = {
                ...config.headers,
                'Content-Type': 'application/json'
            };
        }

        if (contentType === 'application/x-www-form-urlencoded') {
            const params = new URLSearchParams();
            const normalizedParams = AxiosHttpClient.normalizeParams(formParams);
            Object.keys(normalizedParams).forEach((key) => {
                params.append(key, normalizedParams[key]);
            });
            config.data = params;

            config.onUploadProgress = (progressEvent) => {
                this.progress(progressEvent, eventEmitter);
            };
        } else if (contentType === 'multipart/form-data') {
            const formData = new FormData();
            const _formParams = AxiosHttpClient.normalizeParams(formParams);
            for (const key in _formParams) {
                if (Object.prototype.hasOwnProperty.call(_formParams, key)) {
                    if (AxiosHttpClient.isFileParam(_formParams[key])) {
                        // file field
                        formData.append(key, _formParams[key]);
                    } else {
                        formData.append(key, _formParams[key]);
                    }
                }
            }
            config.data = formData;
            // Remove Content-Type header for multipart/form-data to let axios set the boundary
            delete config.headers['Content-Type'];

            config.onUploadProgress = (progressEvent) => {
                this.progress(progressEvent, eventEmitter);
            };
        } else if (bodyParam) {
            config.data = bodyParam;

            config.onUploadProgress = (progressEvent) => {
                this.progress(progressEvent, eventEmitter);
            };
        }

        if (accept) {
            config.headers = {
                ...config.headers,
                Accept: accept
            };
        }

        if (returnType === 'blob' || returnType === 'Blob' || responseType === 'blob' || responseType === 'Blob') {
            config.responseType = 'blob';
        } else if (returnType === 'String') {
            config.responseType = 'text';
        }

        return config;
    }

    setCsrfToken(config: AxiosRequestConfig): void {
        const token = AxiosHttpClient.createCSRFToken();
        config.headers = {
            ...config.headers,
            'X-CSRF-TOKEN': token
        };

        if (!isBrowser()) {
            config.headers = {
                ...config.headers,
                Cookie: `CSRF-TOKEN=${token};path=/`
            };
        }

        try {
            document.cookie = `CSRF-TOKEN=${token};path=/`;
        } catch (err) {
            /* continue regardless of error */
        }
    }

    /**
     * Applies authentication headers to the request.
     * @param config The axios request config object.
     * @param authentications authentications
     */
    private applyAuthToRequest(config: AxiosRequestConfig, authentications: Authentication) {
        if (authentications) {
            switch (authentications.type) {
                case 'basic': {
                    const basicAuth: BasicAuth = authentications.basicAuth;
                    if (basicAuth.username || basicAuth.password) {
                        config.auth = {
                            username: basicAuth.username || '',
                            password: basicAuth.password || ''
                        };
                    }
                    break;
                }
                case 'activiti': {
                    if (authentications.basicAuth.ticket) {
                        config.headers = {
                            ...config.headers,
                            Authorization: authentications.basicAuth.ticket
                        };
                    }
                    break;
                }
                case 'oauth2': {
                    const oauth2: Oauth2 = authentications.oauth2;
                    if (oauth2.accessToken) {
                        config.headers = {
                            ...config.headers,
                            Authorization: `Bearer ${oauth2.accessToken}`
                        };
                    }
                    break;
                }
                default:
                    throw new Error('Unknown authentication type: ' + authentications.type);
            }
        }
    }

    private progress(event: ProgressEvent | unknown, eventEmitter: EventEmitterInstance): void {
        if (isProgressEvent(event)) {
            const percent = Math.round((event.loaded / event.total) * 100);

            const progress = {
                total: event.total,
                loaded: event.loaded,
                percent
            };

            eventEmitter.emit('progress', progress);
        }
    }

    private static createCSRFToken(a?: any): string {
        return a
            ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
            : ([1e16] + (1e16).toString()).replace(/[01]/g, AxiosHttpClient.createCSRFToken);
    }

    /**
     * Deserializes an HTTP response body into a value of the specified type.
     * @param response An Axios response object.
     * @param returnType The type to return. Pass a string for simple types
     * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
     * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
     * all properties on <code>data<code> will be converted to this type.
     * @returns A value of the specified type.
     */
    private static deserialize(response: AxiosResponse, returnType?: any): any {
        if (response === null) {
            return null;
        }

        let data = response.data;

        if (data === null) {
            data = response.statusText;
        }

        if (returnType) {
            if (returnType === 'blob' && isBrowser()) {
                data = new Blob([data], { type: response.headers['content-type'] });
            } else if (returnType === 'blob' && !isBrowser()) {
                data = Buffer.from(data, 'binary');
            } else if (Array.isArray(data)) {
                data = data.map((element) => new returnType(element));
            } else {
                data = new returnType(data);
            }
        }

        return data;
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
                if (AxiosHttpClient.isFileParam(value) || Array.isArray(value)) {
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
