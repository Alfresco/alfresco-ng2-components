import { ContentService } from '@alfresco/adf-core';
import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { mockFile, mockNode } from '../mock';
import { ContentTestingModule } from '../testing/content.testing.module';
import { NewVersionUploaderDialogData } from './models';
import { NewVersionUploaderDialogComponent } from './new-version-uploader.dialog';
import { NewVersionUploaderService } from './new-version-uploader.service';

@Component({
    template: ''
})
class TestDialogComponent {
    @Output()
    uploadError = new EventEmitter<any>();

    afterClosed = () => of({ action: 'refresh', node: mockNode});

}

describe('NewVersionUploaderService', () => {
    let fixture: ComponentFixture<TestDialogComponent>;
    let service: NewVersionUploaderService;
    let contentService: ContentService;
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
        contentService = TestBed.inject(ContentService);
        dialog = TestBed.inject(MatDialog);
        fixture = TestBed.createComponent(TestDialogComponent);

        dialogRefSpyObj = jasmine.createSpyObj({afterClosed: null });
        dialogRefSpyObj.componentInstance = fixture.componentInstance;
        dialogRefSpyObj.afterClosed = fixture.componentInstance.afterClosed;
        spyOnDialogOpen = spyOn(dialog, 'open').and.returnValue(dialogRefSpyObj);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('openUploadNewVersionDialog', () => {
        it('Should not open dialog if update operation is not allowed', () => {
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(false);
            expect(spyOnDialogOpen).not.toHaveBeenCalled();
        });

        it('Should return error if update operation is not allowed', async () => {
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(false);
            const mockNewVersionUploaderDialogData: NewVersionUploaderDialogData = {
                node: mockNode,
                file: mockFile
            };

            service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData).catch(error => {
                expect(error).toEqual({ value: 'OPERATION.ERROR.PERMISSION' });
            });
        });

        describe('Mat Dialog configuration', () => {
            let mockNewVersionUploaderDialogData: NewVersionUploaderDialogData;
            beforeEach(() => {
                spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);
                spyOn(service.versionsApi, 'listVersionHistory').and.returnValue(Promise.resolve({
                    list: { entries: [{ entry: '2' }] }
                }));
                mockNewVersionUploaderDialogData = {
                    node: mockNode,
                    file: mockFile
                };
            });

            it('Should open dialog with default configuration', fakeAsync(() => {
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData);
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: { file: mockFile, node: mockNode, currentVersion: '2', showComments: true, allowDownload: true },
                    panelClass: 'adf-new-version-uploader-dialog',
                    width: '630px'
                });
            }));

            it('Should override default dialog panelClass', fakeAsync(() => {
                const mockDialogConfiguration: MatDialogConfig = {
                    panelClass: 'adf-custom-class',
                    width: '500px'
                };
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration);
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: { file: mockFile, node: mockNode, currentVersion: '2', showComments: true, allowDownload: true },
                    panelClass: 'adf-custom-class',
                    width: '500px'
                });
            }));

            it('Should set dialog height', fakeAsync(() => {
                const mockDialogConfiguration: MatDialogConfig = {
                    height: '600px'
                };
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration);
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: { file: mockFile, node: mockNode, currentVersion: '2', showComments: true, allowDownload: true },
                    panelClass: 'adf-new-version-uploader-dialog',
                    width: '630px',
                    height: '600px'
                });
            }));

            it('Should not override dialog configuration, if dialog configuration is empty', fakeAsync(() => {
                const mockDialogConfiguration: MatDialogConfig = {};
                service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData, mockDialogConfiguration);
                tick();
                expect(spyOnDialogOpen).toHaveBeenCalledWith(NewVersionUploaderDialogComponent, {
                    data: { file: mockFile, node: mockNode, currentVersion: '2', showComments: true, allowDownload: true },
                    panelClass: 'adf-new-version-uploader-dialog',
                    width: '630px'
                });
            }));

        });

        describe('Subscribe events from Dialog', () => {
            let mockNewVersionUploaderDialogData: NewVersionUploaderDialogData;

            beforeEach(() => {
                spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);
                spyOn(service.versionsApi, 'listVersionHistory').and.returnValue(Promise.resolve({
                    list: { entries: [{ entry: '2' }] }
                }));
                mockNewVersionUploaderDialogData = {
                    node: mockNode,
                    file: mockFile
                };
            });

            it('Should resolve Refresh action', fakeAsync(() => {
                const openDialogReturnedValue: Promise<any> = service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData);
                dialogRefSpyObj.afterClosed = () => of({ action: 'refresh', node: mockNode});
                tick();
                openDialogReturnedValue.then(res => expect(res).toEqual({ action: 'refresh', node: mockNode}));
            }));

            it('Should resolve Upload action', fakeAsync(() => {
                const openDialogReturnedValue: Promise<any> = service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData);
                dialogRefSpyObj.afterClosed = () => of({ action: 'upload', node: mockNode});
                tick();
                openDialogReturnedValue.then(res => expect(res).toEqual({ action: 'upload', node: mockNode}));
            }));

            it('Should resolve View Version action', fakeAsync(() => {
                const openDialogReturnedValue: Promise<any> = service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData);
                dialogRefSpyObj.afterClosed = () => of({ action: 'view', node: mockNode});
                tick();
                openDialogReturnedValue.then(res => expect(res).toEqual({ action: 'view', node: mockNode}));
            }));

            it('Should reject promise when an upload error is emitted', fakeAsync(() => {
                const openDialogReturnedValue = service.openUploadNewVersionDialog(mockNewVersionUploaderDialogData);
                tick();
                fixture.componentInstance.uploadError.next({ value: 'Upload error' });
                openDialogReturnedValue.catch(res => expect(res).toEqual({ value: 'Upload error' }));
            }));


        });


    });
});
