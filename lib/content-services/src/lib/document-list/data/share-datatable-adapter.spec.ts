/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DataColumn, DataRow, DataSorting, ThumbnailService, setupTestBed } from '@alfresco/adf-core';
import { FileNode, FolderNode, SmartFolderNode, RuleFolderNode, LinkFolderNode } from './../../mock';
import { ERR_OBJECT_NOT_FOUND, ShareDataRow } from './share-data-row.model';
import { ERR_COL_NOT_FOUND, ERR_ROW_NOT_FOUND, ShareDataTableAdapter } from './share-datatable-adapter';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService } from '../../common/services/content.service';

describe('ShareDataTableAdapter', () => {

    let thumbnailService: ThumbnailService;
    let contentService: ContentService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        const imageUrl: string = 'http://<addresss>';

        contentService = TestBed.inject(ContentService);
        thumbnailService = TestBed.inject(ThumbnailService);

        spyOn(contentService, 'getDocumentThumbnailUrl').and.returnValue(imageUrl);
    });

    it('should use client sorting by default', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, []);
        expect(adapter.sortingMode).toBe('client');
    });

    it('should not be case sensitive for sorting mode value', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, []);

        adapter.sortingMode = 'CLIENT';
        expect(adapter.sortingMode).toBe('client');

        adapter.sortingMode = 'SeRvEr';
        expect(adapter.sortingMode).toBe('server');
    });

    it('should fallback to client sorting for unknown values', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, []);

        adapter.sortingMode = 'SeRvEr';
        expect(adapter.sortingMode).toBe('server');

        adapter.sortingMode = 'quantum';
        expect(adapter.sortingMode).toBe('client');
    });

    it('should setup rows and columns with constructor', () => {
        const schema = [{}] as DataColumn[];
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, schema);

        expect(adapter.getRows()).toEqual([]);
        expect(adapter.getColumns()).toEqual(schema);
    });

    it('should setup columns when constructor is missing schema', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new columns', () => {
        const columns = [{}, {}] as DataColumn[];
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        adapter.setColumns(columns);
        expect(adapter.getColumns()).toEqual(columns);
    });

    it('should reset columns', () => {
        const columns = [{} as DataColumn, {} as DataColumn];
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, columns);

        expect(adapter.getColumns()).toEqual(columns);
        adapter.setColumns(null);
        expect(adapter.getColumns()).toEqual([]);
    });

    it('should set new rows', () => {
        const rows = [{}, {}] as DataRow[];
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        expect(adapter.getRows()).toEqual([]);
        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);
    });

    it('should reset rows', () => {
        const rows = [{}, {}] as DataRow[];
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        adapter.setRows(rows);
        expect(adapter.getRows()).toEqual(rows);

        adapter.setRows(null);
        expect(adapter.getRows()).toEqual([]);
    });

    it('should sort new rows', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        spyOn(adapter, 'sort').and.callThrough();

        const rows = [{}] as DataRow[];
        adapter.setRows(rows);

        expect(adapter.sort).toHaveBeenCalled();
    });

    it('should fail when getting value for missing row', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        const check = () => adapter.getValue(null, {} as DataColumn);
        expect(check).toThrowError(ERR_ROW_NOT_FOUND);
    });

    it('should fail when getting value for missing column', () => {
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        const check = () => adapter.getValue({} as DataRow, null);
        expect(check).toThrowError(ERR_COL_NOT_FOUND);
    });

    it('should return date value as string', () => {
        const rawValue = new Date(2015, 6, 15, 21, 43, 11); // Wed Jul 15 2015 21:43:11 GMT+0100 (BST);

        const file = new FileNode();
        file.entry.createdAt = rawValue;

        const col = {
            key: 'createdAt',
            type: 'text'
        } as DataColumn;

        const row = new ShareDataRow(file, contentService, null);
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const value = adapter.getValue(row, col);
        expect(value).toBe(rawValue);
    });

    it('should generate fallback icon for a file thumbnail with missing mime type', () => {
        spyOn(thumbnailService, 'getDefaultMimeTypeIcon').and.returnValue(`assets/images/ft_ic_miscellaneous.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const file = new FileNode();
        file.entry.content.mimeType = null;

        const row = new ShareDataRow(file, contentService, null);
        const col = { type: 'image', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        expect(value).toContain(`svg`);
    });

    it('should generate fallback icon for a file with no content entry', () => {
        spyOn(thumbnailService, 'getDefaultMimeTypeIcon').and.returnValue(`assets/images/ft_ic_miscellaneous.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const file = new FileNode();
        file.entry.content = null;

        const row = new ShareDataRow(file, contentService, null);
        const col = { type: 'image', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        expect(value).toContain(`svg`);
    });

    it('should return image value unmodified', () => {
        const imageUrl = 'http://<address>';

        const file = new FileNode();
        file.entry['icon'] = imageUrl;

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        const row = new ShareDataRow(file, contentService, null);
        const col = { type: 'image', key: 'icon' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
    });

    it('should resolve folder icon', () => {
        spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_folder.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const row = new ShareDataRow(new FolderNode(), contentService, null);
        const col = { type: 'image', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_folder`);
        expect(value).toContain(`svg`);
    });

    it('should resolve smart folder icon', () => {
        spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_smart_folder.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const row = new ShareDataRow(new SmartFolderNode(), contentService, null);
        const col = { type: 'text', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_smart_folder`);
        expect(value).toContain(`svg`);
    });

    it('should resolve link folder icon', () => {
        spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_folder_shortcut_link.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const row = new ShareDataRow(new LinkFolderNode(), contentService, null);
        const col = { type: 'text', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_folder_shortcut_link`);
        expect(value).toContain(`svg`);
    });

    it('should resolve rule folder icon', () => {
        spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_folder_rule.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const row = new ShareDataRow(new RuleFolderNode(), contentService, null);
        const col = { type: 'text', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_folder_rule`);
        expect(value).toContain(`svg`);
    });

    it('should resolve file thumbnail', () => {
        const imageUrl = 'http://<addresss>';
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
        adapter.thumbnails = true;

        const file = new FileNode();
        const row = new ShareDataRow(file, contentService, null);
        const col = { type: 'image', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toBe(imageUrl);
    });

    it('should resolve fallback file icon for unknown node', () => {
        spyOn(thumbnailService, 'getDefaultMimeTypeIcon').and.returnValue(`assets/images/ft_ic_miscellaneous.svg`);

        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const file = new FileNode();
        file.entry.isFile = false;
        file.entry.isFolder = false;
        file.entry.content = null;

        const row = new ShareDataRow(file, contentService, null);
        const col = { type: 'image', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_miscellaneous`);
        expect(value).toContain(`svg`);
    });

    it('should resolve file icon for content type', () => {
        spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_raster_image.svg`);
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);

        const file = new FileNode();
        file.entry.isFile = false;
        file.entry.isFolder = false;
        file.entry.content.mimeType = 'image/png';

        const row = new ShareDataRow(file, contentService, null);
        const col = { type: 'image', key: '$thumbnail' } as DataColumn;

        const value = adapter.getValue(row, col);
        expect(value).toContain(`assets/images/ft_ic_raster_image`);
        expect(value).toContain(`svg`);
    });

    it('should put folders on top upon sort', () => {
        const file1 = new FileNode('file1');
        const file2 = new FileNode('file2');
        const folder = new FolderNode();

        const col = { key: 'name' } as DataColumn;
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, [col]);
        adapter.setSorting(new DataSorting('name', 'asc'));

        adapter.setRows([
            new ShareDataRow(file2, contentService, null),
            new ShareDataRow(file1, contentService, null),
            new ShareDataRow(folder, contentService, null)
        ]);

        const sorted = adapter.getRows();
        expect((sorted[0]).node).toBe(folder);
        expect((sorted[1]).node).toBe(file1);
        expect((sorted[2]).node).toBe(file2);
    });

    it('should sort by dates up to ms', () => {
        const file1 = new FileNode('file1');
        file1.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 1);

        const file2 = new FileNode('file2');
        file2.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 2);

        const col = { key: 'dateProp' } as DataColumn;
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, [col]);

        adapter.setRows([
            new ShareDataRow(file2, contentService, null),
            new ShareDataRow(file1, contentService, null)
        ]);

        adapter.sort('dateProp', 'asc');

        const rows = adapter.getRows();
        expect((rows[0]).node).toBe(file1);
        expect((rows[1]).node).toBe(file2);

        adapter.sort('dateProp', 'desc');
        expect((rows[0]).node).toBe(file2);
        expect((rows[1]).node).toBe(file1);
    });

    it('should sort by file size', () => {
        const file1 = new FileNode('file1');
        const file2 = new FileNode('file2');
        const file3 = new FileNode('file3');
        const file4 = new FileNode('file4');

        file1.entry.content.sizeInBytes = 146; // 146 bytes
        file2.entry.content.sizeInBytes = 10075; // 9.84 KB
        file3.entry.content.sizeInBytes = 4224120; // 4.03 MB
        file4.entry.content.sizeInBytes = 2852791665; // 2.66 GB

        const col = { key: 'content.sizeInBytes' } as DataColumn;
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, [col]);

        adapter.setRows([
            new ShareDataRow(file3, contentService, null),
            new ShareDataRow(file4, contentService, null),
            new ShareDataRow(file1, contentService, null),
            new ShareDataRow(file2, contentService, null)
        ]);

        adapter.sort('content.sizeInBytes', 'asc');
        const rows = adapter.getRows();

        expect((rows[0]).node).toBe(file1);
        expect((rows[1]).node).toBe(file2);
        expect((rows[2]).node).toBe(file3);
        expect((rows[3]).node).toBe(file4);

        adapter.sort('content.sizeInBytes', 'desc');
        expect((rows[0]).node).toBe(file4);
        expect((rows[1]).node).toBe(file3);
        expect((rows[2]).node).toBe(file2);
        expect((rows[3]).node).toBe(file1);
    });

    it('should sort by name', () => {
        const file1 = new FileNode('file1');
        const file2 = new FileNode('file11');
        const file3 = new FileNode('file20');
        const file4 = new FileNode('file11-1'); // auto rename
        const file5 = new FileNode('a');
        const file6 = new FileNode('b');

        const col = { key: 'name' } as DataColumn;
        const adapter = new ShareDataTableAdapter(thumbnailService, contentService, [col]);

        adapter.setRows([
            new ShareDataRow(file4, contentService, null),
            new ShareDataRow(file6, contentService, null),
            new ShareDataRow(file3, contentService, null),
            new ShareDataRow(file1, contentService, null),
            new ShareDataRow(file2, contentService, null),
            new ShareDataRow(file5, contentService, null)
        ]);

        adapter.sort('name', 'asc');
        const rows = adapter.getRows();

        expect((rows[0]).node).toBe(file5);
        expect((rows[1]).node).toBe(file6);
        expect((rows[2]).node).toBe(file1);
        expect((rows[3]).node).toBe(file2);
        expect((rows[4]).node).toBe(file4);
        expect((rows[5]).node).toBe(file3);

        adapter.sort('name', 'desc');
        expect((rows[0]).node).toBe(file3);
        expect((rows[1]).node).toBe(file4);
        expect((rows[2]).node).toBe(file2);
        expect((rows[3]).node).toBe(file1);
        expect((rows[4]).node).toBe(file6);
        expect((rows[5]).node).toBe(file5);
    });

    describe('ShareDataRow', () => {

        it('should wrap node', () => {
            const file = new FileNode();
            const row = new ShareDataRow(file, contentService, null);
            expect(row.node).toBe(file);
        });

        it('should require object source', () => {
            expect(() => new ShareDataRow(null, contentService, null)).toThrowError(ERR_OBJECT_NOT_FOUND);
        });

        it('should resolve value from node entry', () => {
            const file = new FileNode('test');
            const row = new ShareDataRow(file, contentService, null);
            expect(row.getValue('name')).toBe('test');
        });

        it('should check value', () => {
            const file = new FileNode('test');
            const row = new ShareDataRow(file, contentService, null);

            expect(row.hasValue('name')).toBeTruthy();
            expect(row.hasValue('missing')).toBeFalsy();
        });

        it('should be set as drop target when user has permission for that node', () => {
            const file = new FolderNode('test');
            file.entry['allowableOperations'] = ['create'];
            const row = new ShareDataRow(file, contentService, null);

            expect(row.isDropTarget).toBeTruthy();
        });

        it('should not be set as drop target when user has permission for that node', () => {
            const file = new FolderNode('test');
            const row = new ShareDataRow(file, contentService, null);

            expect(row.isDropTarget).toBeFalsy();
        });

        it('should not be set as drop target when element is not a Folder', () => {
            const file = new FileNode('test');
            const row = new ShareDataRow(file, contentService, null);

            expect(row.isDropTarget).toBeFalsy();
        });

        it('should return all the selected rows', () => {
            const file = new FileNode();
            const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
            const row1 = new ShareDataRow(file, contentService, null);
            const row2 = new ShareDataRow(file, contentService, null);
            const row3 = new ShareDataRow(file, contentService, null);

            row1.isSelected = true;
            row2.isSelected = true;
            adapter.setRows([row1, row2, row3]);
            const selectedRows = adapter.getSelectedRows();

            expect(selectedRows.length).toEqual(2);
            expect(selectedRows).toEqual([row1, row2]);
        });

        it('should return the row of the requested node id', () => {
            const adapter = new ShareDataTableAdapter(thumbnailService, contentService, null);
            const fakeFiles = [new FileNode('fake-file-1', 'text/plain', 'fake-node-id-1'), new FileNode('fake-file-2', 'text/plain', 'fake-node-id-2')];
            const fakeShareDataRows = [new ShareDataRow(fakeFiles[0], contentService, null), new ShareDataRow(fakeFiles[1], contentService, null)];
            adapter.setRows(fakeShareDataRows);

            expect(adapter.getRowByNodeId('fake-node-id-1')).toEqual(fakeShareDataRows[0]);
            expect(adapter.getRowByNodeId('fake-node-id-2')).toEqual(fakeShareDataRows[1]);
        });
   });
});
