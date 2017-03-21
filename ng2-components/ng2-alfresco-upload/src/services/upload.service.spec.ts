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

import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { UploadService } from './upload.service';

declare let jasmine: any;

describe('UploadService', () => {
    let service: UploadService;

    let options = {
        host: 'fakehost',
        url: '/some/cool/url',
        baseUrlPath: 'fakebasepath',
        formFields: {
            siteid: 'fakeSite',
            containerid: 'fakeFolder'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                UploadService
            ]
        });
        service = TestBed.get(UploadService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return an empty queue if no elements are added', () => {
        service.setOptions(options, false);
        expect(service.getQueue().length).toEqual(0);
    });

    it('should add an element in the queue and returns it', () => {
        service.setOptions(options, false);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(1);
    });

    it('should add two elements in the queue and returns them', () => {
        service.setOptions(options, false);
        let filesFake = [
            <File>{name: 'fake-name', size: 10},
            <File>{name: 'fake-name2', size: 20}
        ];
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(2);
    });

    it('should make XHR done request after the file is added in the queue', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('File uploaded');
            done();
        });
        service.setOptions(options, false);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('-root-', 'fake-dir', emitter);

        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true');
        expect(request.method).toBe('POST');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'File uploaded'
        });
    });

    it('should make XHR error request after an error occur', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('Error file uploaded');
            done();
        });
        service.setOptions(options, false);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('-root-', '', emitter);
        expect(jasmine.Ajax.requests.mostRecent().url)
            .toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 404,
            contentType: 'text/plain',
            responseText: 'Error file uploaded'
        });
    });

    it('should make XHR abort request after the xhr abort is called', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toEqual('File aborted');
            done();
        });
        service.setOptions(options, false);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('-root-', '', emitter);

        let file = service.getQueue();
        file[0].emitAbort();
    });

    it('should make XHR error request after the xhr error is called', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('Error file uploaded');
            done();
        });
        service.setOptions(options, false);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('-root-', '', emitter);

        let file = service.getQueue();
        file[0].emitError();
    });

    it('should make XHR progress request after the onprogress is called', (done) => {
        service.setOptions(options, false);
        let fakeProgress = {
            loaded: 500,
            total: 1234,
            percent: 44
        };
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.filesUpload$.subscribe((file) => {
            expect(file).toBeDefined();
            expect(file[0]).toBeDefined();
            expect(file[0].progress).toEqual(fakeProgress);
            done();
        });
        service.uploadFilesInTheQueue('-root-', '', null);

        let file = service.getQueue();

        file[0].emitProgres(fakeProgress);
    });

    it('should make XHR done request after the folder is created', (done) => {
        let fakeRest = {
            entry: {
                isFile: false,
                isFolder: true,
                name: 'fake-folder'
            }
        };
        let fakePromise = new Promise(function (resolve, reject) {
            resolve(fakeRest);
        });
        spyOn(service, 'callApiCreateFolder').and.returnValue(fakePromise);
        service.setOptions(options, false);
        let defaultPath = '';
        let folderName = 'fake-folder';
        service.createFolder(defaultPath, folderName).subscribe(res => {
            expect(res).toEqual(fakeRest);
            done();
        });
    });

    it('should throws an exception when a folder already exist', (done) => {
        let fakeRest = {
            response: {
                body: {
                    error: {
                        statusCode: 409
                    }
                }
            }
        };
        let fakePromise = new Promise(function (resolve, reject) {
            reject(fakeRest);
        });
        spyOn(service, 'callApiCreateFolder').and.returnValue(fakePromise);
        service.setOptions(options, false);
        let defaultPath = '';
        let folderName = 'folder-duplicate-fake';
        service.createFolder(defaultPath, folderName).subscribe(
            res => {
            },
            error => {
                expect(error).toEqual(fakeRest);
                done();
            }
        );
    });

    it('If versioning is true autoRename should not be present and majorVersion should be a param', () => {
        let emitter = new EventEmitter();

        let enableVersioning = true;
        service.setOptions(options, enableVersioning);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('-root-', '', emitter);

        expect(jasmine.Ajax.requests.mostRecent().url.endsWith('autoRename=true')).toBe(false);
        expect(jasmine.Ajax.requests.mostRecent().params.has('majorVersion')).toBe(true);
    });

    it('should use custom root folder ID given to the service', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('File uploaded');
            done();
        });
        service.setOptions(options, false);
        let filesFake = [<File>{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('123', 'fake-dir', emitter);

        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:8080/alfresco/api/-default-/public/alfresco/versions/1/nodes/123/children?autoRename=true');
        expect(request.method).toBe('POST');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'File uploaded'
        });
    });
});
