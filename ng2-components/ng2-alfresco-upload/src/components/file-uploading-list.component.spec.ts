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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfrescoTranslationService, FileModel, FileUploadStatus, NodesApiService, NotificationService, UploadService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { UploadModule } from '../../index';
import { FileUploadService } from '../services/file-uploading.service';
import { FileUploadingListComponent } from './file-uploading-list.component';

describe('FileUploadingListComponent', () => {
    let fixture: ComponentFixture<FileUploadingListComponent>;
    let component: FileUploadingListComponent;
    let uploadService: UploadService;
    let nodesApiService: NodesApiService;
    let fileUploadService: FileUploadService;
    let notificationService: NotificationService;
    let translateService: AlfrescoTranslationService;
    let file = new FileModel(<File> { name: 'fake-name' });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                UploadModule
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        nodesApiService = TestBed.get(NodesApiService);
        uploadService = TestBed.get(UploadService);
        fileUploadService = TestBed.get(FileUploadService);
        notificationService = TestBed.get(NotificationService);
        translateService = TestBed.get(AlfrescoTranslationService);
        fixture = TestBed.createComponent(FileUploadingListComponent);
        component = fixture.componentInstance;
        component.files = [ file ];
        file.data = { entry: { id: 'x' } };

        spyOn(translateService, 'get').and.returnValue(Observable.of('some error message'));
    });

    describe('cancelFileUpload()', () => {
        it('calls cancelUpload()', () => {
            spyOn(uploadService, 'cancelUpload');
            component.cancelFileUpload(file);

            expect(uploadService.cancelUpload).toHaveBeenCalledWith(file);
        });
    });

    describe('removeFile()', () => {
        it('removes file successfully', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.of('success'));
            spyOn(fileUploadService, 'emitFileRemoved');

            component.removeFile(file);
            fixture.detectChanges();

            expect(fileUploadService.emitFileRemoved).toHaveBeenCalledWith(file);
        });

        it('notify on remove file fail', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.throw({}));
            spyOn(notificationService, 'openSnackMessage');

            component.removeFile(file);
            fixture.detectChanges();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
        });
    });

    describe('cancelAllFiles()', () => {
        beforeEach(() => {
            spyOn(component, 'removeFile');
            spyOn(component, 'cancelFileUpload');
        });

        it('calls remove method if file was uploaded', () => {
            file.status = FileUploadStatus.Complete;
            component.cancelAllFiles(null);

            expect(component.removeFile).toHaveBeenCalledWith(file);
        });

        it('calls cancel method if file is in progress', () => {
            file.status = FileUploadStatus.Progress;
            component.cancelAllFiles(null);

            expect(component.cancelFileUpload).toHaveBeenCalledWith(file);
        });
    });

    describe('isUploadCompleted()', () => {
        it('returns false when at least one file is in progress', () => {
            component.files = <any> [
                { status: FileUploadStatus.Progress },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('returns false when at least one file is in pending', () => {
            component.files = <any> [
                { status: FileUploadStatus.Pending },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('returns false when none of the files is completed', () => {
            component.files = <any> [
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Cancelled }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('returns true when none of the files is in progress', () => {
            component.files = <any> [
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(true);
        });
    });

    describe('isUploadCancelled()', () => {
        it('return false when not all files are cancelled', () => {
            component.files = <any> [
                { status: FileUploadStatus.Complete },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('return false when there are no cancelled files', () => {
            component.files = <any> [
                { status: FileUploadStatus.Complete },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('return false when there is at leat one file in progress', () => {
            component.files = <any> [
                { status: FileUploadStatus.Progress },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('return false when there is at leat one file in pendding', () => {
            component.files = <any> [
                { status: FileUploadStatus.Pending },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('return true when all files are aborted', () => {
            component.files = <any> [
                { status: FileUploadStatus.Aborted },
                { status: FileUploadStatus.Aborted }
            ];

            expect(component.isUploadCancelled()).toBe(true);
        });

        it('return true when all files are cancelled', () => {
            component.files = <any> [
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(true);
        });
    });

    describe('uploadErrorFiles()', () => {
        it('returns the error files', () => {
            file.status = 6;

            expect(component.uploadErrorFiles()).toEqual([file]);
        });
    });

    describe('totalErrorFiles()', () => {
        it('returns the number of error files', () => {
            file.status = 6;

            expect(component.totalErrorFiles()).toEqual(1);
        });
    });
});
