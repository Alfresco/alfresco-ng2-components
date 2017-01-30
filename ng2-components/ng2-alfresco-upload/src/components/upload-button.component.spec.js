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
var upload_button_component_1 = require("./upload-button.component");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var translation_service_mock_1 = require("../assets/translation.service.mock");
var upload_service_1 = require("../services/upload.service");
describe('Test ng2-alfresco-upload UploadButton', function () {
    var file = { name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json' };
    var fakeEvent = {
        currentTarget: {
            files: [file]
        },
        target: { value: 'fake-name-1' }
    };
    var fakeResolveRest = {
        entry: {
            isFile: false,
            isFolder: true,
            name: 'fake-folder1'
        }
    };
    var fakeResolvePromise = new Promise(function (resolve, reject) {
        resolve(fakeResolveRest);
    });
    var fakeRejectRest = {
        response: {
            body: {
                error: {
                    statusCode: 409
                }
            }
        }
    };
    var fakeRejectPromise = new Promise(function (resolve, reject) {
        reject(fakeRejectRest);
    });
    var component;
    var fixture;
    var debug;
    var element;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule
            ],
            declarations: [upload_button_component_1.UploadButtonComponent],
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
        window['componentHandler'] = null;
        fixture = testing_1.TestBed.createComponent(upload_button_component_1.UploadButtonComponent);
        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    afterEach(function () {
        fixture.destroy();
        testing_1.TestBed.resetTestingModule();
    });
    it('should render upload-single-file button as default', function () {
        component.multipleFiles = false;
        var compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-single-file')).toBeDefined();
    });
    it('should render upload-multiple-file button if multipleFiles is true', function () {
        component.multipleFiles = true;
        var compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-files')).toBeDefined();
    });
    it('should render an uploadFolder button if uploadFolder is true', function () {
        component.uploadFolder = true;
        var compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder')).toBeDefined();
    });
    it('should call uploadFile with the default root folder', function () {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        fixture.detectChanges();
        component.onFilesAdded(fakeEvent);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
    });
    it('should call uploadFile with a custom root folder', function () {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.rootFolderId = '-my-';
        component.onSuccess = null;
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');
        fixture.detectChanges();
        component.onFilesAdded(fakeEvent);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('-my-', '/root-fake-/sites-fake/folder-fake', null);
    });
    it('should create a folder and emit an File uploaded event', function (done) {
        component.currentFolderPath = '/fake-root-path';
        fixture.detectChanges();
        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakeResolvePromise);
        component.onSuccess.subscribe(function (e) {
            expect(e.value).toEqual('File uploaded');
            done();
        });
        spyOn(component, 'uploadFiles').and.callFake(function () {
            component.onSuccess.emit({
                value: 'File uploaded'
            });
        });
        component.onDirectoryAdded(fakeEvent);
    });
    it('should emit an onError event when the folder already exist', function (done) {
        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakeRejectPromise);
        component.onError.subscribe(function (e) {
            expect(e.value).toEqual('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            done();
        });
        component.onDirectoryAdded(fakeEvent);
    });
});
//# sourceMappingURL=upload-button.component.spec.js.map