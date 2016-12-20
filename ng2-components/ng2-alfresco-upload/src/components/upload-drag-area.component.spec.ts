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
import { UploadDragAreaComponent } from './upload-drag-area.component';
import { DebugElement }    from '@angular/core';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    AlfrescoTranslationService,
    CoreModule
} from 'ng2-alfresco-core';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';
import { EventEmitter } from '@angular/core';

describe('Test ng2-alfresco-upload UploadDragArea', () => {

    let component: any;
    let fixture: ComponentFixture<UploadDragAreaComponent>;
    let debug: DebugElement;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [UploadDragAreaComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                UploadService,
                { provide: AlfrescoTranslationService, useClass: TranslationMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UploadDragAreaComponent);

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
        spyOn(console, 'error');

        let fileFake = new File([''], 'folder-fake', {type: ''});
        component.onFilesDropped([fileFake]);

        expect(console.error).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });

    it('should show an folder non supported error in the notification bar when the file type is empty', () => {
        component._showErrorNotificationBar = jasmine.createSpy('_showErrorNotificationBar');
        component.showUdoNotificationBar = true;

        let fileFake = new File([''], 'folder-fake', {type: ''});
        component.onFilesDropped([fileFake]);

        expect(component._showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });

    it('should upload the list of files dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = false;
        component._uploaderService.addToQueue = jasmine.createSpy('addToQueue');
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();
        let fileFake = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(component._uploaderService.addToQueue).toHaveBeenCalledWith(filesList);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
    });

    it('should show the loading messages in the notification bar when the files are dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = true;
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        component._showUndoNotificationBar = jasmine.createSpy('_showUndoNotificationBar');

        fixture.detectChanges();
        let fileFake = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
        let filesList = [fileFake];

        component.onFilesDropped(filesList);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
        expect(component._showUndoNotificationBar).toHaveBeenCalled();
    });

    it('should upload a file when dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.onSuccess = null;

        fixture.detectChanges();
        spyOn(component._uploaderService, 'uploadFilesInTheQueue');

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
        expect(component._uploaderService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });

    it('should upload a file with a custom root folder ID when dropped', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.rootFolderId = '-my-';
        component.onSuccess = null;

        fixture.detectChanges();
        spyOn(component._uploaderService, 'uploadFilesInTheQueue');

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
        expect(component._uploaderService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-my-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });

    it('should throws an exception and show it in the notification bar when the folder already exist', done => {
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
        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakePromise);
        spyOn(component, '_showErrorNotificationBar').and.callFake( () => {
            expect(component._showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
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
        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakePromise);
        spyOn(component, 'onFilesEntityDropped').and.callFake( () => {
            expect(component.onFilesEntityDropped).toHaveBeenCalledWith(itemEntity);
        });

        spyOn(component, '_showUndoNotificationBar').and.callFake( () => {
            expect(component._showUndoNotificationBar).toHaveBeenCalled();
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
