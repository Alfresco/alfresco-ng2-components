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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentService, UploadService, TranslationService, setupTestBed, CoreModule } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { UploadButtonComponent } from './upload-button.component';
import { TranslationMock } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UploadButtonComponent', () => {

    let file = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
    let fakeEvent = {
        currentTarget: {
            files: [file]
        },
        target: { value: 'fake-name-1' }
    };

    let fakeFolderNodeWithPermission = {
        entry: {
            allowableOperations: [
                'create',
                'update'
            ],
            isFolder: true,
            name: 'Folder Fake Name',
            nodeType: 'cm:folder'
        }
    };

    let component: UploadButtonComponent;
    let fixture: ComponentFixture<UploadButtonComponent>;
    let uploadService: UploadService;
    let contentService: ContentService;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        declarations: [
            UploadButtonComponent
        ],
        providers: [
            UploadService,
            ContentService,
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadButtonComponent);
        uploadService = TestBed.get(UploadService);
        contentService = TestBed.get(ContentService);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should render upload-single-file button as default', () => {
        component.multipleFiles = false;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-single-file')).toBeDefined();
    });

    it('should render upload-multiple-file button if multipleFiles is true', () => {
        component.multipleFiles = true;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-files')).toBeDefined();
    });

    it('should render an uploadFolder button if uploadFolder is true', () => {
        component.uploadFolders = true;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder')).toBeDefined();
    });

    it('should disable uploadFolder button if disabled is true', () => {
        component.disabled = true;
        component.uploadFolders = true;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder').getAttribute('disabled')).toBe('true');
    });

    it('should disable upload-single-file button if disabled is true', () => {
        component.disabled = true;
        component.multipleFiles = false;
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-single-file').getAttribute('disabled')).toBe('true');
    });

    it('should call uploadFile with the default root folder', () => {
        component.rootFolderId = '-root-';
        component.success = null;

        spyOn(contentService, 'getNode').and.returnValue(of(fakeFolderNodeWithPermission));

        component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();

        component.onFilesAdded(fakeEvent);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
    });

    it('should call uploadFile with a custom root folder', () => {
        component.rootFolderId = '-my-';
        component.success = null;

        spyOn(contentService, 'getNode').and.returnValue(of(fakeFolderNodeWithPermission));
        component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });

        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();

        component.onFilesAdded(fakeEvent);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
    });

    it('should not call uploadFiles if rootFolderId is null', () => {
        component.rootFolderId = null;
        component.ngOnChanges({ rootFolderId: new SimpleChange(null, null, true) });

        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();

        component.onFilesAdded(fakeEvent);
        expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
    });

    it('should create a folder and emit an File uploaded event', (done) => {
        component.rootFolderId = '-my-';

        spyOn(contentService, 'createFolder').and.returnValue(of(true));
        spyOn(contentService, 'getNode').and.returnValue(of(fakeFolderNodeWithPermission));

        component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });
        fixture.detectChanges();

        component.success.subscribe(e => {
            expect(e.value).toEqual('File uploaded');
            done();
        });

        spyOn(component, 'uploadFiles').and.callFake(() => {
            component.success.emit({
                value: 'File uploaded'
            });
        });
        component.onDirectoryAdded(fakeEvent);
    });

    it('should by default the title of the button get from the JSON file', () => {
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        component.uploadFolders = false;
        component.multipleFiles = false;

        expect(compiled.querySelector('#upload-single-file-label').innerText).toEqual('FILE_UPLOAD.BUTTON.UPLOAD_FILE');

        component.multipleFiles = true;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-file-label').innerText).toEqual('FILE_UPLOAD.BUTTON.UPLOAD_FILE');

        component.uploadFolders = true;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder-label').innerText).toEqual('FILE_UPLOAD.BUTTON.UPLOAD_FOLDER');
    });

    it('should staticTitle properties change the title of the upload buttons', () => {
        let compiled = fixture.debugElement.nativeElement;
        component.staticTitle = 'test-text';
        component.uploadFolders = false;
        component.multipleFiles = false;

        fixture.detectChanges();
        expect(compiled.querySelector('#upload-single-file-label-static').textContent).toEqual('test-text');

        component.multipleFiles = true;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-file-label-static').textContent).toEqual('test-text');

        component.uploadFolders = true;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder-label-static').textContent).toEqual('test-text');
    });

    describe('fileSize', () => {

        const files: File[] = [
            <File> { name: 'bigFile.png', size: 1000 },
            <File> { name: 'smallFile.png', size: 10 }
        ];

        let addToQueueSpy;

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should filter out file, which are too big if max file size is set', () => {
            component.maxFilesSize = 100;

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(1);
            expect(filesCalledWith[0].name).toBe('smallFile.png');
        });

        it('should filter out all files if maxFilesSize is 0', () => {
            component.maxFilesSize = 0;

            component.uploadFiles(files);

            expect(addToQueueSpy.calls.mostRecent()).toBeUndefined();
        });

        it('should allow file of 0 size when the max file size is set to 0', () => {
            const zeroFiles: File[] = [
                <File> { name: 'zeroFile.png', size: 0 }
            ];
            component.maxFilesSize = 0;

            component.uploadFiles(zeroFiles);

            expect(addToQueueSpy.calls.mostRecent()).toBeDefined();
        });

        it('should filter out all files if maxFilesSize is <0', () => {
            component.maxFilesSize = -2;

            component.uploadFiles(files);

            expect(addToQueueSpy.calls.mostRecent()).toBeUndefined();
        });

        it('should output an error when you try to upload a file too big', (done) => {
            component.maxFilesSize = 100;

            component.error.subscribe(() => {
                done();
            });

            component.uploadFiles(files);
        });

        it('should not filter out files if max file size is not set', () => {
            component.maxFilesSize = null;

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(2);
        });
    });

    describe('uploadFiles', () => {

        const files: File[] = [
            <File> { name: 'phobos.jpg' },
            <File> { name: 'deimos.png' },
            <File> { name: 'ganymede.bmp' }
        ];

        let addToQueueSpy;

        beforeEach(() => {
            addToQueueSpy = spyOn(uploadService, 'addToQueue');
        });

        it('should filter out file, which is not part of the acceptedFilesType', () => {
            component.acceptedFilesType = '.jpg';

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(1, 'Files should contain only one element');
            expect(filesCalledWith[0].name).toBe('phobos.jpg', 'png file should be filtered out');
        });

        it('should filter out files, which are not part of the acceptedFilesType', () => {
            component.acceptedFilesType = '.jpg,.png';

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(2, 'Files should contain two elements');
            expect(filesCalledWith[0].name).toBe('phobos.jpg');
            expect(filesCalledWith[1].name).toBe('deimos.png');
        });

        it('should not filter out anything if acceptedFilesType is wildcard', () => {
            component.acceptedFilesType = '*';

            component.uploadFiles(files);

            const filesCalledWith = addToQueueSpy.calls.mostRecent().args;
            expect(filesCalledWith.length).toBe(3, 'Files should contain all elements');
            expect(filesCalledWith[0].name).toBe('phobos.jpg');
            expect(filesCalledWith[1].name).toBe('deimos.png');
            expect(filesCalledWith[2].name).toBe('ganymede.bmp');
        });

        it('should not add any file to que if everything is filtered out', () => {
            component.acceptedFilesType = 'doc';

            component.uploadFiles(files);

            expect(addToQueueSpy).not.toHaveBeenCalled();
        });
    });

    describe('uploadFiles permission', () => {
        let fakeNodeWithNoPermission;

        beforeEach(() => {
            fakeNodeWithNoPermission = {
                entry: {}
            };
        });

        it('should not call uploadFiles for node without permission', () => {
            component.rootFolderId = 'nodeId';

            spyOn(contentService, 'getNode').and.returnValue(of(fakeNodeWithNoPermission));
            component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });

            uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

            fixture.detectChanges();

            component.onFilesAdded(fakeEvent);
            expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
        });

        it('should not call uploadFiles when getNode fails', () => {
            component.rootFolderId = 'nodeId';

            spyOn(contentService, 'getNode').and.returnValue(throwError('error'));
            component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });

            uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

            fixture.detectChanges();

            component.onFilesAdded(fakeEvent);
            expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
        });

        it('should emit an error message when getNode fails', (done) => {
            component.rootFolderId = 'nodeId';

            spyOn(contentService, 'getNode').and.returnValue(throwError('error'));

            component.error.subscribe((value) => {
                expect(value).toBe('error');
                done();
            });

            component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });
            fixture.detectChanges();

            component.onFilesAdded(fakeEvent);
        });

        it('should not call uploadFiles for node with other permissions', () => {
            component.rootFolderId = 'nodeId';

            fakeNodeWithNoPermission.entry.allowableOperations = ['other'];

            spyOn(contentService, 'getNode').and.returnValue(of(fakeNodeWithNoPermission));
            component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });

            uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

            fixture.detectChanges();

            component.onFilesAdded(fakeEvent);
            expect(uploadService.uploadFilesInTheQueue).not.toHaveBeenCalled();
        });

        it('should call uploadFiles when node has CREATE', () => {
            component.rootFolderId = 'nodeId';

            spyOn(contentService, 'getNode').and.returnValue(of(fakeFolderNodeWithPermission));
            component.ngOnChanges({ rootFolderId: new SimpleChange(null, component.rootFolderId, true) });

            uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

            fixture.detectChanges();

            component.onFilesAdded(fakeEvent);
            expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalled();
        });
    });
});
