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
import { UploadButtonComponent } from './upload-button.component';
import { DebugElement }    from '@angular/core';
import { CoreModule, AlfrescoTranslationService, NotificationService } from 'ng2-alfresco-core';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';

describe('UploadButtonComponent', () => {

    let file = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};
    let fakeEvent = {
        currentTarget: {
            files: [file]
        },
        target: {value: 'fake-name-1'}
    };

    let fakeResolveRest = {
        entry: {
            isFile: false,
            isFolder: true,
            name: 'fake-folder1'
        }
    };
    let fakeResolvePromise = new Promise(function (resolve, reject) {
        resolve(fakeResolveRest);
    });

    let fakeRejectRest = {
        response: {
            body: {
                error: {
                    statusCode: 409
                }
            }
        }
    };

    let fakeRejectPromise = new Promise(function (resolve, reject) {
        reject(fakeRejectRest);
    });

    let component: UploadButtonComponent;
    let fixture: ComponentFixture<UploadButtonComponent>;
    let debug: DebugElement;
    let element: HTMLElement;
    let uploadService: UploadService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                UploadButtonComponent
            ],
            providers: [
                UploadService,
                NotificationService,
                {provide: AlfrescoTranslationService, useClass: TranslationMock}
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        window['componentHandler'] = null;

        fixture = TestBed.createComponent(UploadButtonComponent);
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

    it('should call uploadFile with the default root folder', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();

        component.onFilesAdded(fakeEvent);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith('-root-', '/root-fake-/sites-fake/folder-fake', null);
    });

    it('should call uploadFile with a custom root folder', () => {
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.rootFolderId = '-my-';
        component.onSuccess = null;
        uploadService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        fixture.detectChanges();

        component.onFilesAdded(fakeEvent);
        expect(uploadService.uploadFilesInTheQueue).toHaveBeenCalledWith('-my-', '/root-fake-/sites-fake/folder-fake', null);
    });

    it('should create a folder and emit an File uploaded event', (done) => {
        component.currentFolderPath = '/fake-root-path';
        fixture.detectChanges();

        spyOn(uploadService, 'callApiCreateFolder').and.returnValue(fakeResolvePromise);

        component.onSuccess.subscribe(e => {
            expect(e.value).toEqual('File uploaded');
            done();
        });

        spyOn(component, 'uploadFiles').and.callFake(() => {
            component.onSuccess.emit({
                    value: 'File uploaded'
                }
            );
        });
        component.onDirectoryAdded(fakeEvent);
    });

    it('should emit an onError event when the folder already exist', (done) => {
        spyOn(uploadService, 'callApiCreateFolder').and.returnValue(fakeRejectPromise);
        component.onError.subscribe(e => {
            expect(e.value).toEqual('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            done();
        });

        component.onDirectoryAdded(fakeEvent);
    });

    it('should by default the title of the button get from the JSON file', () => {
        let compiled = fixture.debugElement.nativeElement;
        fixture.detectChanges();
        component.uploadFolders = false;
        component.multipleFiles = false;

        expect(compiled.querySelector('#upload-single-file-label').textContent).toEqual('FILE_UPLOAD.BUTTON.UPLOAD_FILE');

        component.multipleFiles = true;
        fixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-file-label').textContent).toEqual('FILE_UPLOAD.BUTTON.UPLOAD_FILE');

        component.uploadFolders = true;
        fixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder-label').textContent).toEqual('FILE_UPLOAD.BUTTON.UPLOAD_FOLDER');
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
});
