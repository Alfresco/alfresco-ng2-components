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
import { of } from 'rxjs';
import { TaskListService } from './../services/tasklist.service';
import { setupTestBed } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('TaskAuditDirective', () => {

    @Component({
        selector: 'adf-basic-button',
        template: `
        <button id="auditButton"
            adf-task-audit
            [task-id]="currentTaskId"
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

        onAuditClick() {}
    }

    let fixture: ComponentFixture<BasicButtonComponent>;
    let component: BasicButtonComponent;
    let service: TaskListService;

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

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        declarations: [BasicButtonComponent]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BasicButtonComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(TaskListService);

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should fetch the pdf Blob when the format is pdf', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'pdf';
        const blob = createFakePdfBlob();
        spyOn(service, 'fetchTaskAuditPdfById').and.returnValue(of(blob));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('#auditButton');

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

        const auditJson = { taskId: '77', taskName: 'Fake Task Name', assignee: 'FirstName LastName', formData: [], selectedOutcome: null, comments: [] };
        spyOn(service, 'fetchTaskAuditJsonById').and.returnValue(of(auditJson));
        spyOn(component, 'onAuditClick').and.callThrough();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('#auditButton');

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.onAuditClick).toHaveBeenCalledWith({ format: 'json', value: auditJson, fileName: 'FakeAuditName' });
        });

        button.click();

    }));

    it('should fetch the pdf Blob as default when the format is UNKNOWN', fakeAsync(() => {
        component.fileName = 'FakeAuditName';
        component.format = 'fakeFormat';
        const blob = createFakePdfBlob();
        spyOn(service, 'fetchTaskAuditPdfById').and.returnValue(of(blob));
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
