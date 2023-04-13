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
import { of } from 'rxjs';

import { setupTestBed } from '@alfresco/adf-core';
import { AttachmentComponent } from './create-task-attachment.component';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessContentService } from '../form/services/process-content.service';

describe('AttachmentComponent', () => {

    let service: ProcessContentService;
    let component: AttachmentComponent;
    let fixture: ComponentFixture<AttachmentComponent>;
    let createTaskRelatedContentSpy: jasmine.Spy;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {

        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ProcessContentService);

        createTaskRelatedContentSpy = spyOn(service, 'createTaskRelatedContent').and.returnValue(of(
            {
                status: true
            }));
    });

    it('should not call createTaskRelatedContent service when taskId changed', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({taskId: change});
        expect(createTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should not call createTaskRelatedContent service when there is no file uploaded', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({taskId: change});
        const customEvent: any = {
            detail: {
                files: []
            }
        };
        component.onFileUpload(customEvent);
        expect(createTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should call createTaskRelatedContent service when there is a file uploaded', () => {
        const change = new SimpleChange(null, '123', true);
        component.ngOnChanges({taskId: change});
        const file = new File([new Blob()], 'Test');
        const customEvent = {
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
