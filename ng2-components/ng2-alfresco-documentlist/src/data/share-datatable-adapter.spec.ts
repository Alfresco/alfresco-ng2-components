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

import { async, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { DataColumn, DataRow, DataSorting } from 'ng2-alfresco-datatable';
import { FileNode, FolderNode } from './../assets/document-library.model.mock';
import { DocumentListService } from './../services/document-list.service';
import { ShareDataRow, ShareDataTableAdapter } from './share-datatable-adapter';

describe('ShareDataTableAdapter', () => {

    let documentListService: DocumentListService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                DocumentListService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        documentListService = TestBed.get(DocumentListService);
    });

    it('should setup rows and columns with constructor', () => {
        let schema = [<DataColumn> {}];
        let adapter = new ShareDataTableAdapter(documentListService, schema);

        expect(adapter.getRows()).toEqual([]);
        expect(adapter.getColumns()).toEqual(schema);
    });

    it('should setup columns when constructor is missing schema', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);

        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new columns', () => {
        let columns = [<DataColumn> {}, <DataColumn> {}];
        let adapter = new ShareDataTableAdapter(documentListService, null);
        adapter.setColumns(columns);
        expect(adapter.getColumns()).toEqual(columns);
    });

    it('should reset columns', () => {
        let columns = [<DataColumn> {}, <DataColumn> {}];
        let adapter = new ShareDataTableAdapter(documentListService, columns);

        expect(adapter.getColumns()).toEqual(columns);
        adapter.setColumns(null);
        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new rows', () => {
        let rows = [<DataRow> {}, <DataRow> {}];
        let adapter = new ShareDataTableAdapter(documentListService, null);

        expect(adapter.getRows()).toEqual([]);
        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);
    });

    it('should reset rows', () => {
        let rows = [<DataRow> {}, <DataRow> {}];
        let adapter = new ShareDataTableAdapter(documentListService, null);

        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);

        adapter.setRows(null);
        expect(adapter.getRows()).toEqual([]);
    });

    it('should sort new rows', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);
        spyOn(adapter, 'sort').and.callThrough();

        let rows = [<DataRow> {}];
        adapter.setRows(rows);

        expect(adapter.sort).toHaveBeenCalled();
    });

    it('should fail when getting value for missing row', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);
        let check = () => {
            return adapter.getValue(null, <DataColumn> {});
        };
        expect(check).toThrowError(adapter.ERR_ROW_NOT_FOUND);
    });

    it('should fail when getting value for missing column', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);
        let check = () => {
            return adapter.getValue(<DataRow> {}, null);
        };
        expect(check).toThrowError(adapter.ERR_COL_NOT_FOUND);
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

        let row = new ShareDataRow(file, documentListService, null);
        let adapter = new ShareDataTableAdapter(documentListService, null);

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

        let row = new ShareDataRow(file, documentListService, null);
        let adapter = new ShareDataTableAdapter(documentListService, null);

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

        let row = new ShareDataRow(file, documentListService, null);
        let adapter = new ShareDataTableAdapter(documentListService, null);

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

        let row = new ShareDataRow(file, documentListService, null);
        let adapter = new ShareDataTableAdapter(documentListService, null);
        spyOn(console, 'error').and.stub();

        let value = adapter.getValue(row, col);
        expect(value).toBe('Error');
        expect(console.error).toHaveBeenCalled();
    });

    it('should generate fallback icon for a file thumbnail with missing mime type', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);

        let file = new FileNode();
        file.entry.content.mimeType = null;

        let row = new ShareDataRow(file, documentListService, null);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        expect(value).toContain(`svg`);
    });

    it('should generate fallback icon for a file with no content entry', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);

        let file = new FileNode();
        file.entry.content = null;

        let row = new ShareDataRow(file, documentListService, null);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        expect(value).toContain(`svg`);
    });

    it('should return image value unmodified', () => {
        let imageUrl = 'http://<address>';

        let file = new FileNode();
        file.entry['icon'] = imageUrl;

        let adapter = new ShareDataTableAdapter(documentListService, null);
        let row = new ShareDataRow(file, documentListService, null);
        let col = <DataColumn> {type: 'image', key: 'icon'};

        let value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
    });

    it('should resolve folder icon', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);

        let row = new ShareDataRow(new FolderNode(), documentListService, null);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_folder`);
        expect(value).toContain(`svg`);
    });

    it('should resolve file thumbnail', () => {
        let imageUrl: string = 'http://<addresss>';
        spyOn(documentListService, 'getDocumentThumbnailUrl').and.returnValue(imageUrl);

        let adapter = new ShareDataTableAdapter(documentListService, null);
        adapter.thumbnails = true;

        let file = new FileNode();
        let row = new ShareDataRow(file, documentListService, null);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
        expect(documentListService.getDocumentThumbnailUrl).toHaveBeenCalledWith(file);
    });

    it('should resolve fallback file icon for unknown node', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);

        let file = new FileNode();
        file.entry.isFile = false;
        file.entry.isFolder = false;
        file.entry.content = null;

        let row = new ShareDataRow(file, documentListService, null);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        expect(value).toContain(`svg`);
    });

    it('should resolve file icon for content type', () => {
        let adapter = new ShareDataTableAdapter(documentListService, null);

        let file = new FileNode();
        file.entry.isFile = false;
        file.entry.isFolder = false;
        file.entry.content.mimeType = 'image/png';

        let row = new ShareDataRow(file, documentListService, null);
        let col = <DataColumn> {type: 'image', key: '$thumbnail'};

        let value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_raster_image`);
        expect(value).toContain(`svg`);
    });

    it('should put folders on top upon sort', () => {
        let file1 = new FileNode('file1');
        let file2 = new FileNode('file2');
        let folder = new FolderNode();

        let col = <DataColumn> {key: 'name'};
        let adapter = new ShareDataTableAdapter(documentListService, [col]);
        adapter.setSorting(new DataSorting('name', 'asc'));

        adapter.setRows([
            new ShareDataRow(file2, documentListService, null),
            new ShareDataRow(file1, documentListService, null),
            new ShareDataRow(folder, documentListService, null)
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

        let col = <DataColumn> {key: 'dateProp'};
        let adapter = new ShareDataTableAdapter(documentListService, [col]);

        adapter.setRows([
            new ShareDataRow(file2, documentListService, null),
            new ShareDataRow(file1, documentListService, null)
        ]);

        adapter.sort('dateProp', 'asc');

        let rows = adapter.getRows();
        expect((<ShareDataRow> rows[0]).node).toBe(file1);
        expect((<ShareDataRow> rows[1]).node).toBe(file2);

        adapter.sort('dateProp', 'desc');
        expect((<ShareDataRow> rows[0]).node).toBe(file2);
        expect((<ShareDataRow> rows[1]).node).toBe(file1);
    });

});

describe('ShareDataRow', () => {

    let documentListService: DocumentListService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                DocumentListService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        documentListService = TestBed.get(DocumentListService);
    });

    it('should wrap node', () => {
        let file = new FileNode();
        let row = new ShareDataRow(file, documentListService, null);
        expect(row.node).toBe(file);
    });

    it('should require object source', () => {
        expect(() => {
            return new ShareDataRow(null, documentListService, null);
        }).toThrowError(ShareDataRow.ERR_OBJECT_NOT_FOUND);
    });

    it('should resolve value from node entry', () => {
        let file = new FileNode('test');
        let row = new ShareDataRow(file, documentListService, null);
        expect(row.getValue('name')).toBe('test');
    });

    it('should check value', () => {
        let file = new FileNode('test');
        let row = new ShareDataRow(file, documentListService, null);

        expect(row.hasValue('name')).toBeTruthy();
        expect(row.hasValue('missing')).toBeFalsy();
    });

    it('should be set as drop target when user has permission for that node', () => {
        let file = new FolderNode('test');
        file.entry['allowableOperations'] = ['create'];
        let row = new ShareDataRow(file, documentListService, null);

        expect(row.isDropTarget).toBeTruthy();
    });

    it('should not be set as drop target when user has permission for that node', () => {
        let file = new FolderNode('test');
        let row = new ShareDataRow(file, documentListService, null);

        expect(row.isDropTarget).toBeFalsy();
    });

    it('should not be set as drop target when element is not a Folder', () => {
        let file = new FileNode('test');
        let row = new ShareDataRow(file, documentListService, null);

        expect(row.isDropTarget).toBeFalsy();
    });

});
