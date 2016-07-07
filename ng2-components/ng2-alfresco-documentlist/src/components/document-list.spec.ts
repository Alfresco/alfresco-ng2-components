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

import { it, describe, expect, beforeEach } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { DataColumn } from 'ng2-alfresco-datatable';
import { DocumentList } from './document-list';
import { DocumentListServiceMock } from './../assets/document-list.service.mock';
import { ContentActionModel } from '../models/content-action.model';
import { FileNode, FolderNode } from '../assets/document-library.model.mock';
import { MinimalNodeEntity } from '../models/document-library.model';

describe('DocumentList', () => {

    let documentListService: DocumentListServiceMock;
    let documentList: DocumentList;
    let eventMock: any;
    let componentHandler;

    beforeEach(() => {
        documentListService = new DocumentListServiceMock();
        let zone = new NgZone(false);
        documentList = new DocumentList(documentListService, zone);

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
        expect(documentList.data.getColumns().length).not.toBe(0);
    });

    it('should use custom columns instead of default ones', () => {
        let column = <DataColumn> {
            title: 'title',
            key: 'source',
            cssClass: 'css',
            srTitle: '',
            type: 'text',
            format: ''
        };

        let columns = documentList.data.getColumns();
        columns.push(column);

        documentList.ngAfterContentInit();
        expect(columns.length).toBe(1);
        expect(columns[0]).toBe(column);
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

    it('should not give node actions for empty target', () => {
        let actions = documentList.getNodeActions(null);
        expect(actions.length).toBe(0);
    });

    it('should filter content actions for various targets', () => {
        let folderMenu = new ContentActionModel();
        folderMenu.target = 'folder';

        let documentMenu = new ContentActionModel();
        documentMenu.target = 'document';

        documentList.actions = [
            folderMenu,
            documentMenu
        ];


        let actions = documentList.getNodeActions(new FolderNode());
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderMenu);

        actions = documentList.getNodeActions(new FileNode());
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentMenu);
    });

    it('should find no content actions', () => {
        let documentButton = new ContentActionModel();
        documentButton.target = 'document';
        documentList.actions = [documentButton];

        let node = new MinimalNodeEntity();
        expect(documentList.getNodeActions(node)).toEqual([]);

        node = new FileNode();
        node.entry.isFile = false;
        node.entry.isFolder = false;
        expect(documentList.getNodeActions(node)).toEqual([]);
    });

    it('should emit nodeClick event', (done) => {
        let node = new FileNode();
        documentList.nodeClick.subscribe(e => {
            expect(e.value).toBe(node);
            done();
        });
        documentList.onNodeClick(node);
    });

    it('should display folder content on click', () => {
        let path = '/';

        let node = new FolderNode('<display name>');

        spyOn(documentList, 'getNodePath').and.returnValue(path);
        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(node);

        expect(documentList.currentFolderPath).toBe(path);
    });

    it('should not display folder content when no target node provided', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'displayFolderContent').and.stub();

        documentList.onNodeClick(null);
        expect(documentList.displayFolderContent).not.toHaveBeenCalled();

    });

    it('should display folder content only on folder node click', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = new FileNode();
        documentList.onNodeClick(node);

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should not display folder content on click when navigation is off', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();

        let node = new FolderNode('<display name>');
        documentList.navigate = false;
        documentList.onNodeClick(node);

        expect(documentList.displayFolderContent).not.toHaveBeenCalled();
    });

    it('should require node to get path', () => {
        expect(documentList.getNodePath(null)).toBe(null);
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
        spyOn(documentList, 'displayFolderContent').and.stub();
        documentList.folderChange.subscribe(e => {
            done();
        });

        documentList.currentFolderPath = '/some/new/path';
    });

    it('should emit folder changed event with folder details', (done) => {
        spyOn(documentList, 'displayFolderContent').and.stub();

        let path = '/path';

        documentList.folderChange.subscribe(e => {
            expect(e.path).toBe(path);
            done();
        });

        documentList.currentFolderPath = path;
    });

    it('should emit folder changed event only once', () => {
        spyOn(documentList, 'displayFolderContent').and.stub();
        let path = '/new/path';
        let calls = 0;
        documentList.folderChange.subscribe(e => {
            calls++;
        });

        documentList.currentFolderPath = path;
        documentList.currentFolderPath = path;
        documentList.currentFolderPath = path;
        expect(calls).toBe(1);
    });

    it('should reload on binding changes', () => {
        spyOn(documentList, 'reload').and.stub();
        documentList.ngOnChanges();
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
        spyOn(documentList, 'displayFolderContent').and.stub();
        spyOn(documentList, 'contextActionCallback').and.stub();
        let value = {};
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
        documentList.onNodeClick(file);
    });

    it('should emit file preview event on double click', (done) => {
        let file = new FileNode();
        documentList.preview.subscribe(e => {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
    });

    it('should perform folder navigation on single click', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });

    it('should perform folder navigation on double click', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });

    it('should not perform folder navigation on double click when single mode', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);

        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });

    it('should not perform folder navigation on double click when navigation off', () => {
        let folder = new FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigate = false;
        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);

        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });

    it('should perform navigation for folder node only', () => {
        spyOn(documentList, 'getNodePath').and.returnValue('/path');

        let folder = new FolderNode();
        let file = new FileNode();

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

        documentList.onNodeClick(file);
        expect(called).toBeFalsy();

        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
        expect(called).toBeFalsy();
    });

    it('should require valid node for folder navigation', () => {
        let folder = new FolderNode();
        folder.entry = null;
        spyOn(documentList, 'performNavigation').and.stub();

        documentList.navigationMode = DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);

        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);

        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });

    it('should display folder content on reload', () => {
        spyOn(documentList, 'displayFolderContent').and.callThrough();
        documentList.reload();
        expect(documentList.displayFolderContent).toHaveBeenCalled();
    });

    // TODO: move to data adapter
    /*
    it('should generate file icon path based on mime type', () => {
        let fileName = 'custom-icon.svg';
        spyOn(alfrescoServiceMock, 'getMimeTypeIcon').and.returnValue(fileName);
        documentList.baseComponentPath = '/root';

        let file = new FileNode();
        file.entry.content.mimeType = 'text/plain';

        expect(documentList.getThumbnailUrl(file)).toBe(`/root/img/${fileName}`);
    });
    */

    // TODO: move to data adapter
    /*
    it('should fallback to default icon for missing mime type', () => {
        spyOn(documentListService, 'getMimeTypeIcon').and.returnValue(null);
        documentList.baseComponentPath = '/root';

        let file = new FileNode();
        file.entry.content.mimeType = null;

        expect(documentList.getThumbnailUrl(file)).toBe('/root/img/ft_ic_miscellaneous.svg');
    });
    */

    // TODO: move to data adapter
    /*
    it('should fallback to default icon for unknown mime type', () => {
        spyOn(documentListService, 'getMimeTypeIcon').and.returnValue(null);
        documentList.baseComponentPath = '/root';

        let file = new FileNode();
        file.entry.content.mimeType = 'text/plain';

        expect(documentList.getThumbnailUrl(file)).toBe('/root/img/ft_ic_miscellaneous.svg');
    });
    */

    // TODO: move to data adapter
    /*
    it('should resolve thumbnail url for a file', () => {
        let url = 'http://<some url>';
        spyOn(documentListService, 'getDocumentThumbnailUrl').and.returnValue(url);

        documentList.thumbnails = true;

        let file = new FileNode();
        expect(documentList.getThumbnailUrl(file)).toBe(url);
    });
    */

    // TODO: move to data adapter
    /*
    it('should return no thumbnail url with missing service', () => {
        let list = new DocumentList(null, null);
        list.thumbnails = true;

        let file = new FileNode();
        expect(list.getThumbnailUrl(file)).toBeNull();
    });
    */

    // TODO: move to data adapter
    /*
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
    */

    it('should require path to display folder content', () => {
        spyOn(documentListService, 'getFolder').and.callThrough();

        documentList.displayFolderContent(null);
        documentList.displayFolderContent('');

        expect(documentListService.getFolder).not.toHaveBeenCalled();
    });

    it('should require node to resolve context menu actions', () => {
        expect(documentList.getContextActions(null)).toBeNull();

        let file = new FileNode();
        file.entry = null;

        expect(documentList.getContextActions(file)).toBeNull();
    });

    it('should fetch context menu actions for a file node', () => {
        let actionModel = {};
        spyOn(documentList, 'getNodeActions').and.returnValue([actionModel]);

        let file = new FileNode();
        let actions = documentList.getContextActions(file);

        expect(documentList.getNodeActions).toHaveBeenCalledWith(file);
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(file);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });

    it('should fetch context menu actions for a folder node', () => {
        let actionModel = {};
        spyOn(documentList, 'getNodeActions').and.returnValue([actionModel]);

        let folder = new FolderNode();
        let actions = documentList.getContextActions(folder);

        expect(documentList.getNodeActions).toHaveBeenCalledWith(folder);
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(folder);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });

    it('should fetch no context menu actions for unknown type', () => {
        spyOn(documentList, 'getNodeActions').and.stub();

        let node = new FileNode();
        node.entry.isFile = false;
        node.entry.isFolder = false;

        let actions = documentList.getContextActions(node);
        expect(actions).toBeNull();
    });

    it('should return null value when no content actions found', () => {
        spyOn(documentList, 'getNodeActions').and.returnValue([]);

        let file = new FileNode();
        let actions = documentList.getContextActions(file);

        expect(actions).toBeNull();
        expect(documentList.getNodeActions).toHaveBeenCalled();
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

    // TODO: move to data adapter
    /*
    it('should not sort empty page', () => {
        let page = new PageNode();
        spyOn(page.list.entries, 'sort').and.stub();

        documentList.sort(page, null);
        expect(page.list.entries.sort).not.toHaveBeenCalled();
    });
    */

    // TODO: move to data adapter
    /*
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
    */

    // TODO: move to data adapter
    /*
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
    */

});
