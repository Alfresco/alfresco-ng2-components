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
import { AlfrescoTranslationService, FileUploadStatus, NodesApiService, NotificationService, UploadService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { UploadModule } from '../../index';
import { FileUploadingListComponent } from './file-uploading-list.component';

describe('FileUploadingListComponent', () => {
    let fixture: ComponentFixture<FileUploadingListComponent>;
    let component: FileUploadingListComponent;
    let uploadService: UploadService;
    let nodesApiService: NodesApiService;
    let notificationService: NotificationService;
    let translateService: AlfrescoTranslationService;
    let file: any;

    beforeEach(() => {
        file = { data: { entry: { id: 'x' } } };
    });

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
        notificationService = TestBed.get(NotificationService);
        translateService = TestBed.get(AlfrescoTranslationService);
        fixture = TestBed.createComponent(FileUploadingListComponent);
        component = fixture.componentInstance;

        spyOn(translateService, 'get').and.returnValue(Observable.of('some error message'));
        spyOn(notificationService, 'openSnackMessage');
        spyOn(uploadService, 'cancelUpload');
    });

    describe('cancelFile()', () => {
        it('should call uploadService api when cancelling a file', () => {
            component.cancelFile(file);

            expect(uploadService.cancelUpload).toHaveBeenCalledWith(file);
        });
    });

    describe('removeFile()', () => {
        it('should change file status when api returns success', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.of(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(file.status).toBe(FileUploadStatus.Deleted);
        });

        it('should change file status when api returns error', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.throw(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(file.status).toBe(FileUploadStatus.Error);
        });

        it('should notify fail when api returns error', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.throw(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
        });

        it('should call uploadService on error', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.throw(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(uploadService.cancelUpload).toHaveBeenCalled();
        });

        it('should call uploadService on success', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.of(file));

            component.removeFile(file);
            fixture.detectChanges();

            expect(uploadService.cancelUpload).toHaveBeenCalled();
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
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.of({}));

            component.files[0].status = FileUploadStatus.Complete;
            component.cancelAllFiles();

            expect(nodesApiService.deleteNode).toHaveBeenCalled();
        });

        it('should call uploadService when there are uploading files', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.of({}));

            component.files[0].status = FileUploadStatus.Progress;
            component.cancelAllFiles();

            expect(uploadService.cancelUpload).toHaveBeenCalled();
        });

        it('should notify on deleting file error', () => {
            spyOn(nodesApiService, 'deleteNode').and.returnValue(Observable.throw({}));

            component.files[0].status = FileUploadStatus.Complete;
            component.cancelAllFiles();

            expect(notificationService.openSnackMessage).toHaveBeenCalled();
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

        it('should return false when there is at leat one file in progress', () => {
            component.files = <any> [
                { status: FileUploadStatus.Progress },
                { status: FileUploadStatus.Error },
                { status: FileUploadStatus.Error }
            ];

            expect(component.isUploadCancelled()).toBe(false);
        });

        it('should return false when there is at leat one file in pendding', () => {
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
