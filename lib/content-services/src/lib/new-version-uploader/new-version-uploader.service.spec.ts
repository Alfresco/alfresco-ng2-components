import { ContentService } from '@alfresco/adf-core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { mockFile, mockNode } from '../mock';
import { ContentTestingModule } from '../testing/content.testing.module';
import { NewVersionUploaderDialogComponent, NewVersionUploaderDialogData } from './new-version-uploader.dialog';
import { NewVersionUploaderService } from './new-version-uploader.service';

describe('NewVersionUploaderService', () => {
    let service: NewVersionUploaderService;
    let contentService: ContentService;
    let dialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule
            ]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(NewVersionUploaderService);
        contentService = TestBed.inject(ContentService);
        dialog = TestBed.inject(MatDialog);

        spyOnDialogOpen = spyOn(dialog, 'open').and.returnValue({
            componentInstance: {
                uploadNewVersion: new Subject<any>(),
                uploadError: new Subject<any>()
            }
        } as any);

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


    });
});
