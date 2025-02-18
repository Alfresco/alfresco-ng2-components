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

import { Emitters, RequestOptions, SecurityOptions } from 'lib/js-api/src/api-clients/http-client.interface';

export const emptyQueryParams = {};
export const emptyHeaderParams = {};
export const emptyFormParams = {};
export const jsonContentType = 'application/json';
export const jsonAccept = 'application/json';
export const getMethod = 'GET';
export const testUrlEnterprise = 'http://fake-api/enterprise/process-instances/';
export const testUrlCookie = 'http://fake-api/test-cookie';

export const buildRequestMockOptions: RequestOptions = {
    path: '/test',
    httpMethod: 'GET',
    queryParams: {},
    headerParams: {},
    formParams: {},
    bodyParam: null,
    contentType: jsonContentType,
    accept: jsonAccept,
    responseType: 'json',
    returnType: null
};

export const defaultSecurityOptions: SecurityOptions = {
    isBpmRequest: false,
    enableCsrf: false,
    withCredentials: false,
    authentications: {
        basicAuth: { ticket: '' },
        type: 'basic'
    },
    defaultHeaders: {}
};

export const defaultRequestOptions: RequestOptions = {
    path: '/test',
    httpMethod: 'GET',
    queryParams: {},
    headerParams: {},
    formParams: {},
    bodyParam: null,
    contentType: 'application/json',
    accept: 'application/json',
    responseType: 'json',
    returnType: null
};

export const defaultEmitters: Emitters = {
    eventEmitter: { emit: jest.fn(), on: jest.fn(), off: jest.fn(), once: jest.fn() },
    apiClientEmitter: { emit: jest.fn(), on: jest.fn(), off: jest.fn(), once: jest.fn() }
};
