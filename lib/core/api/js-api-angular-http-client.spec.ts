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
import { RequestOptions, ResultListDataRepresentationTaskRepresentation, SecurityOptions, Emitter } from '@alfresco/js-api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JsApiAngularHttpClient } from './js-api-angular-http-client';


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
                returnType: ResultListDataRepresentationTaskRepresentation
            };

            angularHttpClient.request('http://example.com', options, securityOptions, emitter).then((res: ResultListDataRepresentationTaskRepresentation) => {
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

            angularHttpClient.request('http://example.com', options, securityOptions, emitter).then((res) => {
                expect(res).toEqual(mockResponse);
                done();
            });

            const req = controller.expectOne('http://example.com');
            expect(req.request.method).toEqual('POST');

            req.flush(mockResponse);

        });

        it('should return string when responseType and returnType are undefined', (done) => {

            const options: RequestOptions = {
                path: '',
                httpMethod: 'POST'
            };

            angularHttpClient.request('http://example.com', options, securityOptions, emitter).then((res) => {
                expect(res).toEqual(JSON.stringify(mockResponse));
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

            angularHttpClient.request('http://example.com', options, securityOptions, emitter).catch(() => {
                expect(spy).toHaveBeenCalledWith('unauthorized');
                done();
            });

            const req = controller.expectOne('http://example.com');
            expect(req.request.method).toEqual('POST');

            req.flush('<div></div>', { status: 401, statusText: 'unauthorized'});
        });

    });

});
