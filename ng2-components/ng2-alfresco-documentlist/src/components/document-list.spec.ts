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

import { NgZone, TemplateRef } from '@angular/core';
import { DataTableComponent, DataColumn, DataRowEvent } from 'ng2-alfresco-datatable';
import { DocumentList } from './document-list';
import { DocumentListServiceMock } from './../assets/document-list.service.mock';
import { ContentActionModel } from '../models/content-action.model';
import { FileNode, FolderNode } from '../assets/document-library.model.mock';
import { NodeMinimalEntry } from '../models/document-library.model';
import { ShareDataRow, RowFilter, ImageResolver } from './../data/share-datatable-adapter';

describe('DocumentList', () => {

    let documentListService: DocumentListServiceMock;
    let documentList: DocumentList;
    let eventMock: any;
    let componentHandler;

    beforeEach(() => {
        documentListService = new DocumentListServiceMock();
        let zone = new NgZone(false);
        documentList = new DocumentList(documentListService, zone, null);

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

    it('should update root path', () => {
        let adapter = documentList.data;
        expect(adapter.rootPath).toBe(adapter.DEFAULT_ROOT_PATH);

        documentList.rootPath = '-shared-';
        expect(adapter.rootPath).toBe('-shared-');
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

        let node = new NodeMinimalEntry();
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
        spyOn(documentList, 'displayFolderContent').and.returnValue(Promise.resolve());
        let newPath = '/some/new/path';
        documentList.currentFolderPath = newPath;
        expect(documentList.displayFolderContent).toHaveBeenCalledWith(newPath);
    });

    it('should reset to default path', () => {
        spyOn(documentList, 'displayFolderContent').and.returnValue(Promise.resolve());
        documentList.currentFolderPath = null;

        expect(documentList.currentFolderPath).toBe(documentList.DEFAULT_ROOT_FOLDER);
        expect(documentList.displayFolderContent).toHaveBeenCalledWith(documentList.DEFAULT_ROOT_FOLDER);
    });

    it('should emit folder changed event', (done) => {
        spyOn(documentList, 'displayFolderContent').and.returnValue(Promise.resolve());
        documentList.folderChange.subscribe(e => {
            done();
        });

        documentList.currentFolderPath = '/some/new/path';
    });

    it('should emit folder changed event with folder details', (done) => {
        spyOn(documentList, 'displayFolderContent').and.returnValue(Promise.resolve());

        let path = '/path';

        documentList.folderChange.subscribe(e => {
            expect(e.path).toBe(path);
            done();
        });

        documentList.currentFolderPath = path;
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

    it('should enforce single-click on mobile browser', () => {
        spyOn(documentList, 'isMobile').and.returnValue(true);
        documentList.navigationMode = DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.ngOnInit();
        expect(documentList.isMobile).toHaveBeenCalled();
        expect(documentList.navigationMode).toBe(DocumentList.SINGLE_CLICK_NAVIGATION);
    });

    it('should emit error on wrong path', (done) => {
        let raised = false;
        documentList.error.subscribe(err => raised = true);
        spyOn(documentList, 'displayFolderContent').and.returnValue(Promise.reject(false));

        documentList.currentFolderPath = 'wrong-path';
        setTimeout(() => {
            expect(raised).toBeTruthy();
            done();
        }, 0);
    });

    it('should require dataTable to check empty template', () => {
        documentList.dataTable = null;
        expect(documentList.isEmptyTemplateDefined()).toBeFalsy();
    });

    it('should check [empty folder] template ', () => {
        documentList.emptyFolderTemplate = <TemplateRef<any>> {};
        documentList.dataTable = new DataTableComponent();
        expect(documentList.dataTable).toBeDefined();
        expect(documentList.isEmptyTemplateDefined()).toBeTruthy();

        documentList.emptyFolderTemplate = null;
        expect(documentList.isEmptyTemplateDefined()).toBeFalsy();
    });

    it('should set root path for underlying adapter', () => {
        documentList.rootPath = 'test';
        expect(documentList.data.rootPath).toBe('test');
    });

    it('should set default root path for underlying adapter', () => {
        documentList.rootPath = null;
        expect(documentList.data.rootPath).toBe(documentList.data.DEFAULT_ROOT_PATH);
    });

    it('should fetch root path from underlying adapter', () => {
        documentList.data.rootPath = 'test';
        expect(documentList.rootPath).toBe('test');
    });

    it('should not fetch root path when adapter missing', () => {
        documentList.data = null;
        expect(documentList.rootPath).toBeNull();
    });

    it('should set row filter for underlying adapter', () => {
        let filter = <RowFilter> {};
        spyOn(documentList.data, 'setFilter').and.callThrough();

        documentList.rowFilter = filter;
        expect(documentList.data.setFilter).toHaveBeenCalledWith(filter);
    });

    it('should set image resolver for underlying adapter', () => {
        let resolver = <ImageResolver> {};
        spyOn(documentList.data, 'setImageResolver').and.callThrough();

        documentList.imageResolver = resolver;
        expect(documentList.data.setImageResolver).toHaveBeenCalledWith(resolver);
    });

    it('should emit [nodeClick] event on row click', () => {
        let node = new NodeMinimalEntry();
        let row = new ShareDataRow(node);
        let event = <DataRowEvent> { value: row };

        spyOn(documentList, 'onNodeClick').and.callThrough();
        documentList.onRowClick(event);
        expect(documentList.onNodeClick).toHaveBeenCalledWith(node);
    });

    it('should emit [nodeDblClick] event on row double-click', () => {
        let node = new NodeMinimalEntry();
        let row = new ShareDataRow(node);
        let event = <DataRowEvent> { value: row };

        spyOn(documentList, 'onNodeDblClick').and.callThrough();
        documentList.onRowDblClick(event);
        expect(documentList.onNodeDblClick).toHaveBeenCalledWith(node);
    });
});
