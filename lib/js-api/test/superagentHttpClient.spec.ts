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

import { FormValueRepresentation } from '../src';
import { SuperagentHttpClient } from '../src/superagentHttpClient';
import { expect } from 'chai';
import { Response } from 'superagent';

describe('SuperagentHttpClient', () => {
    describe('#buildRequest', () => {
        const client = new SuperagentHttpClient();

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

            expect(response.url).equal('/fake-api/enterprise/process-instances/');
            expect(response.header.Accept).equal('application/json');
            expect(response.header['Content-Type']).equal('application/json');
            expect(response._responseType).equal('blob');
        });
    });

    describe('#deserialize', () => {
        it('should the deserializer return an array of object when the response is an array', () => {
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
            const result = SuperagentHttpClient['deserialize'](data, FormValueRepresentation);
            const isArray = Array.isArray(result);
            const isObject = result[0] instanceof FormValueRepresentation;
            expect(isArray).to.equal(true);
            expect(isObject).to.equal(true);
        });
    });
});
