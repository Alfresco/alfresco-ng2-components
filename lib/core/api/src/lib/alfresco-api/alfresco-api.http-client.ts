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

import { SHOULD_ADD_AUTH_TOKEN } from '@alfresco/adf-core/auth';
import { Emitters as JsApiEmitters, HttpClient as JsApiHttpClient, RequestOptions, SecurityOptions, isBrowser } from '@alfresco/js-api';
import { HttpClient, HttpContext, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { convertObjectToFormData, getQueryParamsWithCustomEncoder, isBlobResponse, isConstructor, isHttpResponseEvent, isHttpUploadProgressEvent, removeNilValues } from './alfresco-api.utils';
import { AlfrescoApiParamEncoder } from './alfresco-api.param-encoder';
import { AlfrescoApiResponseError } from './alfresco-api.response-error';
import { Constructor } from '../types';

@Injectable({
    providedIn: 'root'
})
export class AlfrescoApiHttpClient implements JsApiHttpClient {

    constructor(private httpClient: HttpClient) {}

    request<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: JsApiEmitters): Promise<T> {
        const body = AlfrescoApiHttpClient.getBody(options);
        const params = getQueryParamsWithCustomEncoder(options.queryParams, new AlfrescoApiParamEncoder());
        const headers = AlfrescoApiHttpClient.getHeaders(options);
        const responseType = AlfrescoApiHttpClient.getResponseType(options);
        const context = new HttpContext().set(SHOULD_ADD_AUTH_TOKEN, true);

        const request = this.httpClient.request(
            options.httpMethod,
            url,
            {
                context,
                ...(body && { body }),
                ...(responseType && { responseType }),
                ...(sc.withCredentials && { withCredentials: true }),
                ...(params && { params }),
                headers,
                observe: 'events',
                reportProgress: true
            }
        );

        return this.requestWithLegacyEventEmitters<T>(request, emitters, options.returnType);
    }

    post<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'POST' }, sc, emitters);
    }

    put<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'PUT' }, sc, emitters);
    }

    get<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'GET' }, sc, emitters);
    }

    delete<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: JsApiEmitters): Promise<T> {
        return this.request<T>(url, { ...options, httpMethod: 'DELETE' }, sc, emitters);
    }

    private requestWithLegacyEventEmitters<T = any>(request$: Observable<HttpEvent<T>>, emitters: JsApiEmitters, returnType: any): Promise<T> {

        const abort$ = new Subject<void>();
        const { eventEmitter, apiClientEmitter } = emitters;

        const promise = request$.pipe(
            map((res) => {
                if (isHttpUploadProgressEvent(res)) {
                    const percent = Math.round((res.loaded / res.total) * 100);
                    eventEmitter.emit('progress', { loaded: res.loaded, total: res.total, percent });
                }

                if (isHttpResponseEvent(res)) {
                    eventEmitter.emit('success', res.body);
                    return AlfrescoApiHttpClient.deserialize(res, returnType);
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
                apiClientEmitter.emit('error', err);

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
                    response: { ...err, body: err.error }
                };

                const alfrescoApiError = new AlfrescoApiResponseError(msg, err.status, error);

                return throwError(alfrescoApiError);
            }),
            takeUntil(abort$)
        ).toPromise();

        (promise as any).abort = function() {
            eventEmitter.emit('abort');
            abort$.next();
            abort$.complete();
            return this;
        };

        return promise;
    }

    private static getBody(options: RequestOptions): any {
        const contentType = options.contentType;
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

    private static getHeaders(options: RequestOptions): HttpHeaders {
        const optionsHeaders = {
            ...options.headerParams,
            ...(options.accept && { Accept: options.accept }),
            ...((options.contentType) && { 'Content-Type': options.contentType })
        };

        return new HttpHeaders(optionsHeaders);
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
            return AlfrescoApiHttpClient.deserializeBlobResponse(response);
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

        if (isBrowser()) {
            return new Blob([response.body], { type: response.headers.get('Content-Type') });
        }

        return Buffer.from(response.body as unknown as WithImplicitCoercion<string>, 'binary');
    }
}

