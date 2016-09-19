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

import { PLATFORM_PIPES } from '@angular/core';
import { describe, expect, it, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    AlfrescoTranslationService,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoApiService,
    AlfrescoPipeTranslate
} from 'ng2-alfresco-core';

import { UploadButtonComponent } from './upload-button.component';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';

declare var AlfrescoApi: any;

describe('AlfrescoUploadButton', () => {

    let uploadButtonFixture;

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

    beforeEach( () => {
        window['componentHandler'] = null;
    });

    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            AlfrescoApiService,
            { provide: PLATFORM_PIPES, useValue: AlfrescoPipeTranslate, multi: true },
            { provide: AlfrescoTranslationService, useClass: TranslationMock },
            UploadService
        ];
    });

    beforeEach( inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(UploadButtonComponent)
            .then(fixture => uploadButtonFixture = fixture);
    }));

    it('should render upload-single-file button as default', () => {
        let component = uploadButtonFixture.componentInstance;
        component.multipleFiles = false;
        let compiled = uploadButtonFixture.debugElement.nativeElement;
        uploadButtonFixture.detectChanges();
        expect(compiled.querySelector('#upload-single-file')).toBeDefined();
    });

    it('should render upload-multiple-file button if multipleFiles is true', () => {
        let component = uploadButtonFixture.componentInstance;
        component.multipleFiles = true;
        let compiled = uploadButtonFixture.debugElement.nativeElement;
        uploadButtonFixture.detectChanges();
        expect(compiled.querySelector('#upload-multiple-files')).toBeDefined();
    });

    it('should render an uploadFolder button if uploadFolder is true', () => {
        let component = uploadButtonFixture.componentInstance;
        component.uploadFolder = true;
        let compiled = uploadButtonFixture.debugElement.nativeElement;
        uploadButtonFixture.detectChanges();
        expect(compiled.querySelector('#uploadFolder')).toBeDefined();
    });

    it('should call uploadFile with the default folder', () => {
        let component = uploadButtonFixture.componentInstance;
        component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
        component.onSuccess = null;
        component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

        uploadButtonFixture.detectChanges();

        component.onFilesAdded(fakeEvent);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('/root-fake-/sites-fake/folder-fake', null);
    });

    it('should create a folder and emit an File uploaded event', (done) => {
        let component = uploadButtonFixture.componentInstance;
        component.currentFolderPath = '/fake-root-path';
        uploadButtonFixture.detectChanges();

        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakeResolvePromise);

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
        let component = uploadButtonFixture.componentInstance;
        uploadButtonFixture.detectChanges();

        spyOn(component._uploaderService, 'callApiCreateFolder').and.returnValue(fakeRejectPromise);
        component.onError.subscribe(e => {
            expect(e.value).toEqual('FILE_UPLOAD.MESSAGES.FOLDER_ALREADY_EXIST');
            done();
        });

        component.onDirectoryAdded(fakeEvent);
    });
});
