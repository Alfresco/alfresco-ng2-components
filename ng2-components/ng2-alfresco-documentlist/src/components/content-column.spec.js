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
var document_list_1 = require("./document-list");
var content_column_1 = require("./content-column");
var document_list_service_mock_1 = require("../assets/document-list.service.mock");
var content_column_list_1 = require("./content-column-list");
describe('ContentColumn', function () {
    var documentList;
    var columnList;
    beforeEach(function () {
        var service = new document_list_service_mock_1.DocumentListServiceMock();
        documentList = new document_list_1.DocumentList(service, null, null);
        columnList = new content_column_list_1.ContentColumnList(documentList);
    });
    it('should register model within parent column list', function () {
        spyOn(columnList, 'registerColumn').and.callThrough();
        var column = new content_column_1.ContentColumn(columnList);
        column.ngOnInit();
        expect(columnList.registerColumn).toHaveBeenCalled();
        var columns = documentList.data.getColumns();
        expect(columns.length).toBe(1);
        expect(columns[0]).toBe(column);
    });
    it('should setup screen reader title for thumbnail column', function () {
        var column = new content_column_1.ContentColumn(columnList);
        column.key = '$thumbnail';
        column.ngOnInit();
        expect(column.srTitle).toBe('Thumbnail');
    });
    it('should register on init', function () {
        var column = new content_column_1.ContentColumn(columnList);
        spyOn(column, 'register').and.callThrough();
        column.ngOnInit();
        expect(column.register).toHaveBeenCalled();
    });
    it('should require action list to register action with', function () {
        var column = new content_column_1.ContentColumn(columnList);
        expect(column.register()).toBeTruthy();
        column = new content_column_1.ContentColumn(null);
        expect(column.register()).toBeFalsy();
    });
});
//# sourceMappingURL=content-column.spec.js.map