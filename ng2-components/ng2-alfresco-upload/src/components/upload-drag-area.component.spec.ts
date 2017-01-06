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
import { EventEmitter, DebugElement } from '@angular/core';
import { AlfrescoTranslateService, CoreModule, LogService, LogServiceMock } from 'ng2-alfresco-core';

import { UploadDragAreaComponent } from './upload-drag-area.component';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';

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
                UploadDragAreaComponent
            ],
            providers: [
                UploadService,
                { provide: AlfrescoTranslateService, useClass: TranslationMock },
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

    it('should show an folder non supported error in console when the file type is empty', () => {
        component.showUdoNotificationBar = false;
        spyOn(logService, 'error');

        let fileFake = new File([''], 'folder-fake', {type: ''});
        component.onFilesDropped([fileFake]);

        expect(logService.error).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });

    it('should show an folder non supported error in the notification bar when the file type is empty', () => {
        component.showErrorNotificationBar = jasmine.createSpy('_showErrorNotificationBar');
        component.showUdoNotificationBar = true;

        let fileFake = new File([''], 'folder-fake', {type: ''});
        component.onFilesDropped([fileFake]);

        expect(component.showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });

    it('should upload the list of files dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = false;
        uploadService.addToQueue = jasmine.createSpy('addToQueue');
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();
        let fileFake = <File> {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(uploadService.addToQueue).toHaveBeenCalledWith(filesList);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
    });

    it('should show the loading messages in the notification bar when the files are dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = true;
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        component.showUndoNotificationBar = jasmine.createSpy('_showUndoNotificationBar');

        fixture.detectChanges();
        let fileFake = <File> {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
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
        expect(uploadService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
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
        expect(uploadService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-my-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });

    xit('should throws an exception and show it in the notification bar when the folder already exist', done => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.showUdoNotificationBar = true;

        fixture.detectChanges();
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
        spyOn(uploadService, 'callApiCreateFolder').and.returnValue(fakePromise);
        spyOn(component, 'showErrorNotificationBar').and.callFake( () => {
            expect(component.showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            done();
        });

        let folderEntry = {
            fullPath: '/folder-duplicate-fake',
            isDirectory: true,
            isFile: false,
            name: 'folder-duplicate-fake'
        };

        component.onFolderEntityDropped(folderEntry);
    });

    it('should create a folder and call onFilesEntityDropped with the file inside the folder', done => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.onSuccess = new EventEmitter();

        fixture.detectChanges();

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

        let fakeRest = {
            entry: {
                isFile: false,
                isFolder: true,
                name: 'folder-fake'
            }
        };
        let fakePromise = new Promise(function (resolve, reject) {
            resolve(fakeRest);
        });
        spyOn(uploadService, 'callApiCreateFolder').and.returnValue(fakePromise);
        spyOn(component, 'onFilesEntityDropped').and.callFake( () => {
            expect(component.onFilesEntityDropped).toHaveBeenCalledWith(itemEntity);
        });

        spyOn(component, 'showUndoNotificationBar').and.callFake( () => {
            expect(component.showUndoNotificationBar).toHaveBeenCalled();
            done();
        });

        let folderEntry = {
            fullPath: '/folder-fake',
            isDirectory: true,
            isFile: false,
            name: 'folder-fake',
            createReader: () => {
                return {
                    readEntries: (callback) => {
                        let entries = [itemEntity, itemEntity];
                        callback(entries);
                    }
                };
            }
        };

        component.onFolderEntityDropped(folderEntry);
    });
});
