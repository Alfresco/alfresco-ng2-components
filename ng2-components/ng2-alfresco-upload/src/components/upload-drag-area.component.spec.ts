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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { AlfrescoTranslationService, CoreModule, LogService, LogServiceMock } from 'ng2-alfresco-core';

import { UploadDragAreaComponent } from './upload-drag-area.component';
import { FileDraggableDirective } from '../directives/file-draggable.directive';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';
import { FileModel } from '../models/file.model';

let fakeShareDataRow = {
    obj: {
        entry: {
            createdAt: '2017-06-04T04:32:15.597Z',
            path: {
                name: '/Company Home/User Homes/Test',
                isComplete: true,
                elements: [
                    {
                        id: '94acfc73-7014-4475-9bd9-93a2162f0f8c',
                        name: 'Company Home'
                    },
                    {
                        id: '55052317-7e59-4058-8e07-769f41e615e1',
                        name: 'User Homes'
                    },
                    {
                        id: '70e1cc6a-6918-468a-b84a-1048093b06fd',
                        name: 'Test'
                    }
                ]
            },
            isFolder: true,
            name: 'pippo',
            id: '7462d28e-bd43-4b91-9e7b-0d71598680ac',
            nodeType: 'cm:folder',
            allowableOperations: [
                'delete',
                'update',
                'create'
            ]
        }
    }
};

describe('UploadDragAreaComponent', () => {

    let component: UploadDragAreaComponent;
    let fixture: ComponentFixture<UploadDragAreaComponent>;
    let debug: DebugElement;
    let element: HTMLElement;
    let uploadService: UploadService;
    let logService: LogService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                FileDraggableDirective,
                UploadDragAreaComponent
            ],
            providers: [
                UploadService,
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                { provide: LogService, useClass: LogServiceMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        logService = TestBed.get(LogService);
        fixture = TestBed.createComponent(UploadDragAreaComponent);
        uploadService = TestBed.get(UploadService);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should upload the list of files dropped', (done) => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showNotificationBar = false;
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();
        const file = <File> {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [file];

        spyOn(uploadService, 'addToQueue').and.callFake((f: FileModel) => {
            expect(f.file).toBe(file);
            done();
        });

        component.onFilesDropped(filesList);
    });

    it('should show the loading messages in the notification bar when the files are dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showNotificationBar = true;
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        component.showUndoNotificationBar = jasmine.createSpy('_showUndoNotificationBar');

        fixture.detectChanges();
        let fileFake = <File> {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
        expect(component.showUndoNotificationBar).toHaveBeenCalled();
    });

    it('should upload a file when dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.onSuccess = null;

        fixture.detectChanges();
        spyOn(uploadService, 'uploadFilesInTheQueue');

        let itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: (callbackFile) => {
                let fileFake = new File(['fakefake'], 'file-fake.png', {type: 'image/png'});
                callbackFile(fileFake);
            }
        };

        component.onFilesEntityDropped(itemEntity);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
    });

    it('should upload a file with a custom root folder ID when dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.rootFolderId = '-my-';
        component.onSuccess = null;

        fixture.detectChanges();
        spyOn(uploadService, 'uploadFilesInTheQueue');

        let itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: (callbackFile) => {
                let fileFake = new File(['fakefake'], 'file-fake.png', {type: 'image/png'});
                callbackFile(fileFake);
            }
        };

        component.onFilesEntityDropped(itemEntity);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith(null);
    });

    it('should upload a file when user has create permission on target folder', async(() => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.rootFolderId = '-my-';
        component.enabled = false;

        let fakeItem = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: (callbackFile) => {
                let fileFake = new File(['fakefake'], 'file-fake.png', {type: 'image/png'});
                callbackFile(fileFake);
            }
        };

        fixture.detectChanges();
        spyOn(uploadService, 'uploadFilesInTheQueue').and.returnValue(Promise.resolve(fakeItem));
        component.onSuccess.subscribe((val) => {
            expect(val).not.toBeNull();
        });

        let fakeCustomEvent: CustomEvent = new CustomEvent('CustomEvent', {
            detail: {
                data: fakeShareDataRow,
                files: [fakeItem]
            }
        });

        component.onUploadFiles(fakeCustomEvent);
    }));

});
