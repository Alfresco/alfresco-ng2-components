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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DownloadZipDialogComponent } from './download-zip.dialog';
import { DownloadZipService } from './services/download-zip.service';
import { DownloadEntry, FileDownloadStatus } from '@alfresco/js-api';
import { EMPTY, Observable, of } from 'rxjs';
import { RedirectAuthService } from '@alfresco/adf-core';
import { AlfrescoApiService } from '../../services';
import { AlfrescoApiServiceMock } from '../../mock';

describe('DownloadZipDialogComponent', () => {
    let fixture: ComponentFixture<DownloadZipDialogComponent>;
    let component: DownloadZipDialogComponent;
    let element: HTMLElement;
    let downloadZipService: DownloadZipService;
    const dialogRef = {
        close: jasmine.createSpy('close')
    };

    const dataMock = {
        nodeIds: ['123']
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                DownloadZipService,
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock },
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: dataMock },
                { provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of() } }
            ]
        });
        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(DownloadZipDialogComponent);
        downloadZipService = TestBed.inject(DownloadZipService);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should call downloadZip when it is not cancelled', () => {
        component.cancelled = false;
        spyOn(component, 'downloadZip');

        component.ngOnInit();

        expect(component.downloadZip).toHaveBeenCalledWith(['123']);
    });

    it('should not call downloadZip when it is cancelled', () => {
        component.cancelled = true;
        spyOn(component, 'downloadZip');

        component.ngOnInit();

        expect(component.downloadZip).not.toHaveBeenCalled();
    });

    it('should not call downloadZip when it contains zero nodeIds', () => {
        component.data = {
            nodeIds: []
        };
        spyOn(component, 'downloadZip');

        component.ngOnInit();

        expect(component.downloadZip).not.toHaveBeenCalled();
    });

    it('should call cancelDownload when CANCEL button is clicked', () => {
        spyOn(downloadZipService, 'createDownload').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        fixture.detectChanges();
        spyOn(component, 'cancelDownload');

        const cancelButton = element.querySelector<HTMLButtonElement>('#cancel-button');
        cancelButton.click();

        expect(component.cancelDownload).toHaveBeenCalled();
    });

    it('should call createDownload when component is initialize', () => {
        const createDownloadSpy = spyOn(downloadZipService, 'createDownload').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        fixture.detectChanges();
        expect(createDownloadSpy).toHaveBeenCalled();
    });

    it('should close dialog when download is completed', () => {
        spyOn(downloadZipService, 'createDownload').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        component.download('fakeUrl', 'fileName');
        spyOn(component, 'cancelDownload');
        fixture.detectChanges();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog when download is cancelled', () => {
        spyOn(downloadZipService, 'createDownload').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        fixture.detectChanges();
        component.download('url', 'filename');
        spyOn(downloadZipService, 'cancelDownload');
        component.cancelDownload();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should interrupt download when cancel button is clicked', () => {
        spyOn(component, 'downloadZip');
        spyOn(component, 'download');
        spyOn(component, 'cancelDownload');

        fixture.detectChanges();

        expect(component.downloadZip).toHaveBeenCalled();

        const cancelButton = element.querySelector<HTMLButtonElement>('#cancel-button');
        cancelButton.click();

        expect(component.cancelDownload).toHaveBeenCalled();
        expect(component.download).not.toHaveBeenCalled();
    });

    it('should waitForDownload and display correct download %', () => {
        const downloadEntry$: Observable<DownloadEntry> = new Observable((observer) => {
            observer.next({
                entry: {
                    filesAdded: 10,
                    bytesAdded: 1000,
                    id: '1',
                    totalFiles: 10,
                    totalBytes: 1000,
                    status: FileDownloadStatus.DONE
                }
            });
            observer.complete();
        });

        const downloadZipSpy = spyOn(downloadZipService, 'getDownload').and.callFake(() => downloadEntry$);

        component.waitAndDownload('1', 'testUrl', 'filename');
        fixture.detectChanges();

        expect(downloadZipSpy).toHaveBeenCalledWith('1');
        expect(component.percentageDone).toBe(100);
    });
});
