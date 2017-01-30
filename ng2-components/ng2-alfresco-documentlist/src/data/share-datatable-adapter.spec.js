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
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var document_list_service_mock_1 = require("./../assets/document-list.service.mock");
var share_datatable_adapter_1 = require("./share-datatable-adapter");
var document_library_model_mock_1 = require("./../assets/document-library.model.mock");
describe('ShareDataTableAdapter', function () {
    var basePath;
    var documentListService;
    beforeEach(function () {
        basePath = '/root';
        documentListService = new document_list_service_mock_1.DocumentListServiceMock();
    });
    it('should setup rows and columns with constructor', function () {
        var schema = [{}];
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, schema);
        expect(adapter.getRows()).toEqual([]);
        expect(adapter.getColumns()).toEqual(schema);
    });
    it('should setup columns when constructor is missing schema', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        expect(adapter.getColumns()).toEqual([]);
    });
    it('should set new columns', function () {
        var columns = [{}, {}];
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        adapter.setColumns(columns);
        expect(adapter.getColumns()).toEqual(columns);
    });
    it('should reset columns', function () {
        var columns = [{}, {}];
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, columns);
        expect(adapter.getColumns()).toEqual(columns);
        adapter.setColumns(null);
        expect(adapter.getColumns()).toEqual([]);
    });
    it('should set new rows', function () {
        var rows = [{}, {}];
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        expect(adapter.getRows()).toEqual([]);
        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);
    });
    it('should reset rows', function () {
        var rows = [{}, {}];
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);
        adapter.setRows(null);
        expect(adapter.getRows()).toEqual([]);
    });
    it('should sort new rows', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        spyOn(adapter, 'sort').and.callThrough();
        var rows = [{}];
        adapter.setRows(rows);
        expect(adapter.sort).toHaveBeenCalled();
    });
    it('should fail when getting value for missing row', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        var check = function () { return adapter.getValue(null, {}); };
        expect(check).toThrowError(adapter.ERR_ROW_NOT_FOUND);
    });
    it('should fail when getting value for missing column', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        var check = function () { return adapter.getValue({}, null); };
        expect(check).toThrowError(adapter.ERR_COL_NOT_FOUND);
    });
    it('should require path to load data', function () {
        spyOn(documentListService, 'getFolder').and.callThrough();
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, null, null);
        adapter.loadPath(null);
        expect(documentListService.getFolder).not.toHaveBeenCalled();
    });
    it('should load data for path', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        var path = '/some/path';
        var page = new document_library_model_mock_1.PageNode([folder]);
        spyOn(documentListService, 'getFolder').and.callThrough();
        documentListService.getFolderResult = page;
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, null, null);
        adapter.loadPath(path);
        expect(documentListService.getFolder).toHaveBeenCalledWith(path, jasmine.anything());
        var rows = adapter.getRows();
        expect(rows.length).toBe(1);
        expect(rows[0].node).toBe(folder);
    });
    it('should covert cell value to formatted date', function () {
        var rawValue = new Date(2015, 6, 15, 21, 43, 11);
        var dateValue = 'Jul 15, 2015, 9:43:11 PM';
        var file = new document_library_model_mock_1.FileNode();
        file.entry.createdAt = rawValue;
        var col = {
            key: 'createdAt',
            type: 'date',
            format: 'medium'
        };
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        var value = adapter.getValue(row, col);
        expect(value).toBe(dateValue);
    });
    it('should use default date format as fallback', function () {
        var rawValue = new Date(2015, 6, 15, 21, 43, 11);
        var dateValue = 'Jul 15, 2015, 9:43:11 PM';
        var file = new document_library_model_mock_1.FileNode();
        file.entry.createdAt = rawValue;
        var col = {
            key: 'createdAt',
            type: 'date',
            format: null
        };
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        var value = adapter.getValue(row, col);
        expect(value).toBe(dateValue);
    });
    it('should return date value as string', function () {
        var rawValue = new Date(2015, 6, 15, 21, 43, 11);
        var file = new document_library_model_mock_1.FileNode();
        file.entry.createdAt = rawValue;
        var col = {
            key: 'createdAt',
            type: 'string'
        };
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        var value = adapter.getValue(row, col);
        expect(value).toBe(rawValue);
    });
    it('should log error when having date conversion issues', function () {
        var dateValue = {};
        var file = new document_library_model_mock_1.FileNode();
        file.entry.createdAt = dateValue;
        var col = {
            key: 'createdAt',
            type: 'date',
            format: 'medium'
        };
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, null);
        spyOn(console, 'error').and.stub();
        var value = adapter.getValue(row, col);
        expect(value).toBe('Error');
        expect(console.error).toHaveBeenCalled();
    });
    it('should generate fallback icon for a file thumbnail with unknown mime type', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, basePath, null);
        var file = new document_library_model_mock_1.FileNode('file', 'wrong-mime');
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(basePath + "/assets/images/ft_ic_miscellaneous.svg");
    });
    it('should generate fallback icon for a file thumbnail with missing mime type', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, basePath, null);
        var file = new document_library_model_mock_1.FileNode();
        file.entry.content.mimeType = null;
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(basePath + "/assets/images/ft_ic_miscellaneous.svg");
    });
    it('should generate fallback icon for a file with no content entry', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, basePath, null);
        var file = new document_library_model_mock_1.FileNode();
        file.entry.content = null;
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(basePath + "/assets/images/ft_ic_miscellaneous.svg");
    });
    it('should generate fallback icon when document service fails to find one', function () {
        spyOn(documentListService, 'getMimeTypeIcon').and.returnValue(null);
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, basePath, null);
        var file = new document_library_model_mock_1.FileNode();
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(basePath + "/assets/images/ft_ic_miscellaneous.svg");
    });
    it('should return image value unmodified', function () {
        var imageUrl = 'http://<address>';
        var file = new document_library_model_mock_1.FileNode();
        file.entry['icon'] = imageUrl;
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, basePath, null);
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: 'icon' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
    });
    it('should resolve folder icon', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, basePath, null);
        var row = new share_datatable_adapter_1.ShareDataRow(new document_library_model_mock_1.FolderNode());
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(basePath + "/assets/images/ft_ic_folder.svg");
    });
    it('should resolve file thumbnail', function () {
        var imageUrl = 'http://<addresss>';
        spyOn(documentListService, 'getDocumentThumbnailUrl').and.returnValue(imageUrl);
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, basePath, null);
        adapter.thumbnails = true;
        var file = new document_library_model_mock_1.FileNode();
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
        expect(documentListService.getDocumentThumbnailUrl).toHaveBeenCalledWith(file);
    });
    it('should resolve fallback file icon for unknown node', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, basePath, null);
        var file = new document_library_model_mock_1.FileNode();
        file.entry.isFile = false;
        file.entry.isFolder = false;
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBe(basePath + "/assets/images/ft_ic_miscellaneous.svg");
    });
    it('should require document service to resolve thumbnail', function () {
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, basePath, null);
        adapter.thumbnails = true;
        var file = new document_library_model_mock_1.FileNode();
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var value = adapter.getValue(row, col);
        expect(value).toBeNull();
    });
    it('should log load error', function (done) {
        var error = 'My Error';
        documentListService.getFolderReject = true;
        documentListService.getFolderRejectError = error;
        spyOn(console, 'error').and.stub();
        spyOn(documentListService, 'getFolder').and.callThrough();
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, null, null);
        adapter.loadPath('/some/path').catch(function (err) {
            expect(err).toBe(error);
            done();
        });
    });
    it('should generate file icon path based on mime type', function () {
        var fileName = 'custom-icon.svg';
        spyOn(documentListService, 'getMimeTypeIcon').and.returnValue(fileName);
        var file = new document_library_model_mock_1.FileNode('file1', 'text/plain');
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        var col = { type: 'image', key: '$thumbnail' };
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, '/root', null);
        var value = adapter.getValue(row, col);
        expect(value).toBe("/root/assets/images/" + fileName);
        expect(documentListService.getMimeTypeIcon).toHaveBeenCalled();
    });
    it('should put folders on top upon sort', function () {
        var file1 = new document_library_model_mock_1.FileNode('file1');
        var file2 = new document_library_model_mock_1.FileNode('file2');
        var folder = new document_library_model_mock_1.FolderNode();
        var col = { key: 'name' };
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, [col]);
        adapter.setSorting(new ng2_alfresco_datatable_1.DataSorting('name', 'asc'));
        adapter.setRows([
            new share_datatable_adapter_1.ShareDataRow(file2),
            new share_datatable_adapter_1.ShareDataRow(file1),
            new share_datatable_adapter_1.ShareDataRow(folder)
        ]);
        var sorted = adapter.getRows();
        expect(sorted[0].node).toBe(folder);
        expect(sorted[1].node).toBe(file1);
        expect(sorted[2].node).toBe(file2);
    });
    it('should sort by dates up to ms', function () {
        var file1 = new document_library_model_mock_1.FileNode('file1');
        file1.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 1);
        var file2 = new document_library_model_mock_1.FileNode('file2');
        file2.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 2);
        var col = { key: 'dateProp' };
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(null, null, [col]);
        adapter.setRows([
            new share_datatable_adapter_1.ShareDataRow(file2),
            new share_datatable_adapter_1.ShareDataRow(file1)
        ]);
        adapter.sort('dateProp', 'asc');
        var rows = adapter.getRows();
        expect(rows[0].node).toBe(file1);
        expect(rows[1].node).toBe(file2);
        adapter.sort('dateProp', 'desc');
        expect(rows[0].node).toBe(file2);
        expect(rows[1].node).toBe(file1);
    });
    it('should preserve sorting on navigation', function () {
        var file1 = new document_library_model_mock_1.FileNode('file1');
        var file2 = new document_library_model_mock_1.FileNode('file2');
        var file3 = new document_library_model_mock_1.FileNode('file3');
        var file4 = new document_library_model_mock_1.FileNode('file4');
        var col = { key: 'name' };
        var adapter = new share_datatable_adapter_1.ShareDataTableAdapter(documentListService, null, [col]);
        adapter.setSorting(new ng2_alfresco_datatable_1.DataSorting('name', 'asc'));
        var page1 = new document_library_model_mock_1.PageNode([file2, file1]);
        var page2 = new document_library_model_mock_1.PageNode([file4, file3]);
        documentListService.getFolderResult = page1;
        adapter.loadPath('/page1');
        var sorted = adapter.getRows();
        expect(sorted[0].node).toBe(file1);
        expect(sorted[1].node).toBe(file2);
        documentListService.getFolderResult = page2;
        adapter.loadPath('/page2');
        sorted = adapter.getRows();
        expect(sorted[0].node).toBe(file3);
        expect(sorted[1].node).toBe(file4);
    });
});
describe('ShareDataRow', function () {
    it('should wrap node', function () {
        var file = new document_library_model_mock_1.FileNode();
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        expect(row.node).toBe(file);
    });
    it('should require object source', function () {
        expect(function () { return new share_datatable_adapter_1.ShareDataRow(null); }).toThrowError(share_datatable_adapter_1.ShareDataRow.ERR_OBJECT_NOT_FOUND);
    });
    it('should resolve value from node entry', function () {
        var file = new document_library_model_mock_1.FileNode('test');
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        expect(row.getValue('name')).toBe('test');
    });
    it('should check value', function () {
        var file = new document_library_model_mock_1.FileNode('test');
        var row = new share_datatable_adapter_1.ShareDataRow(file);
        expect(row.hasValue('name')).toBeTruthy();
        expect(row.hasValue('missing')).toBeFalsy();
    });
});
//# sourceMappingURL=share-datatable-adapter.spec.js.map