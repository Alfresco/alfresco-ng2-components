/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { TranslationService, FileUploadStatus, NodesApiService, UploadService, setupTestBed } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { FileUploadingListComponent } from './file-uploading-list.component';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';

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

    describe('removeFile()', () => {
        it('should change file status when api returns success', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(of(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(file.status).toBe(FileUploadStatus.Deleted);
        });

        it('should change file status when api returns error', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(throwError(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(file.status).toBe(FileUploadStatus.Error);
        });

        it('should call uploadService on error', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(throwError(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(uploadService.cancelUpload).toHaveBeenCalled();
        });

        it('should call uploadService on success', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(of(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(uploadService.cancelUpload).toHaveBeenCalled();
        });

        it('should set `Deleted` status on file version instances when original is removed', () => {
            component.files = <any> [
                {
                    data: {
                        entry: { id: 'nodeId' }
                    },
                    name: 'file',
                    status: FileUploadStatus.Complete,
                    options: {
                        newVersion: false
                    }
                },
                {
                    data: {
                        entry: { id: 'nodeId' }
                    },
                    name: 'file_v1',
                    status: FileUploadStatus.Complete,
                    options: {
                        newVersion: true
                    }
                }
            ];

            spyOn(nodesApiService, 'deleteNode').and.returnValue(of(component.files[0]));

            component.removeFile(component.files[0]);
            fixture.detectChanges();

            expect(nodesApiService.deleteNode).toHaveBeenCalledTimes(1);
            expect(component.files[0].status).toBe(FileUploadStatus.Deleted);
            expect(component.files[1].status).toBe(FileUploadStatus.Deleted);
        });

        describe('Events', () => {

            it('should throw an error event if delete file goes wrong', (done) => {
                spyOn(nodesApiService, 'deleteNode').and.returnValue(throwError(file));

                component.error.subscribe(() => {
                    done();
                });

                component.removeFile(file);
            });
        });
    });

    describe('cancelAllFiles()', () => {
        beforeEach(() => {
            component.files = <any> [
                {
                    data: {
                        entry: { id: '1' }
                    },
                    status: FileUploadStatus.Cancelled
                },
                {
                    data: {
                        entry: { id: '2' }
                    },
                    status: FileUploadStatus.Error
                }
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

        it('should call deleteNode when there are completed uploads', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(of({}));

            component.files[0].status = FileUploadStatus.Complete;
            component.cancelAllFiles();

            expect(nodesApiService.deleteNode).toHaveBeenCalled();
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
            component.files = <any> [
                { status: FileUploadStatus.Progress },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return false when at least one file is in pending', () => {
            component.files = <any> [
                { status: FileUploadStatus.Pending },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return false when at least one file is in starting state', () => {
            component.files = <any> [
                { status: FileUploadStatus.Starting },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return false when files are cancelled', () => {
            component.files = <any> [
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Cancelled }
            ];

            expect(component.isUploadCompleted()).toBe(false);
        });

        it('should return true when there are deleted files', () => {
            component.files = <any> [
                { status: FileUploadStatus.Complete },
                { status: FileUploadStatus.Deleted }
            ];

            expect(component.isUploadCompleted()).toBe(true);
        });

        it('should return true when none of the files is in progress', () => {
            component.files = <any> [
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Complete }
            ];

            expect(component.isUploadCompleted()).toBe(true);
        });
    });

    describe('isUploadCancelled()', () => {
        it('should return false when not all files are cancelled', () => {
            component.files = <any> [
                { status: FileUploadStatus.Complete },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there are no cancelled files', () => {
            component.files = <any> [
                { status: FileUploadStatus.Complete },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there is at least one file in progress', () => {
            component.files = <any> [
                { status: FileUploadStatus.Progress },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there is at least one file in pending', () => {
            component.files = <any> [
                { status: FileUploadStatus.Pending },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return true when all files are aborted', () => {
            component.files = <any> [
                { status: FileUploadStatus.Aborted }
            ];

            expect(component.isUploadCancelled()).toBe(true);
        });

        it('should return true when all files are cancelled', () => {
            component.files = <any> [
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Cancelled },
                { status: FileUploadStatus.Aborted }
            ];

            expect(component.isUploadCancelled()).toBe(true);
        });
    });
});
