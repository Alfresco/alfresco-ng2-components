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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileModel, FileUploadCompleteEvent, UploadService } from 'ng2-alfresco-core';
import { UploadModule } from '../../index';
import { FileUploadingDialogComponent } from './file-uploading-dialog.component';

describe('FileUploadingDialogComponent', () => {
    let fixture: ComponentFixture<FileUploadingDialogComponent>;
    let uploadService: UploadService;
    let component: FileUploadingDialogComponent;
    let emitter: EventEmitter<any>;
    let filelist: FileModel[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                UploadModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileUploadingDialogComponent);
        component = fixture.componentInstance;
        uploadService = TestBed.get(UploadService);
        emitter = new EventEmitter();
        filelist = [
            new FileModel(<File> { name: 'fake-name', size: 10 }),
            new FileModel(<File> { name: 'fake-name2', size: 10 })
        ];

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('upload service subscribers', () => {
        it('does not render when uploading list is empty', () => {
            uploadService.addToQueue();
            uploadService.uploadFilesInTheQueue(emitter);

            expect(component.isDialogActive).toBe(false);
        });

        it('opens when uploading list is not empty', () => {
            uploadService.addToQueue(...filelist);
            uploadService.uploadFilesInTheQueue(emitter);

            expect(component.isDialogActive).toBe(true);
        });

        it('updates uploading file list', () => {
            uploadService.addToQueue(...filelist);
            uploadService.uploadFilesInTheQueue(emitter);

            expect(component.filesUploadingList.length).toBe(2);
        });

        it('updates completed uploaded files', () => {
            const completedFiles = 2;
            const completeEvent = new FileUploadCompleteEvent(null, completedFiles, null, null);
            uploadService.fileUploadComplete.next(completeEvent);

            expect(component.totalCompleted).toEqual(completedFiles);
        });
    });

    describe('toggleMinimized()', () => {
        it('minimzes the dialog', () => {
            component.isDialogMinimized = true;
            component.toggleMinimized();

            expect(component.isDialogMinimized).toBe(false);
        });

        it('maximizes the dialog', () => {
            component.isDialogMinimized = false;
            component.toggleMinimized();

            expect(component.isDialogMinimized).toBe(true);
        });
    });

    describe('close()', () => {
        it('closes the dialog', () => {
            component.isDialogActive = true;
            component.close();

            expect(component.isDialogActive).toBe(false);
        });

        it('resets dialog minimize state', () => {
            component.isDialogMinimized = true;
            component.close();

            expect(component.isDialogMinimized).toBe(false);
        });

        it('resets upload queue', () => {
            uploadService.addToQueue(...filelist);
            uploadService.uploadFilesInTheQueue(emitter);
            component.close();

            expect(uploadService.getQueue().length).toBe(0);
        });
    });
});
