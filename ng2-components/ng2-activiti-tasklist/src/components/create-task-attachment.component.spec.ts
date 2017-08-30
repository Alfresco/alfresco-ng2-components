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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { ActivitiContentService } from 'ng2-activiti-form';
import { AppConfigService, CoreModule, TranslationService } from 'ng2-alfresco-core';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';
import { AttachmentComponent } from './create-task-attachment.component';

describe('Activiti Task Create Attachment', () => {

    let componentHandler: any;
    let service: ActivitiContentService;
    let component: AttachmentComponent;
    let fixture: ComponentFixture<AttachmentComponent>;
    let createTaskRelatedContentSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            declarations: [
                AttachmentComponent
            ],
            providers: [
                { provide: AppConfigService, useClass: AppConfigServiceMock },
                { provide: TranslationService, useClass: TranslationMock },
                ActivitiContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(AttachmentComponent);
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
        component.ngOnChanges({'taskId': change});
        expect(createTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should not call createTaskRelatedContent service when there is no file uploaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        let customEvent: any = {
            detail: {
                files: []
            }
        };
        component.onFileUpload(customEvent);
        expect(createTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should call createTaskRelatedContent service when there is a file uploaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
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
