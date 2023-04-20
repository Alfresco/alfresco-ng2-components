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

import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ProcessService } from './../services/process.service';
import { setupTestBed, DownloadService } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'adf-basic-button',
    template: `
    <button id="auditButton"
        adf-process-audit
        [process-id]="1234"
        [download]="download"
        [fileName]="fileName"
        [format]="format"
        (error)="onAuditError($event)"
        (clicked)="onAuditClick($event)">My button
    </button>`
})
class BasicButtonComponent {
    download: boolean = false;
    fileName: string;
    format: string;

    onAuditClick() {}
    onAuditError() {}
}

describe('ProcessAuditDirective', () => {

    let fixture: ComponentFixture<BasicButtonComponent>;
    let component: BasicButtonComponent;
    let service: ProcessService;

    const createFakePdfBlob = (): Blob => {
        const pdfData = atob(
            'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
            'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
            'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
            'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
            'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
            'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
            'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
            'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
            'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
            'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
            'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
            'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
        return new Blob([pdfData], {type: 'application/pdf'});
    };

    const blob = createFakePdfBlob();

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [
            BasicButtonComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BasicButtonComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ProcessService);
    });

    afterEach(() => fixture.destroy());

    it('should fetch the pdf Blob when the format is pdf', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'pdf';
        spyOn(service, 'fetchProcessAuditPdfById').and.returnValue(of(blob));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'pdf', value: blob, fileName: 'FakeAuditName' });
        });

        button.click();
    }));

    it('should download the audit in PDF format (default mode)', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.download = true;
        const downloadService = TestBed.inject(DownloadService);
        spyOn(service, 'fetchProcessAuditPdfById').and.returnValue(of(blob));
        spyOn(downloadService, 'downloadBlob').and.stub();

        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(downloadService.downloadBlob).toHaveBeenCalledWith(blob, 'FakeAuditName.pdf');
        });

        button.click();
    }));

    it('should throw error if download audit failed', fakeAsync(() => {
        const expectedError = 'Failed to get audit';
        spyOn(service, 'fetchProcessAuditPdfById').and.returnValue(throwError(expectedError));
        spyOn(component, 'onAuditError').and.stub();

        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditError).toHaveBeenCalledWith(expectedError);
        });

        button.click();
    }));

    it('should fetch the json info when the format is json', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'json';
        component.download = true;
        const auditJson = {
            processInstanceId: 42516, processInstanceName: 'Fake Process - August 3rd 2017',
            processDefinitionName: 'Claim Approval Process', processDefinitionVersion: 1, processInstanceStartTime: 'Thu Aug 03 15:32:47 UTC 2017', processInstanceEndTime: null,
            processInstanceDurationInMillis: null,
            processInstanceInitiator: 'MyName MyLastname',
            entries: [{
                index: 1, type: 'startForm',
                selectedOutcome: null, formData: [{
                    fieldName: 'User Name',
                    fieldId: 'username', value: 'dsassd'
                },
                { fieldName: 'Claim Amount', fieldId: 'claimamount', value: '22' }], taskName: null, taskAssignee: null, activityId: null,
                activityName: null, activityType: null, startTime: null, endTime: null, durationInMillis: null
            }
            ], decisionInfo: { calculatedValues: [], appliedRules: [] }
        };
        spyOn(service, 'fetchProcessAuditJsonById').and.returnValue(of(auditJson));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'json', value: auditJson, fileName: 'FakeAuditName' });
        });

        button.click();
    }));

    it('should fetch the pdf Blob as default when the format is UNKNOW', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'fakeFormat';
        spyOn(service, 'fetchProcessAuditPdfById').and.returnValue(of(blob));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'pdf', value: blob, fileName: 'FakeAuditName' });
        });

        button.click();
    }));
});
