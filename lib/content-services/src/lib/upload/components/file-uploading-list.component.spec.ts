/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TranslationService, setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { FileUploadingListComponent } from './file-uploading-list.component';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { UploadService } from '../../common/services/upload.service';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { FileModel, FileUploadStatus } from '../../common/models/file.model';

describe('FileUploadingListComponent', () => {
    let fixture: ComponentFixture<FileUploadingListComponent>;
    let component: FileUploadingListComponent;
    let uploadService: UploadService;
    let nodesApiService: NodesApiService;
    let translateService: TranslationService;
    let file: any;

    beforeEach(() => {
        file = { data: { entry: { id: 'x' } } };
    });

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        nodesApiService = TestBed.inject(NodesApiService);

        uploadService = TestBed.inject(UploadService);
        uploadService.clearQueue();

        translateService = TestBed.inject(TranslationService);
        fixture = TestBed.createComponent(FileUploadingListComponent);
        component = fixture.componentInstance;

        spyOn(translateService, 'get').and.returnValue(of('some error message'));
        spyOn(uploadService, 'cancelUpload');
    });

    describe('cancelFile()', () => {
        it('should call cancelUpload service when cancelling a file', () => {
            component.cancelFile(file);

            expect(uploadService.cancelUpload).toHaveBeenCalledWith(file);
        });

        it('should not call cancelUpload service when file has `Pending` status', () => {
            file.status = FileUploadStatus.Pending;
            component.cancelFile(file);

            expect(uploadService.cancelUpload).not.toHaveBeenCalledWith(file);
        });

        it('should set `Cancelled` status on `Pending` file', () => {
            file.status = FileUploadStatus.Pending;
            component.cancelFile(file);

            expect(file.status).toBe(FileUploadStatus.Cancelled);
        });
    });

    describe('cancelAllFiles()', () => {
        beforeEach(() => {
            component.files = [
                {
                    data: {
                        entry: { id: '1' }
                    },
                    status: FileUploadStatus.Cancelled
                } as FileModel,
                {
                    data: {
                        entry: { id: '2' }
                    },
                    status: FileUploadStatus.Error
                } as FileModel
            ];
        });

        it('should not call deleteNode if there are no competed uploads', () => {
            spyOn(nodesApiService, 'deleteNode');

            component.cancelAllFiles();

            expect(nodesApiService.deleteNode).not.toHaveBeenCalled();
        });

        it('should not call uploadService if there are no uploading files', () => {
            component.cancelAllFiles();

            expect(uploadService.cancelUpload).not.toHaveBeenCalled();
        });

        it('should call uploadService when there are uploading files', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(of({}));

            component.files[0].status = FileUploadStatus.Progress;
            component.cancelAllFiles();

            expect(uploadService.cancelUpload).toHaveBeenCalled();
        });
    });

    describe('isUploadCompleted()', () => {
        it('should return false when at least one file is in progress', () => {
            component.files = [
                { status: FileUploadStatus.Progress } as FileModel,
                { status: FileUploadStatus.Complete } as FileModel
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return false when at least one file is in pending', () => {
            component.files = [
                { status: FileUploadStatus.Pending } as FileModel,
                { status: FileUploadStatus.Complete } as FileModel
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return false when at least one file is in starting state', () => {
            component.files = [
                { status: FileUploadStatus.Starting } as FileModel,
                { status: FileUploadStatus.Complete } as FileModel
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return false when files are cancelled', () => {
            component.files = [
                { status: FileUploadStatus.Cancelled } as FileModel,
                { status: FileUploadStatus.Cancelled } as FileModel
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return true when there are deleted files', () => {
            component.files = [
                { status: FileUploadStatus.Complete } as FileModel,
                { status: FileUploadStatus.Deleted } as FileModel
            ];

            expect(component.isUploadCompleted()).toBe(true);
        });

        it('should return true when none of the files is in progress', () => {
            component.files = [
                { status: FileUploadStatus.Error } as FileModel,
                { status: FileUploadStatus.Cancelled } as FileModel,
                { status: FileUploadStatus.Complete } as FileModel
            ];

            expect(component.isUploadCompleted()).toBe(true);
        });
    });

    describe('isUploadCancelled()', () => {
        it('should return false when not all files are cancelled', () => {
            component.files = [
                { status: FileUploadStatus.Complete } as FileModel,
                { status: FileUploadStatus.Cancelled } as FileModel,
                { status: FileUploadStatus.Error } as FileModel
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there are no cancelled files', () => {
            component.files = [
                { status: FileUploadStatus.Complete } as FileModel,
                { status: FileUploadStatus.Error } as FileModel,
                { status: FileUploadStatus.Error } as FileModel
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there is at least one file in progress', () => {
            component.files = [
                { status: FileUploadStatus.Progress } as FileModel,
                { status: FileUploadStatus.Error } as FileModel,
                { status: FileUploadStatus.Error } as FileModel
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there is at least one file in pending', () => {
            component.files = [
                { status: FileUploadStatus.Pending } as FileModel,
                { status: FileUploadStatus.Error } as FileModel,
                { status: FileUploadStatus.Error } as FileModel
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return true when all files are aborted', () => {
            component.files = [
                { status: FileUploadStatus.Aborted } as FileModel
            ];

            expect(component.isUploadCancelled()).toBe(true);
        });

        it('should return true when all files are cancelled', () => {
            component.files = [
                { status: FileUploadStatus.Cancelled } as FileModel,
                { status: FileUploadStatus.Cancelled } as FileModel,
                { status: FileUploadStatus.Aborted } as FileModel
            ];

            expect(component.isUploadCancelled()).toBe(true);
        });
    });
});
