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

import { describe, expect, it, inject, beforeEachProviders } from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { provide } from '@angular/core';
import { UploadButtonComponent } from './upload-button.component';
import { AlfrescoTranslationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadServiceMock } from '../assets/upload.service.mock';
import { UploadService } from '../services/upload.service';
import { AlfrescoApiMock } from '../assets/AlfrescoApi.mock';


declare var AlfrescoApi: any;

describe('AlfrescoUploadButton', () => {

    beforeEach( () => {
        window['AlfrescoApi'] = AlfrescoApiMock;
        window['componentHandler'] = null;
    });

    beforeEachProviders(() => {
        return [
            provide(AlfrescoSettingsService, {useClass: AlfrescoSettingsService}),
            provide(AlfrescoTranslationService, {useClass: TranslationMock}),
            provide(UploadService, {useClass: UploadServiceMock})
        ];
    });

    it('should render upload-single-file button as default',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(UploadButtonComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.multipleFiles = false;
                    let compiled = fixture.debugElement.nativeElement;
                    fixture.detectChanges();
                    expect(compiled.querySelector('#upload-single-file')).toBeDefined();
                });
        }));

    it('should render upload-multiple-file button if multipleFiles is true',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(UploadButtonComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.multipleFiles = true;
                    let compiled = fixture.debugElement.nativeElement;
                    fixture.detectChanges();
                    expect(compiled.querySelector('#upload-multiple-files')).toBeDefined();
                });
        }));

    it('should render an uploadFolder button if uploadFolder is true',
        inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb
                .createAsync(UploadButtonComponent)
                .then((fixture) => {
                    let component = fixture.componentInstance;
                    component.uploadFolder = true;
                    let compiled = fixture.debugElement.nativeElement;
                    fixture.detectChanges();
                    expect(compiled.querySelector('#uploadFolder')).toBeDefined();
                });
        }));

    it('should call uploadFile with the default folder', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(UploadButtonComponent)
            .then((fixture) => {
                let component = fixture.componentInstance;
                component.currentFolderPath = '/root-fake-/sites-fake/folder-fake';
                component.onSuccess = null;
                component._uploaderService.uploadFilesInTheQueue = jasmine.createSpy('uploadFilesInTheQueue');

                fixture.detectChanges();
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
    }));

    it('should create a folder and call upload file', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(UploadButtonComponent)
            .then((fixture) => {
                let component = fixture.componentInstance;

                component.uploadFiles = jasmine.createSpy('uploadFiles');
                let doneFn = jasmine.createSpy('success');

                fixture.detectChanges();

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
    }));

    it('should throws an exception when the folder already exist', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(UploadButtonComponent)
            .then((fixture) => {
                let component = fixture.componentInstance;

                component.uploadFiles = jasmine.createSpy('uploadFiles');

                fixture.detectChanges();

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
    }));

});
