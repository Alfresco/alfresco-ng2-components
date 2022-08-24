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

import { Emitters, HttpClient as JsApiHttpClient, RequestOptions, SecurityOptions } from '@alfresco/js-api';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpResponse, HttpUploadProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { JsApiHttpParamEncoder } from './js-api-http-param-encoder';
import { LegacyResponseError } from './legacy-response-error';

declare const Blob: any;
declare const Buffer: any;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' ;

const isHttpUploadProgressEvent = <T>(val: HttpEvent<T>): val is HttpUploadProgressEvent => val?.type === HttpEventType.UploadProgress;
const isHttpResponseEvent = <T>(val: HttpEvent<T>): val is HttpResponse<T> => val?.type === HttpEventType.Response;
const isDate = (value: any): value is Date => value instanceof Date;
const isBrowser = (): boolean => typeof window !== 'undefined' && typeof window.document !== 'undefined';

@Injectable({
    providedIn: 'root'
})
export class JsApiAngularHttpClient implements JsApiHttpClient {

    constructor(private httpClient: HttpClient) {}

    request<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: Emitters): Promise<T> {

        const responseType = JsApiAngularHttpClient.getResponseType(options);

        const contentType = options.contentTypes ? options.contentTypes[0] : undefined;
        const isFormData = contentType === 'multipart/form-data';

        const optionsHeaders = {
            ...options.headerParams,
            ...(options.accepts?.length && { Accept: options.accepts.join(',') }),
            ...((contentType) && { 'Content-Type': contentType })
        };

        const params = options.queryParams ? JsApiAngularHttpClient.convertObjectToHttpParams(options.queryParams) : {};
        const isFormType = contentType === 'application/x-www-form-urlencoded';

        const body = isFormData
            ? JsApiAngularHttpClient.convertToFormData(options.formParams)
            : isFormType
                ? new HttpParams({ fromObject: JsApiAngularHttpClient.removeUndefinedValues(options.formParams) })
                : options.bodyParam;

        const headers = new HttpHeaders(optionsHeaders);

        const request = this.httpClient.request(
            options.httpMethod,
            url,
            {
                ...(body && { body }),
                ...(responseType ? { responseType } : {}),
                ...(sc.withCredentials && { withCredentials: true }),
                headers,
                params,
                observe: 'events',
                reportProgress: true
            }
        );

        return this.requestWithLegacyEventEmitters<T>(request, emitters, options.returnType);
    }

    post<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, emitters, 'POST');
    }

    put<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, emitters, 'PUT');
    }

    get<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, emitters, 'GET');
    }

    delete<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: Emitters): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, emitters, 'DELETE');
    }

    private requestBuilder<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, emitters: Emitters, httpMethod: HttpMethod): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod,
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, emitters);
    }

    private requestWithLegacyEventEmitters<T = any>(request$: Observable<HttpEvent<T>>, emitters: Emitters, returnType: any): Promise<T> {

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
                    return JsApiAngularHttpClient.deserialize(res, returnType);
                }

                return res;

            }),
            catchError((err: HttpErrorResponse): Observable<LegacyResponseError> => {

                // since we can't always determinate ahead of time if the response is xml or String type,
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

                // some more backwards compatibility magic :) to handle cases like
                // return this.blobService.convert2Json(response.error.response.body)

                const errorResponse = {
                    response: {
                        ...err,
                        body: err.error
                    }
                };

                const error = new LegacyResponseError(msg, err.status, errorResponse);

                return throwError(error);
            }),
            takeUntil(abort$)
        ).toPromise();

        // for Legacy backward compatibility

        (promise as any).abort = function() {
            eventEmitter.emit('abort');
            abort$.next();
            abort$.complete();
            return this;
        };

        return promise;
    }

    private static convertObjectToHttpParams(obj: {[key: string]: unknown}): HttpParams {

        let httpParams = new HttpParams({
            encoder: new JsApiHttpParamEncoder()
        });

        const params = JsApiAngularHttpClient.removeUndefinedValues(obj);

        for (const key in params) {

            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const value = params[key];
                if (value instanceof Array) {
                    const array = value.map(JsApiAngularHttpClient.convertParamsToString);
                    httpParams = httpParams.appendAll({
                        [key]: array
                    });
                } else {
                    httpParams = httpParams.append(key, JsApiAngularHttpClient.convertParamsToString(value));
                }
            }
        }

        return httpParams;
    }

    private static convertParamsToString(value: any): any {
        return isDate(value) ? value.toISOString() : value;
    }

    private static convertToFormData(formParams: {[key: string]: any}): FormData {

        const formData = new FormData();

        for (const key in formParams) {
            if (Object.prototype.hasOwnProperty.call(formParams, key)) {
                const value = formParams[key];
                if (value instanceof File) {
                    formData.append(key, value, value.name);
                } else {
                    formData.append(key, value);
                }
            }
        }

        return formData;
    }

    private static removeUndefinedValues(obj: {[key: string]: unknown}) {

        if(!obj) {
            return {};
        }

        return Object.keys(obj).reduce((acc, key) => {
            const value = obj[key];
            const isNil = value === undefined || value === null;
            return isNil ? acc : { ...acc, [key]: value };
        }, {});
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
    private static deserialize<T>(response: HttpResponse<T>, returnType?: any): any {

        if (response.body && returnType) {
            if (returnType === 'blob') {
                return JsApiAngularHttpClient.deserializeBlobResponse(response);
            } else if (Array.isArray(response.body)) {
                return response.body.map((element) => new returnType(element));
            }

            return new returnType(response.body);
        }

        // for backwards compatibility we need to return empty string instead of null,
        // to avoid issues when accessing response values would break application [C309878]
        /*
            return this.post(apiUrl, saveFormRepresentation).pipe(
                map((res: any) => res.entry)
            );
        */
        return response.body !== null ? response.body : '';
    }

    private static deserializeBlobResponse<T>(response: HttpResponse<T>) {

        if (isBrowser()) {
            return new Blob([response.body], { type: response.headers.get('Content-Type') });
        }

        return new Buffer.from(response.body, 'binary');
    }
}
