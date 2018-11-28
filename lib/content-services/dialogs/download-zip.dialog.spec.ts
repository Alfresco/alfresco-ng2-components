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

import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { setupTestBed, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DownloadZipDialogComponent } from './download-zip.dialog';

fdescribe('DownloadZipDialogComponent', () => {

    let fixture: ComponentFixture<DownloadZipDialogComponent>;
    let component: DownloadZipDialogComponent;
    let element: HTMLElement;
    let apiService: AlfrescoApiService;
    let dialogRef = {
        close: jasmine.createSpy('close')
    };

    let data = {
        nodeIds: [
            '123'
        ]
    };

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [
            { provide: MatDialogRef, useValue: dialogRef },
            { provide: MAT_DIALOG_DATA, useValue: data },
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        dialogRef.close.calls.reset();
        fixture = TestBed.createComponent(DownloadZipDialogComponent);
        apiService = TestBed.get(AlfrescoApiService);
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
        fixture.detectChanges();
        spyOn(component, 'cancelDownload').and.callThrough();

        const cancelButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#cancel-button');
        cancelButton.click();

        expect(component.cancelDownload).toHaveBeenCalled();
    });

    it('should call createDownload when component is initialize' , () => {
        spyOn(apiService, 'getInstance').and.callThrough();
        fixture.detectChanges();
        expect(apiService.getInstance).toHaveBeenCalled();
    });

    it('should close dialog when download is completed' , () => {
        fixture.detectChanges();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    fit('should close dialog when download is cancelled' , () => {
        fixture.detectChanges();
        spyOn(apiService, 'getInstance').and.stub();
        component.cancelDownload();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should interrupt download when cancel button is clicked' , () => {
        spyOn(component, 'downloadZip');
        spyOn(component, 'download');
        spyOn(component, 'cancelDownload').and.callThrough();

        fixture.detectChanges();

        expect(component.downloadZip).toHaveBeenCalled();

        const cancelButton: HTMLButtonElement = <HTMLButtonElement> element.querySelector('#cancel-button');
        cancelButton.click();

        expect(component.cancelDownload).toHaveBeenCalled();
        expect(component.download).not.toHaveBeenCalled();
    });
});
