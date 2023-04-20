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

import { Emitters, RequestOptions, ResultListDataRepresentationTaskRepresentation, SecurityOptions } from '@alfresco/js-api';
import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AlfrescoApiHttpClient } from './alfresco-api.http-client';
import { AlfrescoApiResponseError } from './alfresco-api.response-error';

const securityOptions: SecurityOptions = {
    authentications: {},
    defaultHeaders: {},
    isBpmRequest: false,
    enableCsrf: true,
    withCredentials: false
};

const emitter = {
    emit: () => {},
    off: () => {},
    on: () => {},
    once: () => {}
};

const emitters: Emitters = {
    eventEmitter: emitter,
    apiClientEmitter: emitter
};

const mockResponse =  {
    data: [
        {
            id: 14,
            name: 'nameFake1',
            created: '2017-03-01T12:25:17.189+0000'
        }
    ]
};

describe('AlfrescoApiHttpClient', () => {
    let angularHttpClient: AlfrescoApiHttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });
        angularHttpClient = TestBed.inject(AlfrescoApiHttpClient);
        controller = TestBed.inject(HttpTestingController);
    });


    describe('deserialize', () => {

        afterEach(() => {
            controller.verify();
        });

        it('should deserialize incoming request based on return type', (done) => {

            const options: RequestOptions = {
                path: '',
                httpMethod: 'POST',
                returnType: ResultListDataRepresentationTaskRepresentation,
                headerParams: {
                    'Content-Type': 'application/json'
                },
                accepts: ['application/json']
            };

            angularHttpClient.request('http://example.com', options, securityOptions, emitters).then((res: ResultListDataRepresentationTaskRepresentation) => {
                expect(res instanceof ResultListDataRepresentationTaskRepresentation).toBeTruthy();
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                expect(res.data![0].created instanceof Date).toBeTruthy();
                done();
            });

            const req = controller.expectOne('http://example.com');
            expect(req.request.method).toEqual('POST');

            req.flush(mockResponse);

        });

        it('should return parsed json object when responseType is json', (done) => {

            const options: RequestOptions = {
                path: '',
                httpMethod: 'POST',
                responseType: 'json'
            };

            angularHttpClient.request('http://example.com', options, securityOptions, emitters).then((res) => {
                expect(res).toEqual(mockResponse);
                done();
            });

            const req = controller.expectOne('http://example.com');
            expect(req.request.method).toEqual('POST');

            req.flush(mockResponse);

        });

        it('should emit unauthorized message for 401 request', (done) => {
            const options: RequestOptions = {
                path: '',
                httpMethod: 'POST'
            };

            const spy = spyOn(emitter, 'emit').and.callThrough();

            angularHttpClient.request('http://example.com', options, securityOptions, emitters).catch(() => {
                expect(spy).toHaveBeenCalledWith('unauthorized');
                done();
            });

            const req = controller.expectOne('http://example.com');
            expect(req.request.method).toEqual('POST');

            req.flush('<div></div>', { status: 401, statusText: 'unauthorized'});
        });

    });

    describe('upload', () => {

        afterEach(() => {
            controller.verify();
        });

        it('should behave...', () => {
            const requestOptions: RequestOptions = {
                path: '/nodes/{nodeId}/children',
                httpMethod: 'POST',
                queryParams: {
                    autoRename: true,
                    include: 'allowableOperations',
                    fields: null
                },
                formParams: {
                    filedata: new File([], 'file.txt'),
                    relativePath: '',
                    include: ['allowableOperations'],
                    renditions: 'doclib',
                    autoRename: true,
                    nodeType: 'cm:content'
                },
                bodyParam: {
                    name: 'demo.txt',
                    nodeType: 'cm:content',
                    relativePath: '',
                    newVersion: false,
                    majorVersion: false,
                    parentId: '-my-',
                    path: ''
                },
                contentType: 'multipart/form-data',
                accept: 'application/json',
                returnType: null
            };

            angularHttpClient.request('http://example.com', requestOptions, securityOptions, emitters);
            const req = controller.expectOne('http://example.com?autoRename=true&include=allowableOperations');
            expect(req.request.method).toEqual('POST');

            // filedata: (binary)
            // include: allowableOperations

            const body = req.request.body as HttpParams;

            expect(body.get('relativePath')).toBe('');
            expect(body.get('renditions')).toBe('doclib');
            expect(body.get('autoRename')).toBeTruthy();
            expect(body.get('nodeType')).toBe('cm:content');
            expect(body.get('include')).toBe('allowableOperations');
            expect(body.get('filedata')).toEqual(jasmine.any(File));

            req.flush('');
        });
    });

    it('should return a Error type on failed promise, for backward compatibility, with string value to prevent JSON.parse from crashing when we try to get status code from message', (done) => {
        const options: RequestOptions = {
            path: '',
            httpMethod: 'POST'
        };

        const errorResponse = {
            error: {
                errorKey: 'Cant perform action',
                statusCode: 403
            }
        };

        angularHttpClient.request('http://example.com', options, securityOptions, emitters).catch((res: AlfrescoApiResponseError) => {
            expect(res instanceof Error).toBeTruthy();
            expect(res.message).toBe(JSON.stringify(errorResponse));
            expect(res.status).toBe(403);
            done();
        });

        const req = controller.expectOne('http://example.com');
        expect(req.request.method).toEqual('POST');

        req.flush(errorResponse, { status: 403, statusText: 'Forbidden' });
    });

    it('should return a Error type on failed promise with response body', (done) => {
        const options: RequestOptions = {
            path: '',
            httpMethod: 'POST',
            responseType: 'blob'
        };

        const errorResponse = new Blob();

        angularHttpClient.request('http://example.com', options, securityOptions, emitters).catch((res: AlfrescoApiResponseError) => {
            expect(res.status).toBe(400);
            expect(res.error.response.body instanceof Blob).toBeTruthy();
            done();
        });

        const req = controller.expectOne('http://example.com');

        req.flush(errorResponse, { status: 400, statusText: 'Bad request' });
    });

    it('should correctly handle queryParams with arrays', () => {
        const options: RequestOptions = {
            path: '',
            httpMethod: 'POST',
            queryParams: {
                skipCount: 0,
                status: [
                    'RUNNING',
                    'SUSPENDED'
                ],
                sort: 'startDate,DESC'
            }
        };

        angularHttpClient.request('http://example.com/candidatebaseapp/query/v1/process-instances', options, securityOptions, emitters);

        const req = controller.expectOne('http://example.com/candidatebaseapp/query/v1/process-instances?skipCount=0&status=RUNNING&status=SUSPENDED&sort=startDate%2CDESC');
        expect(req.request.method).toEqual('POST');

        req.flush(null, { status: 200, statusText: 'Ok' });
    });

    it('should convert null values to empty stirng for backward compatibility', (done) => {
        const options: RequestOptions = {
            path: '',
            httpMethod: 'GET'
        };

        angularHttpClient.request('http://example.com', options, securityOptions, emitters).then((res) => {
            expect(res).toEqual('');
            done();
        });

        const req = controller.expectOne('http://example.com');

        req.flush(null, { status: 200, statusText: 'Ok' });
    });

    it('should correctly decode types to string', () => {
        const options: RequestOptions = {
            path: '',
            httpMethod: 'POST',
            queryParams: {
                lastModifiedFrom: '2022-08-17T00:00:00.000+02:00'
            }
        };

        angularHttpClient.request('http://example.com', options, securityOptions, emitters);

        const req = controller.expectOne('http://example.com?lastModifiedFrom=2022-08-17T00%3A00%3A00.000%2B02%3A00');

        req.flush(null, { status: 200, statusText: 'Ok' });
    });

    it('should correctly decode Date types to string ', () => {
        const options: RequestOptions = {
            path: '',
            httpMethod: 'POST',
            queryParams: {
                lastModifiedFrom: new Date('2022-08-17T00:00:00.000Z')
            }
        };

        angularHttpClient.request('http://example.com', options, securityOptions, emitters);

        const req = controller.expectOne('http://example.com?lastModifiedFrom=2022-08-17T00%3A00%3A00.000Z');

        req.flush(null, { status: 200, statusText: 'Ok' });
    });

});
