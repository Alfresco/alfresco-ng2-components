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

import { SuperagentHttpClient } from '../src/superagentHttpClient';
import { FetchResponse, ofetch } from 'ofetch';
import { RequestOptions } from '../src/api-clients/http-client.interface';
import { isBrowser } from '../src/utils';
import { buildRequestMockOptions, defaultEmitters, defaultRequestOptions, defaultSecurityOptions } from './mockObjects/httpClient.mock';

jest.mock('ofetch', () => ({
    ofetch: jest.fn()
}));

jest.mock('../src/utils', () => ({
    isBrowser: jest.fn(() => true),
    paramToString: (param: unknown) => String(param)
}));

describe('SuperagentHttpClient', () => {
    describe('request', () => {
        let client: SuperagentHttpClient;
        let emitters: typeof defaultEmitters;

        const url = 'http://fake-api/test';
        const options: RequestOptions = { ...defaultRequestOptions };
        const securityOptions = { ...defaultSecurityOptions };

        beforeEach(() => {
            client = new SuperagentHttpClient();
            emitters = {
                eventEmitter: { emit: jest.fn(), on: jest.fn(), off: jest.fn(), once: jest.fn() },
                apiClientEmitter: { emit: jest.fn(), on: jest.fn(), off: jest.fn(), once: jest.fn() }
            };
            (ofetch as unknown as jest.Mock).mockClear();
        });

        it('should resolve with deserialized data on success', async () => {
            const fakeResponse = {
                ok: true,
                headers: new Map([['content-type', 'application/json']]),
                json: () => Promise.resolve({ data: 'test' })
            } as unknown as FetchResponse<unknown>;
            (ofetch as unknown as jest.Mock).mockResolvedValue(fakeResponse);

            const result = await client.request(url, options, securityOptions, emitters);

            expect(result).toEqual({ data: 'test' });
            expect(emitters.eventEmitter.emit).toHaveBeenCalledWith('success', { data: 'test' });
        });

        it('should handle non-ok response and reject with error', async () => {
            const fakeResponse = {
                ok: false,
                status: 400,
                headers: new Map([['content-type', 'application/json']]),
                text: () => Promise.resolve('Bad Request')
            } as unknown as FetchResponse<unknown>;
            (ofetch as unknown as jest.Mock).mockResolvedValue(fakeResponse);

            await expect(client.request(url, options, securityOptions, emitters)).rejects.toMatchObject({ status: 400 });
            expect(emitters.apiClientEmitter.emit).toHaveBeenCalledWith('error', fakeResponse);
            expect(emitters.eventEmitter.emit).toHaveBeenCalledWith('error', fakeResponse);
        });

        it('should handle 401 unauthorized response appropriately', async () => {
            const fakeResponse = {
                ok: false,
                status: 401,
                headers: new Map([['content-type', 'application/json']]),
                text: () => Promise.resolve('Unauthorized')
            } as unknown as FetchResponse<unknown>;
            (ofetch as unknown as jest.Mock).mockResolvedValue(fakeResponse);

            await expect(client.request(url, options, securityOptions, emitters)).rejects.toMatchObject({ status: 401 });

            expect(emitters.apiClientEmitter.emit).toHaveBeenCalledWith('unauthorized');
            expect(emitters.eventEmitter.emit).toHaveBeenCalledWith('unauthorized');
        });

        it('should reject with network error when fetch fails', async () => {
            const networkError = new Error('Network failure');
            (ofetch as unknown as jest.Mock).mockRejectedValue(networkError);

            await expect(client.request(url, options, defaultSecurityOptions, emitters)).rejects.toEqual(networkError);
            expect(emitters.apiClientEmitter.emit).toHaveBeenCalledWith('error', networkError);
            expect(emitters.eventEmitter.emit).toHaveBeenCalledWith('error', networkError);
        });

        it('should parse text/html response correctly', async () => {
            const htmlResponse = {
                ok: true,
                headers: new Map([['content-type', 'text/html']]),
                json: () => Promise.reject(new Error('Not JSON')),
                text: () => Promise.resolve('<html><body>HTML Content</body></html>')
            } as unknown as FetchResponse<unknown>;
            (ofetch as unknown as jest.Mock).mockResolvedValue(htmlResponse);

            const result = await client.request('http://fake-api/test', defaultRequestOptions, defaultSecurityOptions, emitters);

            expect(result).toEqual('<html><body>HTML Content</body></html>');
            expect(emitters.eventEmitter.emit).toHaveBeenCalledWith('success', '<html><body>HTML Content</body></html>');
        });

        it('should include custom headers from headerParams', async () => {
            const customOptions: RequestOptions = {
                ...defaultRequestOptions,
                headerParams: { 'X-Custom-Header': 'customValue' }
            };
            // Return a successful JSON response
            const fakeResponse = {
                ok: true,
                headers: new Map([['content-type', 'application/json']]),
                json: () => Promise.resolve({ data: 'with-custom-header' })
            } as unknown as FetchResponse<unknown>;
            (ofetch as unknown as jest.Mock).mockResolvedValue(fakeResponse);

            await client.request(url, customOptions, securityOptions, emitters);

            const fetchCallArgs = (ofetch as unknown as jest.Mock).mock.calls[0];
            const fetchOptions = fetchCallArgs[1];
            expect(fetchOptions.headers['x-custom-header']).toEqual('customValue');
        });

        it('should include headers from securityOptions.defaultHeaders', async () => {
            const securityOptionsWithDefault = {
                ...defaultSecurityOptions,
                defaultHeaders: { 'X-Default-Header': 'defaultValue' }
            };
            const fakeResponse = {
                ok: true,
                headers: new Map([['content-type', 'application/json']]),
                json: () => Promise.resolve({ data: 'with-default-header' })
            } as unknown as FetchResponse<unknown>;
            (ofetch as unknown as jest.Mock).mockResolvedValue(fakeResponse);

            await client.request(url, defaultRequestOptions, securityOptionsWithDefault, emitters);

            const fetchCallArgs = (ofetch as unknown as jest.Mock).mock.calls[0];
            const fetchOptions = fetchCallArgs[1];
            expect(fetchOptions.headers['x-default-header']).toEqual('defaultValue');
        });
    });

    describe('buildRequest', () => {
        it('should create a request with response type blob', () => {
            const client = new SuperagentHttpClient();
            const options = { ...buildRequestMockOptions };
            options.contentType = 'application/json';
            options.accept = 'application/json';
            options.responseType = 'blob';

            const url = 'http://fake-api/enterprise/process-instances/';
            const httpMethod = 'GET';
            const securityOptions = { ...defaultSecurityOptions };

            const request = client['buildRequest'](
                {
                    ...options,
                    path: '',
                    httpMethod,
                    url,
                    bodyParam: null,
                    returnType: null
                },
                securityOptions
            );

            expect(request.urlWithParams).toEqual(url);
            const { fetchOptions } = request;
            expect(fetchOptions.headers['accept']).toEqual(options.accept);
            expect(fetchOptions.headers['content-type']).toEqual(options.contentType);
            expect(fetchOptions.responseType).toEqual('blob');
        });

        it('should set Cookie header when isBpmRequest is true and cookie exists in non-browser environment', () => {
            const client = new SuperagentHttpClient();
            const options = { ...buildRequestMockOptions };
            const url = 'http://fake-api/test-cookie';
            const httpMethod = 'GET';
            const securityOptions = {
                ...defaultSecurityOptions,
                isBpmRequest: true,
                authentications: { cookie: 'testCookie', basicAuth: { ticket: '' }, type: 'basic' }
            };

            (isBrowser as jest.Mock).mockReturnValue(false);

            const request = client['buildRequest'](
                {
                    ...options,
                    path: '',
                    httpMethod,
                    url,
                    bodyParam: null,
                    returnType: null
                },
                securityOptions
            );
            expect(request.fetchOptions.headers['cookie']).toEqual('testCookie');
        });
    });

    describe('deserialize', () => {
        it('should deserialize to an array when the response body is an array', async () => {
            const data = [
                { id: '1', name: 'test1' },
                { id: '2', name: 'test2' }
            ];
            const response = {
                json() {
                    return Promise.resolve(data);
                }
            } as FetchResponse<unknown>;
            const result = await SuperagentHttpClient['deserialize'](response);
            const isArray = Array.isArray(result);
            expect(isArray).toEqual(true);
        });

        it('should deserialize to an object when the response body is an object', () => {
            const response = {
                json: () => Promise.resolve({ id: '1', name: 'test1' })
            } as FetchResponse<unknown>;
            const result = SuperagentHttpClient['deserialize'](response);
            const isArray = Array.isArray(result);
            expect(isArray).toEqual(false);
        });

        it('should return null when response is null', async () => {
            const result = await SuperagentHttpClient['deserialize'](null);
            expect(result).toEqual(null);
        });

        it('should fallback to text property when body cant be parsed', async () => {
            const data = {
                text: () => Promise.resolve('mock-response-text')
            } as FetchResponse<unknown>;
            const result = await SuperagentHttpClient['deserialize'](data);
            expect(result).toEqual('mock-response-text');
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
            expect(result).toBeInstanceOf(Dummy);
            expect(result.id).toEqual('1');
            expect(result.name).toEqual('test1');
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
            expect(fakeRequest.header['X-CSRF-TOKEN']).toBeTruthy();
            expect(document.cookie.indexOf('CSRF-TOKEN=')).not.toEqual(-1);
        });
    });
});
