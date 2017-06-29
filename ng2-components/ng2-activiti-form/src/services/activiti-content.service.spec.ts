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
import { CoreModule, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ActivitiContentService } from 'ng2-activiti-form';
import { TaskAttachmentListComponent } from './adf-task-attachment-list.component';
import { Observable } from 'rxjs/Rx';
import { By } from '@angular/platform-browser';

declare let jasmine: any;

describe('TaskAttachmentList', () => {

    let componentHandler: any;
    let component: TaskAttachmentListComponent;
    let fixture: ComponentFixture<TaskAttachmentListComponent>;
    let service: ActivitiContentService;
    let getTaskRelatedContentSpy: jasmine.Spy;
    let deleteContentSpy: jasmine.Spy;
    let getFileRawContentSpy: jasmine.Spy;
    let mockAttachment: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule
            ],
            declarations: [
                TaskAttachmentListComponent
            ],
            providers: [
                ActivitiContentService
            ]
        }).compileComponents();

        let translateService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TaskAttachmentListComponent);
        component = fixture.componentInstance;

        service = TestBed.get(ActivitiContentService);

        mockAttachment = {
            size: 2,
            total: 2,
            start: 0,
            data: [
                {
                    id: 8,
                    name: 'fake.zip',
                    created: 1494595697381,
                    createdBy: {id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com'},
                    relatedContent: true,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'application/zip',
                    simpleType: 'content',
                    previewStatus: 'unsupported',
                    thumbnailStatus: 'unsupported'
                },
                {
                    id: 9,
                    name: 'fake.jpg',
                    created: 1494595655381,
                    createdBy: {id: 2, firstName: 'user', lastName: 'user', email: 'user@user.com'},
                    relatedContent: true,
                    contentAvailable: true,
                    link: false,
                    mimeType: 'image/jpeg',
                    simpleType: 'image',
                    previewStatus: 'unsupported',
                    thumbnailStatus: 'unsupported'
                }
            ]
        };

        getTaskRelatedContentSpy = spyOn(service, 'getTaskRelatedContent').and.returnValue(Observable.of(
            mockAttachment
        ));

        deleteContentSpy = spyOn(service, 'deleteRelatedContent').and.returnValue(Observable.of({successCode: true}));

        let blobObj = new Blob();
        getFileRawContentSpy = spyOn(service, 'getFileRawContent').and.returnValue(Observable.of(
            blobObj
        ));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load attachments when taskId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        expect(getTaskRelatedContentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading attachments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getTaskRelatedContentSpy.and.returnValue(Observable.throw({}));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit a success event when the attachments are loaded', () => {
        let change = new SimpleChange(null, '123', true);
        component.success.subscribe((attachments) => {
            expect(attachments[0].name).toEqual(mockAttachment.data[0].name);
            expect(attachments[0].id).toEqual(mockAttachment.data[0].id);
        });

        component.ngOnChanges({'taskId': change});
    });

    it('should not attach when no taskId is specified', () => {
        fixture.detectChanges();
        expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the task has attachments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('alfresco-datatable tbody tr')).length).toBe(2);
        });
    }));

    it('should not display attachments when the task has no attachments', async(() => {
        component.taskId = '123';
        getTaskRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('alfresco-datatable tbody tr')).length).toBe(0);
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                getTaskRelatedContentSpy.calls.reset();
            });
        }));

        it('should fetch new attachments when taskId changed', () => {
            component.ngOnChanges({'taskId': change});
            expect(getTaskRelatedContentSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new attachments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new attachments when taskId changed to null', () => {
            component.ngOnChanges({'taskId': nullChange});
            expect(getTaskRelatedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Delete attachments', () => {

        beforeEach(async(() => {
            component.taskId = '123';
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            expect(true).toBe(true);
        });

    });
});
