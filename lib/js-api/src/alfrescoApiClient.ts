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

import { EventEmitter } from 'eventemitter3';
import { AlfrescoApiConfig } from './alfrescoApiConfig';
import { Authentication } from './authentication/authentication';
import { SuperagentHttpClient } from './superagentHttpClient';
import { Emitters, HttpClient, LegacyHttpClient, RequestOptions, SecurityOptions } from './api-clients/http-client.interface';
import { paramToString } from './utils';
import { Storage } from './storage';

declare const Buffer: any;

export type AlfrescoApiClientPromise<T = any> = Promise<T> & {
    on: <K extends string | symbol>(event: K, fn: (...args: any[]) => void, context?: any) => AlfrescoApiClientPromise<T>;
    off: <K extends string | symbol>(event: K, fn?: (...args: any[]) => void, context?: any) => AlfrescoApiClientPromise<T>;
    once: <K extends string | symbol>(event: K, fn: (...args: any[]) => void, context?: any) => AlfrescoApiClientPromise<T>;
    emit: <K extends string | symbol>(event: K, ...args: any[]) => boolean;
    abort?: () => void;
};

/**
 * Builds a string representation of an array-type actual parameter, according to the given collection format.
 * @param param An array parameter.
 * @param collectionFormat The array element separator strategy.
 * @returns A string representation of the supplied collection, using the specified delimiter. Returns
 * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
 */
export function buildCollectionParam(param: string[], collectionFormat: string): string | any[] {
    if (!param) {
        return null;
    }

    switch (collectionFormat) {
        case 'csv':
            return param.map(paramToString).join(',');
        case 'ssv':
            return param.map(paramToString).join(' ');
        case 'tsv':
            return param.map(paramToString).join('\t');
        case 'pipes':
            return param.map(paramToString).join('|');
        case 'multi':
            // return the array directly as SuperAgent will handle it as expected
            return param.map(paramToString);
        default:
            throw new Error('Unknown collection format: ' + collectionFormat);
    }
}

export class AlfrescoApiClient implements LegacyHttpClient {
    private eventEmitter = new EventEmitter();

    storage: Storage;
    host: string;
    className: string;
    config: AlfrescoApiConfig;
    url: string;
    /**
     * The base URL against which to resolve every API call's (relative) path.
     */
    basePath = '';

    /**
     * The authentication methods to be included for all API calls.
     */
    authentications: Authentication = {
        basicAuth: {
            ticket: ''
        },
        type: 'basic'
    };
    /**
     * The default HTTP headers to be included for all API calls.
     */
    defaultHeaders = {};

    /**
     * The default HTTP timeout for all API calls.
     */
    timeout: number | { deadline?: number; response?: number } = undefined;

    contentTypes = {
        JSON: ['application/json']
    };

    httpClient: HttpClient;

    constructor(host?: string, httpClient?: HttpClient) {
        this.host = host;
        this.storage = Storage.getInstance();
        // fallback for backward compatibility
        this.httpClient = httpClient || new SuperagentHttpClient();
    }

    // EventEmitter delegation methods
    on<K extends string | symbol>(event: K, fn: (...args: any[]) => void, context?: any): this {
        this.eventEmitter.on(event, fn, context);
        return this;
    }

    off<K extends string | symbol>(event: K, fn?: (...args: any[]) => void, context?: any): this {
        this.eventEmitter.off(event, fn, context);
        return this;
    }

    once<K extends string | symbol>(event: K, fn: (...args: any[]) => void, context?: any): this {
        this.eventEmitter.once(event, fn, context);
        return this;
    }

    emit<K extends string | symbol>(event: K, ...args: any[]): boolean {
        return this.eventEmitter.emit(event, ...args);
    }

    request<T = any>(options: RequestOptions): Promise<T> {
        return this.buildRequestCall(this.basePath, options, this.httpClient.request.bind(this.httpClient));
    }

    post<T = any>(options: RequestOptions): AlfrescoApiClientPromise<T> {
        const url = this.getCallApiUrl(options);
        return this.buildRequestCall(url, options, this.httpClient.post.bind(this.httpClient));
    }

    put<T = any>(options: RequestOptions): AlfrescoApiClientPromise<T> {
        const url = this.getCallApiUrl(options);
        return this.buildRequestCall(url, options, this.httpClient.put.bind(this.httpClient));
    }

    get<T = any>(options: RequestOptions): AlfrescoApiClientPromise<T> {
        const url = this.getCallApiUrl(options);
        return this.buildRequestCall(url, options, this.httpClient.get.bind(this.httpClient));
    }

    delete<T = void>(options: RequestOptions): AlfrescoApiClientPromise<T> {
        const url = this.getCallApiUrl(options);
        return this.buildRequestCall<T>(url, options, this.httpClient.delete.bind(this.httpClient));
    }

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
    ): AlfrescoApiClientPromise<any> {
        const callApiUrl = url ?? this.getCallApiUrl({ contextRoot, path, pathParams });

        const options: RequestOptions = {
            path,
            httpMethod,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts,
            returnType,
            contextRoot,
            responseType,
            url
        };

        return this.buildRequestCall(callApiUrl, options, this.httpClient.request.bind(this.httpClient));
    }

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
    ): AlfrescoApiClientPromise<any> {
        const customApiUrl = AlfrescoApiClient.buildUrl(path, '', pathParams);
        const options: RequestOptions = {
            path,
            httpMethod,
            pathParams,
            queryParams,
            headerParams,
            formParams,
            bodyParam,
            contentTypes,
            accepts,
            returnType,
            contextRoot,
            responseType
        };

        return this.buildRequestCall(customApiUrl, options, this.httpClient.request.bind(this.httpClient));
    }

    isCsrfEnabled(): boolean {
        if (this.config) {
            return !this.config.disableCsrf;
        } else {
            return true;
        }
    }

    isBpmRequest(): boolean {
        return this.className === 'ProcessAuth' || this.className === 'ProcessClient';
    }

    basicAuth(username: string, password: string): string {
        const str = username + ':' + password;

        let base64;

        if (typeof Buffer === 'function') {
            base64 = Buffer.from(str, 'binary').toString('base64');
        } else {
            base64 = btoa(str);
        }

        return 'Basic ' + base64;
    }

    isWithCredentials(): boolean {
        return !!this.config?.withCredentials;
    }

    getAlfTicket(ticket: string): string {
        const ticketParam = this.isWithCredentials() ? '&ticket=' : '&alf_ticket=';

        if (ticket) {
            return ticketParam + ticket;
        } else {
            const ticketConfig = this.config.ticketEcm;
            const ticketStorage = this.storage.getItem('ticket-ECM');

            if (ticketConfig && ticketStorage && ticketConfig !== ticketStorage) {
                this.emit('ticket_mismatch', { newTicket: ticketStorage });
                return ticketParam + ticketStorage;
            } else if (ticketConfig) {
                return ticketParam + ticketConfig;
            } else if (ticketStorage) {
                return ticketParam + ticketStorage;
            }
        }

        return '';
    }

    /**
     * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders
     * with parameter values
     */
    private static buildUrl(basePath: string, path: string, pathParams: any): string {
        if (path && path !== '' && !path.match(/^\//)) {
            path = '/' + path;
        }
        const url = basePath + path;

        return AlfrescoApiClient.addParamsToUrl(url, pathParams);
    }

    private static addParamsToUrl(path: string, pathParams: any) {
        return path.replace(/\{([\w-]+)}/g, (fullMatch, key) => {
            let value;

            if (Object.prototype.hasOwnProperty.call(pathParams, key)) {
                value = paramToString(pathParams[key]);
            } else {
                value = fullMatch;
            }

            return encodeURIComponent(value);
        });
    }

    private getCallApiUrl({ contextRoot, path, pathParams }: { contextRoot?: string; path: string; pathParams?: any }): string {
        const basePath = contextRoot ? `${this.host}/${contextRoot}` : this.basePath;

        return AlfrescoApiClient.buildUrl(basePath, path, pathParams);
    }

    private buildRequestCall<T = any>(
        url: string,
        options: RequestOptions,
        httpCall: (url: string, options: RequestOptions, security: SecurityOptions, emitters: Emitters) => Promise<T>
    ): AlfrescoApiClientPromise<T> {
        const security = this.getSecurityOptions();
        const emitters = this.getEventEmitters();
        const httpRequestOptions = this.getRequestOptionsWithAcceptAndContentType(options);
        const promise = httpCall(url, httpRequestOptions, security, emitters);

        return this.addPromiseListeners(promise, emitters.eventEmitter);
    }

    private getSecurityOptions(): SecurityOptions {
        return {
            isBpmRequest: this.isBpmRequest(),
            enableCsrf: this.isCsrfEnabled(),
            withCredentials: this.isWithCredentials(),
            authentications: this.authentications,
            defaultHeaders: this.defaultHeaders
        };
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
            eventEmitter: new EventEmitter()
        };
    }

    private getRequestOptionsWithAcceptAndContentType(options: RequestOptions): RequestOptions {
        const contentType = AlfrescoApiClient.jsonPreferredMime(options.contentTypes);
        const accept = AlfrescoApiClient.jsonPreferredMime(options.accepts);

        return {
            ...options,
            contentType,
            accept
        };
    }

    /**
     * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
     * @param contentTypes content types
     * @returns The chosen content type, preferring JSON.
     */
    private static jsonPreferredMime(contentTypes: readonly string[]): string {
        if (!contentTypes?.length) {
            return 'application/json';
        }

        for (const item of contentTypes) {
            if (AlfrescoApiClient.isJsonMime(item)) {
                return item;
            }
        }
        return contentTypes[0];
    }

    /**
     * Checks whether the given content type represents JSON.<br>
     *
     * JSON content type examples:<br>
     * <ul>
     * <li>application/json</li>
     * <li>application/json; charset=UTF8</li>
     * <li>APPLICATION/JSON</li>
     * </ul>
     * @param contentType The MIME content type to check.
     * @returns <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
     */
    private static isJsonMime(contentType: string): boolean {
        return Boolean(contentType?.match(/^application\/json(;.*)?$/i));
    }

    addPromiseListeners<T = any>(promise: Promise<T>, eventEmitter: EventEmitter): AlfrescoApiClientPromise<T> {
        return Object.assign(promise, {
            on<K extends string | symbol>(event: K, fn: (...args: any[]) => void, context?: any): AlfrescoApiClientPromise<T> {
                eventEmitter.on(event, fn, context);
                return this as AlfrescoApiClientPromise<T>;
            },
            once<K extends string | symbol>(event: K, fn: (...args: any[]) => void, context?: any): AlfrescoApiClientPromise<T> {
                eventEmitter.once(event, fn, context);
                return this as AlfrescoApiClientPromise<T>;
            },
            emit<K extends string | symbol>(event: K, ...args: any[]): boolean {
                return eventEmitter.emit(event, ...args);
            },
            off<K extends string | symbol>(event: K, fn?: (...args: any[]) => void, context?: any): AlfrescoApiClientPromise<T> {
                eventEmitter.off(event, fn, context);
                return this as AlfrescoApiClientPromise<T>;
            }
        });
    }
}
