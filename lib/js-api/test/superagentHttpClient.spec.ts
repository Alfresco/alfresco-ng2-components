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

import assert from 'assert';
import { SuperagentHttpClient } from '../src/superagentHttpClient';
import { FetchResponse } from 'ofetch';

describe('SuperagentHttpClient', () => {
    describe('buildRequest', () => {
        it('should create a request with response type blob', () => {
            const client = new SuperagentHttpClient();
            const queryParams = {};
            const headerParams = {};
            const formParams = {};

            const contentType = 'application/json';
            const accept = 'application/json';
            const responseType = 'blob';
            const url = 'http://fake-api/enterprise/process-instances/';
            const httpMethod = 'GET';
            const securityOptions = {
                isBpmRequest: false,
                enableCsrf: false,
                withCredentials: false,
                authentications: {
                    basicAuth: {
                        ticket: ''
                    },
                    type: 'basic'
                },
                defaultHeaders: {}
            };

            const request = client['buildRequest']({
                httpMethod,
                url,
                queryParams,
                headerParams,
                formParams,
                contentType,
                accept,
                responseType,
                bodyParam: null,
                returnType: null,
                securityOptions
            });

            assert.equal(request.urlWithParams, 'http://fake-api/enterprise/process-instances/');
            const { fetchOptions } = request;

            assert.equal(fetchOptions.headers['accept'], 'application/json');
            assert.equal(fetchOptions.headers['content-type'], 'application/json');
            assert.equal(fetchOptions.responseType, 'blob');
        });
    });

    describe('deserialize', () => {
        it('should deserialize to an array when the response body is an array', async () => {
            const data = [
                {
                    id: '1',
                    name: 'test1'
                },
                {
                    id: '2',
                    name: 'test2'
                }
            ];
            const response = {
                json() {
                    return Promise.resolve(data);
                }
            } as FetchResponse<unknown>;
            const result = await SuperagentHttpClient['deserialize'](response);

            const isArray = Array.isArray(result);
            assert.equal(isArray, true);
        });

        it('should deserialize to an object when the response body is an object', () => {
            const response = {
                json: () => Promise.resolve({ id: '1', name: 'test1' })
            } as FetchResponse<unknown>;
            const result = SuperagentHttpClient['deserialize'](response);

            const isArray = Array.isArray(result);
            assert.equal(isArray, false);
        });

        it('should return null when response is null', async () => {
            const result = await SuperagentHttpClient['deserialize'](null);
            assert.equal(result, null);
        });

        it('should fallback to text property when body cant be parsed', async () => {
            const data = {
                text: () => Promise.resolve('mock-response-text')
            } as FetchResponse<unknown>;

            const result = await SuperagentHttpClient['deserialize'](data);

            assert.equal(result, 'mock-response-text');
        });

        it('should convert to returnType when provided', async () => {
            class Dummy {
                id: string;
                name: string;
                constructor(data: any) {
                    this.id = data.id;
                    this.name = data.name;
                }
            }
            const data = {
                json: () => Promise.resolve({ id: '1', name: 'test1' })
            } as FetchResponse<unknown>;
            const result = await SuperagentHttpClient['deserialize'](data, Dummy);
            assert.ok(result instanceof Dummy);
            assert.equal(result.id, '1');
            assert.equal(result.name, 'test1');
        });
    });

    describe('setCsrfToken', () => {
        it('should set CSRF token in headers and document.cookie', () => {
            const client = new SuperagentHttpClient();
            const fakeRequest: any = {
                header: {},
                set: function (key: string, value: string) {
                    this.header[key] = value;
                    return this;
                },
                withCredentials: function () {}
            };

            if (typeof document === 'undefined') {
                (global as any).document = { cookie: '' };
            }

            client.setCsrfToken(fakeRequest);
            assert.ok(fakeRequest.header['X-CSRF-TOKEN']);
            assert.ok(document.cookie.indexOf('CSRF-TOKEN=') !== -1);
        });
    });
});
