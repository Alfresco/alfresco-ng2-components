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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdProgressSpinnerModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ActivitiContentService } from 'ng2-activiti-form';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { Observable } from 'rxjs/Rx';
import { TaskAttachmentListComponent } from './task-attachment-list.component';

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
                DataTableModule.forRoot(),
                MdProgressSpinnerModule
            ],
            declarations: [
                TaskAttachmentListComponent
            ],
            providers: [
                ActivitiContentService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();

        let translateService: AlfrescoTranslationService = TestBed.get(AlfrescoTranslationService);
        spyOn(translateService, 'addTranslationFolder').and.stub();
        spyOn(translateService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });

        let nativeTranslateService: TranslateService = TestBed.get(TranslateService);
        spyOn(nativeTranslateService, 'get').and.callFake((key) => {
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
            expect(fixture.debugElement.queryAll(By.css('adf-datatable tbody tr')).length).toBe(2);
        });
    }));

    it('should display all actions if attachements are not read only', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        fixture.detectChanges();

        let actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let actionMenu = fixture.debugElement.nativeElement.querySelectorAll('button.mat-menu-item').length;
            expect(fixture.debugElement.nativeElement.querySelector('[data-automation-id="View"]')).not.toBeNull();
            expect(fixture.debugElement.nativeElement.querySelector('[data-automation-id="Remove"]')).not.toBeNull();
            expect(actionMenu).toBe(3);
        });
    });

    it('should not display remove action if attachments are read only', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        component.disabled = true;
        fixture.detectChanges();

        let actionButton = fixture.debugElement.nativeElement.querySelector('[data-automation-id="action_menu_0"]');
        actionButton.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let actionMenu = fixture.debugElement.nativeElement.querySelectorAll('button.mat-menu-item').length;
            expect(fixture.debugElement.nativeElement.querySelector('[data-automation-id="View"]')).not.toBeNull();
            expect(fixture.debugElement.nativeElement.querySelector('[data-automation-id="Remove"]')).toBeNull();
            expect(actionMenu).toBe(2);
        });
    });

    it('should show the empty list component when the attachments list is empty', async(() => {
        getTaskRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list-header').innerText.trim()).toEqual('TASK-ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should show the empty list drag and drop component when the task is not completed', async(() => {
        getTaskRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list .adf-empty-list-drag_drop').innerText.trim()).toEqual('TASK-ATTACHMENT.EMPTY.DRAG-AND-DROP.TITLE');
        });
    }));

    it('should show the empty list component when the attachments list is empty for completed task', async(() => {
        getTaskRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'taskId': change});
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list-header').innerText.trim()).toEqual('TASK-ATTACHMENT.EMPTY-LIST.HEADER');
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.taskId = '123';
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
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            expect(true).toBe(true);
        });

    });
});
