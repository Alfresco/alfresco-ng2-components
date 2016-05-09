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
System.register(['angular2/testing', 'angular2/core', 'angular2/http', 'angular2/http/testing', './upload.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var testing_1, core_1, http_1, testing_2, upload_service_1;
    return {
        setters:[
            function (testing_1_1) {
                testing_1 = testing_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (testing_2_1) {
                testing_2 = testing_2_1;
            },
            function (upload_service_1_1) {
                upload_service_1 = upload_service_1_1;
            }],
        execute: function() {
            testing_1.describe('AlfrescoUploadService', function () {
                var injector, backend, mockBackend, httpService, service, options;
                beforeEach(function () {
                    injector = core_1.Injector.resolveAndCreate([
                        http_1.HTTP_PROVIDERS,
                        testing_2.MockBackend,
                        core_1.provide(http_1.XHRBackend, { useClass: testing_2.MockBackend })
                    ]);
                    mockBackend = injector.get(testing_2.MockBackend);
                    backend = injector.get(http_1.XHRBackend);
                    httpService = injector.get(http_1.Http);
                    options = {
                        url: '',
                        withCredentials: true,
                        authToken: btoa('fakeadmin:fakeadmin'),
                        authTokenPrefix: 'Basic',
                        fieldName: 'fakeFileData',
                        formFields: {
                            siteid: 'fakeSite',
                            containerid: 'fakeFolder'
                        }
                    };
                    service = new upload_service_1.UploadService(options);
                });
                testing_1.it('should make XHR request', function () {
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
                    var filesFake = [{ name: 'fake-name', size: 10 }];
                    service.addToQueue(filesFake);
                    expect(xhr.open).toHaveBeenCalled();
                });
            });
        }
    }
});
//# sourceMappingURL=upload.service.spec.js.map