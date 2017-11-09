"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var ng2_alfresco_core_1 = require("ng2-alfresco-core");
var ng2_alfresco_datatable_1 = require("ng2-alfresco-datatable");
var ng2_alfresco_datatable_2 = require("ng2-alfresco-datatable");
var Rx_1 = require("rxjs/Rx");
var document_library_model_mock_1 = require("../assets/document-library.model.mock");
var document_list_component_mock_1 = require("../assets/document-list.component.mock");
var material_module_1 = require("../../material.module");
var content_action_model_1 = require("../models/content-action.model");
var document_library_model_1 = require("../models/document-library.model");
var document_list_service_1 = require("./../services/document-list.service");
var document_list_component_1 = require("./document-list.component");
describe('DocumentList', function () {
    var documentList;
    var documentListService;
    var apiService;
    var fixture;
    var element;
    var eventMock;
    var appConfig;
    var userPreferences;
    beforeEach(testing_1.async(function () {
        var zone = new core_1.NgZone({ enableLongStackTrace: false });
        testing_1.TestBed.configureTestingModule({
            imports: [
                ng2_alfresco_core_1.CoreModule,
                ng2_alfresco_datatable_2.DataTableModule,
                material_module_1.MaterialModule
            ],
            declarations: [
                document_list_component_1.DocumentListComponent
            ],
            providers: [
                document_list_service_1.DocumentListService,
                { provide: core_1.NgZone, useValue: zone }
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));
    beforeEach(function () {
        eventMock = {
            preventDefault: function () {
            }
        };
        fixture = testing_1.TestBed.createComponent(document_list_component_1.DocumentListComponent);
        var translateService = testing_1.TestBed.get(ng2_alfresco_core_1.AlfrescoTranslationService);
        spyOn(translateService, 'get').and.callFake(function (key) {
            return Rx_1.Observable.of(key);
        });
        element = fixture.nativeElement;
        documentList = fixture.componentInstance;
        documentListService = testing_1.TestBed.get(document_list_service_1.DocumentListService);
        apiService = testing_1.TestBed.get(ng2_alfresco_core_1.AlfrescoApiService);
        userPreferences = testing_1.TestBed.get(ng2_alfresco_core_1.UserPreferencesService);
        appConfig = testing_1.TestBed.get(ng2_alfresco_core_1.AppConfigService);
        fixture.detectChanges();
    });
    beforeEach(function () {
        jasmine.Ajax.install();
    });
    afterEach(function () {
        jasmine.Ajax.uninstall();
    });
    it('should setup default columns', function () {
        documentList.ngAfterContentInit();
        expect(documentList.data.getColumns().length).not.toBe(0);
    });
    it('should add the custom columns', function () {
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
        expect(columns.length).toBe(6);
        expect(columns[5]).toBe(column);
    });
    it('should call action\'s handler with node', function () {
        var node = new document_library_model_mock_1.FileNode();
        var action = new content_action_model_1.ContentActionModel();
        action.handler = function () { };
        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node, documentList, undefined);
    });
    it('should call action\'s handler with node and permission', function () {
        var node = new document_library_model_mock_1.FileNode();
        var action = new content_action_model_1.ContentActionModel();
        action.handler = function () { };
        action.permission = 'fake-permission';
        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node, documentList, 'fake-permission');
    });
    it('should call action\'s execute with node if it is defined', function () {
        var node = new document_library_model_mock_1.FileNode();
        var action = new content_action_model_1.ContentActionModel();
        action.execute = function () { };
        spyOn(action, 'execute').and.stub();
        documentList.executeContentAction(node, action);
        expect(action.execute).toHaveBeenCalledWith(node);
    });
    it('should call action\'s execute only after the handler has been executed', function () {
        var deleteObservable = new Rx_1.Subject();
        var node = new document_library_model_mock_1.FileNode();
        var action = new content_action_model_1.ContentActionModel();
        action.handler = function () { return deleteObservable; };
        action.execute = function () { };
        spyOn(action, 'execute').and.stub();
        documentList.executeContentAction(node, action);
        expect(action.execute).not.toHaveBeenCalled();
        deleteObservable.next();
        expect(action.execute).toHaveBeenCalledWith(node);
    });
    it('should show the loading state during the loading of new elements', function (done) {
        documentList.ngAfterContentInit();
        documentList.node = new document_library_model_1.NodePaging();
        fixture.detectChanges();
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            expect(element.querySelector('#adf-document-list-loading')).toBeDefined();
            done();
        });
    });
    it('should reset selection upon reload', function () {
        spyOn(documentList, 'resetSelection').and.callThrough();
        documentList.reload();
        fixture.detectChanges();
        expect(documentList.resetSelection).toHaveBeenCalled();
    });
    it('should reset selection on loading folder by node id', function () {
        spyOn(documentList, 'resetSelection').and.callThrough();
        documentList.loadFolderByNodeId('-trashcan-');
        expect(documentList.resetSelection).toHaveBeenCalled();
    });
    it('should reset selection in the datatable also', function () {
        spyOn(documentList.dataTable, 'resetSelection').and.callThrough();
        documentList.loadFolderByNodeId('-trashcan-');
        expect(documentList.dataTable.resetSelection).toHaveBeenCalled();
    });
    it('should empty template be present when no element are present', function (done) {
        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.folderNode = new document_library_model_1.NodeMinimal();
        documentList.folderNode.id = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.reload();
        fixture.detectChanges();
        documentList.ready.subscribe(function () {
            fixture.detectChanges();
            expect(element.querySelector('#adf-document-list-empty')).toBeDefined();
            done();
        });
        jasmine.Ajax.requests.at(0).respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(document_list_component_mock_1.fakeNodeAnswerWithNOEntries)
        });
    });
    it('should not execute action without node provided', function () {
        var action = new content_action_model_1.ContentActionModel();
        action.handler = function () {
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
        expect(actions[0].target).toBe(folderMenu.target);
        actions = documentList.getNodeActions(new document_library_model_mock_1.FileNode());
        expect(actions.length).toBe(1);
        expect(actions[0].target).toBe(documentMenu.target);
    });
    it('should disable the action if there is no permission for the file and disableWithNoPermission true', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: ['create', 'update'] } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBe(true);
    });
    it('should disable the action if there is no permission for the folder and disableWithNoPermission true', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: ['create', 'update'] } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBe(true);
    });
    it('should not disable the action if there is no permission for the file and disableWithNoPermission false', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            disableWithNoPermission: false,
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: ['create', 'update'] } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeUndefined(true);
    });
    it('should not disable the action if there is no permission for the folder and disableWithNoPermission false', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            disableWithNoPermission: false,
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: ['create', 'update'] } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBeUndefined(true);
    });
    it('should not disable the action if there is the right permission for the file', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: ['create', 'update', 'delete'] } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeUndefined();
    });
    it('should not disable the action if there is the right permission for the folder', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: ['create', 'update', 'delete'] } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBeUndefined();
    });
    it('should not disable the action if there are no permissions for the file', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: null } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeUndefined();
    });
    it('should not disable the action if there are no permissions for the folder', function () {
        var documentMenu = new content_action_model_1.ContentActionModel({
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction'
        });
        documentList.actions = [
            documentMenu
        ];
        var nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: null } };
        var actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBeUndefined();
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
        var node = new document_library_model_mock_1.FolderNode('<display name>');
        spyOn(documentList, 'loadFolder').and.returnValue(Promise.resolve(true));
        documentList.navigationMode = document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(node);
        expect(documentList.loadFolder).toHaveBeenCalled();
    });
    it('should not display folder content when no target node provided', function () {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'loadFolder').and.stub();
        documentList.onNodeClick(null);
        expect(documentList.loadFolder).not.toHaveBeenCalled();
    });
    it('should display folder content only on folder node click', function () {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'loadFolder').and.stub();
        var node = new document_library_model_mock_1.FileNode();
        documentList.onNodeClick(node);
        expect(documentList.loadFolder).not.toHaveBeenCalled();
    });
    it('should not display folder content on click when navigation is off', function () {
        spyOn(documentList, 'loadFolder').and.stub();
        var node = new document_library_model_mock_1.FolderNode('<display name>');
        documentList.navigate = false;
        documentList.onNodeClick(node);
        expect(documentList.loadFolder).not.toHaveBeenCalled();
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
        spyOn(documentList, 'loadFolder').and.stub();
        spyOn(documentList, 'contextActionCallback').and.stub();
        var value = {};
        documentList.ngOnInit();
        documentList.contextActionHandler.next(value);
        expect(documentList.contextActionCallback).toHaveBeenCalledWith(value);
    });
    it('should suppress default context menu', function () {
        documentList.contextMenuActions = true;
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onShowContextMenu(eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });
    it('should not suppress default context menu', function () {
        documentList.contextMenuActions = false;
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onShowContextMenu(eventMock);
        expect(eventMock.preventDefault).not.toHaveBeenCalled();
    });
    it('should emit file preview event on single click', function (done) {
        var file = new document_library_model_mock_1.FileNode();
        documentList.preview.subscribe(function (e) {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(file);
    });
    it('should emit file preview event on double click', function (done) {
        var file = new document_library_model_mock_1.FileNode();
        documentList.preview.subscribe(function (e) {
            expect(e.value).toBe(file);
            done();
        });
        documentList.navigationMode = document_list_component_1.DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
    });
    it('should perform folder navigation on single click', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });
    it('should perform folder navigation on double click', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_component_1.DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).toHaveBeenCalled();
    });
    it('should not perform folder navigation on double click when single mode', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });
    it('should not perform folder navigation on double click when navigation off', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigate = false;
        documentList.navigationMode = document_list_component_1.DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });
    it('should perform navigation for folder node only', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        var file = new document_library_model_mock_1.FileNode();
        expect(documentList.performNavigation(folder)).toBeTruthy();
        expect(documentList.performNavigation(file)).toBeFalsy();
        expect(documentList.performNavigation(null)).toBeFalsy();
    });
    it('should require valid node for file preview', function () {
        var file = new document_library_model_mock_1.FileNode();
        file.entry = null;
        var called = false;
        documentList.navigationMode = document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.preview.subscribe(function (val) { return called = true; });
        documentList.onNodeClick(file);
        expect(called).toBeFalsy();
        documentList.navigationMode = document_list_component_1.DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
        expect(called).toBeFalsy();
    });
    it('should require valid node for folder navigation', function () {
        var folder = new document_library_model_mock_1.FolderNode();
        folder.entry = null;
        spyOn(documentList, 'performNavigation').and.stub();
        documentList.navigationMode = document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);
        documentList.navigationMode = document_list_component_1.DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.performNavigation).not.toHaveBeenCalled();
    });
    it('should display folder content from loadFolder on reload if folderNode defined', function () {
        documentList.folderNode = new document_library_model_1.NodeMinimal();
        spyOn(documentList, 'loadFolder').and.callThrough();
        documentList.reload();
        expect(documentList.loadFolder).toHaveBeenCalled();
    });
    it('should display folder content from loadFolderByNodeId on reload if currentFolderId defined', function () {
        documentList.currentFolderId = 'id-folder';
        spyOn(documentList, 'loadFolderByNodeId').and.callThrough();
        documentList.reload();
        expect(documentList.loadFolderByNodeId).toHaveBeenCalled();
    });
    it('should display folder content from loadFolderByNodeId on reload if node defined', function () {
        documentList.node = new document_library_model_1.NodePaging();
        spyOn(documentList.data, 'loadPage').and.callThrough();
        documentList.reload();
        expect(documentList.data.loadPage).toHaveBeenCalled();
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
    it('should enforce single-click on mobile browser', function () {
        spyOn(documentList, 'isMobile').and.returnValue(true);
        documentList.navigationMode = document_list_component_1.DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.ngOnInit();
        expect(documentList.isMobile).toHaveBeenCalled();
        expect(documentList.navigationMode).toBe(document_list_component_1.DocumentListComponent.SINGLE_CLICK_NAVIGATION);
    });
    xit('should emit error on wrong folder id', function (done) {
        documentList.error.subscribe(function () {
            done();
        });
        documentList.currentFolderId = 'wrong-id';
        documentList.ngOnChanges({ currentFolderId: new core_1.SimpleChange(null, documentList.currentFolderId, true) });
    });
    it('should require dataTable to check empty template', function () {
        documentList.dataTable = null;
        expect(documentList.isEmptyTemplateDefined()).toBeFalsy();
    });
    it('should check [empty folder] template ', function () {
        documentList.emptyFolderTemplate = {};
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent(null, null);
        expect(documentList.dataTable).toBeDefined();
        expect(documentList.isEmptyTemplateDefined()).toBeTruthy();
        documentList.emptyFolderTemplate = null;
        expect(documentList.isEmptyTemplateDefined()).toBeFalsy();
    });
    it('should require dataTable to check no permission template', function () {
        documentList.dataTable = null;
        expect(documentList.isNoPermissionTemplateDefined()).toBe(false);
    });
    it('should return true if custom permission template is provided', function () {
        documentList.noPermissionTemplate = {};
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent(null, null);
        expect(documentList.isNoPermissionTemplateDefined()).toBe(true);
    });
    it('should return false if no custom permission template is provided', function () {
        documentList.noPermissionTemplate = null;
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent(null, null);
        expect(documentList.isNoPermissionTemplateDefined()).toBe(false);
    });
    it('should empty folder NOT show the pagination', function () {
        documentList.emptyFolderTemplate = {};
        documentList.dataTable = new ng2_alfresco_datatable_1.DataTableComponent(null, null);
        expect(documentList.isEmpty()).toBeTruthy();
        expect(element.querySelector('alfresco-pagination')).toBe(null);
    });
    it('should set row filter and reload contents if currentFolderId is set when setting rowFilter', function () {
        var filter = {};
        documentList.currentFolderId = 'id';
        spyOn(documentList.data, 'setFilter').and.callThrough();
        spyOn(documentListService, 'getFolder');
        documentList.ngOnChanges({ rowFilter: new core_1.SimpleChange(null, filter, true) });
        expect(documentList.data.setFilter).toHaveBeenCalledWith(filter);
        expect(documentListService.getFolder).toHaveBeenCalled();
    });
    it('should NOT reload contents if currentFolderId is NOT set when setting rowFilter', function () {
        documentList.currentFolderId = null;
        spyOn(documentListService, 'getFolder');
        documentList.ngOnChanges({ rowFilter: new core_1.SimpleChange(null, {}, true) });
        expect(documentListService.getFolder).not.toHaveBeenCalled();
    });
    it('should set image resolver for underlying adapter', function () {
        var resolver = {};
        spyOn(documentList.data, 'setImageResolver').and.callThrough();
        documentList.ngOnChanges({ imageResolver: new core_1.SimpleChange(null, resolver, true) });
        expect(documentList.data.setImageResolver).toHaveBeenCalledWith(resolver);
    });
    it('should emit [nodeClick] event on row click', function () {
        var node = new document_library_model_1.NodeMinimalEntry();
        spyOn(documentList, 'onNodeClick').and.callThrough();
        documentList.onNodeClick(node);
        expect(documentList.onNodeClick).toHaveBeenCalledWith(node);
    });
    it('should emit node-click DOM event', function (done) {
        var node = new document_library_model_1.NodeMinimalEntry();
        var htmlElement = fixture.debugElement.nativeElement;
        htmlElement.addEventListener('node-click', function (e) {
            done();
        });
        documentList.onNodeClick(node);
    });
    it('should emit [nodeDblClick] event on row double-click', function () {
        var node = new document_library_model_1.NodeMinimalEntry();
        spyOn(documentList, 'onNodeDblClick').and.callThrough();
        documentList.onNodeDblClick(node);
        expect(documentList.onNodeDblClick).toHaveBeenCalledWith(node);
    });
    it('should emit node-dblclick DOM event', function (done) {
        var node = new document_library_model_1.NodeMinimalEntry();
        var htmlElement = fixture.debugElement.nativeElement;
        htmlElement.addEventListener('node-dblclick', function (e) {
            done();
        });
        documentList.onNodeDblClick(node);
    });
    it('should load folder by ID on init', function () {
        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        spyOn(documentList, 'loadFolderNodesByFolderNodeId').and.returnValue(Promise.resolve());
        documentList.ngOnChanges({ folderNode: new core_1.SimpleChange(null, documentList.currentFolderId, true) });
        expect(documentList.loadFolderNodesByFolderNodeId).toHaveBeenCalled();
    });
    it('should emit error when getFolderNode fails', function (done) {
        var error = { message: '{ "error": { "statusCode": 501 } }' };
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.reject(error));
        documentList.error.subscribe(function (val) {
            expect(val).toBe(error);
            done();
        });
        documentList.loadFolderByNodeId('123');
    });
    it('should emit error when loadFolderNodesByFolderNodeId fails', function (done) {
        var error = { message: '{ "error": { "statusCode": 501 } }' };
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(document_list_component_mock_1.fakeNodeWithCreatePermission));
        spyOn(documentList, 'loadFolderNodesByFolderNodeId').and.returnValue(Promise.reject(error));
        documentList.error.subscribe(function (val) {
            expect(val).toBe(error);
            done();
        });
        documentList.loadFolderByNodeId('123');
    });
    it('should set no permision when getFolderNode fails with 403', function (done) {
        var error = { message: '{ "error": { "statusCode": 403 } }' };
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.reject(error));
        documentList.error.subscribe(function (val) {
            expect(val).toBe(error);
            expect(documentList.noPermission).toBe(true);
            done();
        });
        documentList.loadFolderByNodeId('123');
    });
    xit('should load previous page if there are no other elements in multi page table', function (done) {
        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.folderNode = new document_library_model_1.NodeMinimal();
        documentList.folderNode.id = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.skipCount = 5;
        documentList.pageSize = 5;
        spyOn(documentList, 'isPaginationEnabled').and.returnValue(true);
        documentList.reload();
        fixture.detectChanges();
        documentList.ready.subscribe(function () {
            fixture.detectChanges();
            var rowElement = element.querySelector('[data-automation-id="b_txt_file.rtf"]');
            expect(rowElement).toBeDefined();
            expect(rowElement).not.toBeNull();
            done();
        });
        jasmine.Ajax.requests.at(0).respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(document_list_component_mock_1.fakeNodeAnswerWithNOEntries)
        });
        jasmine.Ajax.requests.at(1).respondWith({
            status: 200,
            contentType: 'application/json',
            responseText: JSON.stringify(document_list_component_mock_1.fakeNodeAnswerWithEntries)
        });
    });
    it('should return true if current folder node has create permission', function (done) {
        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.folderNode = new document_library_model_1.NodeMinimal();
        documentList.folderNode.id = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.skipCount = 5;
        documentList.pageSize = 5;
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(document_list_component_mock_1.fakeNodeWithCreatePermission));
        spyOn(documentListService, 'getFolder').and.returnValue(Promise.resolve(document_list_component_mock_1.fakeNodeAnswerWithNOEntries));
        var change = new core_1.SimpleChange(null, '1d26e465-dea3-42f3-b415-faa8364b9692', true);
        documentList.ngOnChanges({ 'currentFolderId': change });
        fixture.detectChanges();
        fixture.whenStable().then(function () {
            fixture.detectChanges();
            expect(documentList.hasCreatePermission()).toBeTruthy();
            done();
        });
    });
    it('should return false if navigate to a folder with no create permission', function (done) {
        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.folderNode = new document_library_model_1.NodeMinimal();
        documentList.folderNode.id = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.skipCount = 5;
        documentList.pageSize = 5;
        spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(document_list_component_mock_1.fakeNodeWithNoPermission));
        spyOn(documentListService, 'getFolder').and.returnValue(Promise.resolve(document_list_component_mock_1.fakeNodeAnswerWithNOEntries));
        documentList.loadFolder();
        var clickedFolderNode = new document_library_model_mock_1.FolderNode('fake-folder-node');
        documentList.onNodeDblClick(clickedFolderNode);
        fixture.detectChanges();
        fixture.whenStable().then(function () {
            expect(documentList.hasCreatePermission()).toBeFalsy();
            done();
        });
    });
    it('should not perform navigation for virtual sources', function () {
        var sources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-'];
        var node = new document_library_model_mock_1.FolderNode('folder');
        documentList.currentFolderId = 'node-id';
        expect(documentList.canNavigateFolder(node)).toBeTruthy();
        sources.forEach(function (source) {
            documentList.currentFolderId = source;
            expect(documentList.canNavigateFolder(node)).toBeFalsy();
        });
    });
    it('should fetch trashcan', function () {
        spyOn(apiService.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve(null));
        documentList.loadFolderByNodeId('-trashcan-');
        expect(apiService.nodesApi.getDeletedNodes).toHaveBeenCalled();
    });
    it('should emit error when fetch trashcan fails', function (done) {
        spyOn(apiService.nodesApi, 'getDeletedNodes').and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-trashcan-');
    });
    it('should fetch shared links', function () {
        var sharedlinksApi = apiService.getInstance().core.sharedlinksApi;
        spyOn(sharedlinksApi, 'findSharedLinks').and.returnValue(Promise.resolve(null));
        documentList.loadFolderByNodeId('-sharedlinks-');
        expect(sharedlinksApi.findSharedLinks).toHaveBeenCalled();
    });
    it('should emit error when fetch shared links fails', function (done) {
        spyOn(apiService.getInstance().core.sharedlinksApi, 'findSharedLinks')
            .and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-sharedlinks-');
    });
    it('should fetch sites', function () {
        var sitesApi = apiService.getInstance().core.sitesApi;
        spyOn(sitesApi, 'getSites').and.returnValue(Promise.resolve(null));
        documentList.loadFolderByNodeId('-sites-');
        expect(sitesApi.getSites).toHaveBeenCalled();
    });
    it('should emit error when fetch sites fails', function (done) {
        spyOn(apiService.getInstance().core.sitesApi, 'getSites')
            .and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-sites-');
    });
    it('should fetch user membership sites', function () {
        var peopleApi = apiService.getInstance().core.peopleApi;
        spyOn(peopleApi, 'getSiteMembership').and.returnValue(Promise.resolve());
        documentList.loadFolderByNodeId('-mysites-');
        expect(peopleApi.getSiteMembership).toHaveBeenCalled();
    });
    it('should emit error when fetch membership sites fails', function (done) {
        spyOn(apiService.getInstance().core.peopleApi, 'getSiteMembership')
            .and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-mysites-');
    });
    it('should fetch favorites', function () {
        var favoritesApi = apiService.getInstance().core.favoritesApi;
        spyOn(favoritesApi, 'getFavorites').and.returnValue(Promise.resolve(null));
        documentList.loadFolderByNodeId('-favorites-');
        expect(favoritesApi.getFavorites).toHaveBeenCalled();
    });
    it('should emit error when fetch favorites fails', function (done) {
        spyOn(apiService.getInstance().core.favoritesApi, 'getFavorites')
            .and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-favorites-');
    });
    it('should fetch recent', function (done) {
        var person = { entry: { id: 'person ' } };
        spyOn(apiService.peopleApi, 'getPerson').and.returnValue(Promise.resolve(person));
        spyOn(apiService.searchApi, 'search').and.returnValue(Promise.resolve(null));
        documentList.loadFolderByNodeId('-recent-');
        setTimeout(function () {
            expect(apiService.peopleApi.getPerson).toHaveBeenCalledWith('-me-');
            expect(apiService.searchApi.search).toHaveBeenCalled();
            done();
        }, 100);
    });
    it('should emit error when fetch recent fails on getPerson call', function (done) {
        spyOn(apiService.peopleApi, 'getPerson').and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-recent-');
    });
    it('should emit error when fetch recent fails on search call', function (done) {
        var person = { entry: { id: 'person ' } };
        spyOn(apiService.peopleApi, 'getPerson').and.returnValue(Promise.resolve(person));
        spyOn(apiService.searchApi, 'search').and.returnValue(Promise.reject('error'));
        documentList.error.subscribe(function (val) {
            expect(val).toBe('error');
            done();
        });
        documentList.loadFolderByNodeId('-recent-');
    });
    it('should switch to another page', function () {
        spyOn(documentList, 'reload').and.stub();
        var page1 = {
            maxItems: 5,
            skipCount: 0
        };
        var page2 = {
            maxItems: 5,
            skipCount: 10
        };
        documentList.onChangePageNumber(page1);
        expect(documentList.pageSize).toBe(page1.maxItems);
        expect(documentList.skipCount).toBe(page1.skipCount);
        documentList.onChangePageNumber(page2);
        expect(documentList.pageSize).toBe(page2.maxItems);
        expect(documentList.skipCount).toBe(page2.skipCount);
        expect(documentList.reload).toHaveBeenCalledTimes(2);
    });
    it('should reset pagination when switching sources', function () {
        spyOn(documentList, 'resetPagination').and.callThrough();
        documentList.ngOnChanges({ currentFolderId: new core_1.SimpleChange(null, '-trashcan-', false) });
        documentList.ngOnChanges({ currentFolderId: new core_1.SimpleChange(null, '-sites-', false) });
        expect(documentList.resetPagination).toHaveBeenCalledTimes(2);
    });
    it('should reset folder node upon changing current folder id', function () {
        documentList.folderNode = {};
        documentList.ngOnChanges({ currentFolderId: new core_1.SimpleChange(null, '-sites-', false) });
        expect(documentList.folderNode).toBeNull();
    });
    it('should fallback to first page size supported', function () {
        userPreferences.paginationSize = 10;
        appConfig.config = Object.assign(appConfig.config, {
            'document-list': {
                supportedPageSizes: [20, 30, 40]
            }
        });
        var customFixture = testing_1.TestBed.createComponent(document_list_component_1.DocumentListComponent);
        var component = customFixture.componentInstance;
        customFixture.detectChanges();
        expect(component.supportedPageSizes).toEqual([20, 30, 40]);
        expect(component.pageSize).toBe(20);
    });
});
