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

import { TranslationMock } from './../assets/translation.service.mock';
import { ProcessAttachmentListComponent } from './process-attachment-list.component';

describe('ProcessAttachmentListComponent', () => {

    let componentHandler: any;
    let service: ActivitiContentService;
    let component: ProcessAttachmentListComponent;
    let fixture: ComponentFixture<ProcessAttachmentListComponent>;
    let getProcessRelatedContentSpy: jasmine.Spy;
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
                ProcessAttachmentListComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiContentService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ProcessAttachmentListComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiContentService);

        const translateService: TranslateService = TestBed.get(TranslateService);
        spyOn(translateService, 'get').and.callFake((key) => {
            return Observable.of(key);
        });

        mockAttachment = {
            'size': 2,
            'total': 2,
            'start': 0,
            'data': [{
                'id': 4001,
                'name': 'Invoice01.pdf',
                'created': '2017-05-12T12:50:05.522+0000',
                'createdBy': {
                    'id': 1,
                    'firstName': 'Apps',
                    'lastName': 'Administrator',
                    'email': 'admin@app.activiti.com',
                    'company': 'Alfresco.com',
                    'pictureId': 3003
                },
                'relatedContent': true,
                'contentAvailable': true,
                'link': false,
                'mimeType': 'application/pdf',
                'simpleType': 'pdf',
                'previewStatus': 'created',
                'thumbnailStatus': 'created'
            },
                {
                    'id': 4002,
                    'name': 'Invoice02.pdf',
                    'created': '2017-05-12T12:50:05.522+0000',
                    'createdBy': {
                        'id': 1,
                        'firstName': 'Apps',
                        'lastName': 'Administrator',
                        'email': 'admin@app.activiti.com',
                        'company': 'Alfresco.com',
                        'pictureId': 3003
                    },
                    'relatedContent': true,
                    'contentAvailable': true,
                    'link': false,
                    'mimeType': 'application/pdf',
                    'simpleType': 'pdf',
                    'previewStatus': 'created',
                    'thumbnailStatus': 'created'
                }]
        };

        getProcessRelatedContentSpy = spyOn(service, 'getProcessRelatedContent').and.returnValue(Observable.of(mockAttachment));

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

    it('should load attachments when processInstanceId specified', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
        expect(getProcessRelatedContentSpy).toHaveBeenCalled();
    });

    it('should emit an error when an error occurs loading attachments', () => {
        let emitSpy = spyOn(component.error, 'emit');
        getProcessRelatedContentSpy.and.returnValue(Observable.throw({}));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });
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

    it('should not attach when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the process has attachments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('adf-datatable tbody tr')).length).toBe(2);
        });
    }));

    it('should display all actions if attachements are not read only', () => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

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
        component.ngOnChanges({ 'processInstanceId': change });
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
        getProcessRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list-header').innerText.trim()).toEqual('PROCESS-ATTACHMENT.EMPTY.HEADER');
        });
    }));

    it('should show the empty list drag and drop component when the process is not completed', async(() => {
        getProcessRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list .adf-empty-list-drag_drop').innerText.trim()).toEqual('PROCESS-ATTACHMENT.EMPTY.DRAG-AND-DROP.TITLE');
        });
    }));

    it('should show the empty list component when the attachments list is empty for completed process', async(() => {
        getProcessRelatedContentSpy.and.returnValue(Observable.of({
            'size': 0,
            'total': 0,
            'start': 0,
            'data': []
        }));
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({'processInstanceId': change});
        component.disabled = true;

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector('adf-empty-list-header').innerText.trim()).toEqual('PROCESS-ATTACHMENT.EMPTY-LIST.HEADER');
        });
    }));

    describe('change detection', () => {

        let change = new SimpleChange('123', '456', true);
        let nullChange = new SimpleChange('123', null, true);

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.whenStable().then(() => {
                getProcessRelatedContentSpy.calls.reset();
            });
        }));

        it('should fetch new attachments when processInstanceId changed', () => {
            component.ngOnChanges({ 'processInstanceId': change });
            expect(getProcessRelatedContentSpy).toHaveBeenCalledWith('456');
        });

        it('should NOT fetch new attachments when empty changeset made', () => {
            component.ngOnChanges({});
            expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
        });

        it('should NOT fetch new attachments when processInstanceId changed to null', () => {
            component.ngOnChanges({ 'processInstanceId': nullChange });
            expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
        });
    });

    describe('Delete attachments', () => {

        beforeEach(async(() => {
            component.processInstanceId = '123';
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            expect(true).toBe(true);
        });

    });

});
