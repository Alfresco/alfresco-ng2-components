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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableComponent, DataTableModule } from 'ng2-alfresco-datatable';
import { MaterialModule } from '../../material.module';
import { DocumentListService } from '../../services/document-list.service';

import { DocumentListComponent } from './../document-list.component';
import { EmptyFolderContentDirective } from './empty-folder-content.directive';

describe('EmptyFolderContent', () => {

    let emptyFolderContent: EmptyFolderContentDirective;
    let documentList: DocumentListComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule,
                DataTableModule,
                MaterialModule
            ],
            declarations: [
                DocumentListComponent
            ],
            providers: [
                DocumentListService
            ],
            schemas: [
                CUSTOM_ELEMENTS_SCHEMA
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        documentList = TestBed.createComponent(DocumentListComponent).componentInstance;
        documentList.dataTable = new DataTableComponent(null, null);
        emptyFolderContent = new EmptyFolderContentDirective(documentList);
    });

    it('is defined', () => {
        expect(emptyFolderContent).toBeDefined();
    });

    it('set template', () => {
        emptyFolderContent.template = '<example>';

        emptyFolderContent.ngAfterContentInit();

        expect(emptyFolderContent.template).toBe(documentList.emptyFolderTemplate);
        expect(emptyFolderContent.template).toBe(documentList.dataTable.noContentTemplate);
    });
});
