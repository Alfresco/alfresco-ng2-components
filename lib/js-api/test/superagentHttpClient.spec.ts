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
import { AxiosHttpClient } from '../src/axiosHttpClient';
import { AxiosResponse } from 'axios';

describe('AxiosHttpClient', () => {
    describe('#buildRequest', () => {
        const client = new AxiosHttpClient();

        it('should create a request with response type blob', () => {
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

    describe('#deserialize', () => {
        it('should the deserializer return an array of object when the response is an array', () => {
            const data: AxiosResponse = {
                data: [
                    {
                        id: '1',
                        name: 'test1'
                    },
                    {
                        id: '2',
                        name: 'test2'
                    }
                ],
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    headers: undefined
                }
            };
            const result = AxiosHttpClient['deserialize'](data);
            const isArray = Array.isArray(result);
            assert.equal(isArray, true);
        });
    });
});
