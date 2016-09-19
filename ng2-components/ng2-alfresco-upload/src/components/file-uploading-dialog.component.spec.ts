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
import { Observable } from 'rxjs/Observable';
import { HTTP_PROVIDERS } from '@angular/http';

import {
    AlfrescoTranslationService,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoApiService,
    AlfrescoPipeTranslate
} from 'ng2-alfresco-core';

import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { FileModel } from '../models/file.model';
import { TranslationMock } from '../assets/translation.service.mock';
import { UploadService } from '../services/upload.service';

describe('FileUploadDialog', () => {

    let componentFixture;
    let uploadService;

    beforeEachProviders(() => {
        return [
            HTTP_PROVIDERS,
            AlfrescoApiService,
            AlfrescoSettingsService,
            AlfrescoAuthenticationService,
            { provide: PLATFORM_PIPES, useValue: AlfrescoPipeTranslate, multi: true },
            { provide: AlfrescoTranslationService, useClass: TranslationMock },
            UploadService
        ];
    });

    beforeEach(
        inject(
            [TestComponentBuilder, UploadService],
            (tcb: TestComponentBuilder, service: UploadService) => {
                return tcb
                    .createAsync(FileUploadingDialogComponent)
                    .then(fixture => {
                        componentFixture = fixture;
                        uploadService = service;
                    });
            }
        )
    );

    it('should render completed upload 1 when an element is added to Observer', () => {
        let fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        let file = new FileModel(fileFake);
        file.progress = {'percent': 50};

        uploadService.totalCompleted$ = new Observable(observer => {
            observer.next(1);
        });

        let component = componentFixture.componentInstance;
        componentFixture.detectChanges();
        component.filesUploadingList = [file];

        let compiled = componentFixture.debugElement.nativeElement;

        componentFixture.detectChanges();

        expect(compiled.querySelector('#total-upload-completed').innerText).toEqual('1');
    });

    it('should render dialog box with css class show when an element is added to Observer', () => {
        let fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        let file = new FileModel(fileFake);
        file.progress = {'percent': 50};

        let component = componentFixture.componentInstance;
        componentFixture.detectChanges();
        uploadService.addToQueue([file]);
        component.filesUploadingList = [file];

        let compiled = componentFixture.debugElement.nativeElement;

        componentFixture.detectChanges();

        expect(compiled.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });

    it('should render dialog box with css class show when the toggleShowDialog is called', () => {
        let fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        let file = new FileModel(fileFake);

        let component = componentFixture.componentInstance;
        componentFixture.detectChanges();
        component.filesUploadingList = [file];

        let compiled = componentFixture.debugElement.nativeElement;

        component.toggleShowDialog();
        componentFixture.detectChanges();

        expect(compiled.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });

    it('should render dialog box with css class hide', () => {
        let fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        let file = new FileModel(fileFake);
        let component = componentFixture.componentInstance;
        component.filesUploadingList = [file];
        component.isDialogActive = true;

        let compiled = componentFixture.debugElement.nativeElement;

        component.toggleShowDialog();
        componentFixture.detectChanges();

        expect(compiled.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog');
    });

    it('should render minimize dialog as default', () => {
        let fileFake = {
            id: 'fake-id',
            name: 'fake-name'
        };
        let file = new FileModel(fileFake);
        let component = componentFixture.componentInstance;
        component.filesUploadingList = [file];
        component.isDialogActive = true;

        let compiled = componentFixture.debugElement.nativeElement;

        component.toggleDialogMinimize();
        componentFixture.detectChanges();

        expect(compiled.querySelector('.minimize-button').getAttribute('class')).toEqual('minimize-button active');
    });
});
