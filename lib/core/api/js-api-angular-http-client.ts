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
    RequestOptions,
    SecurityOptions
} from '@alfresco/js-api';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

type EventListener = (...args: any[]) => void;
type EmitterMethod = (type: string, listener: EventListener) => void;

interface Emitter {
    emit(type: string, ...args: any[]): void;
    off: EmitterMethod;
    on: EmitterMethod;
    once: EmitterMethod;
}


@Injectable({
    providedIn: 'root'
})
export class JsApiAngularHttpClient implements JsApiHttpClient {

    constructor(private httpClient: HttpClient) {}

    request<T = any>(url: string, options: RequestOptions, _sc: SecurityOptions, emitter: Emitter): Promise<T> {

        const responseType = this.getResponseType(options);
        const params = new HttpParams({ fromObject: this.removeUndefinedValues(options.queryParams) });

        const request = this.httpClient.request(
            options.httpMethod,
            url,
            {
            ...(options.bodyParam ? { body: options.bodyParam } : {}),
            ...(options.headerParams ? { headers: new HttpHeaders(options.headerParams) } : {}),
            observe: 'body',
            ...(options.queryParams ? { params } : {}),
            ...(responseType ? { responseType } : {})
        });

        // if (securityOptions.isBpmRequest) {
        //     if (response.header && response.header.hasOwnProperty('set-cookie')) {
        //         this.authCookie = response.header['set-cookie'][0];
        //     }
        // }

        return this.requestWithLegacyEventEmitters<T>(request, emitter);
    }

    private requestWithLegacyEventEmitters<T = any>(request$: Observable<T>, emitter: Emitter): Promise<T> {

        const abort$ = new Subject<void>();

        const promise = request$.pipe(
            map((res: T) => {
                emitter.emit('success', res);
                return res;
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
            console.log(`%c DEBUG:IM HERE -> on`, 'color: orange');
            emitter.on.apply(emitter, arguments);
            return this;
        };

        (promise as any).once = function() {
            console.log(`%c DEBUG:IM HERE -> once`, 'color: orange');
            emitter.once.apply(emitter, arguments);
            return this;
        };

        (promise as any).emit = function() {
            console.log(`%c DEBUG:IM HERE -> emit`, 'color: orange');
            emitter.emit.apply(emitter, arguments);
            return this;
        };

        (promise as any).off = function() {
            console.log(`%c DEBUG:IM HERE -> off`, 'color: orange');
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


    post<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitter: Emitter): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'POST',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, emitter);
    }

    put<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitter: Emitter): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'PUT',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, emitter);
    }

    get<T = any>(url: string, options: RequestOptions, sc: SecurityOptions, emitter: Emitter): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'GET',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, emitter);
    }

    delete<T = void>(url: string, options: RequestOptions, sc: SecurityOptions, emitter: Emitter): Promise<T> {
        return this.request<T>(url, {
            ...options,
            httpMethod: 'DELETE',
            contentTypes: options.contentTypes || ['application/json'],
            accepts: options.accepts || ['application/json']
        }, sc, emitter);
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

        if (isBlobType) {
            return 'blob';
        } else if (options.returnType === 'String') {
            return 'text';
        }

        return null;
    }
}
