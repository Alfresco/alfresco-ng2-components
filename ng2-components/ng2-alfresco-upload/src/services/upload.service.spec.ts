/**
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {it, describe} from 'angular2/testing';
import {provide, Injector} from 'angular2/core';
import {Http, HTTP_PROVIDERS, XHRBackend, Response, ResponseOptions} from 'angular2/http';
import {MockBackend} from 'angular2/http/testing';
import {UploadService} from './upload.service';

describe('AlfrescoUploadService', () => {
    let injector,
        backend,
        mockBackend,
        httpService,
        service,
        options;

    beforeEach(() => {
        injector = Injector.resolveAndCreate([
            HTTP_PROVIDERS,
            MockBackend,
            provide(XHRBackend, {useClass: MockBackend})
        ]);

        mockBackend = injector.get(MockBackend);
        backend = injector.get(XHRBackend);
        httpService = injector.get(Http);

        options = {
            url: 'http://mockUpload',
            withCredentials: true,
            authToken: btoa('fakeadmin:fakeadmin'),
            authTokenPrefix: 'Basic',
            fieldName: 'fakeFileData',
            formFields: {
                siteid: 'fakeSite',
                containerid: 'fakeFolder'
            }
        };
        service = new UploadService(options);
    });

    it('should make XHR request', () => {

        var xhr = {
            open: jasmine.createSpy('open'),
            upload: jasmine.createSpy('upload'),
            send: jasmine.createSpy('send'),
            setRequestHeader: jasmine.createSpy('setRequestHeader')
        };

        XMLHttpRequest = jasmine.createSpy('XMLHttpRequest');
        XMLHttpRequest.and.callFake(function () {
            return xhr;
        });

        let filesFake = [{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);

        expect(xhr.open).toHaveBeenCalled();
    });



});