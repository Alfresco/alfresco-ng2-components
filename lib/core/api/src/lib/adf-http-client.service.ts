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

import { SHOULD_ADD_AUTH_TOKEN } from '@alfresco/adf-core/auth';
import { Emitters as JsApiEmitters, HttpClient as JsApiHttpClient } from '@alfresco/js-api';
import { HttpClient, HttpContext, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import {
    convertObjectToFormData,
    getQueryParamsWithCustomEncoder,
    isBlobResponse,
    isConstructor,
    isHttpResponseEvent,
    isHttpUploadProgressEvent,
    removeNilValues
} from './alfresco-api/alfresco-api.utils';
import { AlfrescoApiParamEncoder } from './alfresco-api/alfresco-api.param-encoder';
import { AlfrescoApiResponseError } from './alfresco-api/alfresco-api.response-error';
import { Constructor } from './types';
import { RequestOptions, SecurityOptions } from './interfaces';
import ee, { Emitter } from 'event-emitter';

export interface Emitters {
    readonly eventEmitter: Emitter;
    readonly apiClientEmitter: Emitter;
}

@Injectable({
    providedIn: 'root'
})
export class AdfHttpClient implements ee.Emitter, JsApiHttpClient {
    on: ee.EmitterMethod;
    off: ee.EmitterMethod;
    once: ee.EmitterMethod;
    _disableCsrf: boolean;

    emit: (type: string, ...args: any[]) => void;

    get disableCsrf(): boolean {
        return this._disableCsrf;
    }

    set disableCsrf(disableCsrf: boolean) {
        this._disableCsrf = disableCsrf;
    }

    private defaultSecurityOptions = {
        withCredentials: true,
        isBpmRequest: false,
        authentications: {},
        defaultHeaders: {}
    };

    constructor(private httpClient: HttpClient) {
        ee(this);
    }

    setDefaultSecurityOption(options: any) {
        this.defaultSecurityOptions = this.merge(this.defaultSecurityOptions, options);
    }

    merge(...objects): any {
        const result = {};

        objects.forEach((source) => {
            Object.keys(source).forEach((prop) => {
                if (prop in result && Array.isArray(result[prop])) {
                    result[prop] = result[prop].concat(source[prop]);
                } else if (prop in result && typeof result[prop] === 'object') {
                    result[prop] = this.merge(result[prop], source[prop]);
                } else {
                    result[prop] = source[prop];
                }
            });
        });

        return result;
    }

    request<T = any>(url: string, options?: RequestOptions, sc: SecurityOptions = this.defaultSecurityOptions, emitters?: JsApiEmitters): Promise<T> {
        const body = AdfHttpClient.getBody(options);
        const params = getQueryParamsWithCustomEncoder(options.queryParams, new AlfrescoApiParamEncoder());
        const responseType = AdfHttpClient.getResponseType(options);
        const context = new HttpContext().set(SHOULD_ADD_AUTH_TOKEN, true);
        const security: SecurityOptions = { ...this.defaultSecurityOptions, ...sc };
        const headers = this.getHeaders(options);
        if (!emitters) {
            emitters = this.getEventEmitters();
        }

        const request = this.httpClient.request(options.httpMethod, url, {
            context,
            ...(body && { body }),
            ...(responseType && { responseType }),
            ...security,
            ...(params && { params }),
            headers,
            observe: 'events',
            reportProgress: true
        });

        return this.requestWithLegacyEventEmitters<T>(request, emitters, options.returnType);
    }

    post<T = any>(url: string, options?: RequestOptions, sc?: SecurityOptions, emitters?: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'POST' }, sc, emitters);
    }

    put<T = any>(url: string, options?: RequestOptions, sc?: SecurityOptions, emitters?: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'PUT' }, sc, emitters);
    }

    get<T = any>(url: string, options?: RequestOptions, sc?: SecurityOptions, emitters?: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'GET' }, sc, emitters);
    }

    delete<T = void>(url: string, options?: RequestOptions, sc?: SecurityOptions, emitters?: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'DELETE' }, sc, emitters);
    }

    private addPromiseListeners<T = any>(promise: Promise<T>, eventEmitter: any) {
        const eventPromise = Object.assign(promise, {
            on() {
                // eslint-disable-next-line prefer-spread, prefer-rest-params
                eventEmitter.on.apply(eventEmitter, arguments);
                return this;
            },
            once() {
                // eslint-disable-next-line prefer-spread, prefer-rest-params
                eventEmitter.once.apply(eventEmitter, arguments);
                return this;
            },
            emit() {
                // eslint-disable-next-line prefer-spread, prefer-rest-params
                eventEmitter.emit.apply(eventEmitter, arguments);
                return this;
            },
            off() {
                // eslint-disable-next-line prefer-spread, prefer-rest-params
                eventEmitter.off.apply(eventEmitter, arguments);
                return this;
            }
        });

        return eventPromise;
    }

    private getEventEmitters(): Emitters {
        const apiClientEmitter = {
            on: this.on.bind(this),
            off: this.off.bind(this),
            once: this.once.bind(this),
            emit: this.emit.bind(this)
        };

        return {
            apiClientEmitter,
            eventEmitter: ee({})
        };
    }

    private requestWithLegacyEventEmitters<T = any>(request$: Observable<HttpEvent<T>>, emitters: JsApiEmitters, returnType: any): Promise<T> {
        const abort$ = new Subject<void>();
        const { eventEmitter, apiClientEmitter } = emitters;

        const promise = request$
            .pipe(
                map((res) => {
                    if (isHttpUploadProgressEvent(res)) {
                        const percent = Math.round((res.loaded / res.total) * 100);
                        eventEmitter.emit('progress', { loaded: res.loaded, total: res.total, percent });
                    }

                    if (isHttpResponseEvent(res)) {
                        eventEmitter.emit('success', res.body);
                        return AdfHttpClient.deserialize(res, returnType);
                    }
                }),
                catchError((err: HttpErrorResponse): Observable<AlfrescoApiResponseError> => {
                    // since we can't always determinate ahead of time if the response is going to be xml or plain text response
                    // we need to handle false positive cases here.

                    if (err.status === 200) {
                        eventEmitter.emit('success', err.error.text);
                        return of(err.error.text);
                    }

                    eventEmitter.emit('error', err);
                    apiClientEmitter.emit('error', { ...err, response: { req: err } });

                    if (err.status === 401) {
                        eventEmitter.emit('unauthorized');
                        apiClientEmitter.emit('unauthorized');
                    }

                    // for backwards compatibility we need to convert it to error class as the HttpErrorResponse only implements Error interface, not extending it,
                    // and we need to be able to correctly pass instanceof Error conditions used inside repository
                    // we also need to pass error as Stringify string as we are detecting statusCodes using JSON.parse(error.message) in some places
                    const msg = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);

                    // for backwards compatibility to handle cases in code where we try read response.error.response.body;

                    const error = {
                        ...err,
                        body: err.error
                    };

                    const alfrescoApiError = new AlfrescoApiResponseError(msg, err.status, error);
                    return throwError(alfrescoApiError);
                }),
                takeUntil(abort$)
            )
            .toPromise();

        (promise as any).abort = function () {
            eventEmitter.emit('abort');
            abort$.next();
            abort$.complete();
            return this;
        };

        return this.addPromiseListeners(promise, eventEmitter);
    }

    private static getBody(options: RequestOptions): any {
        const contentType = options.contentType ? options.contentType : AdfHttpClient.jsonPreferredMime(options.contentTypes);
        const isFormData = contentType === 'multipart/form-data';
        const isFormUrlEncoded = contentType === 'application/x-www-form-urlencoded';
        const body = options.bodyParam;

        if (isFormData) {
            return convertObjectToFormData(options.formParams);
        }

        if (isFormUrlEncoded) {
            return new HttpParams({ fromObject: removeNilValues(options.formParams) });
        }

        return body;
    }

    private getHeaders(options: RequestOptions): HttpHeaders {
        const contentType = options.contentType || AdfHttpClient.jsonPreferredMime(options.contentTypes);
        const accept = options.accept || AdfHttpClient.jsonPreferredMime(options.accepts);

        const optionsHeaders = {
            ...options.headerParams,
            ...(accept && { Accept: accept }),
            ...(contentType && { 'Content-Type': contentType })
        };

        if (!this.disableCsrf) {
            this.setCsrfToken(optionsHeaders);
        }

        return new HttpHeaders(optionsHeaders);
    }

    /**
     * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
     *
     * @param contentTypes a contentType array
     * @returns  The chosen content type, preferring JSON.
     */
    private static jsonPreferredMime(contentTypes: readonly string[]): string {
        if (!contentTypes?.length) {
            return 'application/json';
        }

        for (let i = 0; i < contentTypes.length; i++) {
            if (AdfHttpClient.isJsonMime(contentTypes[i])) {
                return contentTypes[i];
            }
        }
        return contentTypes[0];
    }

    /**
     * Checks whether the given content type represents JSON.<br>
     * JSON content type examples:<br>
     * <ul>
     * <li>application/json</li>
     * <li>application/json; charset=UTF8</li>
     * <li>APPLICATION/JSON</li>
     * </ul>
     *
     * @param contentType The MIME content type to check.
     * @returns <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
     */
    private static isJsonMime(contentType: string): boolean {
        return Boolean(contentType?.match(/^application\/json(;.*)?$/i));
    }

    private setCsrfToken(optionsHeaders: any) {
        const token = this.createCSRFToken();
        optionsHeaders['X-CSRF-TOKEN'] = token;

        try {
            document.cookie = 'CSRF-TOKEN=' + token + ';path=/';
        } catch {
            /* continue regardless of error */
        }
    }

    private createCSRFToken(a?: any): string {
        const randomValue = AdfHttpClient.getSecureRandomValue();
        return a ? (a ^ ((randomValue * 16) >> (a / 4))).toString(16) : ([1e16] + (1e16).toString()).replace(/[01]/g, this.createCSRFToken);
    }

    private static getSecureRandomValue(): number {
        const max = Math.pow(2, 32);
        return window.crypto.getRandomValues(new Uint32Array(1))[0] / max;
    }

    private static getResponseType(options: RequestOptions): 'blob' | 'json' | 'text' {
        const isBlobType = options.returnType?.toString().toLowerCase() === 'blob' || options.responseType?.toString().toLowerCase() === 'blob';

        if (isBlobType) {
            return 'blob';
        }

        if (options.returnType === 'String') {
            return 'text';
        }

        return 'json';
    }

    /**
     * Deserialize an HTTP response body into a value of the specified type.
     *
     * @param response response object
     * @param returnType return type
     * @returns deserialized object
     */
    private static deserialize<T>(response: HttpResponse<T>, returnType?: Constructor<unknown> | 'blob'): any {
        if (response === null) {
            return null;
        }

        const body = response.body;

        if (!returnType) {
            // for backwards compatibility we need to return empty string instead of null,
            // to avoid issues when accessing null response would break application [C309878]
            // cannot read property 'entry' of null in cases like
            // return this.post(apiUrl, saveFormRepresentation).pipe(map((res: any) => res.entry))

            return body !== null ? body : '';
        }

        if (isBlobResponse(response, returnType)) {
            return AdfHttpClient.deserializeBlobResponse(response);
        }

        if (!isConstructor(returnType)) {
            return body;
        }

        if (Array.isArray(body)) {
            return body.map((element) => new returnType(element));
        }

        return new returnType(body);
    }

    private static deserializeBlobResponse(response: HttpResponse<Blob>) {
        return new Blob([response.body], { type: response.headers.get('Content-Type') });
    }
}
