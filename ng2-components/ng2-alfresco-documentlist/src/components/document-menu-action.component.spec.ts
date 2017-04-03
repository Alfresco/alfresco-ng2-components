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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService,
    AlfrescoApiService,
    CoreModule,
    LogService
} from 'ng2-alfresco-core';
import { DocumentListService } from './../services/document-list.service';
import { DocumentMenuActionComponent } from './document-menu-action.component';

declare let jasmine: any;

describe('Document menu action', () => {

    let component: DocumentMenuActionComponent;
    let fixture: ComponentFixture<DocumentMenuActionComponent>;
    let element: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [DocumentMenuActionComponent],
            providers: [
                AlfrescoSettingsService,
                AlfrescoAuthenticationService,
                AlfrescoApiService,
                LogService,
                DocumentListService
            ]
        });

        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DocumentMenuActionComponent);

        element = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    describe('Folder creation', () => {

        it('should createFolder fire a success event if the folder has been created', (done) => {

            component.showDialog();

            component.createFolder('test-folder');

            component.success.subscribe(() => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 200,
                contentType: 'application/json',
                responseText: JSON.stringify({
                    'entry': {
                        'aspectNames': ['cm:auditable'],
                        'createdAt': '2017-04-03T11:34:35.708+0000',
                        'isFolder': true,
                        'isFile': false,
                        'createdByUser': {'id': 'admin', 'displayName': 'Administrator'},
                        'modifiedAt': '2017-04-03T11:34:35.708+0000',
                        'modifiedByUser': {'id': 'admin', 'displayName': 'Administrator'},
                        'name': 'test-folder2',
                        'id': 'c0284dc3-841d-48b2-955c-bcb2218e2b03',
                        'nodeType': 'cm:folder',
                        'parentId': '1ee81bf8-52d6-4cfc-a924-1efbc79306bf'
                    }
                })
            });
        });

        it('should createFolder fire an error event if the folder has not been created', (done) => {

            component.showDialog();

            component.createFolder('test-folder');

            component.error.subscribe(() => {
                done();
            });

            jasmine.Ajax.requests.mostRecent().respondWith({
                status: 403
            });
        });
    });
});
