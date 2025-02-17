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
import { Response } from 'superagent';

describe('SuperagentHttpClient', () => {
    describe('buildRequest', () => {
        it('should create a request with response type blob', () => {
            const client = new SuperagentHttpClient();
            const queryParams = {};
            const headerParams = {};
            const formParams = {};

            const contentTypes = 'application/json';
            const accepts = 'application/json';
            const responseType = 'blob';
            const url = '/fake-api/enterprise/process-instances/';
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

            const response: any = client['buildRequest'](
                httpMethod,
                url,
                queryParams,
                headerParams,
                formParams,
                null,
                contentTypes,
                accepts,
                responseType,
                null,
                null,
                securityOptions
            );

            assert.equal(response.url, '/fake-api/enterprise/process-instances/');
            assert.equal(response.header.Accept, 'application/json');
            assert.equal(response.header['Content-Type'], 'application/json');
            assert.equal(response._responseType, 'blob');
        });
    });

    describe('deserialize', () => {
        it('should deserialize to an array when the response body is an array', () => {
            const data = {
                body: [
                    {
                        id: '1',
                        name: 'test1'
                    },
                    {
                        id: '2',
                        name: 'test2'
                    }
                ]
            } as Response;
            const result = SuperagentHttpClient['deserialize'](data);
            const isArray = Array.isArray(result);
            assert.equal(isArray, true);
        });

        it('should deserialize to an object when the response body is an object', () => {
            const data = {
                body: {
                    id: '1',
                    name: 'test1'
                }
            } as Response;
            const result = SuperagentHttpClient['deserialize'](data);
            const isArray = Array.isArray(result);
            assert.equal(isArray, false);
        });

        it('should return null when response is null', () => {
            const result = SuperagentHttpClient['deserialize'](null);
            assert.equal(result, null);
        });

        it('should fallback to text property when body is null', () => {
            const data = {
                text: '{"id": "1", "name": "test1"}',
                header: {
                    'content-type': 'application/json'
                }
            } as any as Response;
            const result = SuperagentHttpClient['deserialize'](data, 'blob');
            assert.deepEqual(result, new Blob([data.text], { type: data.header['content-type'] }));
        });

        it('should convert to returnType when provided', () => {
            class Dummy {
                id: string;
                name: string;
                constructor(data: any) {
                    this.id = data.id;
                    this.name = data.name;
                }
            }
            const data = {
                body: {
                    id: '1',
                    name: 'test1'
                }
            } as Response;
            const result = SuperagentHttpClient['deserialize'](data, Dummy);
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
