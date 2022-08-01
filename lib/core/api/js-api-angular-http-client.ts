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
    Emitter as JsEmitter,
    RequestOptions,
    SecurityOptions
} from '@alfresco/js-api';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

declare const Blob: any;
declare const Buffer: any;

export const isBrowser = (): boolean => typeof window !== 'undefined' && typeof window.document !== 'undefined';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' ;

@Injectable({
    providedIn: 'root'
})
export class JsApiAngularHttpClient implements JsApiHttpClient {

    constructor(private httpClient: HttpClient) {}

    request<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter): Promise<T> {

        const responseType = this.getResponseType(options);
        const params = new HttpParams({ fromObject: this.removeUndefinedValues(options.queryParams) });

        const headers = this.getRequestHeaders(options, sc);

        const request = this.httpClient.request(
            options.httpMethod,
            url,
            {
            ...(options.bodyParam ? { body: options.bodyParam } : {}),
            headers,
            ...(options.queryParams ? { params } : {}),
            ...(responseType ? { responseType } : {}),
            observe: 'response'
        });

        return this.requestWithLegacyEventEmitters<T>(request, eventEmitter, options.returnType);
    }

    private getRequestHeaders(options: RequestOptions, sc: SecurityOptions): HttpHeaders {
        const headers = new HttpHeaders(options.headerParams || {});

        const type = sc.authentications.type?.toLowerCase();

        switch (type) {
            case 'basic':
                return headers.set('Authorization', 'Basic ' + btoa(sc.authentications.basicAuth.password));
            case 'activiti': {
                if (sc.authentications.basicAuth.ticket) {
                    return headers.set('Authorization', 'Basic ' + btoa(sc.authentications.basicAuth.ticket));
                }
                return headers;
            };
            default:
                return headers;
        }
    }

    post<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, 'POST');
    }

    put<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, 'PUT');
    }

    get<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, 'GET');
    }

    delete<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter): Promise<T> {
        return this.requestBuilder<T>(url, options, sc, eventEmitter, 'DELETE');
    }

    private requestBuilder<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, eventEmitter: JsEmitter, httpMethod: HttpMethod): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod,
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, eventEmitter);
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
        const isDefaultSuperAgentType = !options.responseType && !options.returnType;

        if (isBlobType) {
            return 'blob';
        } else if (options.returnType === 'String' || isDefaultSuperAgentType) {
            return 'text';
        }

        return null;
    }

    private requestWithLegacyEventEmitters<T = any>(request$: Observable<HttpResponse<T>>, emitter: JsEmitter, returnType: any): Promise<T> {

        const abort$ = new Subject<void>();

        const promise = request$.pipe(
            map((res) => {
                emitter.emit('success', res.body);

                return JsApiAngularHttpClient.deserialize(res.body, returnType);
            }),
            catchError((err: HttpErrorResponse) => {
                emitter.emit('error', err);

                if (err.status === 401) {
                    emitter.emit('unauthorized');
                }

                return throwError(err);
            }),
            takeUntil(abort$)
        ).toPromise();

        // for Legacy backward compatibility

        (promise as any).on = function() {
            emitter.on.apply(emitter, arguments);
            return this;
        };

        (promise as any).once = function() {
            emitter.once.apply(emitter, arguments);
            return this;
        };

        (promise as any).emit = function() {
            emitter.emit.apply(emitter, arguments);
            return this;
        };

        (promise as any).off = function() {
            emitter.off.apply(emitter, arguments);
            return this;
        };

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

        // if (res.type === 'text/html') {
        //     return JsApiAngularHttpClient.deserialize(res);
        //     returnType = undefined;
        // }

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
