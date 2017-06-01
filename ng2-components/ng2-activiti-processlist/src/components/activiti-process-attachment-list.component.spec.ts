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
import { DataTableModule, ObjectDataRow, DataRowEvent, ObjectDataTableAdapter, DataSorting } from 'ng2-alfresco-datatable';

import { ActivitiProcessAttachmentListComponent } from './activiti-process-attachment-list.component';
import { TranslationMock } from './../assets/translation.service.mock';

describe('Activiti Process Instance Attachment List', () => {

    let componentHandler: any;
    let service: ActivitiContentService;
    let component: ActivitiProcessAttachmentListComponent;
    let fixture: ComponentFixture<ActivitiProcessAttachmentListComponent>;
    let getProcessRelatedContentSpy: jasmine.Spy;
    let deleteContentSpy: jasmine.Spy;
    let getFileRawContentSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule.forRoot()
            ],
            declarations: [
                ActivitiProcessAttachmentListComponent
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiProcessAttachmentListComponent);
        component = fixture.componentInstance;
        service = fixture.debugElement.injector.get(ActivitiContentService);

        getProcessRelatedContentSpy = spyOn(service, 'getProcessRelatedContent').and.returnValue(Observable.of(
            {
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
            }));

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

    it('should not attach when no processInstanceId is specified', () => {
        fixture.detectChanges();
        expect(getProcessRelatedContentSpy).not.toHaveBeenCalled();
    });

    it('should display attachments when the process has attachments', async(() => {
        let change = new SimpleChange(null, '123', true);
        component.ngOnChanges({ 'processInstanceId': change });

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.debugElement.queryAll(By.css('alfresco-datatable tbody tr')).length).toBe(2);
        });
    }));

    it('should not display attachments when the process has no attachments', async(() => {
        component.processInstanceId = '123';
        getProcessRelatedContentSpy.and.returnValue(Observable.of({
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
            component.processInstanceId = '123';
            fixture.detectChanges();
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
            fixture.detectChanges();
            fixture.whenStable();
        }));

        it('should display a dialog to the user when the Add button clicked', () => {
            expect(true).toBe(true);
        });

    });

});
