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

import { DataColumn, DataRow, DataSorting } from 'ng2-alfresco-datatable';
import { DocumentListServiceMock } from './../assets/document-list.service.mock';
import { ShareDataTableAdapter, ShareDataRow } from './share-datatable-adapter';
import { FileNode, FolderNode, PageNode } from './../assets/document-library.model.mock';

describe('ShareDataTableAdapter', () => {

    let basePath: string;
    let documentListService: DocumentListServiceMock;

    beforeEach(() => {
        basePath = '/root';
        documentListService = new DocumentListServiceMock();
    });

    it('should setup rows and columns with constructor', () => {
        let schema = [<DataColumn> {}];
        let adapter = new ShareDataTableAdapter(null, null, schema);

        expect(adapter.getRows()).toEqual([]);
        expect(adapter.getColumns()).toEqual(schema);
    });

    it('should setup columns when constructor is missing schema', () => {
        let adapter = new ShareDataTableAdapter(null, null, null);

        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new columns', () => {
        let columns = [<DataColumn> {}, <DataColumn> {}];
        let adapter = new ShareDataTableAdapter(null, null, null);
        adapter.setColumns(columns);
        expect(adapter.getColumns()).toEqual(columns);
    });

    it('should reset columns', () => {
        let columns = [<DataColumn> {}, <DataColumn> {}];
        let adapter = new ShareDataTableAdapter(null, null, columns);

        expect(adapter.getColumns()).toEqual(columns);
        adapter.setColumns(null);
        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new rows', () => {
        let rows = [<DataRow> {}, <DataRow> {}];
        let adapter = new ShareDataTableAdapter(null, null, null);

        expect(adapter.getRows()).toEqual([]);
        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);
    });

    it('should reset rows', () => {
        let rows = [<DataRow> {}, <DataRow> {}];
        let adapter = new ShareDataTableAdapter(null, null, null);

        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);

        adapter.setRows(null);
        expect(adapter.getRows()).toEqual([]);
    });

    it('should sort new rows', () => {
        let adapter = new ShareDataTableAdapter(null, null, null);
        spyOn(adapter, 'sort').and.callThrough();

        let rows = [<DataRow> {}];
        adapter.setRows(rows);

        expect(adapter.sort).toHaveBeenCalled();
    });

    it('should fail when getting value for missing row', () => {
        let adapter = new ShareDataTableAdapter(null, null, null);
        let check = () => { return adapter.getValue(null, <DataColumn>{}); };
        expect(check).toThrowError(adapter.ERR_ROW_NOT_FOUND);
    });

    it('should fail when getting value for missing column', () => {
        let adapter = new ShareDataTableAdapter(null, null, null);
        let check = () => { return adapter.getValue(<DataRow>{}, null); };
        expect(check).toThrowError(adapter.ERR_COL_NOT_FOUND);
    });

    it('should require path to load data', () => {
        spyOn(documentListService, 'getFolder').and.callThrough();

        let adapter = new ShareDataTableAdapter(documentListService, null, null);
        adapter.loadPath(null);

        expect(documentListService.getFolder).not.toHaveBeenCalled();
    });

    it('should load data for path', () => {
        let folder = new FolderNode();
        let path = '/some/path';
        let page = new PageNode([folder]);

        spyOn(documentListService, 'getFolder').and.callThrough();
        documentListService.getFolderResult = page;

        let adapter = new ShareDataTableAdapter(documentListService, null, null);
        adapter.loadPath(path);

        expect(documentListService.getFolder).toHaveBeenCalledWith(path, jasmine.anything());

        let rows = adapter.getRows();
        expect(rows.length).toBe(1);
        expect((<ShareDataRow>rows[0]).node).toBe(folder);
    });

    it('should covert cell value to formatted date', () => {
        let rawValue = new Date(2015, 6, 15, 21, 43, 11); // Wed Jul 15 2015 21:43:11 GMT+0100 (BST);
        let dateValue = 'Jul 15, 2015, 9:43:11 PM';

        let file = new FileNode();
        file.entry.createdAt = rawValue;

        let col = <DataColumn> {
            key: 'createdAt',
            type: 'date',
            format: 'medium' // Jul 15, 2015, 9:43:11 PM
        };

        let row = new ShareDataRow(file);
        let adapter = new ShareDataTableAdapter(null, null, null);

        let value = adapter.getValue(row, col);
        expect(value).toBe(dateValue);
    });

    it('should use default date format as fallback', () => {
        let rawValue = new Date(2015, 6, 15, 21, 43, 11); // Wed Jul 15 2015 21:43:11 GMT+0100 (BST);
        let dateValue = 'Jul 15, 2015, 9:43:11 PM';

        let file = new FileNode();
        file.entry.createdAt = rawValue;

        let col = <DataColumn> {
            key: 'createdAt',
            type: 'date',
            format: null
        };

        let row = new ShareDataRow(file);
        let adapter = new ShareDataTableAdapter(null, null, null);

        let value = adapter.getValue(row, col);
        expect(value).toBe(dateValue);
    });

    it('should return date value as string', () => {
        let rawValue = new Date(2015, 6, 15, 21, 43, 11); // Wed Jul 15 2015 21:43:11 GMT+0100 (BST);

        let file = new FileNode();
        file.entry.createdAt = rawValue;

        let col = <DataColumn> {
            key: 'createdAt',
            type: 'string'
        };

        let row = new ShareDataRow(file);
        let adapter = new ShareDataTableAdapter(null, null, null);

        let value = adapter.getValue(row, col);
        expect(value).toBe(rawValue);
    });

    it('should log error when having date conversion issues', () => {
        let dateValue = <Date> {};
        let file = new FileNode();
        file.entry.createdAt = <any> dateValue;

        let col = <DataColumn> {
            key: 'createdAt',
            type: 'date',
            format: 'medium'
        };

        let row = new ShareDataRow(file);
        let adapter = new ShareDataTableAdapter(null, null, null);
        spyOn(console, 'error').and.stub();

        let value = adapter.getValue(row, col);
        expect(value).toBe(dateValue);
        expect(console.error).toHaveBeenCalledWith(`Error parsing date ${value} to format ${col.format}`);
    });

    it('should generate fallback icon for a file thumbnail with unknown mime type', () => {
        let adapter = new ShareDataTableAdapter(documentListService, basePath, null);

        let file = new FileNode('file', 'wrong-mime');
        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(`${basePath}/img/ft_ic_miscellaneous.svg`);
    });

    it('should generate fallback icon for a file thumbnail with missing mime type', () => {
        let adapter = new ShareDataTableAdapter(documentListService, basePath, null);

        let file = new FileNode();
        file.entry.content.mimeType = null;

        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(`${basePath}/img/ft_ic_miscellaneous.svg`);
    });

    it('should generate fallback icon for a file with no content entry', () => {
        let adapter = new ShareDataTableAdapter(documentListService, basePath, null);

        let file = new FileNode();
        file.entry.content = null;

        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(`${basePath}/img/ft_ic_miscellaneous.svg`);
    });

    it('should generate fallback icon when document service fails to find one', () => {
        spyOn(documentListService, 'getMimeTypeIcon').and.returnValue(null);
        let adapter = new ShareDataTableAdapter(documentListService, basePath, null);

        let file = new FileNode();
        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(`${basePath}/img/ft_ic_miscellaneous.svg`);
    });

    it('should return image value unmodified', () => {
        let imageUrl = 'http://<address>';

        let file = new FileNode();
        file.entry['icon'] = imageUrl;

        let adapter = new ShareDataTableAdapter(null, basePath, null);
        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: 'icon' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
    });

    it('should resolve folder icon', () => {
        let adapter = new ShareDataTableAdapter(null, basePath, null);

        let row = new ShareDataRow(new FolderNode());
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(`${basePath}/img/ft_ic_folder.svg`);
    });

    it('should resolve file thumbnail', () => {
        let imageUrl: string = 'http://<addresss>';
        spyOn(documentListService, 'getDocumentThumbnailUrl').and.returnValue(imageUrl);

        let adapter = new ShareDataTableAdapter(documentListService, basePath, null);
        adapter.thumbnails = true;

        let file = new FileNode();
        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
        expect(documentListService.getDocumentThumbnailUrl).toHaveBeenCalledWith(file);
    });

    it('should resolve fallback file icon for unknown node', () => {
        let adapter = new ShareDataTableAdapter(null, basePath, null);

        let file = new FileNode();
        file.entry.isFile = false;
        file.entry.isFolder = false;

        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBe(`${basePath}/img/ft_ic_miscellaneous.svg`);
    });

    it('should require document service to resolve thumbnail', () => {
        let adapter = new ShareDataTableAdapter(null, basePath, null);
        adapter.thumbnails = true;

        let file = new FileNode();
        let row = new ShareDataRow(file);
        let col = <DataColumn> { type: 'image', key: '$thumbnail' };

        let value = adapter.getValue(row, col);
        expect(value).toBeNull();
    });

    it('should log load error', () => {
        let error = 'My Error';
        documentListService.getFolderReject = true;
        documentListService.getFolderRejectError = error;

        spyOn(console, 'error').and.stub();
        spyOn(documentListService, 'getFolder').and.callThrough();

        let adapter = new ShareDataTableAdapter(documentListService, null, null);
        adapter.loadPath('/some/path');

        expect(documentListService.getFolder).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(error);
    });

    it('should generate file icon path based on mime type', () => {
        let fileName = 'custom-icon.svg';
        spyOn(documentListService, 'getMimeTypeIcon').and.returnValue(fileName);

        let file = new FileNode('file1', 'text/plain');
        let row = new ShareDataRow(file);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let adapter = new ShareDataTableAdapter(documentListService, '/root', null);
        let value = adapter.getValue(row, col);

        expect(value).toBe(`/root/img/${fileName}`);
        expect(documentListService.getMimeTypeIcon).toHaveBeenCalled();
    });

    it('should put folders on top upon sort', () => {
        let file1 = new FileNode('file1');
        let file2 = new FileNode('file2');
        let folder = new FolderNode();

        let col = <DataColumn> { key: 'name' };
        let adapter = new ShareDataTableAdapter(null, null, [col]);
        adapter.setSorting(new DataSorting('name', 'asc'));

        adapter.setRows([
            new ShareDataRow(file2),
            new ShareDataRow(file1),
            new ShareDataRow(folder)
        ]);

        let sorted = adapter.getRows();
        expect((<ShareDataRow> sorted[0]).node).toBe(folder);
        expect((<ShareDataRow> sorted[1]).node).toBe(file1);
        expect((<ShareDataRow> sorted[2]).node).toBe(file2);
    });

    it('should sort by dates up to ms', () => {
        let file1 = new FileNode('file1');
        file1.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 1);

        let file2 = new FileNode('file2');
        file2.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 2);

        let col = <DataColumn> { key: 'dateProp' };
        let adapter = new ShareDataTableAdapter(null, null, [col]);

        adapter.setRows([
            new ShareDataRow(file2),
            new ShareDataRow(file1)
        ]);

        adapter.sort('dateProp', 'asc');

        let rows = adapter.getRows();
        expect((<ShareDataRow> rows[0]).node).toBe(file1);
        expect((<ShareDataRow> rows[1]).node).toBe(file2);

        adapter.sort('dateProp', 'desc');
        expect((<ShareDataRow> rows[0]).node).toBe(file2);
        expect((<ShareDataRow> rows[1]).node).toBe(file1);
    });

    it('should preserve sorting on navigation', () => {
        let file1 = new FileNode('file1');
        let file2 = new FileNode('file2');
        let file3 = new FileNode('file3');
        let file4 = new FileNode('file4');

        let col = <DataColumn> { key: 'name' };
        let adapter = new ShareDataTableAdapter(documentListService, null, [col]);
        adapter.setSorting(new DataSorting('name', 'asc'));

        let page1 = new PageNode([file2, file1]);
        let page2 = new PageNode([file4, file3]);

        documentListService.getFolderResult = page1;
        adapter.loadPath('/page1');

        let sorted = adapter.getRows();
        expect((<ShareDataRow> sorted[0]).node).toBe(file1);
        expect((<ShareDataRow> sorted[1]).node).toBe(file2);

        documentListService.getFolderResult = page2;
        adapter.loadPath('/page2');

        sorted = adapter.getRows();
        expect((<ShareDataRow> sorted[0]).node).toBe(file3);
        expect((<ShareDataRow> sorted[1]).node).toBe(file4);
    });
});

describe('ShareDataRow', () => {

    it('should wrap node', () => {
        let file = new FileNode();
        let row = new ShareDataRow(file);
        expect(row.node).toBe(file);
    });

    it('should require object source', () => {
        expect(() => { return new ShareDataRow(null); }).toThrowError(ShareDataRow.ERR_OBJECT_NOT_FOUND);
    });

    it('should resolve value from node entry', () => {
        let file = new FileNode('test');
        let row = new ShareDataRow(file);
        expect(row.getValue('name')).toBe('test');
    });

    it('should check value', () => {
        let file = new FileNode('test');
        let row = new ShareDataRow(file);

        expect(row.hasValue('name')).toBeTruthy();
        expect(row.hasValue('missing')).toBeFalsy();
    });

});
