/*!
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
"use strict";
var core_1 = require("@angular/core");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var upload_service_1 = require("./upload.service");
var core_2 = require("@angular/core");
describe('Test ng2-alfresco-upload', function () {
    var service, injector, options;
    options = {
        host: 'fakehost',
        url: '/some/cool/url',
        baseUrlPath: 'fakebasepath',
        formFields: {
            siteid: 'fakeSite',
            containerid: 'fakeFolder'
        }
    };
    beforeEach(function () {
        injector = core_1.ReflectiveInjector.resolveAndCreate([
            ng2_alfresco_core_1.AlfrescoSettingsService,
            ng2_alfresco_core_1.AlfrescoApiService,
            ng2_alfresco_core_1.AlfrescoAuthenticationService,
            upload_service_1.UploadService
        ]);
    });
    describe('UploadService ', function () {
        beforeEach(function () {
            service = injector.get(upload_service_1.UploadService);
            service.apiService.setInstance(new AlfrescoApi({}));
            jasmine.Ajax.install();
        });
        afterEach(function () {
            jasmine.Ajax.uninstall();
        });
        it('should return an empty queue if no elements are added', function () {
            service.setOptions(options, false);
            expect(service.getQueue().length).toEqual(0);
        });
        it('should add an element in the queue and returns it', function () {
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            expect(service.getQueue().length).toEqual(1);
        });
        it('should add two elements in the queue and returns them', function () {
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }, { name: 'fake-name2', size: 20 }];
            service.addToQueue(filesFake);
            expect(service.getQueue().length).toEqual(2);
        });
        it('should make XHR done request after the file is added in the queue', function (done) {
            var emitter = new core_2.EventEmitter();
            emitter.subscribe(function (e) {
                expect(e.value).toBe('File uploaded');
                done();
            });
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.uploadFilesInTheQueue('-root-', 'fake-dir', emitter);
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('http://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true');
            expect(request.method).toBe('POST');
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'text/plain',
                responseText: 'File uploaded'
            });
        });
        it('should make XHR error request after an error occur', function (done) {
            var emitter = new core_2.EventEmitter();
            emitter.subscribe(function (e) {
                expect(e.value).toBe('Error file uploaded');
                done();
            });
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.uploadFilesInTheQueue('-root-', '', emitter);
            expect(jasmine.Ajax.requests.mostRecent().url)
                .toBe('http://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true');
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 404,
                contentType: 'text/plain',
                responseText: 'Error file uploaded'
            });
        });
        it('should make XHR abort request after the xhr abort is called', function (done) {
            var emitter = new core_2.EventEmitter();
            emitter.subscribe(function (e) {
                expect(e.value).toEqual('File aborted');
                done();
            });
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.uploadFilesInTheQueue('-root-', '', emitter);
            var file = service.getQueue();
            file[0].emitAbort();
        });
        it('should make XHR error request after the xhr error is called', function (done) {
            var emitter = new core_2.EventEmitter();
            emitter.subscribe(function (e) {
                expect(e.value).toBe('Error file uploaded');
                done();
            });
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.uploadFilesInTheQueue('-root-', '', emitter);
            var file = service.getQueue();
            file[0].emitError();
        });
        it('should make XHR progress request after the onprogress is called', function (done) {
            service.setOptions(options, false);
            var fakeProgress = {
                loaded: 500,
                total: 1234,
                percent: 44
            };
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.filesUpload$.subscribe(function (file) {
                expect(file).toBeDefined();
                expect(file[0]).toBeDefined();
                expect(file[0].progress).toEqual(fakeProgress);
                done();
            });
            service.uploadFilesInTheQueue('-root-', '', null);
            var file = service.getQueue();
            file[0].emitProgres(fakeProgress);
        });
        it('should make XHR done request after the folder is created', function (done) {
            var fakeRest = {
                entry: {
                    isFile: false,
                    isFolder: true,
                    name: 'fake-folder'
                }
            };
            var fakePromise = new Promise(function (resolve, reject) {
                resolve(fakeRest);
            });
            spyOn(service, 'callApiCreateFolder').and.returnValue(fakePromise);
            service.setOptions(options, false);
            var defaultPath = '';
            var folderName = 'fake-folder';
            service.createFolder(defaultPath, folderName).subscribe(function (res) {
                expect(res).toEqual(fakeRest);
                done();
            });
        });
        it('should throws an exception when a folder already exist', function (done) {
            var fakeRest = {
                response: {
                    body: {
                        error: {
                            statusCode: 409
                        }
                    }
                }
            };
            var fakePromise = new Promise(function (resolve, reject) {
                reject(fakeRest);
            });
            spyOn(service, 'callApiCreateFolder').and.returnValue(fakePromise);
            service.setOptions(options, false);
            var defaultPath = '';
            var folderName = 'folder-duplicate-fake';
            service.createFolder(defaultPath, folderName).subscribe(function (res) {
            }, function (error) {
                expect(error).toEqual(fakeRest);
                done();
            });
        });
        it('If versioning is true autoRename should not be present and majorVersion should be a param', function () {
            var emitter = new core_2.EventEmitter();
            var enableVersioning = true;
            service.setOptions(options, enableVersioning);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.uploadFilesInTheQueue('-root-', '', emitter);
            console.log(jasmine.Ajax.requests.mostRecent().url);
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('autoRename=true')).toBe(false);
            expect(jasmine.Ajax.requests.mostRecent().params.has('majorVersion')).toBe(true);
        });
        it('should use custom root folder ID given to the service', function (done) {
            var emitter = new core_2.EventEmitter();
            emitter.subscribe(function (e) {
                expect(e.value).toBe('File uploaded');
                done();
            });
            service.setOptions(options, false);
            var filesFake = [{ name: 'fake-name', size: 10 }];
            service.addToQueue(filesFake);
            service.uploadFilesInTheQueue('123', 'fake-dir', emitter);
            var request = jasmine.Ajax.requests.mostRecent();
            expect(request.url).toBe('http://127.0.0.1:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/123/children?autoRename=true');
            expect(request.method).toBe('POST');
            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'text/plain',
                responseText: 'File uploaded'
            });
        });
    });
});
//# sourceMappingURL=upload.service.spec.js.map