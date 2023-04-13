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

import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
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

@Component({
    template: ''
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
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ],
            declarations: [TestDialogComponent]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(NewVersionUploaderService);
        dialog = TestBed.inject(MatDialog);
        fixture = TestBed.createComponent(TestDialogComponent);

        dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: null });
        dialogRefSpyObj.componentInstance = fixture.componentInstance;
        dialogRefSpyObj.afterClosed = fixture.componentInstance.afterClosed;
        spyOnDialogOpen = spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('openUploadNewVersionDialog', () => {
        describe('Mat Dialog configuration', () => {
            let mockNewVersionUploaderDialogData: NewVersionUploaderDialogData;
            beforeEach(() => {
                spyOn(service.versionsApi, 'listVersionHistory').and.returnValue(Promise.resolve({
                    list: { entries: [{ entry: '2' }] }
                } as any));
                mockNewVersionUploaderDialogData = {
                    node: mockNode,
                    file: mockFile
                };
            });

            it('Should open dialog with default configuration', fakeAsync(() => {
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).toPromise();
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: {
                        file: mockFile,
                        node: mockNode,
                        currentVersion: '2',
                        showComments: true,
                        allowDownload: true,
                        showVersionsOnly: undefined
                    },
                    panelClass: ['adf-new-version-uploader-dialog', 'adf-new-version-uploader-dialog-upload'],
                    width: '630px'
                } as any);
            }));

            it('Should override default dialog panelClass', fakeAsync(() => {
                const mockDialogConfiguration: MatDialogConfig = {
                    panelClass: 'adf-custom-class',
                    width: '500px'
                };
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration).toPromise();
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: {
                        file: mockFile,
                        node: mockNode,
                        currentVersion: '2',
                        showComments: true,
                        allowDownload: true,
                        showVersionsOnly: undefined
                    },
                    panelClass: 'adf-custom-class',
                    width: '500px'
                } as any);
            }));

            it('Should set dialog height', fakeAsync(() => {
                const mockDialogConfiguration: MatDialogConfig = {
                    height: '600px'
                };
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration).toPromise();
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: {
                        file: mockFile,
                        node: mockNode,
                        currentVersion: '2',
                        showComments: true,
                        allowDownload: true,
                        showVersionsOnly: undefined
                    },
                    panelClass: ['adf-new-version-uploader-dialog', 'adf-new-version-uploader-dialog-upload'],
                    width: '630px',
                    height: '600px'
                } as any);
            }));

            it('Should not override dialog configuration, if dialog configuration is empty', fakeAsync(() => {
                const mockDialogConfiguration: MatDialogConfig = {};
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration).toPromise();
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: {
                        file: mockFile,
                        node: mockNode,
                        currentVersion: '2',
                        showComments: true,
                        allowDownload: true,
                        showVersionsOnly: undefined
                    },
                    panelClass: ['adf-new-version-uploader-dialog', 'adf-new-version-uploader-dialog-upload'],
                    width: '630px'
                } as any);
            }));

            it('Should dialog add list css class if showVersionsOnly is true', fakeAsync(() => {
                const mockNewVersionUploaderDialogDataWithVersionsOnly = {
                    node: mockNode,
                    file: mockFile,
                    showVersionsOnly: true
                };
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogDataWithVersionsOnly).toPromise();
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: {
                        file: mockFile,
                        node: mockNode,
                        currentVersion: '2',
                        showComments: true,
                        allowDownload: true,
                        showVersionsOnly: true
                    },
                    panelClass: ['adf-new-version-uploader-dialog', 'adf-new-version-uploader-dialog-list'],
                    width: '630px'
                } as any);
            }));

        });

        describe('Subscribe events from Dialog', () => {
            let mockNewVersionUploaderDialogData: NewVersionUploaderDialogData;

            beforeEach(() => {
                spyOn(service.versionsApi, 'listVersionHistory').and.returnValue(Promise.resolve({
                    list: { entries: [{ entry: '2' }] }
                }) as any);
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
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).subscribe(() => {
                        fail('An error should have been thrown');
                    },
                    error => {
                        expect(error).toEqual({ value: 'Upload error' });
                        done();
                    });
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
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, undefined, elementToFocusSelector)
                    .subscribe();
            });

        });

    });
});
