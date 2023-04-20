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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { CreateProcessAttachmentComponent } from './create-process-attachment.component';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';

declare let jasmine: any;

describe('CreateProcessAttachmentComponent', () => {

    let component: CreateProcessAttachmentComponent;
    let fixture: ComponentFixture<CreateProcessAttachmentComponent>;
    let element: HTMLElement;

    const file = new File([new Blob()], 'Test');
    const fileObj = { entry: null, file, relativeFolder: '/' };
    const customEvent = { detail: { files: [fileObj] } };

    const fakeUploadResponse = {
        id: 9999,
        name: 'BANANA.jpeg',
        created: '2017-06-12T12:52:11.109Z',
        createdBy: { id: 2, firstName: 'fake-user', lastName: 'fake-user', email: 'fake-user' },
        relatedContent: false,
        contentAvailable: true,
        link: false,
        mimeType: 'image/jpeg',
        simpleType: 'image',
        previewStatus: 'queued',
        thumbnailStatus: 'queued'
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateProcessAttachmentComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;

        component.processInstanceId = '9999';
        fixture.detectChanges();
    });

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should update the processInstanceId when it is changed', () => {
        component.processInstanceId = null;

        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ processInstanceId: change });

        expect(component.processInstanceId).toBe('123');
    });

    it('should emit content created event when the file is uploaded', (done) => {
        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.id).toBe(9999);
            done();
        });

        component.onFileUpload(customEvent);

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeUploadResponse)
        });
    });

    it('should allow user to upload files via button', (done) => {
        const buttonUpload = element.querySelector<HTMLElement>('#add_new_process_content_button');
        expect(buttonUpload).toBeDefined();
        expect(buttonUpload).not.toBeNull();

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.id).toBe(9999);
            done();
        });

        const dropEvent = new CustomEvent('upload-files', customEvent);
        buttonUpload.dispatchEvent(dropEvent);
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeUploadResponse)
        });
    });
});
