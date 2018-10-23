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

import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileModel, FileUploadCompleteEvent, FileUploadErrorEvent, UploadService, setupTestBed, CoreModule, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { UploadModule } from '../upload.module';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FileUploadingDialogComponent', () => {
    let fixture: ComponentFixture<FileUploadingDialogComponent>;
    let uploadService: UploadService;
    let component: FileUploadingDialogComponent;
    let emitter: EventEmitter<any>;
    let fileList: FileModel[];

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            UploadModule
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FileUploadingDialogComponent);
        component = fixture.componentInstance;

        uploadService = TestBed.get(UploadService);
        uploadService.clearQueue();

        emitter = new EventEmitter();
        fileList = [
            new FileModel(<File> { name: 'fake-name', size: 10 }),
            new FileModel(<File> { name: 'fake-name2', size: 10 })
        ];

        fixture.detectChanges();
    });

    describe('upload service subscribers', () => {
        it('should not render dialog when uploading list is empty', () => {
            uploadService.addToQueue();
            uploadService.uploadFilesInTheQueue(emitter);

            expect(component.isDialogActive).toBe(false);
        });

        it('should open dialog when uploading list is not empty', () => {
            uploadService.addToQueue(...fileList);
            uploadService.uploadFilesInTheQueue(emitter);

            expect(component.isDialogActive).toBe(true);
        });

        it('should update uploading file list', () => {
            uploadService.addToQueue(...fileList);
            uploadService.uploadFilesInTheQueue(emitter);

            expect(component.filesUploadingList.length).toBe(2);
        });

        it('should update completed uploaded files count', () => {
            const completedFiles = 2;
            const completeEvent = new FileUploadCompleteEvent(null, completedFiles, null, null);
            uploadService.fileUploadComplete.next(completeEvent);

            expect(component.totalCompleted).toEqual(completedFiles);
        });

        it('should update error files count', () => {
            const totalErrors = 2;
            const errorEvent = new FileUploadErrorEvent(null, null, totalErrors);
            uploadService.fileUploadError.next(errorEvent);

            expect(component.totalErrors).toEqual(totalErrors);
        });
    });

    describe('toggleConfirmation()', () => {
        it('should change state to true when false', () => {
            component.isConfirmation = false;

            component.toggleConfirmation();

            expect(component.isConfirmation).toBe(true);
        });

        it('should change state to false when true', () => {
            component.isConfirmation = true;

            component.toggleConfirmation();

            expect(component.isConfirmation).toBe(false);
        });

        it('should change dialog minimize state to false', () => {
            component.isDialogMinimized = true;

            component.toggleConfirmation();

            expect(component.isDialogMinimized).toBe(false);
        });

        it('should not change dialog minimize state', () => {
            component.isDialogMinimized = false;

            component.toggleConfirmation();

            expect(component.isDialogMinimized).toBe(false);
        });
    });

    describe('cancelAllUploads()', () => {
        beforeEach(() => {
            (<any> component).uploadList = {
                cancelAllFiles: jasmine.createSpy('cancelAllFiles')
            };
        });

        it('should toggle confirmation dialog', () => {
            spyOn(component, 'toggleConfirmation');

            component.cancelAllUploads();

            expect(component.toggleConfirmation).toHaveBeenCalled();
        });

        it('should call upload list cancel method', () => {
            component.cancelAllUploads();

            expect(component.uploadList.cancelAllFiles).toHaveBeenCalled();
        });
    });

    describe('toggleMinimized()', () => {
        it('should minimize the dialog', () => {
            component.isDialogMinimized = true;
            component.toggleMinimized();

            expect(component.isDialogMinimized).toBe(false);
        });

        it('should maximize the dialog', () => {
            component.isDialogMinimized = false;
            component.toggleMinimized();

            expect(component.isDialogMinimized).toBe(true);
        });
    });

    describe('close()', () => {
        it('should reset confirmation state', () => {
            component.isConfirmation = true;
            component.close();

            expect(component.isConfirmation).toBe(false);
        });

        it('should reset total files count', () => {
            component.totalCompleted = 1;
            component.close();

            expect(component.totalCompleted).toBe(0);
        });

        it('should reset total errors count', () => {
            component.totalErrors = 1;
            component.close();

            expect(component.totalErrors).toBe(0);
        });

        it('should closes the dialog', () => {
            component.isDialogActive = true;
            component.close();

            expect(component.isDialogActive).toBe(false);
        });

        it('should reset dialog minimize state', () => {
            component.isDialogMinimized = true;
            component.close();

            expect(component.isDialogMinimized).toBe(false);
        });

        it('should reset upload queue', () => {
            uploadService.addToQueue(...fileList);
            uploadService.uploadFilesInTheQueue(emitter);
            component.close();

            expect(uploadService.getQueue().length).toBe(0);
        });
    });
});
