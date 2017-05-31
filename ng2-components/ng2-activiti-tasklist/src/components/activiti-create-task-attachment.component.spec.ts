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
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiContentService } from 'ng2-activiti-form';

import { ActivitiCreateTaskAttachmentComponent } from './activiti-create-task-attachment.component';

describe('Activiti Task Create Attachment', () => {

    let componentHandler: any;
    let service: ActivitiContentService;
    let component: ActivitiCreateTaskAttachmentComponent;
    let fixture: ComponentFixture<ActivitiCreateTaskAttachmentComponent>;
    let createTaskRelatedContentSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiCreateTaskAttachmentComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService },
                ActivitiContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiCreateTaskAttachmentComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiContentService);

        createTaskRelatedContentSpy = spyOn(service, 'createTaskRelatedContent').and.returnValue(Observable.of(
            {
              status: true
            }));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should not call createTaskRelatedContent service when taskId changed', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        expect(createTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should not call createTaskRelatedContent service when there is no file uploaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        let customEvent = {
            detail: {
                files: [
                ]
            }
        };
        component.onFileUpload(customEvent);
        expect(createTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should call createTaskRelatedContent service when there is a file uploaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'taskId': change });
        let file = new File([new Blob()], 'Test');
        let customEvent = {
            detail: {
                files: [
                    file
                ]
            }
        };
        component.onFileUpload(customEvent);
        expect(createTaskRelatedContentSpy).toHaveBeenCalled();
    });
});
