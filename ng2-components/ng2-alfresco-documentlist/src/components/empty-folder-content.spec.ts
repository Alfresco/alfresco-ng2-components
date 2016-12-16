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

import { EmptyFolderContent } from './empty-folder-content';
import { DocumentList } from './document-list';
import { DocumentListServiceMock } from './../assets/document-list.service.mock';
import { DataTableComponent } from 'ng2-alfresco-datatable';

describe('EmptyFolderContent', () => {

    let emptyFolderContent: EmptyFolderContent;
    let documentList: DocumentList;

    beforeEach(() => {
        let documentListService = new DocumentListServiceMock();
        documentList = new DocumentList(documentListService, null, null);
        documentList.dataTable = new DataTableComponent();
        emptyFolderContent = new EmptyFolderContent(documentList);
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
