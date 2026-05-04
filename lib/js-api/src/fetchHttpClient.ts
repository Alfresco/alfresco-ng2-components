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

import { Authentication } from './authentication/authentication';
import { RequestOptions, HttpClient, SecurityOptions, Emitters } from './api-clients/http-client.interface';
import { Oauth2 } from './authentication/oauth2';
import { BasicAuth } from './authentication/basicAuth';
import { isBrowser, paramToString } from './utils';

declare const Blob: any;
declare const Buffer: any;
declare const process: any;
declare const XMLHttpRequest: any;

export class FetchHttpClient implements HttpClient {
    timeout: number | { deadline?: number; response?: number } = undefined;
    private readonly customFetch?: typeof fetch;

    constructor(customFetch?: typeof fetch) {
        this.customFetch = customFetch;
    }

    private getFetch(): typeof fetch {
        // eslint-disable-next-line no-underscore-dangle
        return this.customFetch || (process as any).__test_fetch__ || globalThis.fetch;
    }

    private hasNativeXhr(): boolean {
        // eslint-disable-next-line no-underscore-dangle
        if (this.customFetch || (process as any).__test_fetch__) {
            return false;
        }
        return typeof XMLHttpRequest !== 'undefined';
    }

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
        const { httpMethod, queryParams, headerParams, formParams, bodyParam, contentType, accept, responseType, returnType } = options;

        const headers = this.buildHeaders(headerParams, securityOptions, contentType, accept);
        const queryString = FetchHttpClient.buildQueryString(queryParams);
        const fullUrl = queryString ? `${url}${url.includes('?') ? '&' : '?'}${queryString}` : url;
        const body = this.buildBody(contentType, formParams, bodyParam);
        const hasBody = body !== undefined && httpMethod !== 'GET' && httpMethod !== 'HEAD';
        const withCredentials = securityOptions.withCredentials || securityOptions.isBpmRequest;

        if (hasBody && this.hasNativeXhr()) {
            return this.requestWithXhr<T>(fullUrl, httpMethod, headers, body, withCredentials, returnType, responseType, securityOptions, emitters);
        }

        return this.requestWithFetch<T>(
            fullUrl,
            httpMethod,
            headers,
            hasBody ? body : undefined,
            withCredentials,
            returnType,
            responseType,
            securityOptions,
            emitters
        );
    }

    private requestWithFetch<T>(
        url: string,
        method: string,
        headers: Record<string, string>,
        body: any,
        withCredentials: boolean,
        returnType: string,
        responseType: string,
        securityOptions: SecurityOptions,
        emitters: Emitters
    ): Promise<T> {
        const { eventEmitter } = emitters;
        const controller = new AbortController();
        const timeoutMs = typeof this.timeout === 'number' ? this.timeout : this.timeout?.deadline;

        if (timeoutMs) {
            if (typeof AbortSignal.timeout === 'function') {
                AbortSignal.timeout(timeoutMs).addEventListener('abort', () => controller.abort());
            } else {
                setTimeout(() => controller.abort(), timeoutMs);
            }
        }

        const init: RequestInit = {
            method,
            headers,
            signal: controller.signal,
            credentials: withCredentials ? 'include' : 'same-origin'
        };

        if (body !== undefined) {
            init.body = body;
        }

        const fn = this.getFetch();

        const promise: any = new Promise<T>((resolve, reject) => {
            const execute = async () => {
                const response = await fn(url, init);

                if (!response.ok) {
                    const errorText = await response.text().catch(() => '');
                    const error: any = new Error(errorText || response.statusText);
                    error.status = response.status;
                    error.response = response;

                    FetchHttpClient.emitErrorEvents(error, response.status, emitters);
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject({ error, status: response.status, message: errorText || response.statusText });
                    return;
                }

                if (securityOptions.isBpmRequest) {
                    const setCookie = response.headers.get('set-cookie');
                    if (setCookie) {
                        securityOptions.authentications.cookie = setCookie;
                    }
                }

                const data = await this.deserializeResponse(response, returnType, responseType);
                eventEmitter.emit('success', data);
                resolve(data as T);
            };

            execute().catch((error: any) => {
                if (error.name === 'AbortError') {
                    eventEmitter.emit('abort');
                    reject(error);
                    return;
                }
                if (!error.status) {
                    FetchHttpClient.emitErrorEvents(error, 0, emitters);
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(error.status ? { error, status: error.status, message: error.message } : { error });
            });
        });

        promise.abort = () => {
            controller.abort();
            return promise;
        };

        return promise;
    }

    private requestWithXhr<T>(
        url: string,
        method: string,
        headers: Record<string, string>,
        body: any,
        withCredentials: boolean,
        returnType: string,
        responseType: string,
        securityOptions: SecurityOptions,
        emitters: Emitters
    ): Promise<T> {
        const { eventEmitter } = emitters;
        const timeoutMs = typeof this.timeout === 'number' ? this.timeout : this.timeout?.deadline;
        let xhr: any;

        const promise: any = new Promise<T>((resolve, reject) => {
            xhr = new XMLHttpRequest();
            xhr.open(method, url, true);

            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }

            if (withCredentials) {
                xhr.withCredentials = true;
            }

            if (timeoutMs) {
                xhr.timeout = timeoutMs;
            }

            if (returnType === 'blob' || returnType === 'Blob' || responseType === 'blob' || responseType === 'Blob' || returnType === 'Binary') {
                xhr.responseType = 'blob';
            }

            xhr.upload.onprogress = (event: any) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    eventEmitter.emit('progress', { total: event.total, loaded: event.loaded, percent });
                }
            };

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (securityOptions.isBpmRequest) {
                        const setCookie = xhr.getResponseHeader('set-cookie');
                        if (setCookie) {
                            securityOptions.authentications.cookie = setCookie;
                        }
                    }

                    const data = this.deserializeXhrResponse(xhr, returnType, responseType);
                    eventEmitter.emit('success', data);
                    resolve(data as T);
                } else {
                    const errorText = xhr.responseText || xhr.statusText;
                    const error: any = new Error(errorText);
                    error.status = xhr.status;
                    error.message = errorText;

                    FetchHttpClient.emitErrorEvents(error, xhr.status, emitters);
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject({ error, status: xhr.status, message: errorText });
                }
            };

            xhr.onerror = () => {
                const error = new Error('Network request failed');
                FetchHttpClient.emitErrorEvents(error, 0, emitters);
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ error });
            };

            xhr.onabort = () => {
                eventEmitter.emit('abort');
                reject(new DOMException('The operation was aborted.', 'AbortError'));
            };

            xhr.ontimeout = () => {
                const error = new Error('Request timed out');
                FetchHttpClient.emitErrorEvents(error, 0, emitters);
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ error });
            };

            xhr.send(body);
        });

        promise.abort = () => {
            if (xhr) {
                xhr.abort();
            }
            return promise;
        };

        return promise;
    }

    private deserializeXhrResponse(xhr: any, returnType: string, responseType: string): any {
        if (returnType === 'blob' || returnType === 'Blob' || responseType === 'blob' || responseType === 'Blob' || returnType === 'Binary') {
            return xhr.response;
        }

        if (returnType === 'String') {
            return xhr.responseText;
        }

        const contentType = xhr.getResponseHeader('content-type') || '';
        if (contentType.includes('text/html')) {
            return xhr.responseText;
        }

        try {
            const text = xhr.responseText;
            if (!text) {
                return {};
            }
            const data = JSON.parse(text);
            if (returnType && Array.isArray(data)) {
                return data.map((element: any) => new (returnType as any)(element));
            }
            if (returnType && typeof returnType === 'function') {
                return new (returnType as any)(data);
            }
            return data;
        } catch {
            return xhr.responseText || '';
        }
    }

    setCsrfToken(headers: Record<string, string>): void {
        const token = FetchHttpClient.createCSRFToken();
        headers['X-CSRF-TOKEN'] = token;

        if (!isBrowser()) {
            headers['Cookie'] = 'CSRF-TOKEN=' + token + ';path=/';
        }

        try {
            document.cookie = 'CSRF-TOKEN=' + token + ';path=/';
        } catch {
            /* continue regardless of error */
        }
    }

    private buildHeaders(
        headerParams: Record<string, any>,
        securityOptions: SecurityOptions,
        contentType: string,
        accept: string
    ): Record<string, string> {
        const headers: Record<string, string> = {
            ...securityOptions.defaultHeaders,
            ...FetchHttpClient.normalizeParams(headerParams)
        };

        this.applyAuthHeaders(headers, securityOptions.authentications);

        if (securityOptions.isBpmRequest && securityOptions.enableCsrf) {
            this.setCsrfToken(headers);
        }

        if (securityOptions.isBpmRequest && securityOptions.authentications.cookie && !isBrowser()) {
            headers['Cookie'] = headers['Cookie']
                ? headers['Cookie'] + '; ' + securityOptions.authentications.cookie
                : securityOptions.authentications.cookie;
        }

        if (contentType && contentType !== 'multipart/form-data') {
            headers['Content-Type'] = contentType;
        } else if (contentType !== 'multipart/form-data' && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        if (accept) {
            headers['Accept'] = accept;
        }

        return headers;
    }

    private buildBody(contentType: string, formParams: Record<string, any>, bodyParam: string | object): any {
        if (contentType === 'application/x-www-form-urlencoded') {
            const params = FetchHttpClient.normalizeParams(formParams);
            return new URLSearchParams(params).toString();
        }

        if (contentType === 'multipart/form-data') {
            const normalizedParams = FetchHttpClient.normalizeParams(formParams);
            const formData = new FormData();
            for (const [key, value] of Object.entries(normalizedParams)) {
                formData.append(key, value as any);
            }
            return formData;
        }

        if (bodyParam) {
            return typeof bodyParam === 'string' ? bodyParam : JSON.stringify(bodyParam);
        }

        return undefined;
    }

    private static emitErrorEvents(error: any, status: number, emitters: Emitters): void {
        const { eventEmitter, apiClientEmitter } = emitters;

        apiClientEmitter.emit('error', error);
        eventEmitter.emit('error', error);

        if (status === 401) {
            apiClientEmitter.emit('unauthorized');
            eventEmitter.emit('unauthorized');
        }

        if (status === 403) {
            apiClientEmitter.emit('forbidden');
            eventEmitter.emit('forbidden');
        }
    }

    private applyAuthHeaders(headers: Record<string, string>, authentications: Authentication): void {
        if (!authentications) {
            return;
        }

        switch (authentications.type) {
            case 'basic': {
                const basicAuth: BasicAuth = authentications.basicAuth;
                if (basicAuth.username || basicAuth.password) {
                    const encoded =
                        typeof btoa === 'function'
                            ? btoa((basicAuth.username || '') + ':' + (basicAuth.password || ''))
                            : Buffer.from((basicAuth.username || '') + ':' + (basicAuth.password || '')).toString('base64');
                    headers['Authorization'] = 'Basic ' + encoded;
                }
                break;
            }
            case 'activiti': {
                if (authentications.basicAuth.ticket) {
                    headers['Authorization'] = authentications.basicAuth.ticket;
                }
                break;
            }
            case 'oauth2': {
                const oauth2: Oauth2 = authentications.oauth2;
                if (oauth2.accessToken) {
                    headers['Authorization'] = 'Bearer ' + oauth2.accessToken;
                }
                break;
            }
            default:
                throw new Error('Unknown authentication type: ' + authentications.type);
        }
    }

    private async deserializeResponse(response: Response, returnType: string, responseType: string): Promise<any> {
        if (returnType === 'blob' || returnType === 'Blob' || responseType === 'blob' || responseType === 'Blob' || returnType === 'Binary') {
            const blob = await response.blob();
            if (isBrowser()) {
                return blob;
            }
            const arrayBuffer = await blob.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }

        if (returnType === 'String') {
            return response.text();
        }

        const contentTypeHeader = response.headers.get('content-type') || '';
        if (contentTypeHeader.includes('text/html')) {
            return response.text();
        }

        try {
            const text = await response.text();
            if (!text) {
                return {};
            }
            const data = JSON.parse(text);
            if (returnType && Array.isArray(data)) {
                return data.map((element: any) => new (returnType as any)(element));
            }
            if (returnType && typeof returnType === 'function') {
                return new (returnType as any)(data);
            }
            return data;
        } catch {
            return response.text().catch(() => '');
        }
    }

    private static createCSRFToken(): string {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
    }

    private static buildQueryString(params: Record<string, any>): string {
        if (!params) {
            return '';
        }
        const normalized = FetchHttpClient.normalizeParams(params);
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(normalized)) {
            if (Array.isArray(value)) {
                value.forEach((v: any) => searchParams.append(key, v));
            } else {
                searchParams.append(key, value);
            }
        }
        return searchParams.toString();
    }

    private static normalizeParams(params: Record<string, any>): Record<string, any> {
        if (!params) {
            return {};
        }
        const newParams: Record<string, any> = {};
        for (const [key, value] of Object.entries(params)) {
            if (value != null) {
                newParams[key] = FetchHttpClient.isFileParam(value) || Array.isArray(value) ? value : paramToString(value);
            }
        }
        return newParams;
    }

    private static isFileParam(param: any): boolean {
        if (typeof Buffer === 'function' && (param instanceof Buffer || param?.path)) {
            return true;
        }
        if (typeof Blob === 'function' && param instanceof Blob) {
            return true;
        }
        if (typeof File === 'function' && param instanceof File) {
            return true;
        }
        if (typeof File === 'object' && param instanceof File) {
            return true;
        }
        return false;
    }
}
