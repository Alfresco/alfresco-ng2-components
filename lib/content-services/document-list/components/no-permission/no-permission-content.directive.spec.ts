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

import { TestBed } from '@angular/core/testing';
import { DataTableComponent, setupTestBed } from '@alfresco/adf-core';
import { DocumentListComponent } from './../document-list.component';
import { NoPermissionContentDirective } from './no-permission-content.directive';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('NoPermissionContentDirective', () => {

    let noPermissionContent: NoPermissionContentDirective;
    let documentList: DocumentListComponent;

    setupTestBed({
        imports: [ContentTestingModule]
    });

    beforeEach(() => {
        documentList = (TestBed.createComponent(DocumentListComponent).componentInstance as DocumentListComponent);
        documentList.dataTable = new DataTableComponent(null, null);
        noPermissionContent = new NoPermissionContentDirective(documentList);
    });

    it('should be defined', () => {
        expect(noPermissionContent).toBeDefined();
    });

    it('should set template', () => {
        noPermissionContent.template = '<example>';

        noPermissionContent.ngAfterContentInit();

        expect(noPermissionContent.template).toBe(documentList.noPermissionTemplate);
        expect(noPermissionContent.template).toBe(documentList.dataTable.noPermissionTemplate);
    });
});
