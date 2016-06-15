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

import { it, describe, beforeEach, expect } from '@angular/core/testing';
import { UploadService } from './upload.service';
import { FileModel } from './../models/file.model';
import { AlfrescoApiMock } from '../assets/AlfrescoApi.mock';


declare var AlfrescoApi: any;

declare let jasmine: any;

let doneFn = jasmine.createSpy('success');
let errorFn = jasmine.createSpy('error');

class MockUploadService extends UploadService {

    createXMLHttpRequestInstance() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === this.DONE && this.status === 200) {
                doneFn(this.responseText);
            } else if (this.readyState === this.DONE && this.status === 404) {
                errorFn(this.responseText);
            }
        };
        xhr.abort = jasmine.createSpy('abort');
        return xhr;
    }
}

describe('AlfrescoUploadService', () => {
    let service: MockUploadService,
        serviceUpload: UploadService,
        options: any;

    options = {
        host: 'fakehost',
        url: '/some/cool/url',
        baseUrlPath: 'fakebasepath',
        formFields: {
            siteid: 'fakeSite',
            containerid: 'fakeFolder'
        }
    };

    beforeEach(() => {
        jasmine.Ajax.install();
        window['AlfrescoApi'] = AlfrescoApiMock;
        service = new MockUploadService(options);
        serviceUpload = new UploadService(options);
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should show the default option if no method setOption is called', () => {
        let empty = {};
        service.setOptions(empty);
        expect(service.getUrl()).toEqual('/alfresco/service/api/upload');
        expect(service.getBaseUrl()).toEqual('/alfresco/api/-default-/public/alfresco/versions/1');
        let formFields: Object = {};
        expect(service.getFormFileds()).toEqual(formFields);
    });

    it('should set the basic option an empty queue if no elements are added', () => {
        service.setOptions(options);
        expect(service.getUrl()).toEqual('/some/cool/url');
        expect(service.getBaseUrl()).toEqual('fakebasepath');
        expect(service.getFormFileds()).toEqual({
            siteid: 'fakeSite',
            containerid: 'fakeFolder'
        });
    });

    it('should return an empty queue if no elements are added', () => {
        service.setOptions(options);
        expect(service.getQueue().length).toEqual(0);
    });

    it('should add an element in the queue and returns it', () => {
        service.setOptions(options);
        let filesFake = [{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(1);
    });

    it('should add two elements in the queue and returns them', () => {
        service.setOptions(options);
        let filesFake = [{name: 'fake-name', size: 10}, {name: 'fake-name2', size: 20}];
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(2);
    });

    it('should make XHR done request after the file is added in the queue', () => {
        service.setOptions(options);
        let filesFake = [{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('', null);

        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('fakehost/some/cool/url');
        expect(request.method).toBe('POST');
        // expect(request.data()).toEqual({fileName: 'fake-name.png'});

        expect(doneFn).not.toHaveBeenCalled();
        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'File uploaded'
        });
        expect(doneFn).toHaveBeenCalledWith('File uploaded');
    });

    it('should make XHR error request after an error occur', () => {
        service.setOptions(options);
        let filesFake = [{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('', null);
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('fakehost/some/cool/url');
        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 404,
            contentType: 'text/plain',
            responseText: 'Error file uploaded'
        });
        expect(errorFn).toHaveBeenCalledWith('Error file uploaded');
    });

    it('should make XHR abort request after the xhr abort is called', () => {
        service.setOptions(options);
        let filesFake = [{name: 'fake-name', size: 10}];
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue('', null);
        let file = service.getQueue();
        file[0].setAbort();
        expect(file[0]._xmlHttpRequest.abort).toHaveBeenCalled();
    });

    it('should make XHR done request after the file is upload', () => {
        service.setOptions(options);
        let filesFake = {name: 'fake-name', size: 10};

        let uploadingFileModel = new FileModel(filesFake);
        service.uploadFile(uploadingFileModel, '', null);

        expect(jasmine.Ajax.requests.mostRecent().url).toBe('fakehost/some/cool/url');
        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'Single File uploaded'
        });
        expect(doneFn).toHaveBeenCalledWith('Single File uploaded');
    });

    it('should make XHR done request after the folder is created', (done)  => {
        let fakeRest = {
            entry: {
                isFile: false,
                isFolder: true
            }
        };
        service.setOptions(options);
        let defaultPath = '';
        let folderName = 'fake-folder';
        service.createFolder(defaultPath, folderName).subscribe(res => {
            expect(res).toEqual(fakeRest);
            done();
        });
    });

    it('should throws an exception when a folder already exist', (done)  => {
        let fakeRest = {
            response: {
                body: {
                    error: {
                        statusCode: 409
                    }
                }
            }
        };
        service.setOptions(options);
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

    it('should create an XHR object ', ()  => {
        service.setOptions(options);
        let filesFake = {name: 'fake-name', size: 10};
        let uploadingFileModel = new FileModel(filesFake);
        let xhrRequest = serviceUpload.createXMLHttpRequestInstance(uploadingFileModel, null);
        expect(xhrRequest.upload).toBeDefined();
        expect(xhrRequest.upload.onabort).toBeDefined();
        expect(xhrRequest.upload.onprogress).toBeDefined();
        expect(xhrRequest.upload.onerror).toBeDefined();
        expect(xhrRequest.onreadystatechange).toBeDefined();
    });
});
