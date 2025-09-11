/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { mockFile, mockNewVersionUploaderData, mockNode } from '../mock';
import { ContentTestingModule } from '../testing/content.testing.module';
import {
    NewVersionUploaderData,
    NewVersionUploaderDataAction,
    NewVersionUploaderDialogData,
    RefreshData,
    VersionManagerUploadData,
    ViewVersion
} from './models';
import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';
import { NewVersionUploaderService } from './new-version-uploader.service';
import { Version, VersionPaging } from '@alfresco/js-api';

@Component({
    template: '',
    standalone: true
})
class TestDialogComponent {
    @Output()
    dialogAction = new EventEmitter<NewVersionUploaderData>();

    @Output()
    uploadError = new EventEmitter<any>();

    afterClosed = () => of({ action: 'refresh', node: mockNode });
}

describe('NewVersionUploaderService', () => {
    let fixture: ComponentFixture<TestDialogComponent>;
    let service: NewVersionUploaderService;
    let dialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;
    let dialogRefSpyObj;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, TestDialogComponent],
            teardown: { destroyAfterEach: false }
        });

        service = TestBed.inject(NewVersionUploaderService);
        dialog = TestBed.inject(MatDialog);
        fixture = TestBed.createComponent(TestDialogComponent);

        dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: null });
        dialogRefSpyObj.componentInstance = fixture.componentInstance;
        dialogRefSpyObj.afterClosed = fixture.componentInstance.afterClosed;
        spyOnDialogOpen = spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    });

    describe('openUploadNewVersionDialog', () => {
        let mockNewVersionUploaderDialogData: NewVersionUploaderDialogData;
        let expectedConfig: MatDialogConfig<NewVersionUploaderDialogData>;

        beforeEach(() => {
            spyOn(service.versionsApi, 'listVersionHistory').and.returnValue(
                Promise.resolve({
                    list: {
                        entries: [
                            {
                                entry: {
                                    id: '2'
                                }
                            }
                        ]
                    }
                } as VersionPaging)
            );
            mockNewVersionUploaderDialogData = {
                node: mockNode,
                file: mockFile,
                showComments: true,
                allowDownload: true
            };
            expectedConfig = {
                data: {
                    file: mockFile,
                    node: mockNode,
                    currentVersion: {
                        id: '2'
                    } as Version,
                    showComments: true,
                    allowDownload: true,
                    showVersionsOnly: undefined,
                    allowViewVersions: true,
                    allowVersionDelete: true,
                    showActions: true
                },
                panelClass: ['adf-new-version-uploader-dialog', 'adf-new-version-uploader-dialog-upload'],
                width: '630px'
            };
        });

        it('should open dialog with default configuration', fakeAsync(() => {
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).toPromise();
            tick();
            expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
        }));

        it('should override default dialog panelClass', fakeAsync(() => {
            const mockDialogConfiguration: MatDialogConfig = {
                panelClass: 'adf-custom-class',
                width: '500px'
            };
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration).toPromise();
            tick();
            expectedConfig.panelClass = 'adf-custom-class';
            expectedConfig.width = '500px';
            expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
        }));

        it('should set dialog height', fakeAsync(() => {
            const mockDialogConfiguration: MatDialogConfig = {
                height: '600px'
            };
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration).toPromise();
            tick();
            expectedConfig.height = '600px';
            expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
        }));

        it('should not override dialog configuration, if dialog configuration is empty', fakeAsync(() => {
            const mockDialogConfiguration: MatDialogConfig = {};
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration).toPromise();
            tick();
            expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
        }));

        it('should dialog add list css class if showVersionsOnly is true', fakeAsync(() => {
            const mockNewVersionUploaderDialogDataWithVersionsOnly = {
                node: mockNode,
                file: mockFile,
                showVersionsOnly: true,
                showComments: true,
                allowDownload: true
            };
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogDataWithVersionsOnly).toPromise();
            tick();
            expectedConfig.data.showVersionsOnly = true;
            expectedConfig.panelClass = ['adf-new-version-uploader-dialog', 'adf-new-version-uploader-dialog-list'];
            expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
        }));

        it('should open dialog with correct configuration when allowViewVersions is true', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<NewVersionUploaderData>(mockNewVersionUploaderData);
            mockNewVersionUploaderDialogData.allowViewVersions = true;

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
                done();
            });
        });

        it('should open dialog with correct configuration when allowViewVersions is false', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<NewVersionUploaderData>(mockNewVersionUploaderData);
            mockNewVersionUploaderDialogData.allowViewVersions = false;

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                expectedConfig.data.allowViewVersions = false;
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
                done();
            });
        });

        it('should open dialog with correct configuration when allowVersionDelete is true', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<NewVersionUploaderData>(mockNewVersionUploaderData);
            mockNewVersionUploaderDialogData.allowVersionDelete = true;

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
                done();
            });
        });

        it('should open dialog with correct configuration when allowVersionDelete is false', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<NewVersionUploaderData>(mockNewVersionUploaderData);
            mockNewVersionUploaderDialogData.allowVersionDelete = false;

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                expectedConfig.data.allowVersionDelete = false;
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
                done();
            });
        });

        it('should open dialog with correct configuration when showActions is true', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<NewVersionUploaderData>(mockNewVersionUploaderData);
            mockNewVersionUploaderDialogData.showActions = true;

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
                done();
            });
        });

        it('should open dialog with correct configuration when showActions is false', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<NewVersionUploaderData>(mockNewVersionUploaderData);
            mockNewVersionUploaderDialogData.showActions = false;

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                expectedConfig.data.showActions = false;
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, expectedConfig);
                done();
            });
        });
    });

    describe('Subscribe events from Dialog', () => {
        let mockNewVersionUploaderDialogData: NewVersionUploaderDialogData;

        beforeEach(() => {
            spyOn(service.versionsApi, 'listVersionHistory').and.returnValue(
                Promise.resolve({
                    list: { entries: [{ entry: '2' }] }
                }) as any
            );
            mockNewVersionUploaderDialogData = {
                node: mockNode,
                file: mockFile
            };
        });

        it('Should return Refresh action', (done) => {
            dialogRefSpyObj.componentInstance = {
                dialogAction: new BehaviorSubject<RefreshData>({
                    action: NewVersionUploaderDataAction.refresh,
                    node: mockNode
                }),
                uploadError: new Subject()
            };
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe((res) => {
                expect(res).toEqual({ action: NewVersionUploaderDataAction.refresh, node: mockNode });
                done();
            });
        });

        it('Should return Upload action', (done) => {
            dialogRefSpyObj.componentInstance = {
                dialogAction: new BehaviorSubject<VersionManagerUploadData>(mockNewVersionUploaderData),
                uploadError: new Subject()
            };
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe((res) => {
                expect(res).toEqual(mockNewVersionUploaderData);
                done();
            });
        });

        it('Should return View Version action', (done) => {
            dialogRefSpyObj.componentInstance = {
                dialogAction: new BehaviorSubject<ViewVersion>({
                    action: NewVersionUploaderDataAction.view,
                    versionId: '2'
                }),
                uploadError: new Subject()
            };
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe((res) => {
                expect(res).toEqual({ action: NewVersionUploaderDataAction.view, versionId: '2' });
                done();
            });
        });

        it('Should return upload error', (done) => {
            dialogRefSpyObj.componentInstance = {
                dialogAction: new Subject(),
                uploadError: new BehaviorSubject<any>({ value: 'Upload error' })
            };
            spyOnDialogOpen.and.returnValue(dialogRefSpyObj);
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(
                () => {
                    fail('An error should have been thrown');
                },
                (error) => {
                    expect(error).toEqual({ value: 'Upload error' });
                    done();
                }
            );
        });

        it('should focus element indicated by passed selector after closing modal', (done) => {
            dialogRefSpyObj.componentInstance.dialogAction = new BehaviorSubject<VersionManagerUploadData>(mockNewVersionUploaderData);
            const afterClosed$ = new BehaviorSubject<void>(undefined);
            dialogRefSpyObj.afterClosed = () => afterClosed$;
            const elementToFocusSelector = 'button';
            const elementToFocus = document.createElement(elementToFocusSelector);
            spyOn(elementToFocus, 'focus').and.callFake(() => {
                expect(elementToFocus.focus).toHaveBeenCalled();
                done();
            });
            spyOn(document, 'querySelector').and.returnValue(elementToFocus);
            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, undefined, elementToFocusSelector).subscribe();
        });
    });
});
