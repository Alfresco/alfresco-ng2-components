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
"use strict";
var empty_folder_content_1 = require("./empty-folder-content");
var document_list_1 = require("./document-list");
var document_list_service_mock_1 = require("./../assets/document-list.service.mock");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
describe('EmptyFolderContent', function () {
    var emptyFolderContent;
    var documentList;
    beforeEach(function () {
        var documentListService = new document_list_service_mock_1.DocumentListServiceMock();
        documentList = new document_list_1.DocumentList(documentListService, null, null);
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent();
        emptyFolderContent = new empty_folder_content_1.EmptyFolderContent(documentList);
    });
    it('is defined', function () {
        expect(emptyFolderContent).toBeDefined();
    });
    it('set template', function () {
        emptyFolderContent.template = '<example>';
        emptyFolderContent.ngAfterContentInit();
        expect(emptyFolderContent.template).toBe(documentList.emptyFolderTemplate);
        expect(emptyFolderContent.template).toBe(documentList.dataTable.noContentTemplate);
    });
});
//# sourceMappingURL=empty-folder-content.spec.js.map