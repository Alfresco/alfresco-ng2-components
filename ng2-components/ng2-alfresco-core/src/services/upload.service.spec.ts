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
import { FileModel, FileUploadOptions, FileUploadStatus } from '../models/file.model';
import { AlfrescoApiService } from './alfresco-api.service';
import { AlfrescoSettingsService } from './alfresco-settings.service';
import { AppConfigModule } from './app-config.service';
import { AuthenticationService } from './authentication.service';
import { StorageService } from './storage.service';
import { UploadService } from './upload.service';

declare let jasmine: any;

describe('UploadService', () => {
    let service: UploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule.forRoot('app.config.json', {
                    ecmHost: 'http://localhost:9876/ecm',
                    files: {
                        excluded: ['.DS_Store', 'desktop.ini', '.git', '*.git']
                    }
                })
            ],
            providers: [
                UploadService,
                AlfrescoApiService,
                AlfrescoSettingsService,
                AuthenticationService,
                StorageService
            ]
        });
        service = TestBed.get(UploadService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return an empty queue if no elements are added', () => {
        expect(service.getQueue().length).toEqual(0);
    });

    it('should add an element in the queue and returns it', () => {
        let filesFake = new FileModel(<File> { name: 'fake-name', size: 10 });
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(1);
    });

    it('should add two elements in the queue and returns them', () => {
        let filesFake = [
            new FileModel(<File> { name: 'fake-name', size: 10 }),
            new FileModel(<File> { name: 'fake-name2', size: 20 })
        ];
        service.addToQueue(...filesFake);
        expect(service.getQueue().length).toEqual(2);
    });

    it('should skip hidden macOS files', () => {
        const file1 = new FileModel(new File([''], '.git'));
        const file2 = new FileModel(new File([''], 'readme.md'));
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should make XHR done request after the file is added in the queue', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('File uploaded');
            done();
        });
        let fileFake = new FileModel(
            <File> { name: 'fake-name', size: 10 },
            <FileUploadOptions> { parentId: '-root-', path: 'fake-dir' }
        );
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true');
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
        let fileFake = new FileModel(
            <File> { name: 'fake-name', size: 10 },
            <FileUploadOptions> { parentId: '-root-' }
        );
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);
        expect(jasmine.Ajax.requests.mostRecent().url)
            .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true');

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
        let fileFake = new FileModel(<File> { name: 'fake-name', size: 10 });
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        let file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('If versioning is true autoRename should not be present and majorVersion should be a param', () => {
        let emitter = new EventEmitter();

        const filesFake = new FileModel(<File> { name: 'fake-name', size: 10 }, { newVersion: true });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        expect(jasmine.Ajax.requests.mostRecent().url.endsWith('autoRename=true')).toBe(false);
        expect(jasmine.Ajax.requests.mostRecent().params.has('majorVersion')).toBe(true);
    });

    it('should use custom root folder ID given to the service', (done) => {
        let emitter = new EventEmitter();

        emitter.subscribe(e => {
            expect(e.value).toBe('File uploaded');
            done();
        });
        let filesFake = new FileModel(
            <File> { name: 'fake-name', size: 10 },
            <FileUploadOptions> { parentId: '123', path: 'fake-dir' }
        );
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        let request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/123/children?autoRename=true');
        expect(request.method).toBe('POST');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'File uploaded'
        });
    });

    it('should start downloading the next one if a file of the list is aborted', (done) => {
        let emitter = new EventEmitter();

        service.fileUploadAborted.subscribe(e => {
            expect(e).not.toBeNull();
        });

        service.fileUploadCancelled.subscribe(e => {
            expect(e).not.toBeNull();
            done();
        });

        let fileFake1 = new FileModel(<File> { name: 'fake-name1', size: 10 });
        let fileFake2 = new FileModel(<File> { name: 'fake-name2', size: 10 });
        let filelist = [fileFake1, fileFake2];
        service.addToQueue(...filelist);
        service.uploadFilesInTheQueue(emitter);

        let file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('should remove from the queue all the files in the exluded list', () => {
        const file1 = new FileModel(new File([''], '.git'));
        const file2 = new FileModel(new File([''], '.DS_Store'));
        const file3 = new FileModel(new File([''], 'desktop.ini'));
        const file4 = new FileModel(new File([''], 'readme.md'));
        const file5 = new FileModel(new File([''], 'test.git'));
        const result = service.addToQueue(file1, file2, file3, file4, file5);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file4);
    });

    it('should call onUploadDeleted if file was deleted', () => {
        const file = <any> ({ status: FileUploadStatus.Deleted });
        spyOn(service.fileUploadDeleted, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadDeleted.next).toHaveBeenCalled();
    });

    it('should call fileUploadError if file has error status', () => {
        const file = <any> ({ status: FileUploadStatus.Error });
        spyOn(service.fileUploadError, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadError.next).toHaveBeenCalled();
    });

    it('should call fileUploadCancelled if file is in pending', () => {
        const file = <any> ({ status: FileUploadStatus.Pending });
        spyOn(service.fileUploadCancelled, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadCancelled.next).toHaveBeenCalled();
    });
});
