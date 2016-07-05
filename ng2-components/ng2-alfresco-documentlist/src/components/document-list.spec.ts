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

/*
import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { DocumentList } from './document-list';
import { ContentColumnModel } from '../models/content-column.model';
import { AlfrescoServiceMock } from '../assets/alfresco.service.mock';
import { ContentActionModel } from '../models/content-action.model';
import {
    PageNode,
    FileNode,
    FolderNode
} from '../assets/document-library.model.mock';
import { ColumnSortingModel } from '../models/column-sorting.model';

describe('DocumentList', () => {

    let alfrescoServiceMock: AlfrescoServiceMock;
    let documentList: DocumentList;
    let eventMock: any;
    let componentHandler;

    beforeEach(() => {
        alfrescoServiceMock = new AlfrescoServiceMock();
        let zone = new NgZone(false);
        documentList = new DocumentList(alfrescoServiceMock, zone);

        eventMock = {
            preventDefault: function () {
                console.log('mock preventDefault');
            }
        };

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should setup default columns', () => {
        spyOn(documentList, 'setupDefaultColumns').and.callThrough();

        documentList.ngAfterContentInit();

        expect(documentList.setupDefaultColumns).toHaveBeenCalled();
        expect(documentList.columns.length).not.toBe(0);
    });

    it('should use custom columns instead of default ones', () => {
        let column: ContentColumnModel = {
            title: 'title',
            source: 'source',
            cssClass: 'css',
            srTitle: '',
            type: 'text',
            format: ''
        };
        documentList.columns.push(column);

        documentList.ngAfterContentInit();
        expect(documentList.columns.length).toBe(1);
        expect(documentList.columns[0]).toBe(column);
    });

    it('should fetch folder', () => {
        let folder = {
            'nodeRef': 'workspace://SpacesStore/8bb36efb-c26d-4d2b-9199-ab6922f53c28'
        };
        alfrescoServiceMock.folderToReturn = folder;
        documentList.ngOnInit();

        expect(documentList.folder).toBe(folder);
    });

    it('should return thumbnail url for a file when thumbnails turned on', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        let node = new FileNode();
        documentList.thumbnails = true;
        let result = documentList.getThumbnailUrl(node);

        expect(result).toBe(url);
        expect(alfrescoServiceMock.getDocumentThumbnailUrl).toHaveBeenCalled();
    });

    it('should return a null thumbnail url for a null item', () => {
        let url = 'URL';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        let result = documentList.getThumbnailUrl(null);

        expect(result).toBeNull();
        expect(alfrescoServiceMock.getDocumentThumbnailUrl).not.toHaveBeenCalled();
    });

    it('should execute action with node', () => {
        let node = new FileNode();
        let action = new ContentActionModel();
        action.handler = function () {
            console.log('mock handler');
        };

        spyOn(action, 'handler').and.stub();

        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node, documentList);

    });

    it('should not execute action without node provided', () => {
        let action = new ContentActionModel();
        action.handler = function () {
            console.log('mock handler');
        };

        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(null, action);
        expect(action.handler).not.toHaveBeenCalled();
    });

    it('should give no content actions for empty target', () => {
        let actions = documentList.getContentActions(null, 'button');
        expect(actions.length).toBe(0);
    });

    it('should give no content actions for empty type', () => {
        let actions = documentList.getContentActions('folder', null);
        expect(actions.length).toBe(0);
    });

    it('should filter content actions for various types and targets', () => {
        let folderButton = new ContentActionModel();
        folderButton.target = 'folder';
        folderButton.type = 'button';

        let folderMenu = new ContentActionModel();
        folderMenu.target = 'folder';
        folderMenu.type = 'menu';

        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        let documentMenu = new ContentActionModel();
        documentMenu.target = 'document';
        documentMenu.type = 'menu';

        documentList.actions = [
            folderButton,
            folderMenu,
            documentButton,
            documentMenu
        ];

        let actions = documentList.getContentActions('folder', 'button');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderButton);

        actions = documentList.getContentActions('folder', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderMenu);

        actions = documentList.getContentActions('document', 'button');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);

        actions = documentList.getContentActions('document', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentMenu);
    });

    it('should be case insensitive when filtering content actions', () => {
        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        documentList.actions = [documentButton];

        let actions = documentList.getContentActions('DoCuMeNt', 'BUTTON');
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentButton);
    });

    it('should find no content actions', () => {
        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentButton.type = 'button';

        documentList.actions = [documentButton];

        let actions = documentList.getContentActions('unknown', 'value');
        expect(actions.length).toBe(0);
    });

    it('should emit itemClick event', (done) => {
        let node = new FileNode();
        documentList.itemClick.subscribe(e => {
            expect(e.value).toBe(node);
            done();
        });
        documentList.onItemClick(node);
    });

    it('should prevent default item single click event', () => {
        spyOn(eventMock, 'preventDefault').and.stub();

        documentList.onItemClick(null, eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default item double click event', () => {
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onItemDblClick(null, eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it('should display folder content on click', () => {
        let path = '/';

        let node = new FolderNode('<display name>');

        spyOn(documentList, 'getNodePath').and.returnValue(path);
        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onItemClick(node);

        expect(documentList.currentFolderPath).toBe(path);
    });

    it('should not display folder content when no target node provided', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.onItemClick(null);
        expect(documentList.displayFolderContent).not.toHaveBeenCalled();

    });

    it('should display folder content only on folder node click', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = new FileNode();
        documentList.onItemClick(node);

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should not display folder content on click when navigation is off', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = new FolderNode('<display name>');
        documentList.navigate = false;
        documentList.onItemClick(node);

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should require node to get path', () => {
        expect(documentList.getNodePath(null)).toBe(null);
    });

    it('should return root object value', () => {
        let target = {
            key1: 'value1'
        };

        expect(documentList.getObjectValue(target, 'key1')).toBe('value1');
    });

    it('should return no object value when key is missing', () => {
        let target = {
            key1: 'value1'
        };
        expect(documentList.getObjectValue(target, 'missing')).toBeUndefined();
    });

    it('should return nested object value', () => {
        let target = {
            key1: {
                key2: {
                    key3: 'value1'
                }
            }
        };

        expect(documentList.getObjectValue(target, 'key1.key2.key3')).toBe('value1');
    });

    it('should display folder content for new folder path', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();
        let newPath = '/some/new/path';
        documentList.currentFolderPath = newPath;
        expect(documentList.displayFolderContent).toHaveBeenCalledWith(newPath);
    });

    it('should not display folder content for same path', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();
        documentList.currentFolderPath = '/test';
        expect(documentList.displayFolderContent).toHaveBeenCalledTimes(1);

        documentList.currentFolderPath = '/test';
        expect(documentList.displayFolderContent).toHaveBeenCalledTimes(1);
    });

    it('should reset to default path', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();
        documentList.currentFolderPath = null;

        expect(documentList.currentFolderPath).toBe(documentList.DEFAULT_ROOT_FOLDER);
        expect(documentList.displayFolderContent).toHaveBeenCalledWith(documentList.DEFAULT_ROOT_FOLDER);
    });

    it('should emit folder changed event', (done) => {
        documentList.folderChange.subscribe(e => {
            done();
        });
        documentList.folder = new PageNode();
    });

    it('should emit folder changed event with folder details', (done) => {
        let folder = new PageNode();
        let path = '/path';

        documentList.folderChange.subscribe(e => {
            expect(e.value).toBe(folder);
            expect(e.path).toBe(path);
            done();
        });

        spyOn(documentList, 'displayFolderContent').and.stub();
        documentList.currentFolderPath = path;
        documentList.folder = folder;
    });

    it('should not emit folder changed event', () => {
        let folder = new PageNode();
        let calls = 0;
        documentList.folderChange.subscribe(e => {
            calls++;
        });

        documentList.folder = folder;
        documentList.folder = folder;
        expect(calls).toBe(1);
    });

    it('should reload on binding changes', () => {
        spyOn(documentList, 'reload').and.stub();
        documentList.ngOnChanges(null);
        expect(documentList.reload).toHaveBeenCalled();
    });

    it('should execute context action on callback', () => {
        let action = {
            node: {},
            model: {}
        };

        spyOn(documentList, 'executeContentAction').and.stub();
        documentList.contextActionCallback(action);
        expect(documentList.executeContentAction).toHaveBeenCalledWith(action.node, action.model);
    });

    it('should not execute context action on callback', () => {
        spyOn(documentList, 'executeContentAction').and.stub();
        documentList.contextActionCallback(null);
        expect(documentList.executeContentAction).not.toHaveBeenCalled();
    });

    it('should upgrade material design components', () => {
        documentList.ngAfterViewChecked();
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
    });

    it('should subscribe to context action handler', () => {
        let value = {};
        spyOn(documentList, 'contextActionCallback').and.stub();
        documentList.ngOnInit();
        documentList.contextActionHandler.next(value);
        expect(documentList.contextActionCallback).toHaveBeenCalledWith(value);
    });

    it('should suppress default context menu', () => {
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onShowContextMenu(eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it('should emit file preview event on single click', (done) => {
        let file = new FileNode();
        documentList.preview.subscribe(e => {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onItemClick(file, null);
    });

    it('should emit file preview event on double click', (done) => {
        let file = new FileNode();
        documentList.preview.subscribe(e => {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onItemDblClick(file, null);
    });

    it('should perform folder navigation on single click', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onItemClick(folder, null);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });

    it('should perform folder navigation on double click', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onItemDblClick(folder, null);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });

    it('should not perform folder navigation on double click when single mode', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onItemDblClick(folder, null);

        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });

    it('should not perform folder navigation on double click when navigation off', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigate = false;
        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onItemDblClick(folder, null);

        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });

    it('should perform navigation for folder node only', () => {
        let folder = new FolderNode();
        let file = new FileNode();
        spyOn(documentList, 'getNodePath').and.returnValue('/path');

        expect(documentList.performNavigation(folder)).toBeTruthy();
        expect(documentList.performNavigation(file)).toBeFalsy();
        expect(documentList.performNavigation(null)).toBeFalsy();
    });

    it('should not get node path for null node', () => {
        expect(documentList.getNodePath(null)).toBeNull();
    });

    it('should trim company home from node path', () => {
        let file = new FileNode('file.txt');
        file.entry.path.name = '/Company Home/folder1';
        expect(documentList.getNodePath(file)).toBe('/folder1/file.txt');
    });


    it('should require valid node for file preview', () => {
        let file = new FileNode();
        file.entry = null;
        let called = false;

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.preview.subscribe(val => called = true);

        documentList.onItemClick(file, null);
        expect(called).toBeFalsy();

        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onItemDblClick(file, null);
        expect(called).toBeFalsy();
    });

    it('should require valid node for folder navigation', () => {
        let folder = new FolderNode();
        folder.entry = null;
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onItemClick(folder, null);

        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onItemDblClick(folder, null);

        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });

    it('should display folder content on reload', () => {
        spyOn(documentList, 'displayFolderContent').and.callThrough();
        documentList.reload();
        expect(documentList.displayFolderContent).toHaveBeenCalled();
    });

    it('should generate thumbnail for unknown content', () => {
        documentList.baseComponentPath = '/root';
        let node = new FileNode();
        node.entry.isFile = false;

        expect(documentList.getThumbnailUrl(node)).toBe('/root/img/ft_ic_miscellaneous.svg');
    });

    it('should generate folder icon path', () => {
        documentList.baseComponentPath = '/root';
        let folder = new FolderNode();
        expect(documentList.getThumbnailUrl(folder)).toBe('/root/img/ft_ic_folder.svg');
    });

    it('should generate file icon path based on mime type', () => {
        let fileName = 'custom-icon.svg';
        spyOn(alfrescoServiceMock, 'getMimeTypeIcon').and.returnValue(fileName);
        documentList.baseComponentPath = '/root';

        let file = new FileNode();
        file.entry.content.mimeType = 'text/plain';

        expect(documentList.getThumbnailUrl(file)).toBe(`/root/img/${fileName}`);
    });

    it('should fallback to default icon for missing mime type', () => {
        spyOn(alfrescoServiceMock, 'getMimeTypeIcon').and.returnValue(null);
        documentList.baseComponentPath = '/root';

        let file = new FileNode();
        file.entry.content.mimeType = null;

        expect(documentList.getThumbnailUrl(file)).toBe('/root/img/ft_ic_miscellaneous.svg');
    });

    it('should fallback to default icon for unknown mime type', () => {
        spyOn(alfrescoServiceMock, 'getMimeTypeIcon').and.returnValue(null);
        documentList.baseComponentPath = '/root';

        let file = new FileNode();
        file.entry.content.mimeType = 'text/plain';

        expect(documentList.getThumbnailUrl(file)).toBe('/root/img/ft_ic_miscellaneous.svg');
    });

    it('should resolve thumbnail url for a file', () => {
        let url = 'http://<some url>';
        spyOn(alfrescoServiceMock, 'getDocumentThumbnailUrl').and.returnValue(url);

        documentList.thumbnails = true;

        let file = new FileNode();
        expect(documentList.getThumbnailUrl(file)).toBe(url);
    });

    it('should return no thumbnail url with missing service', () => {
        let list = new DocumentList(null, null);
        list.thumbnails = true;

        let file = new FileNode();
        expect(list.getThumbnailUrl(file)).toBeNull();
    });

    it('should sort on column header click', () => {
        let col = new ContentColumnModel();
        col.source = 'id';

        spyOn(documentList, 'sort').and.callThrough();

        documentList.onColumnHeaderClick(col);

        expect(documentList.sorting).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'asc'
            })
        );
        expect(documentList.sort).toHaveBeenCalled();
    });

    it('should invert sorting on column header click', () => {
        let col = new ContentColumnModel();
        col.source = 'id';

        spyOn(documentList, 'sort').and.callThrough();

        documentList.sorting = <ColumnSortingModel> { key: 'id', direction: 'asc' };
        documentList.onColumnHeaderClick(col);

        expect(documentList.sorting).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'desc'
            })
        );

        documentList.onColumnHeaderClick(col);
        expect(documentList.sorting).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'asc'
            })
        );

        expect(documentList.sort).toHaveBeenCalledTimes(2);
    });

    it('should use ascending direction for different column header click', () => {
        let col = new ContentColumnModel();
        col.source = 'id';

        spyOn(documentList, 'sort').and.callThrough();

        documentList.sorting = <ColumnSortingModel> { key: 'col1', direction: 'desc' };
        documentList.onColumnHeaderClick(col);

        expect(documentList.sorting).toEqual(
            jasmine.objectContaining({
                key: 'id',
                direction: 'asc'
            })
        );

        expect(documentList.sort).toHaveBeenCalled();
    });

    it('should not sort by column header when instance is missing', () => {
        spyOn(documentList, 'sort').and.callThrough();
        documentList.onColumnHeaderClick(null);
        expect(documentList.sort).not.toHaveBeenCalled();
    });

    it('should convert cell value to formatted date', () => {

        let rawValue = new Date(2015, 6, 15, 21, 43, 11).toString(); // Wed Jul 15 2015 21:43:11 GMT+0100 (BST);
        let dateValue = 'Jul 15, 2015, 9:43:11 PM';

        let file = new FileNode();
        file.entry.createdAt = rawValue;

        let col = new ContentColumnModel();
        col.source = 'createdAt';
        col.type = 'date';
        col.format = 'medium'; // Jul 15, 2015, 9:43:11 PM

        let value = documentList.getCellValue(file, col);
        expect(value).toBe(dateValue);
    });

    it('should return date value as string', () => {
        let rawValue = new Date(2015, 6, 15, 21, 43, 11).toString(); // Wed Jul 15 2015 21:43:11 GMT+0100 (BST);

        let file = new FileNode();
        file.entry.createdAt = rawValue;

        let col = new ContentColumnModel();
        col.source = 'createdAt';
        col.type = 'string';

        let value = documentList.getCellValue(file, col);
        expect(value).toBe(rawValue);
    });

    it('should convert cell value to thumbnail', () => {
        let url = 'http://<address>';
        spyOn(documentList, 'getThumbnailUrl').and.returnValue(url);

        let file = new FileNode();

        let col = new ContentColumnModel();
        col.source = '$thumbnail';
        col.type = 'image';

        let value = documentList.getCellValue(file, col);
        expect(value).toBe(url);
    });

    it('should require path to display folder content', () => {
        spyOn(alfrescoServiceMock, 'getFolder').and.callThrough();

        documentList.displayFolderContent(null);
        documentList.displayFolderContent('');

        expect(alfrescoServiceMock.getFolder).not.toHaveBeenCalled();
    });

    it('should require node to resolve context menu actions', () => {
        expect(documentList.getContextActions(null)).toBeNull();

        let file = new FileNode();
        file.entry = null;

        expect(documentList.getContextActions(file)).toBeNull();
    });

    it('should fetch context menu actions for a file node', () => {
        let actionModel = {};
        spyOn(documentList, 'getContentActions').and.returnValue([actionModel]);

        let file = new FileNode();
        let actions = documentList.getContextActions(file);

        expect(documentList.getContentActions).toHaveBeenCalledWith('document', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(file);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });

    it('should fetch context menu actions for a folder node', () => {
        let actionModel = {};
        spyOn(documentList, 'getContentActions').and.returnValue([actionModel]);

        let folder = new FolderNode();
        let actions = documentList.getContextActions(folder);

        expect(documentList.getContentActions).toHaveBeenCalledWith('folder', 'menu');
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(folder);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });

    it('should fetch no context menu actions for unknown type', () => {
        spyOn(documentList, 'getContentActions').and.stub();

        let node = new FileNode();
        node.entry.isFile = false;
        node.entry.isFolder = false;

        let actions = documentList.getContextActions(node);

        expect(documentList.getContentActions).not.toHaveBeenCalled();
        expect(actions).toBeNull();
    });

    it('should return null value when no content actions found', () => {
        spyOn(documentList, 'getContentActions').and.returnValue([]);

        let file = new FileNode();
        let actions = documentList.getContextActions(file);

        expect(actions).toBeNull();
        expect(documentList.getContentActions).toHaveBeenCalled();
    });

    it('should update error message when folder content display fails', () => {
        let error = 'My Error';
        alfrescoServiceMock.getFolderReject = true;
        alfrescoServiceMock.getFolderRejectError = error;

        documentList.displayFolderContent('/some/path');
        expect(documentList.errorMessage).toBe(error);
    });

    it('should get object value via property path', () => {
        let obj = {
            name: {
                firstName: '<name>'
            }
        };

        expect(documentList.getObjectValue(obj, 'name.firstName')).toBe('<name>');
    });

    it('should not get object value via invalid path', () => {
        expect(documentList.getObjectValue({}, 'some.missing.path')).toBeUndefined();
    });

    it('should log error when having date conversion issues', () => {

        let value = '<wrong-date>';
        let file = new FileNode();
        file.entry.createdAt = value;

        let col = new ContentColumnModel({
            source: 'createdAt',
            type: 'date',
            format: 'medium'
        });

        spyOn(console, 'error').and.stub();

        let result = documentList.getCellValue(file, col);

        expect(result).toBe(value);
        expect(console.error).toHaveBeenCalledWith(`DocumentList: error parsing date ${value} to format ${col.format}`);
    });

    it('should convert thumbnail if column source defined', () => {
        let file = new FileNode();
        let col = new ContentColumnModel({
            source: 'name',
            type: 'image'
        });

        expect(documentList.getCellValue(file, col)).toBe(file.entry.name);
    });

    it('should require current folder path to reload', () => {

        // Redefine 'currentFolderPath' to disable native setter validation
        Object.defineProperty(documentList, 'currentFolderPath', {
            value: null
        });
        expect(documentList.currentFolderPath).toBeNull();

        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.reload();

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should not sort empty page', () => {
        let page = new PageNode();
        spyOn(page.list.entries, 'sort').and.stub();

        documentList.sort(page, null);
        expect(page.list.entries.sort).not.toHaveBeenCalled();
    });

    it('should put folders to top on sort', () => {
        let folder = new FolderNode();
        let file1 = new FileNode('file1');
        let file2 = new FileNode('file2');
        let page = new PageNode([file1, file2, folder]);

        // asc
        documentList.sort(page, new ColumnSortingModel({
            key: 'name',
            direction: 'asc'
        }));

        expect(page.list.entries[0]).toBe(folder);
        expect(page.list.entries[1]).toBe(file1);
        expect(page.list.entries[2]).toBe(file2);

        // desc
        documentList.sort(page, new ColumnSortingModel({
            key: 'name',
            direction: 'desc'
        }));

        expect(page.list.entries[0]).toBe(folder);
        expect(page.list.entries[1]).toBe(file2);
        expect(page.list.entries[2]).toBe(file1);
    });

    it('should sort by dates up to ms', () => {
        let file1 = new FileNode();
        file1.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 1);

        let file2 = new FileNode();
        file2.entry['dateProp'] = new Date(2016, 6, 30, 13, 14, 2);

        let page = new PageNode([file1, file2]);

        // desc
        documentList.sort(page, new ColumnSortingModel({
            key: 'dateProp',
            direction: 'desc'
        }));

        expect(page.list.entries[0]).toBe(file2);
        expect(page.list.entries[1]).toBe(file1);

        // asc
        documentList.sort(page, new ColumnSortingModel({
            key: 'dateProp',
            direction: 'asc'
        }));

        expect(page.list.entries[0]).toBe(file1);
        expect(page.list.entries[1]).toBe(file2);
    });

});
*/
