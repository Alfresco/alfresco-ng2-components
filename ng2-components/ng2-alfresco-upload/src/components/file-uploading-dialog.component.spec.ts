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

import { DebugElement } from '@angular/core';
import { MdProgressSpinnerModule } from '@angular/material';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { FileUploadingListComponent } from './file-uploading-list.component';
import { UploadService } from '../services/upload.service';
import { FileModel, FileUploadStatus } from 'ng2-alfresco-core';
import { FileUploadCompleteEvent, FileUploadEvent } from 'ng2-alfresco-core';

describe('FileUploadingDialogComponent', () => {

    let component: FileUploadingDialogComponent;
    let fixture: ComponentFixture<FileUploadingDialogComponent>;
    let debug: DebugElement;
    let element: any;
    let file: FileModel;
    let uploadService: UploadService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                MdProgressSpinnerModule
            ],
            declarations: [
                FileUploadingDialogComponent,
                FileUploadingListComponent
            ],
            providers: [
                UploadService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        const fileFake = new File([''], 'fake-name');
        file = new FileModel(fileFake);

        fixture = TestBed.createComponent(FileUploadingDialogComponent);
        uploadService = TestBed.get(UploadService);

        debug = fixture.debugElement;
        element = fixture.nativeElement;
        component = fixture.componentInstance;

        component.filesUploadingList = [file];
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should render completed upload 1 when an element is added to Observer', () => {
        uploadService.fileUploadComplete.next(new FileUploadCompleteEvent(null, 1));
        fixture.detectChanges();

        expect(element.querySelector('#total-upload-completed').innerText).toEqual('1');
    });

    it('should render dialog box with css class show when an element is added to Observer', () => {
        uploadService.addToQueue(new FileModel(<File> { name: 'file' }));
        component.filesUploadingList = [file];

        fixture.detectChanges();

        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });

    it('should render dialog box with css class show when the toggleVisible is called', () => {
        component.toggleVisible();
        fixture.detectChanges();

        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog show');
    });

    it('should render dialog box with css class hide', () => {
        component.isDialogActive = true;

        component.toggleVisible();
        fixture.detectChanges();

        expect(element.querySelector('.file-dialog').getAttribute('class')).toEqual('file-dialog');
    });

    it('should render minimize dialog as default', () => {
        component.isDialogActive = true;

        component.toggleMinimized();
        fixture.detectChanges();

        expect(element.querySelector('.minimize-button').getAttribute('class')).toEqual('minimize-button active');
    });

    it('should show the close button when the file upload is completed', async(() => {
        component.isDialogActive = true;
        uploadService.addToQueue(new FileModel(<File> { name: 'file' }));
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let closeButton = element.querySelector('#button-close-upload-list');
            expect(closeButton).not.toBeNull();
        });

        uploadService.fileUpload.next(new FileUploadCompleteEvent(file, 1, { status: FileUploadStatus.Complete }, 0));
    }));

    it('should show the close button when the file upload is in error', async(() => {
        component.isDialogActive = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let closeButton = element.querySelector('#button-close-upload-list');
            expect(closeButton).not.toBeNull();
        });

        uploadService.fileUpload.next(new FileUploadEvent(file, FileUploadStatus.Error));
    }));

    it('should show the close button when the file upload is cancelled', async(() => {
        component.isDialogActive = true;
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let closeButton = element.querySelector('#button-close-upload-list');
            expect(closeButton).not.toBeNull();
        });

        uploadService.fileUpload.next(new FileUploadEvent(file, FileUploadStatus.Cancelled));
    }));
});
