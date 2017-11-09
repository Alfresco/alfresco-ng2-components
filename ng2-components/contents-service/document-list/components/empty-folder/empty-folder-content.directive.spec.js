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
Object.defineProperty(exports, "__esModule", { value: true });
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var empty_folder_content_component_1 = require("./empty-folder-content.directive");
var document_list_component_1 = require("./../document-list.component");
var document_list_service_mock_1 = require("./../../assets/document-list.service.mock");
describe('EmptyFolderContent', function () {
    var emptyFolderContent;
    var documentList;
    beforeEach(function () {
        var documentListService = new document_list_service_mock_1.DocumentListServiceMock();
        documentList = new document_list_component_1.DocumentListComponent(documentListService, null, null);
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent(null);
        emptyFolderContent = new empty_folder_content_component_1.EmptyFolderContentDirective(documentList);
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
//# sourceMappingURL=empty-folder-content.directive.spec.js.map
