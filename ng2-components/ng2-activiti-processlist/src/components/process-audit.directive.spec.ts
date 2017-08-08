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

import { Component } from '@angular/core';
import {
    async,
    ComponentFixture,
    fakeAsync,
    TestBed
} from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { ProcessService } from './../services/process.service';
import { ProcessAuditDirective } from './process-audit.directive';

declare let jasmine: any;

describe('ProcessAuditDirective', () => {

    let fixture: ComponentFixture<BasicButtonComponent>;
    let component: BasicButtonComponent;
    let service: ProcessService;

    function createFakePdfBlob(): Blob {
        let pdfData = atob(
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
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot()],
            declarations: [BasicButtonComponent, ProcessAuditDirective],
            providers: [ProcessService]
        });

        TestBed.compileComponents();

        fixture = TestBed.createComponent(BasicButtonComponent);
        component = fixture.componentInstance;
        service = TestBed.get(ProcessService);

        jasmine.Ajax.install();
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should fetch the pdf Blob when the format is pdf', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'pdf';
        let blob = createFakePdfBlob();
        spyOn(service, 'fetchProcessAuditPdfById').and.returnValue(Observable.of(blob));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        let button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'pdf', value: blob, fileName: 'FakeAuditName' });
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
        spyOn(service, 'fetchProcessAuditJsonById').and.returnValue(Observable.of(auditJson));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        let button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'json', value: auditJson, fileName: 'FakeAuditName' });
        });

        button.click();

    }));

    it('should fetch the pdf Blob as default when the format is UNKNOW', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'fakeFormat';
        let blob = createFakePdfBlob();
        spyOn(service, 'fetchProcessAuditPdfById').and.returnValue(Observable.of(blob));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        let button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'pdf', value: blob, fileName: 'FakeAuditName' });
        });

        button.click();

    }));

});

@Component({
    selector: 'adf-basic-button',
    template: `
    <button id="auditButton"
        adf-process-audit
        [process-id]="currentProcessId"
        [download]="download"
        [fileName]="fileName"
        [format]="format"
        (clicked)="onAuditClick($event)">My button
    </button>`
})
class BasicButtonComponent {

    download: boolean = false;
    fileName: string;
    format: string;
    constructor() {

    }

    onAuditClick(event: any) {
        console.log(event);
    }
}
