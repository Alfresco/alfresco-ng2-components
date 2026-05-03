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

/* eslint-disable jsdoc/require-jsdoc, no-underscore-dangle */
import { FetchHttpClient } from '../src/fetchHttpClient';
import { EventEmitter } from 'eventemitter3';
import { getGlobalMockAgent, mockHost } from './mockObjects/base.mock';

describe('FetchHttpClient', () => {
    const host = 'https://127.0.0.1:8080';
    let client: FetchHttpClient;
    let eventEmitter: EventEmitter;
    let apiClientEmitter: EventEmitter;
    let emitters: any;

    const defaultSecurityOptions: any = {
        isBpmRequest: false,
        enableCsrf: false,
        withCredentials: false,
        authentications: {
            basicAuth: { ticket: '' },
            type: 'basic'
        },
        defaultHeaders: {}
    };

    beforeEach(() => {
        client = new FetchHttpClient();
        eventEmitter = new EventEmitter();
        apiClientEmitter = new EventEmitter();
        emitters = { eventEmitter, apiClientEmitter };
    });

    describe('#setCsrfToken', () => {
        it('should set X-CSRF-TOKEN header', () => {
            const headers: Record<string, string> = {};
            client.setCsrfToken(headers);
            expect(headers['X-CSRF-TOKEN']).toBeTruthy();
            expect(headers['X-CSRF-TOKEN'].length).toBeGreaterThan(0);
        });
    });

    describe('#get', () => {
        it('should perform a GET request and return JSON', async () => {
            mockHost(host).get('/api/test').reply(200, { id: 1, name: 'test' });

            const result = await client.get(
                host + '/api/test',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({ id: 1, name: 'test' });
        });

        it('should emit success event', async () => {
            mockHost(host).get('/api/test').reply(200, { ok: true });
            const successSpy = jest.fn();
            eventEmitter.on('success', successSpy);

            await client.get(
                host + '/api/test',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(successSpy).toHaveBeenCalledWith({ ok: true });
        });

        it('should append query parameters', async () => {
            mockHost(host).get('/api/test?foo=bar&num=42').reply(200, { ok: true });

            const result = await client.get(
                host + '/api/test',
                {
                    httpMethod: 'GET',
                    queryParams: { foo: 'bar', num: 42 },
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({ ok: true });
        });

        it('should return text for String returnType', async () => {
            mockHost(host).get('/api/text').reply(200, 'plain text', { 'content-type': 'text/plain' });

            const result = await client.get(
                host + '/api/text',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'text/plain',
                    responseType: null,
                    returnType: 'String'
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toBe('plain text');
        });
    });

    describe('#post', () => {
        it('should perform a POST request with JSON body', async () => {
            mockHost(host).post('/api/items', { name: 'new' }).reply(201, { id: 2, name: 'new' });

            const result = await client.post(
                host + '/api/items',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { name: 'new' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({ id: 2, name: 'new' });
        });

        it('should send form-urlencoded body', async () => {
            mockHost(host).post('/api/login', 'username=admin&password=admin').reply(200, { ticket: 'abc' });

            const result = await client.post(
                host + '/api/login',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: { username: 'admin', password: 'admin' },
                    bodyParam: null,
                    contentType: 'application/x-www-form-urlencoded',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({ ticket: 'abc' });
        });
    });

    describe('#put', () => {
        it('should perform a PUT request', async () => {
            mockHost(host).put('/api/items/1', { name: 'updated' }).reply(200, { id: 1, name: 'updated' });

            const result = await client.put(
                host + '/api/items/1',
                {
                    httpMethod: 'PUT',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { name: 'updated' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({ id: 1, name: 'updated' });
        });
    });

    describe('#delete', () => {
        it('should perform a DELETE request', async () => {
            mockHost(host).delete('/api/items/1').reply(204, '');

            const result = await client.delete(
                host + '/api/items/1',
                {
                    httpMethod: 'DELETE',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({});
        });
    });

    describe('error handling', () => {
        it('should emit error and reject on 500', async () => {
            mockHost(host).get('/api/fail').reply(500, 'Internal Server Error', { 'content-type': 'text/plain' });
            const errorSpy = jest.fn();
            eventEmitter.on('error', errorSpy);

            await expect(
                client.get(
                    host + '/api/fail',
                    {
                        httpMethod: 'GET',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: null,
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toEqual(expect.objectContaining({ status: 500 }));

            expect(errorSpy).toHaveBeenCalled();
        });

        it('should emit unauthorized on 401', async () => {
            mockHost(host).get('/api/secure').reply(401, 'Unauthorized', { 'content-type': 'text/plain' });
            const unauthorizedSpy = jest.fn();
            eventEmitter.on('unauthorized', unauthorizedSpy);

            await expect(
                client.get(
                    host + '/api/secure',
                    {
                        httpMethod: 'GET',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: null,
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toEqual(expect.objectContaining({ status: 401 }));

            expect(unauthorizedSpy).toHaveBeenCalled();
        });

        it('should emit forbidden on 403', async () => {
            mockHost(host).get('/api/forbidden').reply(403, 'Forbidden', { 'content-type': 'text/plain' });
            const forbiddenSpy = jest.fn();
            eventEmitter.on('forbidden', forbiddenSpy);

            await expect(
                client.get(
                    host + '/api/forbidden',
                    {
                        httpMethod: 'GET',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: null,
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toEqual(expect.objectContaining({ status: 403 }));

            expect(forbiddenSpy).toHaveBeenCalled();
        });
    });

    describe('authentication headers', () => {
        it('should add Basic auth header', async () => {
            mockHost(host).get('/api/test').reply(200, { ok: true });

            const securityOptions: any = {
                ...defaultSecurityOptions,
                authentications: {
                    type: 'basic',
                    basicAuth: { username: 'admin', password: 'admin' }
                }
            };

            await client.get(
                host + '/api/test',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                securityOptions,
                emitters
            );
        });

        it('should add Bearer token for oauth2', async () => {
            mockHost(host).get('/api/test').reply(200, { ok: true });

            const securityOptions: any = {
                ...defaultSecurityOptions,
                authentications: {
                    type: 'oauth2',
                    oauth2: { accessToken: 'my-token' }
                }
            };

            await client.get(
                host + '/api/test',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                securityOptions,
                emitters
            );
        });

        it('should add activiti ticket header', async () => {
            mockHost(host).get('/api/test').reply(200, { ok: true });

            const securityOptions: any = {
                ...defaultSecurityOptions,
                authentications: {
                    type: 'activiti',
                    basicAuth: { ticket: 'TICKET_abc123' }
                }
            };

            await client.get(
                host + '/api/test',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                securityOptions,
                emitters
            );
        });

        it('should throw for unknown auth type', () => {
            const securityOptions: any = {
                ...defaultSecurityOptions,
                authentications: { type: 'unknown' }
            };

            expect(() =>
                client.get(
                    host + '/api/test',
                    {
                        httpMethod: 'GET',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: null,
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    securityOptions,
                    emitters
                )
            ).toThrow('Unknown authentication type: unknown');
        });
    });

    describe('abort', () => {
        it('should support aborting a request', async () => {
            mockHost(host).get('/api/slow').reply(200, { ok: true });
            const abortSpy = jest.fn();
            eventEmitter.on('abort', abortSpy);

            const promise = client.get(
                host + '/api/slow',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            (promise as any).abort();

            await expect(promise).rejects.toBeTruthy();
        });
    });

    describe('timeout', () => {
        it('should accept a numeric timeout', () => {
            client.timeout = 5000;
            expect(client.timeout).toBe(5000);
        });

        it('should accept an object timeout', () => {
            client.timeout = { deadline: 10000, response: 5000 };
            expect((client.timeout as any).deadline).toBe(10000);
        });
    });

    describe('BPM request handling', () => {
        it('should store set-cookie for BPM requests', async () => {
            mockHost(host).get('/api/bpm').reply(200, { ok: true }, { 'set-cookie': 'JSESSIONID=abc123' });

            const securityOptions: any = {
                ...defaultSecurityOptions,
                isBpmRequest: true
            };

            await client.get(
                host + '/api/bpm',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                securityOptions,
                emitters
            );

            expect(securityOptions.authentications.cookie).toBe('JSESSIONID=abc123');
        });
    });

    describe('deserialization', () => {
        it('should return empty object for empty response', async () => {
            mockHost(host).get('/api/empty').reply(200, '');

            const result = await client.get(
                host + '/api/empty',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({});
        });

        it('should return text for HTML content-type', async () => {
            mockHost(host).get('/api/html').reply(200, '<html>test</html>', { 'content-type': 'text/html' });

            const result = await client.get(
                host + '/api/html',
                {
                    httpMethod: 'GET',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: null,
                    contentType: 'application/json',
                    accept: 'text/html',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toBe('<html>test</html>');
        });
    });

    describe('XHR path', () => {
        let xhrClient: FetchHttpClient;
        let mockXhr: any;

        function createMockXhr() {
            const xhr: any = {
                open: jest.fn(),
                send: jest.fn(),
                setRequestHeader: jest.fn(),
                getResponseHeader: jest.fn(),
                abort: jest.fn(),
                upload: {},
                readyState: 0,
                status: 0,
                responseText: '',
                response: null,
                withCredentials: false,
                timeout: 0,
                responseType: ''
            };
            xhr.send.mockImplementation(() => {
                setTimeout(() => {
                    if (xhr.onload) {
                        xhr.onload();
                    }
                }, 0);
            });
            return xhr;
        }

        beforeEach(() => {
            xhrClient = new FetchHttpClient();
            mockXhr = createMockXhr();
            (globalThis as any).XMLHttpRequest = jest.fn(() => mockXhr);
            delete (process as any).__test_fetch__;
        });

        afterEach(() => {
            delete (globalThis as any).XMLHttpRequest;
            getGlobalMockAgent();
        });

        it('should use XHR for POST requests when XMLHttpRequest is available', async () => {
            mockXhr.status = 200;
            mockXhr.responseText = JSON.stringify({ created: true });
            mockXhr.getResponseHeader.mockReturnValue('application/json');

            const result = await xhrClient.post(
                host + '/api/items',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { name: 'test' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({ created: true });
            expect(mockXhr.open).toHaveBeenCalledWith('POST', host + '/api/items', true);
            expect(mockXhr.send).toHaveBeenCalled();
        });

        it('should emit progress events from XHR upload', async () => {
            mockXhr.status = 200;
            mockXhr.responseText = JSON.stringify({ ok: true });
            mockXhr.getResponseHeader.mockReturnValue('application/json');
            mockXhr.send.mockImplementation(() => {
                if (mockXhr.upload.onprogress) {
                    mockXhr.upload.onprogress({ lengthComputable: true, loaded: 50, total: 100 });
                    mockXhr.upload.onprogress({ lengthComputable: true, loaded: 100, total: 100 });
                }
                setTimeout(() => mockXhr.onload(), 0);
            });

            const progressSpy = jest.fn();
            eventEmitter.on('progress', progressSpy);

            await xhrClient.post(
                host + '/api/upload',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { data: 'content' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(progressSpy).toHaveBeenCalledTimes(2);
            expect(progressSpy).toHaveBeenCalledWith({ total: 100, loaded: 50, percent: 50 });
            expect(progressSpy).toHaveBeenCalledWith({ total: 100, loaded: 100, percent: 100 });
        });

        it('should emit error and reject on XHR error status', async () => {
            mockXhr.status = 500;
            mockXhr.responseText = 'Server Error';
            mockXhr.statusText = 'Internal Server Error';

            const errorSpy = jest.fn();
            eventEmitter.on('error', errorSpy);

            await expect(
                xhrClient.post(
                    host + '/api/fail',
                    {
                        httpMethod: 'POST',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: { data: 'test' },
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toEqual(expect.objectContaining({ status: 500 }));

            expect(errorSpy).toHaveBeenCalled();
        });

        it('should emit unauthorized on XHR 401', async () => {
            mockXhr.status = 401;
            mockXhr.responseText = 'Unauthorized';

            const unauthorizedSpy = jest.fn();
            eventEmitter.on('unauthorized', unauthorizedSpy);

            await expect(
                xhrClient.post(
                    host + '/api/secure',
                    {
                        httpMethod: 'POST',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: { data: 'test' },
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toEqual(expect.objectContaining({ status: 401 }));

            expect(unauthorizedSpy).toHaveBeenCalled();
        });

        it('should emit forbidden on XHR 403', async () => {
            mockXhr.status = 403;
            mockXhr.responseText = 'Forbidden';

            const forbiddenSpy = jest.fn();
            eventEmitter.on('forbidden', forbiddenSpy);

            await expect(
                xhrClient.post(
                    host + '/api/forbidden',
                    {
                        httpMethod: 'POST',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: { data: 'test' },
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toEqual(expect.objectContaining({ status: 403 }));

            expect(forbiddenSpy).toHaveBeenCalled();
        });

        it('should handle XHR network error', async () => {
            mockXhr.send.mockImplementation(() => {
                setTimeout(() => mockXhr.onerror(), 0);
            });

            const errorSpy = jest.fn();
            eventEmitter.on('error', errorSpy);

            await expect(
                xhrClient.post(
                    host + '/api/network-fail',
                    {
                        httpMethod: 'POST',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: { data: 'test' },
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toBeTruthy();

            expect(errorSpy).toHaveBeenCalled();
        });

        it('should handle XHR abort', async () => {
            mockXhr.send.mockImplementation(() => {
                setTimeout(() => mockXhr.onabort(), 0);
            });

            const abortSpy = jest.fn();
            eventEmitter.on('abort', abortSpy);

            await expect(
                xhrClient.post(
                    host + '/api/abort',
                    {
                        httpMethod: 'POST',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: { data: 'test' },
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toBeTruthy();

            expect(abortSpy).toHaveBeenCalled();
        });

        it('should handle XHR timeout', async () => {
            mockXhr.send.mockImplementation(() => {
                setTimeout(() => mockXhr.ontimeout(), 0);
            });

            const errorSpy = jest.fn();
            eventEmitter.on('error', errorSpy);

            await expect(
                xhrClient.post(
                    host + '/api/slow',
                    {
                        httpMethod: 'POST',
                        queryParams: {},
                        headerParams: {},
                        formParams: {},
                        bodyParam: { data: 'test' },
                        contentType: 'application/json',
                        accept: 'application/json',
                        responseType: null,
                        returnType: null
                    },
                    defaultSecurityOptions,
                    emitters
                )
            ).rejects.toBeTruthy();

            expect(errorSpy).toHaveBeenCalled();
        });

        it('should support aborting an XHR request via promise.abort()', async () => {
            mockXhr.send.mockImplementation(() => {
                // don't auto-resolve
            });

            const promise = xhrClient.post(
                host + '/api/cancel',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { data: 'test' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            (promise as any).abort();
            expect(mockXhr.abort).toHaveBeenCalled();
        });

        it('should set withCredentials on XHR for BPM requests', async () => {
            mockXhr.status = 200;
            mockXhr.responseText = JSON.stringify({ ok: true });
            mockXhr.getResponseHeader.mockReturnValue('application/json');

            await xhrClient.post(
                host + '/api/bpm',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { data: 'test' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                { ...defaultSecurityOptions, isBpmRequest: true },
                emitters
            );

            expect(mockXhr.withCredentials).toBe(true);
        });

        it('should set blob responseType for blob returnType', async () => {
            mockXhr.status = 200;
            mockXhr.response = new Blob(['test']);
            mockXhr.getResponseHeader.mockReturnValue('application/octet-stream');

            await xhrClient.post(
                host + '/api/download',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { id: 1 },
                    contentType: 'application/json',
                    accept: 'application/octet-stream',
                    responseType: null,
                    returnType: 'Blob'
                },
                defaultSecurityOptions,
                emitters
            );

            expect(mockXhr.responseType).toBe('blob');
        });

        it('should deserialize String returnType from XHR', async () => {
            mockXhr.status = 200;
            mockXhr.responseText = 'plain text response';
            mockXhr.getResponseHeader.mockReturnValue('text/plain');

            const result = await xhrClient.post(
                host + '/api/text',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { query: 'test' },
                    contentType: 'application/json',
                    accept: 'text/plain',
                    responseType: null,
                    returnType: 'String'
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toBe('plain text response');
        });

        it('should deserialize HTML content from XHR', async () => {
            mockXhr.status = 200;
            mockXhr.responseText = '<html>content</html>';
            mockXhr.getResponseHeader.mockReturnValue('text/html');

            const result = await xhrClient.post(
                host + '/api/html',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { page: 'home' },
                    contentType: 'application/json',
                    accept: 'text/html',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toBe('<html>content</html>');
        });

        it('should return empty object for empty XHR response', async () => {
            mockXhr.status = 200;
            mockXhr.responseText = '';
            mockXhr.getResponseHeader.mockReturnValue('application/json');

            const result = await xhrClient.post(
                host + '/api/empty',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { data: 'test' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(result).toEqual({});
        });

        it('should set XHR timeout when configured', async () => {
            xhrClient.timeout = 5000;
            mockXhr.status = 200;
            mockXhr.responseText = JSON.stringify({ ok: true });
            mockXhr.getResponseHeader.mockReturnValue('application/json');

            await xhrClient.post(
                host + '/api/test',
                {
                    httpMethod: 'POST',
                    queryParams: {},
                    headerParams: {},
                    formParams: {},
                    bodyParam: { data: 'test' },
                    contentType: 'application/json',
                    accept: 'application/json',
                    responseType: null,
                    returnType: null
                },
                defaultSecurityOptions,
                emitters
            );

            expect(mockXhr.timeout).toBe(5000);
        });
    });
});
