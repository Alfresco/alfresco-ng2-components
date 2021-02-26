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

import { EventEmitter } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FileModel, FileUploadOptions, FileUploadStatus } from '../models/file.model';
import { AppConfigModule } from '../app-config/app-config.module';
import { UploadService } from './upload.service';
import { AppConfigService } from '../app-config/app-config.service';
import { AlfrescoApiService } from './alfresco-api.service';

import { setupTestBed } from '../testing/setup-test-bed';
import { CoreTestingModule } from '../testing/core.testing.module';
import { AssocChildBody, AssociationBody } from '@alfresco/js-api';
import { TranslateModule } from '@ngx-translate/core';
import { DiscoveryApiService } from './discovery-api.service';
import { BehaviorSubject } from 'rxjs';
import { EcmProductVersionModel } from '../models';

declare let jasmine: any;

describe('UploadService', () => {
    let service: UploadService;
    let alfrescoApiService: AlfrescoApiService;
    const mockProductInfo = new BehaviorSubject<EcmProductVersionModel>(null);

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            CoreTestingModule,
            AppConfigModule
        ],
        providers: [
            {
                provide: DiscoveryApiService,
                useValue: {
                    ecmProductInfo$: mockProductInfo
                }
            }
        ]
    });

    beforeEach(() => {
        const appConfig: AppConfigService = TestBed.inject(AppConfigService);
        appConfig.config = {
            ecmHost: 'http://localhost:9876/ecm',
            files: {
                excluded: ['.DS_Store', 'desktop.ini', '.git', '*.git', '*.SWF'],
                'match-options': {
                    /* cspell:disable-next-line */
                    nocase: true
                }
            },
            folders: {
                excluded: ['ROLLINGPANDA'],
                'match-options': {
                    /* cspell:disable-next-line */
                    nocase: true
                }
            }
        };

        service = TestBed.inject(UploadService);
        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        service.queue = [];
        service.activeTask = null;
        jasmine.Ajax.install();
        mockProductInfo.next({ status: { isThumbnailGenerationEnabled: true } } as EcmProductVersionModel);
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should return an empty queue if no elements are added', () => {
        expect(service.getQueue().length).toEqual(0);
    });

    it('should add an element in the queue and returns it', () => {
        const filesFake = new FileModel(<File> { name: 'fake-name', size: 10 });
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(1);
    });

    it('should add two elements in the queue and returns them', () => {
        const filesFake = [
            new FileModel(<File> { name: 'fake-name', size: 10 }),
            new FileModel(<File> { name: 'fake-name2', size: 20 })
        ];
        service.addToQueue(...filesFake);
        expect(service.getQueue().length).toEqual(2);
    });

    it('should not have the queue uploading if all files are complete, cancelled, aborted, errored or deleted', () => {
        const file1 = new FileModel(<File> { name: 'fake-file-1', size: 10 });
        const file2 = new FileModel(<File> { name: 'fake-file-2', size: 20 });
        const file3 = new FileModel(<File> { name: 'fake-file-3', size: 30 });
        const file4 = new FileModel(<File> { name: 'fake-file-4', size: 40 });
        const file5 = new FileModel(<File> { name: 'fake-file-5', size: 50 });

        file1.status = FileUploadStatus.Complete;
        file2.status = FileUploadStatus.Cancelled;
        file3.status = FileUploadStatus.Aborted;
        file4.status = FileUploadStatus.Error;
        file5.status = FileUploadStatus.Deleted;

        service.addToQueue(file1, file2, file3, file4, file5);

        expect(service.isUploading()).toBe(false);
    });

    it('should have the queue still uploading if some files are still pending, starting or in progress', () => {
        const file1 = new FileModel(<File> { name: 'fake-file-1', size: 10 });
        const file2 = new FileModel(<File> { name: 'fake-file-2', size: 20 });

        service.addToQueue(file1, file2);

        file1.status = FileUploadStatus.Complete;
        file2.status = FileUploadStatus.Pending;
        expect(service.isUploading()).toBe(true);

        file2.status = FileUploadStatus.Starting;
        expect(service.isUploading()).toBe(true);

        file2.status = FileUploadStatus.Progress;
        expect(service.isUploading()).toBe(true);
    });

    it('should skip hidden macOS files', () => {
        const file1 = new FileModel(new File([''], '.git'));
        const file2 = new FileModel(new File([''], 'readme.md'));
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should match the extension in case insensitive way', () => {
        const file1 = new FileModel(new File([''], 'test.swf'));
        const file2 = new FileModel(new File([''], 'readme.md'));
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should make XHR done request after the file is added in the queue', (done) => {
        const emitter = new EventEmitter();

        const emitterDisposable = emitter.subscribe((e) => {
            expect(e.value).toBe('File uploaded');
            emitterDisposable.unsubscribe();
            done();
        });
        const fileFake = new FileModel(
            <File> { name: 'fake-name', size: 10 },
            <FileUploadOptions> { parentId: '-root-', path: 'fake-dir' }
        );
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true&include=allowableOperations');
        expect(request.method).toBe('POST');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'File uploaded'
        });
    });

    it('should make XHR error request after an error occur', (done) => {
        const emitter = new EventEmitter();

        const emitterDisposable = emitter.subscribe((e) => {
            expect(e.value).toBe('Error file uploaded');
            emitterDisposable.unsubscribe();
            done();
        });
        const fileFake = new FileModel(
            <File> { name: 'fake-name', size: 10 },
            <FileUploadOptions> { parentId: '-root-' }
        );
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);
        expect(jasmine.Ajax.requests.mostRecent().url)
            .toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true&include=allowableOperations');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 404,
            contentType: 'text/plain',
            responseText: 'Error file uploaded'
        });
    });

    it('should abort file only if it\'s safe to abort', (done) => {
        const emitter = new EventEmitter();

        const emitterDisposable = emitter.subscribe((event) => {
            expect(event.value).toEqual('File aborted');
            emitterDisposable.unsubscribe();
            done();
        });

        const fileFake = new FileModel(<File> { name: 'fake-name', size: 10000000 });
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('should let file complete and then delete node if it\'s not safe to abort', (done) => {
        const emitter = new EventEmitter();

        const emitterDisposable = emitter.subscribe((event) => {
            expect(event.value).toEqual('File deleted');
            emitterDisposable.unsubscribe();

            const deleteRequest = jasmine.Ajax.requests.mostRecent();
            expect(deleteRequest.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/myNodeId?permanent=true');
            expect(deleteRequest.method).toBe('DELETE');

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'text/plain',
                responseText: 'File deleted'
        });
            done();
        });

        const fileFake = new FileModel(<File> { name: 'fake-name', size: 10 });
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);

        const request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?autoRename=true&include=allowableOperations');
        expect(request.method).toBe('POST');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'json',
            responseText: {
                entry: {
                    id: 'myNodeId'
                }
            }
        });
    });

    it('should delete node\'s version when cancelling the upload of the new file version', (done) => {
        const emitter = new EventEmitter();

        const emitterDisposable = emitter.subscribe((event) => {
            expect(event.value).toEqual('File deleted');
            emitterDisposable.unsubscribe();

            const deleteRequest = jasmine.Ajax.requests.mostRecent();
            expect(deleteRequest.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/myNodeId/versions/1.1');
            expect(deleteRequest.method).toBe('DELETE');

            jasmine.Ajax.requests.mostRecent().respondWith({
                'status': 200,
                contentType: 'text/plain',
                responseText: 'File deleted'
            });
            done();
        });

        const fileFake = new FileModel(<File> {name: 'fake-name', size: 10}, null, 'fakeId');
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);

        const request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/fakeId/content?include=allowableOperations');
        expect(request.method).toBe('PUT');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'json',
            responseText: {
                entry: {
                    id: 'myNodeId',
                    properties: {
                        'cm:versionLabel': '1.1'
                    }
                }
            }
        });
    });

    it('If newVersion is set, name should be a param', () => {
        const uploadFileSpy = spyOn(alfrescoApiService.getInstance().upload, 'uploadFile').and.callThrough();

        const emitter = new EventEmitter();

        const filesFake = new FileModel(<File> { name: 'fake-name', size: 10 }, {
            newVersion: true
        });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        expect(uploadFileSpy).toHaveBeenCalledWith({
            name: 'fake-name',
            size: 10
        }, undefined, undefined, { newVersion: true }, {
            renditions: 'doclib',
            include: ['allowableOperations'],
            overwrite: true,
            majorVersion: undefined,
            comment: undefined,
            name: 'fake-name'
        });
    });

    it('should use custom root folder ID given to the service', (done) => {
        const emitter = new EventEmitter();

        const emitterDisposable = emitter.subscribe((e) => {
            expect(e.value).toBe('File uploaded');
            emitterDisposable.unsubscribe();
            done();
        });
        const filesFake = new FileModel(
            <File> { name: 'fake-file-name', size: 10 },
            <FileUploadOptions> { parentId: '123', path: 'fake-dir' }
        );
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        const request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('http://localhost:9876/ecm/alfresco/api/-default-/public/alfresco/versions/1/nodes/123/children?autoRename=true&include=allowableOperations');
        expect(request.method).toBe('POST');

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'text/plain',
            responseText: 'File uploaded'
        });
    });

    it('should append to the request the extra upload options', () => {
        const uploadFileSpy = spyOn(alfrescoApiService.getInstance().upload, 'uploadFile').and.callThrough();
        const emitter = new EventEmitter();

        const filesFake = new FileModel(
            <File> { name: 'fake-name', size: 10 },
            <FileUploadOptions> {
                parentId: '123', path: 'fake-dir',
                secondaryChildren: [<AssocChildBody> { assocType: 'assoc-1', childId: 'child-id' }],
                association: { assocType: 'fake-assoc' },
                targets: [<AssociationBody> { assocType: 'target-assoc', targetId: 'fake-target-id' }]
            });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        expect(uploadFileSpy).toHaveBeenCalledWith({
            name: 'fake-name',
            size: 10
        }, 'fake-dir', '123', {
            newVersion: false,
            parentId: '123',
            path: 'fake-dir',
            secondaryChildren: [<AssocChildBody> { assocType: 'assoc-1', childId: 'child-id' }],
            association: { assocType: 'fake-assoc' },
            targets: [<AssociationBody> { assocType: 'target-assoc', targetId: 'fake-target-id' }]
        }, {
            renditions: 'doclib',
            include: ['allowableOperations'],
            autoRename: true
        });
    });

    it('should start downloading the next one if a file of the list is aborted', (done) => {
        const emitter = new EventEmitter();

        service.fileUploadAborted.subscribe((e) => {
            expect(e).not.toBeNull();
        });

        service.fileUploadCancelled.subscribe((e) => {
            expect(e).not.toBeNull();
            done();
        });

        const fileFake1 = new FileModel(<File> { name: 'fake-name1', size: 10 });
        const fileFake2 = new FileModel(<File> { name: 'fake-name2', size: 10 });
        const fileList = [fileFake1, fileFake2];
        service.addToQueue(...fileList);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('should remove from the queue all the files in the excluded list', () => {
        const file1 = new FileModel(new File([''], '.git'));
        const file2 = new FileModel(new File([''], '.DS_Store'));
        const file3 = new FileModel(new File([''], 'desktop.ini'));
        const file4 = new FileModel(new File([''], 'readme.md'));
        const file5 = new FileModel(new File([''], 'test.git'));
        const result = service.addToQueue(file1, file2, file3, file4, file5);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file4);
    });

    it('should skip files if they are in an excluded folder', () => {
        const file1: any = { name: 'readmetoo.md', file : { webkitRelativePath: '/rollingPanda/' }};
        const file2: any = { name: 'readme.md', file : { webkitRelativePath: '/test/' }};
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should match the folder in case insensitive way', () => {
        const file1: any = { name: 'readmetoo.md', file : { webkitRelativePath: '/rollingPanda/' }};
        const file2: any = { name: 'readme.md', file : { webkitRelativePath: '/test/' }};
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should skip files if they are in an excluded folder when path is in options', () => {
        const file1: any = { name: 'readmetoo.md', file : {}, options: { path: '/rollingPanda/'}};
        const file2: any = { name: 'readme.md', file : { webkitRelativePath: '/test/' }};
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should call onUploadDeleted if file was deleted', async(() => {
        const file = <any> ({ status: FileUploadStatus.Deleted });
        spyOn(service.fileUploadDeleted, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadDeleted.next).toHaveBeenCalled();
    }));

    it('should call fileUploadError if file has error status', async(() => {
        const file = <any> ({ status: FileUploadStatus.Error });
        spyOn(service.fileUploadError, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadError.next).toHaveBeenCalled();
    }));

    it('should call fileUploadCancelled if file is in pending', async(() => {
        const file = <any> ({ status: FileUploadStatus.Pending });
        spyOn(service.fileUploadCancelled, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadCancelled.next).toHaveBeenCalled();
    }));

    it('Should not pass rendition if it is disabled', () => {
        mockProductInfo.next({ status: { isThumbnailGenerationEnabled: false } } as EcmProductVersionModel);

        const uploadFileSpy = spyOn(alfrescoApiService.getInstance().upload, 'uploadFile').and.callThrough();
        const emitter = new EventEmitter();

        const filesFake = new FileModel(<File> { name: 'fake-name', size: 10 }, {
            newVersion: true
        });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        expect(uploadFileSpy).toHaveBeenCalledWith({
            name: 'fake-name',
            size: 10
        }, undefined, undefined, { newVersion: true }, {
            include: ['allowableOperations'],
            overwrite: true,
               majorVersion: undefined,
            comment: undefined,
            name: 'fake-name'
        });
    });
});
