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
var document_list_service_mock_1 = require("../assets/document-list.service.mock");
var content_column_list_1 = require("./content-column-list");
describe('ContentColumnList', function () {
    var documentList;
    var columnList;
    beforeEach(function () {
        var service = new document_list_service_mock_1.DocumentListServiceMock();
        documentList = new document_list_1.DocumentList(service, null, null);
        columnList = new content_column_list_1.ContentColumnList(documentList);
    });
    it('should register column within parent document list', function () {
        var columns = documentList.data.getColumns();
        expect(columns.length).toBe(0);
        var column = {};
        var result = columnList.registerColumn(column);
        expect(result).toBeTruthy();
        expect(columns.length).toBe(1);
        expect(columns[0]).toBe(column);
    });
    it('should require document list instance to register action', function () {
        columnList = new content_column_list_1.ContentColumnList(null);
        var col = {};
        expect(columnList.registerColumn(col)).toBeFalsy();
    });
    it('should require action instance to register', function () {
        spyOn(documentList.actions, 'push').and.callThrough();
        var result = columnList.registerColumn(null);
        expect(result).toBeFalsy();
        expect(documentList.actions.push).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=content-column-list.spec.js.map