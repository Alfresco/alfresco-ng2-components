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

declare let jasmine: any;

describe('TaskAttachmentList', () => {

    let componentHandler: any;
    let component: TaskAttachmentListComponent;
    let fixture: ComponentFixture<TaskAttachmentListComponent>;
    let service: ActivitiContentService;

    beforeEach(() => {
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

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
        spyOn(translateService, 'get').and.callFake((key) => { return Observable.of(key); });
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(TaskAttachmentListComponent);
        component = fixture.componentInstance;

        service = TestBed.get(ActivitiContentService);

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should fetch all the attachments of a taskId', (done) => {

        component.success.subscribe((res) => {
            expect(res).toBeDefined();
            expect(res.length).toBe(2);
            expect(res[0].name).toBe('fake.zip');
            expect(res[0].icon).toBe('ft_ic_archive.svg');
            expect(res[1].name).toBe('fake.jpg');
            expect(res[1].icon).toBe('ft_ic_raster_image.svg');
            done();
        });

        let taskId = '1';
        let change = new SimpleChange(null, taskId, true);
        component.ngOnChanges({ 'taskId': change });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({
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
            })
        });
    });
});
