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
    Emitter as JsEmitter, HttpClient as JsApiHttpClient, RequestOptions,
    SecurityOptions
} from '@alfresco/js-api';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpParams, HttpResponse, HttpUploadProgressEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

declare const Blob: any;
declare const Buffer: any;

export const isBrowser = (): boolean => typeof window !== 'undefined' && typeof window.document !== 'undefined';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' ;

const isHttpUploadProgressEvent = <T>(val: HttpEvent<T>): val is HttpUploadProgressEvent => val?.type === HttpEventType.UploadProgress;
const isHttpResponseEvent = <T>(val: HttpEvent<T>): val is HttpResponse<T> => val?.type === HttpEventType.Response;

@Injectable({
    providedIn: 'root'
})
export class JsApiAngularHttpClient implements JsApiHttpClient {

    constructor(private httpClient: HttpClient) {}

    request<T = any>(url: string, options: RequestOptions, _sc: SecurityOptions, eventEmitter: JsEmitter, globalEmitter: JsEmitter): Promise<T> {

        const responseType = this.getResponseType(options);

        const contentType = options.contentTypes ? options.contentTypes[0] : undefined;

        const optionsHeaders = {
            ...options.headerParams,
            ...(options.accepts?.length && { Accept: options.accepts.join(',') })
        };

        const params = options.queryParams ? new HttpParams({ fromObject: this.removeUndefinedValues(options.queryParams) }) : {};
        const isFormType = contentType === 'application/x-www-form-urlencoded';
        const isFormData = contentType === 'multipart/form-data';

        const body = isFormData ? this.convertToFormData(options.formParams) : isFormType ? new HttpParams({ fromObject: this.removeUndefinedValues(options.formParams) }) : options.bodyParam;

        const headers = new HttpHeaders(optionsHeaders);

        const request = this.httpClient.request(
            options.httpMethod,
            url,
            {
                body,
                headers,
                params,
                ...(responseType ? { responseType } : {}),
                observe: 'events',
                reportProgress: true
            }
        );

        return this.requestWithLegacyEventEmitters<T>(request, eventEmitter, globalEmitter, options.returnType);
    }


    private convertToFormData(formParams: {[key: string]: any}): FormData {

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

    post<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter, globalEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, globalEmitter, 'POST');
    }

    put<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter, globalEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, globalEmitter, 'PUT');
    }

    get<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter, globalEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, globalEmitter, 'GET');
    }

    delete<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter, globalEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, globalEmitter, 'DELETE');
    }

    private requestBuilder<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter, globalEmitter: JsEmitter, httpMethod: HttpMethod): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod,
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, eventEmitter, globalEmitter);
    }

    // Poor man's sanitizer
    private removeUndefinedValues(obj: {[key: string]: any}) {
        const newObj = {};

        if(obj) {
            Object.keys(obj).forEach((key) => {
                if (obj[key] === Object(obj[key])) {
                    newObj[key] = this.removeUndefinedValues(obj[key]);
                } else if (obj[key] !== undefined && obj[key] !== null) {
                    newObj[key] = obj[key];
                }
            });
        }

        return newObj;
    }

    private getResponseType(options: RequestOptions): 'arraybuffer' | 'blob' | 'json' | 'text' | null {

        const isBlobType = options.returnType?.toString().toLowerCase() === 'blob' || options.responseType?.toString().toLowerCase() === 'blob';
        // const isDefaultSuperAgentType = !options.responseType && !options.returnType;
        // const isFile = JsApiAngularHttpClient.isFileParam(options.formParams?.filedata);
        const isDefaultSuperAgentType = false;

        if (isBlobType) {
            return 'blob';
        }

        // if (isFile) {
        //     return 'arraybuffer';
        // }

        if (options.returnType === 'String' || isDefaultSuperAgentType) {
            return 'text';
        }

        return null;
    }

    // private static isFileParam(param: any): boolean {
    //     // Buffer in Node.js
    //     if (typeof Buffer === 'function' && (param instanceof Buffer || param?.path)) {
    //         return true;
    //     }
    //     // Blob in browser
    //     if (typeof Blob === 'function' && param instanceof Blob) {
    //         return true;
    //     }
    //     // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    //     if (typeof File === 'function' && param instanceof File) {
    //         return true;
    //     }
    //     // Safari fix
    //     if (typeof File === 'object' && param instanceof File) {
    //         return true;
    //     }

    //     return false;
    // }

    private requestWithLegacyEventEmitters<T = any>(request$: Observable<HttpEvent<T>>, emitter: JsEmitter, globalEmitter: JsEmitter, returnType: any): Promise<T> {

        const abort$ = new Subject<void>();

        const promise = request$.pipe(
            map((res) => {

                if (isHttpUploadProgressEvent(res)) {
                    const percent = Math.round((res.loaded / res.total) * 100);
                    emitter.emit('progress', { loaded: res.loaded, total: res.total, percent });
                }

                if (isHttpResponseEvent(res)) {
                    emitter.emit('success', res.body);
                    return JsApiAngularHttpClient.deserialize(res.body, returnType);
                }

                return res;

            }),
            catchError((err: HttpErrorResponse) => {
                emitter.emit('error', err);
                globalEmitter.emit('error', err);

                if (err.status === 401) {
                    emitter.emit('unauthorized');
                    globalEmitter.emit('unauthorized');
                }

                return throwError(err);
            }),
            takeUntil(abort$)
        ).toPromise();

        // for Legacy backward compatibility

        (promise as any).abort = function() {
            emitter.emit('abort');
            abort$.next();
            abort$.complete();
            return this;
        };

        return promise;
    }

    /**
     * Deserialize an HTTP response body into a value of the specified type.
     */
     private static deserialize(response: any, returnType?: any): any {

        if (response && returnType) {
            if (returnType === 'blob') {
                return JsApiAngularHttpClient.deserializeBlobResponse(response);
            } else if (Array.isArray(response)) {
                return response.map((element) => new returnType(element));
            }

            return new returnType(response);
        }

        return response;
    }

    private static deserializeBlobResponse(response: any) {

        if (isBrowser()) {
            return new Blob([response], { type: response.header['content-type'] });
        }

        return new Buffer.from(response, 'binary');
    }
}
