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
import { Emitter, RequestOptions, ResultListDataRepresentationTaskRepresentation, SecurityOptions } from '@alfresco/js-api';
import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JsApiAngularHttpClient, ResponseError } from './js-api-angular-http-client';


const securityOptions: SecurityOptions = {
    authentications: {},
    defaultHeaders: {},
    isBpmRequest: false,
    enableCsrf: true,
    withCredentials: false
};

const emitter: Emitter = {
    emit: () => {},
    off: () => {},
    on: () => {},
    once: () => {}
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


describe('JsApiAngularHttpClient', () => {
    let angularHttpClient: JsApiAngularHttpClient;
    let controller: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });
        angularHttpClient = TestBed.inject(JsApiAngularHttpClient);
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

            angularHttpClient.request('http://example.com', options, securityOptions, emitter, emitter).then((res: ResultListDataRepresentationTaskRepresentation) => {
                expect(res instanceof ResultListDataRepresentationTaskRepresentation).toBeTruthy();
                expect(res.data[0].created instanceof Date).toBeTruthy();
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

            angularHttpClient.request('http://example.com', options, securityOptions, emitter, emitter).then((res) => {
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

            angularHttpClient.request('http://example.com', options, securityOptions, emitter, emitter).catch(() => {
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
                contentTypes: ['multipart/form-data'],
                accepts: ['application/json'],
                returnType: null
            };

            angularHttpClient.request('http://example.com', requestOptions, securityOptions, emitter, emitter);
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

    it('should return a Error type on failed promise, for backward compatibility, with string value to prevent JSON.parse from not getting correct statusCode', (done) => {
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

        angularHttpClient.request('http://example.com', options, securityOptions, emitter, emitter).catch((res: ResponseError) => {
            expect(res instanceof Error).toBeTruthy();
            expect(res.message).toBe(JSON.stringify(errorResponse));
            expect(res.status).toBe(403);
            done();
        });

        const req = controller.expectOne('http://example.com');
        expect(req.request.method).toEqual('POST');

        req.flush(errorResponse, { status: 403, statusText: 'Forbidden' });
    });

});
