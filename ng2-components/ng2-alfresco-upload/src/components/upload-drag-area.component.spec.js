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
var testing_1 = require("@angular/core/testing");
var upload_drag_area_component_1 = require("./upload-drag-area.component");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var translation_service_mock_1 = require("../assets/translation.service.mock");
var upload_service_1 = require("../services/upload.service");
var core_1 = require("@angular/core");
describe('Test ng2-alfresco-upload UploadDragArea', function () {
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [upload_drag_area_component_1.UploadDragAreaComponent],
            providers: [
                ng2_alfresco_core_1.AlfrescoSettingsService,
                ng2_alfresco_core_1.AlfrescoAuthenticationService,
                ng2_alfresco_core_1.AlfrescoApiService,
                upload_service_1.UploadService,
                { provide: ng2_alfresco_core_1.AlfrescoTranslationService, useClass: translation_service_mock_1.TranslationMock }
            ]
        }).compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(upload_drag_area_component_1.UploadDragAreaComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        fixture.destroy();
        testing_1.TestBed.resetTestingModule();
    });
    it('should show an folder non supported error in console when the file type is empty', function () {
        component.showUdoNotificationBar = false;
        spyOn(console, 'error');
        var fileFake = new File([''], 'folder-fake', { type: '' });
        component.onFilesDropped([fileFake]);
        expect(console.error).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });
    it('should show an folder non supported error in the notification bar when the file type is empty', function () {
        component._showErrorNotificationBar = jasmine.createSpy('_showErrorNotificationBar');
        component.showUdoNotificationBar = true;
        var fileFake = new File([''], 'folder-fake', { type: '' });
        component.onFilesDropped([fileFake]);
        expect(component._showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_NOT_SUPPORTED');
    });
    it('should upload the list of files dropped', function () {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = false;
        component._uploaderService.addToQueue = jasmine.createSpy('addToQueue');
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        fixture.detectChanges();
        var fileFake = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
        var filesList = [fileFake];
        component.onFilesDropped(filesList);
        expect(component._uploaderService.addToQueue).toHaveBeenCalledWith(filesList);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
    });
    it('should show the loading messages in the notification bar when the files are dropped', function () {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component.showUdoNotificationBar = true;
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        component._showUndoNotificationBar = jasmine.createSpy('_showUndoNotificationBar');
        fixture.detectChanges();
        var fileFake = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
        var filesList = [fileFake];
        component.onFilesDropped(filesList);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
        expect(component._showUndoNotificationBar).toHaveBeenCalled();
    });
    it('should upload a file when dropped', function () {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.onSuccess = null;
        fixture.detectChanges();
        spyOn(component._uploaderService, 'uploadFilesInTheQueue');
        var itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: function (callbackFile) {
                var fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                callbackFile(fileFake);
            }
        };
        component.onFilesEntityDropped(itemEntity);
        expect(component._uploaderService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });
    it('should upload a file with a custom root folder ID when dropped', function () {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.rootFolderId = '-my-';
        component.onSuccess = null;
        fixture.detectChanges();
        spyOn(component._uploaderService, 'uploadFilesInTheQueue');
        var itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: function (callbackFile) {
                var fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                callbackFile(fileFake);
            }
        };
        component.onFilesEntityDropped(itemEntity);
        expect(component._uploaderService.uploadFilesInTheQueue)
            .toHaveBeenCalledWith('-my-', '/root-fake-/sites-fake/document-library-fake/folder-fake/', null);
    });
    it('should throws an exception and show it in the notification bar when the folder already exist', function (done) {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.showUdoNotificationBar = true;
        fixture.detectChanges();
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
        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakePromise);
        spyOn(component, '_showErrorNotificationBar').and.callFake(function () {
            expect(component._showErrorNotificationBar).toHaveBeenCalledWith('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            done();
        });
        var folderEntry = {
            fullPath: '/folder-duplicate-fake',
            isDirectory: true,
            isFile: false,
            name: 'folder-duplicate-fake'
        };
        component.onFolderEntityDropped(folderEntry);
    });
    it('should create a folder and call onFilesEntityDropped with the file inside the folder', function (done) {
        component.currentFolderPath = '/root-fake-/sites-fake/document-library-fake';
        component.onSuccess = new core_1.EventEmitter();
        fixture.detectChanges();
        var itemEntity = {
            fullPath: '/folder-fake/file-fake.png',
            isDirectory: false,
            isFile: true,
            name: 'file-fake.png',
            file: function (callbackFile) {
                var fileFake = new File(['fakefake'], 'file-fake.png', { type: 'image/png' });
                callbackFile(fileFake);
            }
        };
        var fakeRest = {
            entry: {
                isFile: false,
                isFolder: true,
                name: 'folder-fake'
            }
        };
        var fakePromise = new Promise(function (resolve, reject) {
            resolve(fakeRest);
        });
        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakePromise);
        spyOn(component, 'onFilesEntityDropped').and.callFake(function () {
            expect(component.onFilesEntityDropped).toHaveBeenCalledWith(itemEntity);
        });
        spyOn(component, '_showUndoNotificationBar').and.callFake(function () {
            expect(component._showUndoNotificationBar).toHaveBeenCalled();
            done();
        });
        var folderEntry = {
            fullPath: '/folder-fake',
            isDirectory: true,
            isFile: false,
            name: 'folder-fake',
            createReader: function () {
                return {
                    readEntries: function (callback) {
                        var entries = [itemEntity, itemEntity];
                        callback(entries);
                    }
                };
            }
        };
        component.onFolderEntityDropped(folderEntry);
    });
});
//# sourceMappingURL=upload-drag-area.component.spec.js.map