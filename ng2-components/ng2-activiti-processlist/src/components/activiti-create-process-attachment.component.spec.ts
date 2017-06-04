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
import { Observable } from 'rxjs/Rx';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { ActivitiContentService } from 'ng2-activiti-form';

import { ActivitiCreateProcessAttachmentComponent } from './activiti-create-process-attachment.component';
import { TranslationMock } from './../assets/translation.service.mock';

describe('Activiti Process Instance Create Attachment', () => {

    let componentHandler: any;
    let service: ActivitiContentService;
    let component: ActivitiCreateProcessAttachmentComponent;
    let fixture: ComponentFixture<ActivitiCreateProcessAttachmentComponent>;
    let createProcessRelatedContentSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                ActivitiCreateProcessAttachmentComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiCreateProcessAttachmentComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiContentService);

        createProcessRelatedContentSpy = spyOn(service, 'createProcessRelatedContent').and.returnValue(Observable.of({successCode: true}));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should not call createProcessRelatedContent service when processInstanceId changed', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        expect(createProcessRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should not call createProcessRelatedContent service when there is no file uploaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        let customEvent = {
            detail: {
                files: [
                ]
            }
        };
        component.onFileUpload(customEvent);
        expect(createProcessRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should call createProcessRelatedContent service when there is a file uploaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        let file = new File([new Blob()], 'Test');
        let customEvent = {
            detail: {
                files: [
                    file
                ]
            }
        };
        component.onFileUpload(customEvent);
        expect(createProcessRelatedContentSpy).toHaveBeenCalled();
    });
});
