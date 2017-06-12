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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiContentService } from 'ng2-activiti-form';
import { ActivitiCreateProcessAttachmentComponent } from './adf-create-process-attachment.component';

declare let jasmine: any;

describe('Activiti Process Create Attachment', () => {

    let componentHandler: any;
    let service: ActivitiContentService;
    let component: ActivitiCreateProcessAttachmentComponent;
    let fixture: ComponentFixture<ActivitiCreateProcessAttachmentComponent>;
    let element: HTMLElement;

    let file = new File([new Blob()], 'Test');
    let customEvent = { detail: { files: [file] } };

    let fakeUploadResponse = {
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiCreateProcessAttachmentComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService },
                ActivitiContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivitiCreateProcessAttachmentComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiContentService);
        element = fixture.nativeElement;

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;

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

        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        expect(component.processInstanceId).toBe('123');
    });

    it('should emit content created event when the file is uploaded', async(() => {
        component.contentCreated.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.id).toBe(9999);
        });

        component.onFileUpload(customEvent);

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeUploadResponse)
        });
    }));

    it('should allow user to drag&drop files', async(() => {
        let dragArea: HTMLElement = <HTMLElement> element.querySelector('#add_new_process_content_area');
        expect(dragArea).toBeDefined();
        expect(dragArea).not.toBeNull();

        component.contentCreated.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.id).toBe(9999);
        });

        let dropEvent = new CustomEvent('upload-files', customEvent);
        dragArea.dispatchEvent(dropEvent);
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeUploadResponse)
        });
    }));

    it('should allow user to upload files via button', async(() => {
        let buttonUpload: HTMLElement = <HTMLElement> element.querySelector('#add_new_process_content_button');
        expect(buttonUpload).toBeDefined();
        expect(buttonUpload).not.toBeNull();

        component.contentCreated.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.id).toBe(9999);
        });

        let dropEvent = new CustomEvent('upload-files', customEvent);
        buttonUpload.dispatchEvent(dropEvent);
        fixture.detectChanges();

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify(fakeUploadResponse)
        });
    }));

});
