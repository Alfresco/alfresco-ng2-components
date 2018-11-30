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
import { TestBed } from '@angular/core/testing';
import { DataTableComponent, setupTestBed } from '@alfresco/adf-core';
import { DocumentListComponent } from '../document-list.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { ContentLoadingDirective } from './content-loading.directive';

describe('EmptyFolderContent', () => {

    let contentLoading: ContentLoadingDirective;
    let documentList: DocumentListComponent;

    setupTestBed({
        imports: [ContentTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        documentList = (TestBed.createComponent(DocumentListComponent).componentInstance as DocumentListComponent);
        documentList.dataTable = new DataTableComponent(null, null);
        contentLoading = new ContentLoadingDirective(documentList);
    });

    it('is defined', () => {
        expect(contentLoading).toBeDefined();
    });

    it('set template', () => {
        contentLoading.template = '<example>';

        contentLoading.ngAfterContentInit();

        expect(contentLoading.template).toBe(documentList.loadingTemplate);
        expect(contentLoading.template).toBe(documentList.dataTable.loadingTemplate);
    });
});
