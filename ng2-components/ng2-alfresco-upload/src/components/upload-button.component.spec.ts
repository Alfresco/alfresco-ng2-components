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

import { describe, expect, it, inject, beforeEach, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { UploadButtonComponent } from './upload-button.component';
import { AlfrescoTranslationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadServiceMock } from '../assets/upload.service.mock';
import { UploadService } from '../services/upload.service';
import { AlfrescoApiMock } from '../assets/AlfrescoApi.mock';


declare var AlfrescoApi: any;

describe('AlfrescoUploadButton', () => {

    let uploadButtonFixture;

    beforeEach( () => {
        window['AlfrescoApi'] = AlfrescoApiMock;
        window['componentHandler'] = null;
    });

    beforeEachProviders(() => {
        return [
            { provide: AlfrescoSettingsService },
            { provide: AlfrescoTranslationService, useClass: TranslationMock },
            { provide: UploadService, useClass: UploadServiceMock }
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
        let file = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};

        let fakeEvent = {
            currentTarget: {
                files: [file]
            },
            target: {value: 'fake-value'}
        };

        component.onFilesAdded(fakeEvent);
        expect(component._uploaderService.uploadFilesInTheQueue).toHaveBeenCalledWith('/root-fake-/sites-fake/folder-fake', null);
    });

    it('should create a folder and call upload file', () => {
        let component = uploadButtonFixture.componentInstance;

        component.uploadFiles = jasmine.createSpy('uploadFiles');
        let doneFn = jasmine.createSpy('success');

        uploadButtonFixture.detectChanges();

        let file = {name: 'fake-name-1', size: 10, webkitRelativePath: 'fake-folder1/fake-name-1.json'};

        let fakeEvent = {
            currentTarget: {
                files: [file]
            },
            target: {value: 'fake-value'}
        };
        component.onDirectoryAdded(fakeEvent);
        expect(doneFn).not.toHaveBeenCalledWith(fakeEvent);
    });

    it('should throws an exception when the folder already exist', () => {
        let component = uploadButtonFixture.componentInstance;

        component.uploadFiles = jasmine.createSpy('uploadFiles');

        uploadButtonFixture.detectChanges();

        let file = {name: 'fake-name-1', size: 10, webkitRelativePath: 'folder-duplicate-fake/fake-name-1.json'};

        let fakeEvent = {
            currentTarget: {
                files: [file]
            },
            target: {value: 'fake-value'}
        };
        component.onDirectoryAdded(fakeEvent);
        expect(component.uploadFiles).not.toHaveBeenCalledWith(fakeEvent);
    });
});
