/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AppConfigService, AppConfigServiceMock } from '@alfresco/adf-core';
import { UploadService } from './upload.service';
import { RepositoryInfo } from '@alfresco/js-api';
import { BehaviorSubject } from 'rxjs';
import { DiscoveryApiService } from '../../common/services/discovery-api.service';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';
import { AlfrescoApiService } from '../../services';
import { AlfrescoApiServiceMock } from '../../mock';

describe('UploadService', () => {
    let service: UploadService;
    let appConfigService: AppConfigService;
    let uploadFileSpy: jasmine.Spy;

    const mockProductInfo = new BehaviorSubject<RepositoryInfo>(null);

    const createMockPromiseWithEvents = (responseData?: any, shouldError = false) => {
        const handlers: any = {};
        const promise: any = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldError) {
                    if (handlers.error) {
                        handlers.error(responseData || { status: 404 });
                    }
                    reject(responseData);
                } else {
                    if (handlers.success) {
                        handlers.success(responseData);
                    }
                    resolve(responseData);
                }
            }, 0);
        });

        promise.on = (event: string, handler: (data?: any) => void) => {
            handlers[event] = handler;
            return promise;
        };

        promise.abort = () => {
            if (handlers.abort) {
                handlers.abort();
            }
        };

        promise.catch = (handler: (error: any) => void) => Promise.prototype.catch.call(promise, handler);

        return promise;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                UploadService,
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                {
                    provide: DiscoveryApiService,
                    useValue: {
                        ecmProductInfo$: mockProductInfo
                    }
                }
            ]
        });
        appConfigService = TestBed.inject(AppConfigService);
        appConfigService.config = {
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
        service.queue = [];
        service.clearCache();

        uploadFileSpy = spyOn(service.uploadApi, 'uploadFile').and.callThrough();

        mockProductInfo.next({ status: { isThumbnailGenerationEnabled: true } } as RepositoryInfo);
    });

    it('should return an empty queue if no elements are added', () => {
        expect(service.getQueue().length).toEqual(0);
    });

    it('should add an element in the queue and returns it', () => {
        const filesFake = new FileModel({ name: 'fake-name', size: 10 } as File);
        service.addToQueue(filesFake);
        expect(service.getQueue().length).toEqual(1);
    });

    it('should add two elements in the queue and returns them', () => {
        const filesFake = [new FileModel({ name: 'fake-name', size: 10 } as File), new FileModel({ name: 'fake-name2', size: 20 } as File)];
        service.addToQueue(...filesFake);
        expect(service.getQueue().length).toEqual(2);
    });

    it('should not have the queue uploading if all files are complete, cancelled, aborted, errored or deleted', () => {
        const file1 = new FileModel({ name: 'fake-file-1', size: 10 } as File);
        const file2 = new FileModel({ name: 'fake-file-2', size: 20 } as File);
        const file3 = new FileModel({ name: 'fake-file-3', size: 30 } as File);
        const file4 = new FileModel({ name: 'fake-file-4', size: 40 } as File);
        const file5 = new FileModel({ name: 'fake-file-5', size: 50 } as File);

        file1.status = FileUploadStatus.Complete;
        file2.status = FileUploadStatus.Cancelled;
        file3.status = FileUploadStatus.Aborted;
        file4.status = FileUploadStatus.Error;
        file5.status = FileUploadStatus.Deleted;

        service.addToQueue(file1, file2, file3, file4, file5);

        expect(service.isUploading()).toBe(false);
    });

    it('should have the queue still uploading if some files are still pending, starting or in progress', () => {
        const file1 = new FileModel({ name: 'fake-file-1', size: 10 } as File);
        const file2 = new FileModel({ name: 'fake-file-2', size: 20 } as File);

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

        const mockResponse = { entry: { id: 'node-id' } };
        const mockPromise = createMockPromiseWithEvents(mockResponse);

        uploadFileSpy.and.returnValue(mockPromise);

        const emitterDisposable = emitter.subscribe((e) => {
            expect(e.value).toEqual(mockResponse);
            emitterDisposable.unsubscribe();
            done();
        });

        const fileFake = new FileModel({ name: 'fake-name', size: 10 } as File, { parentId: '-root-', path: 'fake-dir' });
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        expect(uploadFileSpy).toHaveBeenCalled();
    });

    it('should make XHR error request after an error occur', (done) => {
        const emitter = new EventEmitter();

        const mockPromise = createMockPromiseWithEvents({ status: 404 }, true);
        uploadFileSpy.and.returnValue(mockPromise);

        const emitterDisposable = emitter.subscribe((e) => {
            expect(e.value).toBe('Error file uploaded');
            emitterDisposable.unsubscribe();
            done();
        });

        const fileFake = new FileModel({ name: 'fake-name', size: 10 } as File, { parentId: '-root-' });
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(null, emitter);

        expect(uploadFileSpy).toHaveBeenCalled();
    });

    it('should abort file only if it is safe to abort', (done) => {
        const emitter = new EventEmitter();

        const mockPromise = createMockPromiseWithEvents();
        uploadFileSpy.and.returnValue(mockPromise);

        const emitterDisposable = emitter.subscribe((event) => {
            expect(event.value).toEqual('File aborted');
            emitterDisposable.unsubscribe();
            done();
        });

        const fileFake = new FileModel({ name: 'fake-name', size: 10000000 } as File);
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('should let file complete and then delete node if it is not safe to abort', (done) => {
        const emitter = new EventEmitter();

        const mockUploadResponse = { entry: { id: 'myNodeId' } };
        const mockPromise = createMockPromiseWithEvents(mockUploadResponse);
        uploadFileSpy.and.returnValue(mockPromise);

        const deleteNodeSpy = spyOn(service.nodesApi, 'deleteNode').and.returnValue(Promise.resolve());

        const emitterDisposable = emitter.subscribe((event) => {
            if (event.value === 'File deleted') {
                expect(deleteNodeSpy).toHaveBeenCalledWith('myNodeId', { permanent: true });
                emitterDisposable.unsubscribe();
                done();
            }
        });

        const fileFake = new FileModel({ name: 'fake-name', size: 10 } as File);
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('should delete node version when cancelling the upload of the new file version', (done) => {
        const emitter = new EventEmitter();

        const mockUploadResponse = {
            entry: {
                id: 'myNodeId',
                properties: {
                    'cm:versionLabel': '1.1'
                }
            }
        };
        const mockPromise = createMockPromiseWithEvents(mockUploadResponse);

        spyOn(service.nodesApi, 'updateNodeContent').and.returnValue(mockPromise);
        const deleteVersionSpy = spyOn(service.versionsApi, 'deleteVersion').and.returnValue(Promise.resolve());

        const emitterDisposable = emitter.subscribe((event) => {
            if (event.value === 'File deleted') {
                expect(deleteVersionSpy).toHaveBeenCalledWith('myNodeId', '1.1');
                emitterDisposable.unsubscribe();
                done();
            }
        });

        const fileFake = new FileModel({ name: 'fake-name', size: 10 } as File, null, 'fakeId');
        service.addToQueue(fileFake);
        service.uploadFilesInTheQueue(emitter);

        const file = service.getQueue();
        service.cancelUpload(...file);
    });

    it('If newVersion is set, name should be a param', () => {
        const emitter = new EventEmitter();
        const filesFake = new FileModel({ name: 'fake-name', size: 10 } as File, { newVersion: true });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        expect(uploadFileSpy).toHaveBeenCalledWith(
            {
                name: 'fake-name',
                size: 10
            },
            undefined,
            undefined,
            { newVersion: true, name: 'fake-name', nodeType: undefined },
            {
                renditions: 'doclib',
                include: ['allowableOperations'],
                overwrite: true,
                majorVersion: undefined,
                comment: undefined,
                name: 'fake-name'
            }
        );
    });

    it('should use custom root folder ID given to the service', (done) => {
        const emitter = new EventEmitter();

        const mockResponse = { entry: { id: 'node-id' } };
        const mockPromise = createMockPromiseWithEvents(mockResponse);
        uploadFileSpy.and.returnValue(mockPromise);

        const emitterDisposable = emitter.subscribe((e) => {
            expect(e.value).toEqual(mockResponse);
            emitterDisposable.unsubscribe();
            done();
        });

        const filesFake = new FileModel({ name: 'fake-file-name', size: 10 } as File, { parentId: '123', path: 'fake-dir' });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue(emitter);

        expect(uploadFileSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ name: 'fake-file-name' }),
            'fake-dir',
            '123',
            jasmine.any(Object),
            jasmine.any(Object)
        );
    });

    describe('versioningEnabled', () => {
        it('should upload with "versioningEnabled" parameter taken from file options', () => {
            const model = new FileModel({ name: 'file-name', size: 10 } as File, { versioningEnabled: true });

            service.addToQueue(model);
            service.uploadFilesInTheQueue();

            expect(uploadFileSpy).toHaveBeenCalledWith(
                {
                    name: 'file-name',
                    size: 10
                },
                undefined,
                undefined,
                { newVersion: false, name: 'file-name', nodeType: undefined },
                {
                    include: ['allowableOperations'],
                    renditions: 'doclib',
                    versioningEnabled: true,
                    autoRename: true
                }
            );
        });

        it('should not use "versioningEnabled" if not explicitly provided', () => {
            const model = new FileModel({ name: 'file-name', size: 10 } as File, {});

            service.addToQueue(model);
            service.uploadFilesInTheQueue();

            expect(uploadFileSpy).toHaveBeenCalledWith(
                {
                    name: 'file-name',
                    size: 10
                },
                undefined,
                undefined,
                { newVersion: false, name: 'file-name', nodeType: undefined },
                {
                    include: ['allowableOperations'],
                    renditions: 'doclib',
                    autoRename: true
                }
            );
        });
    });

    it('should append the extra upload options to the request', () => {
        const filesFake = new FileModel({ name: 'fake-name', size: 10 } as File, {
            parentId: '123',
            path: 'fake-dir',
            secondaryChildren: [{ assocType: 'assoc-1', childId: 'child-id' }],
            association: { assocType: 'fake-assoc' },
            targets: [{ assocType: 'target-assoc', targetId: 'fake-target-id' }]
        });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue();

        expect(uploadFileSpy).toHaveBeenCalledWith(
            {
                name: 'fake-name',
                size: 10
            },
            'fake-dir',
            '123',
            {
                newVersion: false,
                name: 'fake-name',
                nodeType: undefined,
                parentId: '123',
                path: 'fake-dir',
                secondaryChildren: [{ assocType: 'assoc-1', childId: 'child-id' }],
                association: { assocType: 'fake-assoc' },
                targets: [{ assocType: 'target-assoc', targetId: 'fake-target-id' }]
            },
            {
                renditions: 'doclib',
                include: ['allowableOperations'],
                autoRename: true
            }
        );
    });

    it('should start downloading the next one if a file of the list is aborted', (done) => {
        const mockResponse1 = { entry: { id: 'node-id-1' } };
        const mockResponse2 = { entry: { id: 'node-id-2' } };
        const mockPromise1 = createMockPromiseWithEvents(mockResponse1);
        const mockPromise2 = createMockPromiseWithEvents(mockResponse2);

        uploadFileSpy.and.returnValues(mockPromise1, mockPromise2);

        service.fileUploadAborted.subscribe((e) => {
            expect(e).not.toBeNull();
        });

        service.fileUploadCancelled.subscribe((e) => {
            expect(e).not.toBeNull();
            done();
        });

        const fileFake1 = new FileModel({ name: 'fake-name1', size: 10 } as File);
        const fileFake2 = new FileModel({ name: 'fake-name2', size: 10 } as File);
        const fileList = [fileFake1, fileFake2];
        service.addToQueue(...fileList);
        service.uploadFilesInTheQueue();

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
        const file1: any = { name: 'readmetoo.md', file: { webkitRelativePath: '/rollingPanda/' } };
        const file2: any = { name: 'readme.md', file: { webkitRelativePath: '/test/' } };
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should match the folder in case insensitive way', () => {
        const file1: any = { name: 'readmetoo.md', file: { webkitRelativePath: '/rollingPanda/' } };
        const file2: any = { name: 'readme.md', file: { webkitRelativePath: '/test/' } };
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should skip files if they are in an excluded folder when path is in options', () => {
        const file1: any = { name: 'readmetoo.md', file: {}, options: { path: '/rollingPanda/' } };
        const file2: any = { name: 'readme.md', file: { webkitRelativePath: '/test/' } };
        const result = service.addToQueue(file1, file2);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(file2);
    });

    it('should call onUploadDeleted if file was deleted', () => {
        const file = { status: FileUploadStatus.Deleted } as FileModel;
        spyOn(service.fileUploadDeleted, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadDeleted.next).toHaveBeenCalled();
    });

    it('should call fileUploadError if file has error status', () => {
        const file = { status: FileUploadStatus.Error } as FileModel;
        spyOn(service.fileUploadError, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadError.next).toHaveBeenCalled();
    });

    it('should call fileUploadCancelled if file is in pending', () => {
        const file = { status: FileUploadStatus.Pending } as FileModel;
        spyOn(service.fileUploadCancelled, 'next');

        service.cancelUpload(file);

        expect(service.fileUploadCancelled.next).toHaveBeenCalled();
    });

    it('Should not pass rendition if it is disabled', () => {
        mockProductInfo.next({ status: { isThumbnailGenerationEnabled: false } } as RepositoryInfo);

        const filesFake = new FileModel({ name: 'fake-name', size: 10 } as File, { newVersion: true });
        service.addToQueue(filesFake);
        service.uploadFilesInTheQueue();

        expect(uploadFileSpy).toHaveBeenCalledWith(
            {
                name: 'fake-name',
                size: 10
            },
            undefined,
            undefined,
            { newVersion: true, name: 'fake-name', nodeType: undefined },
            {
                include: ['allowableOperations'],
                overwrite: true,
                majorVersion: undefined,
                comment: undefined,
                name: 'fake-name'
            }
        );
    });
});
