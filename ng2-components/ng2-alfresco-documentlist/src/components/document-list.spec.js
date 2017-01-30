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
var core_1 = require("@angular/core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var document_list_1 = require("./document-list");
var document_list_service_mock_1 = require("./../assets/document-list.service.mock");
var content_action_model_1 = require("../models/content-action.model");
var document_library_model_mock_1 = require("../assets/document-library.model.mock");
var document_library_model_1 = require("../models/document-library.model");
var share_datatable_adapter_1 = require("./../data/share-datatable-adapter");
describe('DocumentList', function () {
    var documentListService;
    var documentList;
    var eventMock;
    var componentHandler;
    beforeEach(function () {
        documentListService = new document_list_service_mock_1.DocumentListServiceMock();
        var zone = new core_1.NgZone(false);
        documentList = new document_list_1.DocumentList(documentListService, zone, null);
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
    it('should update root folder ID', function () {
        var adapter = documentList.data;
        expect(adapter.rootFolderId).toBe(adapter.DEFAULT_ROOT_ID);
        documentList.rootFolderId = '-shared-';
        expect(adapter.rootFolderId).toBe('-shared-');
    });
    it('should setup default columns', function () {
        spyOn(documentList, 'setupDefaultColumns').and.callThrough();
        documentList.ngAfterContentInit();
        expect(documentList.setupDefaultColumns).toHaveBeenCalled();
        expect(documentList.data.getColumns().length).not.toBe(0);
    });
    it('should use custom columns instead of default ones', function () {
        var column = {
            title: 'title',
            key: 'source',
            cssClass: 'css',
            srTitle: '',
            type: 'text',
            format: ''
        };
        var columns = documentList.data.getColumns();
        columns.push(column);
        documentList.ngAfterContentInit();
        expect(columns.length).toBe(1);
        expect(columns[0]).toBe(column);
    });
    it('should execute action with node', function () {
        var node = new document_library_model_mock_1.FileNode();
        var action = new content_action_model_1.ContentActionModel();
        action.handler = function () {
            console.log('mock handler');
        };
        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node, documentList);
    });
    it('should not execute action without node provided', function () {
        var action = new content_action_model_1.ContentActionModel();
        action.handler = function () {
            console.log('mock handler');
        };
        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(null, action);
        expect(action.handler).not.toHaveBeenCalled();
    });
    it('should not give node actions for empty target', function () {
        var actions = documentList.getNodeActions(null);
        expect(actions.length).toBe(0);
    });
    it('should filter content actions for various targets', function () {
        var folderMenu = new content_action_model_1.ContentActionModel();
        folderMenu.target = 'folder';
        var documentMenu = new content_action_model_1.ContentActionModel();
        documentMenu.target = 'document';
        documentList.actions = [
            folderMenu,
            documentMenu
        ];
        var actions = documentList.getNodeActions(new document_library_model_mock_1.FolderNode());
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(folderMenu);
        actions = documentList.getNodeActions(new document_library_model_mock_1.FileNode());
        expect(actions.length).toBe(1);
        expect(actions[0]).toBe(documentMenu);
    });
    it('should find no content actions', function () {
        var documentButton = new content_action_model_1.ContentActionModel();
        documentButton.target = 'document';
        documentList.actions = [documentButton];
        var node = new document_library_model_1.NodeMinimalEntry();
        expect(documentList.getNodeActions(node)).toEqual([]);
        node = new document_library_model_mock_1.FileNode();
        node.entry.isFile = false;
        node.entry.isFolder = false;
        expect(documentList.getNodeActions(node)).toEqual([]);
    });
    it('should emit nodeClick event', function (done) {
        var node = new document_library_model_mock_1.FileNode();
        documentList.nodeClick.subscribe(function (e) {
            expect(e.value).toBe(node);
            done();
        });
        documentList.onNodeClick(node);
    });
    it('should display folder content on click', function () {
        var path = '/';
        var node = new document_library_model_mock_1.FolderNode('<display name>');
        spyOn(documentList, 'getNodePath').and.returnValue(path);
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve(true));
        documentList.navigationMode = document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(node);
        expect(documentList.currentFolderPath).toBe(path);
    });
    it('should not display folder content when no target node provided', function () {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'loadFolderByPath').and.stub();
        documentList.onNodeClick(null);
        expect(documentList.loadFolderByPath).not.toHaveBeenCalled();
    });
    it('should display folder content only on folder node click', function () {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'loadFolderByPath').and.stub();
        var node = new document_library_model_mock_1.FileNode();
        documentList.onNodeClick(node);
        expect(documentList.loadFolderByPath).not.toHaveBeenCalled();
    });
    it('should not display folder content on click when navigation is off', function () {
        spyOn(documentList, 'loadFolderByPath').and.stub();
        var node = new document_library_model_mock_1.FolderNode('<display name>');
        documentList.navigate = false;
        documentList.onNodeClick(node);
        expect(documentList.loadFolderByPath).not.toHaveBeenCalled();
    });
    it('should require node to get path', function () {
        expect(documentList.getNodePath(null)).toBe(null);
    });
    it('should display folder content for new folder path', function () {
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve());
        var newPath = '/some/new/path';
        documentList.currentFolderPath = newPath;
        documentList.ngOnChanges({ currentFolderPath: new core_1.SimpleChange(null, newPath) });
        expect(documentList.loadFolderByPath).toHaveBeenCalledWith(newPath);
    });
    it('should reset to default path', function () {
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve());
        documentList.currentFolderPath = null;
        documentList.ngOnChanges({ currentFolderPath: new core_1.SimpleChange('', null) });
        expect(documentList.currentFolderPath).toBe(documentList.DEFAULT_FOLDER_PATH);
        expect(documentList.loadFolderByPath).toHaveBeenCalledWith(documentList.DEFAULT_FOLDER_PATH);
    });
    it('should emit folder changed event', function (done) {
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve());
        documentList.folderChange.subscribe(function (e) {
            done();
        });
        var newPath = '/some/new/path';
        documentList.currentFolderPath = newPath;
        documentList.ngOnChanges({ currentFolderPath: new core_1.SimpleChange(null, newPath) });
    });
    it('should emit folder changed event with folder details', function (done) {
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve());
        var path = '/path';
        documentList.folderChange.subscribe(function (e) {
            expect(e.path).toBe(path);
            done();
        });
        documentList.currentFolderPath = path;
        documentList.ngOnChanges({ currentFolderPath: new core_1.SimpleChange(null, path) });
    });
    it('should execute context action on callback', function () {
        var action = {
            node: {},
            model: {}
        };
        spyOn(documentList, 'executeContentAction').and.stub();
        documentList.contextActionCallback(action);
        expect(documentList.executeContentAction).toHaveBeenCalledWith(action.node, action.model);
    });
    it('should not execute context action on callback', function () {
        spyOn(documentList, 'executeContentAction').and.stub();
        documentList.contextActionCallback(null);
        expect(documentList.executeContentAction).not.toHaveBeenCalled();
    });
    it('should subscribe to context action handler', function () {
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.resolve(true));
        spyOn(documentList, 'contextActionCallback').and.stub();
        var value = {};
        documentList.ngOnInit();
        documentList.contextActionHandler.next(value);
        expect(documentList.contextActionCallback).toHaveBeenCalledWith(value);
    });
    it('should suppress default context menu', function () {
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onShowContextMenu(eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });
    it('should emit file preview event on single click', function (done) {
        var file = new document_library_model_mock_1.FileNode();
        documentList.preview.subscribe(function (e) {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(file);
    });
    it('should emit file preview event on double click', function (done) {
        var file = new document_library_model_mock_1.FileNode();
        documentList.preview.subscribe(function (e) {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = document_list_1.DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
    });
    it('should perform folder navigation on single click', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });
    it('should perform folder navigation on double click', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_1.DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });
    it('should not perform folder navigation on double click when single mode', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });
    it('should not perform folder navigation on double click when navigation off', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigate = false;
        documentList.navigationMode = document_list_1.DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });
    it('should perform navigation for folder node only', function () {
        spyOn(documentList, 'getNodePath').and.returnValue('/path');
        var folder = new document_library_model_mock_1.FolderNode();
        var file = new document_library_model_mock_1.FileNode();
        expect(documentList.performNavigation(folder)).toBeTruthy();
        expect(documentList.performNavigation(file)).toBeFalsy();
        expect(documentList.performNavigation(null)).toBeFalsy();
    });
    it('should not get node path for null node', function () {
        expect(documentList.getNodePath(null)).toBeNull();
    });
    it('should trim company home from node path', function () {
        var file = new document_library_model_mock_1.FileNode('file.txt');
        file.entry.path.name = '/Company Home/folder1';
        expect(documentList.getNodePath(file)).toBe('/folder1/file.txt');
    });
    it('should require valid node for file preview', function () {
        var file = new document_library_model_mock_1.FileNode();
        file.entry = null;
        var called = false;
        documentList.navigationMode = document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.preview.subscribe(function (val) { return called = true; });
        documentList.onNodeClick(file);
        expect(called).toBeFalsy();
        documentList.navigationMode = document_list_1.DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
        expect(called).toBeFalsy();
    });
    it('should require valid node for folder navigation', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        folder.entry = null;
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);
        documentList.navigationMode = document_list_1.DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });
    it('should display folder content on reload', function () {
        spyOn(documentList, 'loadFolderByPath').and.callThrough();
        documentList.reload();
        expect(documentList.loadFolderByPath).toHaveBeenCalled();
    });
    it('should require path to display folder content', function () {
        spyOn(documentListService, 'getFolder').and.callThrough();
        documentList.loadFolderByPath(null);
        documentList.loadFolderByPath('');
        expect(documentListService.getFolder).not.toHaveBeenCalled();
    });
    it('should require node to resolve context menu actions', function () {
        expect(documentList.getContextActions(null)).toBeNull();
        var file = new document_library_model_mock_1.FileNode();
        file.entry = null;
        expect(documentList.getContextActions(file)).toBeNull();
    });
    it('should fetch context menu actions for a file node', function () {
        var actionModel = {};
        spyOn(documentList, 'getNodeActions').and.returnValue([actionModel]);
        var file = new document_library_model_mock_1.FileNode();
        var actions = documentList.getContextActions(file);
        expect(documentList.getNodeActions).toHaveBeenCalledWith(file);
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(file);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });
    it('should fetch context menu actions for a folder node', function () {
        var actionModel = {};
        spyOn(documentList, 'getNodeActions').and.returnValue([actionModel]);
        var folder = new document_library_model_mock_1.FolderNode();
        var actions = documentList.getContextActions(folder);
        expect(documentList.getNodeActions).toHaveBeenCalledWith(folder);
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(folder);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });
    it('should fetch no context menu actions for unknown type', function () {
        spyOn(documentList, 'getNodeActions').and.stub();
        var node = new document_library_model_mock_1.FileNode();
        node.entry.isFile = false;
        node.entry.isFolder = false;
        var actions = documentList.getContextActions(node);
        expect(actions).toBeNull();
    });
    it('should return null value when no content actions found', function () {
        spyOn(documentList, 'getNodeActions').and.returnValue([]);
        var file = new document_library_model_mock_1.FileNode();
        var actions = documentList.getContextActions(file);
        expect(actions).toBeNull();
        expect(documentList.getNodeActions).toHaveBeenCalled();
    });
    it('should require current folder path to reload', function () {
        Object.defineProperty(documentList, 'currentFolderPath', {
            value: null
        });
        expect(documentList.currentFolderPath).toBeNull();
        spyOn(documentList, 'loadFolderByPath').and.stub();
        documentList.reload();
        expect(documentList.loadFolderByPath).not.toHaveBeenCalled();
    });
    it('should enforce single-click on mobile browser', function () {
        spyOn(documentList, 'isMobile').and.returnValue(true);
        documentList.navigationMode = document_list_1.DocumentList.DOUBLE_CLICK_NAVIGATION;
        documentList.ngOnInit();
        expect(documentList.isMobile).toHaveBeenCalled();
        expect(documentList.navigationMode).toBe(document_list_1.DocumentList.SINGLE_CLICK_NAVIGATION);
    });
    it('should emit error on wrong path', function (done) {
        var raised = false;
        documentList.error.subscribe(function (err) { return raised = true; });
        spyOn(documentList, 'loadFolderByPath').and.returnValue(Promise.reject(false));
        documentList.currentFolderPath = 'wrong-path';
        documentList.ngOnChanges({ currentFolderPath: new core_1.SimpleChange(null, documentList.currentFolderPath) });
        setTimeout(function () {
            expect(raised).toBeTruthy();
            done();
        }, 0);
    });
    it('should require dataTable to check empty template', function () {
        documentList.dataTable = null;
        expect(documentList.isEmptyTemplateDefined()).toBeFalsy();
    });
    it('should check [empty folder] template ', function () {
        documentList.emptyFolderTemplate = {};
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent();
        expect(documentList.dataTable).toBeDefined();
        expect(documentList.isEmptyTemplateDefined()).toBeTruthy();
        documentList.emptyFolderTemplate = null;
        expect(documentList.isEmptyTemplateDefined()).toBeFalsy();
    });
    it('should set root folder ID for underlying adapter', function () {
        documentList.rootFolderId = 'test';
        expect(documentList.data.rootFolderId).toBe('test');
    });
    it('should set default root folder ID for underlying adapter', function () {
        documentList.rootFolderId = null;
        expect(documentList.data.rootFolderId).toBe(documentList.data.DEFAULT_ROOT_ID);
    });
    it('should fetch root folder ID from underlying adapter', function () {
        documentList.data.rootFolderId = 'test';
        expect(documentList.rootFolderId).toBe('test');
    });
    it('should not fetch root folder ID when adapter missing', function () {
        documentList.data = null;
        expect(documentList.rootFolderId).toBeNull();
    });
    it('should set row filter for underlying adapter', function () {
        var filter = {};
        spyOn(documentList.data, 'setFilter').and.callThrough();
        documentList.rowFilter = filter;
        expect(documentList.data.setFilter).toHaveBeenCalledWith(filter);
    });
    it('should set image resolver for underlying adapter', function () {
        var resolver = {};
        spyOn(documentList.data, 'setImageResolver').and.callThrough();
        documentList.imageResolver = resolver;
        expect(documentList.data.setImageResolver).toHaveBeenCalledWith(resolver);
    });
    it('should emit [nodeClick] event on row click', function () {
        var node = new document_library_model_1.NodeMinimalEntry();
        var row = new share_datatable_adapter_1.ShareDataRow(node);
        var event = { value: row };
        spyOn(documentList, 'onNodeClick').and.callThrough();
        documentList.onRowClick(event);
        expect(documentList.onNodeClick).toHaveBeenCalledWith(node);
    });
    it('should emit [nodeDblClick] event on row double-click', function () {
        var node = new document_library_model_1.NodeMinimalEntry();
        var row = new share_datatable_adapter_1.ShareDataRow(node);
        var event = { value: row };
        spyOn(documentList, 'onNodeDblClick').and.callThrough();
        documentList.onRowDblClick(event);
        expect(documentList.onNodeDblClick).toHaveBeenCalledWith(node);
    });
    describe('navigate by folder ID', function () {
        it('should load folder by ID on init', function () {
            documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
            var loadbyIdSpy = spyOn(documentList.data, 'loadById').and.returnValue(Promise.resolve());
            documentList.ngOnInit();
            expect(loadbyIdSpy).toHaveBeenCalled();
            expect(documentList.currentFolderPath).toBe('/');
        });
        it('should load folder by ID on changes', function () {
            var newNodeId = '1d26e465-dea3-42f3-b415-faa8364b9692';
            documentList.ngOnChanges({ currentFolderId: new core_1.SimpleChange(null, newNodeId) });
            var loadbyPathSpy = spyOn(documentList.data, 'loadPath').and.returnValue(Promise.resolve());
            documentList.ngOnInit();
            expect(loadbyPathSpy).toHaveBeenCalled();
            expect(documentList.currentFolderPath).toBe('/');
        });
    });
    describe('configure root folder', function () {
        it('should re-load folder when rootFolderId changed', function () {
            var newRootFolder = '-new-';
            documentList.ngOnChanges({ rootFolderId: new core_1.SimpleChange(null, newRootFolder) });
            var loadbyPathSpy = spyOn(documentList.data, 'loadPath').and.returnValue(Promise.resolve());
            documentList.ngOnInit();
            expect(loadbyPathSpy).toHaveBeenCalled();
            expect(documentList.currentFolderPath).toBe('/');
        });
    });
});
//# sourceMappingURL=document-list.spec.js.map