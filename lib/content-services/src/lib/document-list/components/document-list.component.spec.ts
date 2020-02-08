/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, QueryList } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { setupTestBed, AlfrescoApiService, DataColumnListComponent, DataColumnComponent, DataColumn, DataTableComponent } from '@alfresco/adf-core';
import { Subject, of, throwError } from 'rxjs';
import {
    FileNode, FolderNode,
    fakeNodeAnswerWithNOEntries,
    fakeNodeWithNoPermission,
    fakeGetSitesAnswer,
    fakeGetSiteMembership
} from '../../mock';
import { ContentActionModel } from '../models/content-action.model';
import { NodeMinimal, NodeMinimalEntry, NodePaging } from '../models/document-library.model';
import { ImageResolver } from './../data/image-resolver.model';
import { RowFilter } from './../data/row-filter.model';

import { DocumentListService } from './../services/document-list.service';
import { CustomResourcesService } from './../services/custom-resources.service';
import { DocumentListComponent } from './document-list.component';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { NodeEntry } from '@alfresco/js-api';
import { By } from '@angular/platform-browser';

describe('DocumentList', () => {

    let documentList: DocumentListComponent;
    let documentListService: DocumentListService;
    let apiService: AlfrescoApiService;
    let customResourcesService: CustomResourcesService;
    let fixture: ComponentFixture<DocumentListComponent>;
    let element: HTMLElement;
    let eventMock: any;
    let spyGetSites: any;
    let spyFavorite: any;
    let spyFolder: any;
    let spyFolderNode: any;

    setupTestBed({
        imports: [ContentTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        eventMock = {
            preventDefault: function () {
            }
        };

        fixture = TestBed.createComponent(DocumentListComponent);

        element = fixture.nativeElement;
        documentList = fixture.componentInstance;
        documentListService = TestBed.get(DocumentListService);
        apiService = TestBed.get(AlfrescoApiService);
        customResourcesService = TestBed.get(CustomResourcesService);

        spyFolder = spyOn(documentListService, 'getFolder').and.callFake(() => {
            return Promise.resolve({ list: {} });
        });

        spyFolderNode = spyOn(documentListService, 'getFolderNode').and.callFake(() => {
            return Promise.resolve({ entry: {} });
        });

        spyOn(apiService.nodesApi, 'getNode').and.callFake(() => {
            return Promise.resolve({ entry: {} });
        });

        documentList.ngOnInit();
        documentList.currentFolderId = 'no-node';

        spyGetSites = spyOn(apiService.sitesApi, 'getSites').and.returnValue(Promise.resolve(fakeGetSitesAnswer));
        spyFavorite = spyOn(apiService.favoritesApi, 'getFavorites').and.returnValue(Promise.resolve({ list: { entries: [] } }));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should update schema if columns change', fakeAsync(() => {
        documentList.columnList = new DataColumnListComponent();
        documentList.columnList.columns = new QueryList<DataColumnComponent>();

        spyOn(documentList.data, 'setColumns').and.callThrough();

        documentList.ngAfterContentInit();
        documentList.columnList.columns.reset([new DataColumnComponent()]);
        documentList.columnList.columns.notifyOnChanges();

        tick(100);

        expect(documentList.data.setColumns).toHaveBeenCalled();
    }));

    it('should setup default columns', () => {
        fixture.detectChanges();
        documentList.ngAfterContentInit();

        expect(documentList.data.getColumns().length).not.toBe(0);
    });

    it('should add the custom columns', () => {
        fixture.detectChanges();

        const column = <DataColumn> {
            title: 'title',
            key: 'source',
            cssClass: 'css',
            srTitle: '',
            type: 'text',
            format: ''
        };

        const columns = documentList.data.getColumns();
        columns.push(column);

        documentList.ngAfterContentInit();
        expect(columns.length).toBe(6);
        expect(columns[5]).toBe(column);
    });

    it('should call action handler with node', () => {
        const node = new FileNode();
        const action = new ContentActionModel();
        action.handler = () => {
        };

        spyOn(action, 'handler').and.stub();

        documentList.executeContentAction(node, action);
        expect(action.handler).toHaveBeenCalledWith(node, documentList, undefined);

    });

    it('should call action handler with node and permission', () => {
        const node = new FileNode();
        const action = new ContentActionModel();
        action.handler = () => {
        };
        action.permission = 'fake-permission';
        spyOn(action, 'handler').and.stub();

        documentList.executeContentAction(node, action);

        expect(action.handler).toHaveBeenCalledWith(node, documentList, 'fake-permission');
    });

    it('should call action execute with node if it is defined', () => {
        const node = new FileNode();
        const action = new ContentActionModel();
        action.execute = () => {
        };
        spyOn(action, 'execute').and.stub();

        documentList.executeContentAction(node, action);

        expect(action.execute).toHaveBeenCalledWith(node);
    });

    it('should call action execute only after the handler has been executed', () => {
        const deleteObservable: Subject<any> = new Subject<any>();
        const node = new FileNode();
        const action = new ContentActionModel();
        action.handler = () => deleteObservable;
        action.execute = () => {
        };
        spyOn(action, 'execute').and.stub();

        documentList.executeContentAction(node, action);

        expect(action.execute).not.toHaveBeenCalled();
        deleteObservable.next();
        expect(action.execute).toHaveBeenCalledWith(node);
    });

    it('should show the loading state during the loading of new elements', () => {
        documentList.ngOnInit();
        documentList.ngAfterContentInit();
        documentList.node = new NodePaging();

        fixture.detectChanges();
        expect(element.querySelector('.adf-document-list-loading')).toBeDefined();
    });

    it('should hide the header if showHeader is false', () => {
        documentList.showHeader = false;

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should show the header if showHeader is true', () => {
        documentList.showHeader = true;

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBeDefined();
    });

    it('should reset selection upon reload', () => {
        documentList.currentFolderId = 'id-folder';
        spyOn(documentList, 'resetSelection').and.callThrough();

        documentList.reload();
        fixture.detectChanges();

        expect(documentList.resetSelection).toHaveBeenCalled();
    });

    it('should use the cardview style if cardview is true', () => {
        documentList.display = 'gallery';

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-card')).toBeDefined();
    });

    it('should use the base document list style if cardview is false', () => {
        documentList.display = 'list';

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-card')).toBe(null);
        expect(element.querySelector('.adf-datatable')).toBeDefined();
    });

    it('should reset selection upon reload', () => {
        documentList.currentFolderId = 'id-folder';
        spyOn(documentList, 'resetSelection').and.callThrough();

        documentList.reload();
        fixture.detectChanges();

        expect(documentList.resetSelection).toHaveBeenCalled();
    });

    it('should reset when a parameter changes', () => {
        spyOn(documentList.dataTable, 'resetSelection').and.callThrough();

        documentList.ngOnChanges({});
        expect(documentList.dataTable.resetSelection).toHaveBeenCalled();
    });

    it('should empty template be present when no element are present', () => {
        spyOn(documentList, 'loadFolder').and.callThrough();
        spyFolderNode.and.returnValue(of({ entry: { id: 'fake-node' } }));
        spyFolder.and.returnValue(of(fakeNodeAnswerWithNOEntries));

        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        fixture.detectChanges();

        documentList.reload();
        expect(element.querySelector('#adf-document-list-empty')).toBeDefined();
    });

    it('should not execute action without node provided', () => {
        const action = new ContentActionModel();
        action.handler = function () {
        };

        spyOn(action, 'handler').and.stub();
        documentList.executeContentAction(null, action);
        expect(action.handler).not.toHaveBeenCalled();
    });

    it('should not give node actions for empty target', () => {
        const actions = documentList.getNodeActions(null);
        expect(actions.length).toBe(0);
    });

    it('should filter content actions for various targets', () => {
        const folderMenu = new ContentActionModel();
        folderMenu.target = 'folder';

        const documentMenu = new ContentActionModel();
        documentMenu.target = 'document';

        documentList.actions = [
            folderMenu,
            documentMenu
        ];

        let actions = documentList.getNodeActions(new FolderNode());
        expect(actions.length).toBe(1);
        expect(actions[0].target).toBe(folderMenu.target);

        actions = documentList.getNodeActions(new FileNode());
        expect(actions.length).toBe(1);
        expect(actions[0].target).toBe(documentMenu.target);
    });

    it('should disable the action if there is no permission for the file and disableWithNoPermission true', () => {
        documentList.currentFolderId = 'fake-node-id';
        const documentMenu = new ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: ['create', 'update'] } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBe(true);

    });

    it('should not display hidden content actions', () => {
        documentList.actions = [
            new ContentActionModel({
                target: 'document',
                title: 'Action1',
                visible: false
            }),
            new ContentActionModel({
                target: 'document',
                title: 'Action2',
                visible: true
            })
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz' } };
        const actions = documentList.getNodeActions(nodeFile);

        expect(actions.length).toBe(1);
        expect(actions[0].title).toBe('Action2');
    });

    it('should evaluate conditional visibility for content actions', () => {
        documentList.actions = [
            new ContentActionModel({
                target: 'document',
                title: 'Action1',
                visible: (): boolean => true
            }),
            new ContentActionModel({
                target: 'document',
                title: 'Action2',
                visible: (): boolean => false
            })
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz' } };
        const actions = documentList.getNodeActions(nodeFile);

        expect(actions.length).toBe(1);
        expect(actions[0].title).toBe('Action1');
    });

    it('should evaluate conditional disabled state for content action', () => {
        documentList.actions = [
            new ContentActionModel({
                target: 'document',
                title: 'Action1',
                disabled: (): boolean => true
            }),
            new ContentActionModel({
                target: 'document',
                title: 'Action2',
                disabled: (): boolean => false
            })
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz' } };
        const actions = documentList.getNodeActions(nodeFile);

        expect(actions.length).toBe(2);
        expect(actions[0].disabled).toBeTruthy();
        expect(actions[1].disabled).toBeFalsy();
    });

    it('should not disable the action if there is copy permission', () => {
        const documentMenu = new ContentActionModel({
            disableWithNoPermission: true,
            permission: 'copy',
            target: 'document',
            title: 'FileAction'
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: ['create', 'update'] } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeFalsy();

    });

    it('should disable the action if there is no permission for the folder and disableWithNoPermission true', () => {
        const documentMenu = new ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction'
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: ['create', 'update'] } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBe(true);

    });

    it('should not disable the action if there is the right permission for the file', () => {
        const documentMenu = new ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: ['create', 'update', 'delete'] } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeFalsy();
    });

    it('should disable the action if a readonly lock is applied to the file', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = {
            entry: {
                isFile: true,
                name: 'xyz',
                isLocked: true,
                allowableOperations: ['create', 'update', 'delete'],
                properties: { 'cm:lockType': 'READ_ONLY_LOCK', 'cm:lockLifetime': 'PERSISTENT' }
            }
        };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeTruthy();
    });

    it('should not disable the action for the lock owner if write lock is applied', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });

        spyOn(apiService.getInstance(), 'getEcmUsername').and.returnValue('lockOwner');

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = {
            entry: {
                isFile: true,
                name: 'xyz',
                isLocked: true,
                allowableOperations: ['create', 'update', 'delete'],
                properties: {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lockOwner', displayName: 'lockOwner' }
                }
            }
        };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeFalsy();
    });

    it('should disable the action if write lock is applied and user is not the lock owner', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'document',
            title: 'FileAction'
        });

        spyOn(apiService.getInstance(), 'getEcmUsername').and.returnValue('jerryTheKillerCow');

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = {
            entry: {
                isFile: true,
                name: 'xyz',
                isLocked: true,
                allowableOperations: ['create', 'update', 'delete'],
                properties: {
                    'cm:lockType': 'WRITE_LOCK',
                    'cm:lockLifetime': 'PERSISTENT',
                    'cm:lockOwner': { id: 'lockOwner', displayName: 'lockOwner' }
                }
            }
        };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeTruthy();
    });

    it('should not disable the action if there is the right permission for the folder', () => {
        const documentMenu = new ContentActionModel({
            disableWithNoPermission: true,
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction'
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = {
            entry: {
                isFolder: true,
                name: 'xyz',
                allowableOperations: ['create', 'update', 'delete']
            }
        };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBeFalsy();
    });

    it('should not disable the action if there are no permissions for the file and disable with no permission is false', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'document',
            title: 'FileAction',
            disableWithNoPermission: false
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: null } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeFalsy();
    });

    it('should not disable the action if there are no permissions for the folder and disable with no permission is false', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction',
            disableWithNoPermission: false
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: null } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBeFalsy();
    });

    it('should disable the action if there are no permissions for the file and disable with no permission is true', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'document',
            title: 'FileAction',
            disableWithNoPermission: true
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFile: true, name: 'xyz', allowableOperations: null } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FileAction');
        expect(actions[0].disabled).toBeDefined();
        expect(actions[0].disabled).toBeTruthy();
    });

    it('should disable the action if there are no permissions for the folder and disable with no permission is true', () => {
        const documentMenu = new ContentActionModel({
            permission: 'delete',
            target: 'folder',
            title: 'FolderAction',
            disableWithNoPermission: true
        });

        documentList.actions = [
            documentMenu
        ];

        const nodeFile = { entry: { isFolder: true, name: 'xyz', allowableOperations: null } };

        const actions = documentList.getNodeActions(nodeFile);
        expect(actions.length).toBe(1);
        expect(actions[0].title).toEqual('FolderAction');
        expect(actions[0].disabled).toBeDefined();
        expect(actions[0].disabled).toBeTruthy();
    });

    it('should find no content actions', () => {
        const documentButton = new ContentActionModel();
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
        const node = new FileNode();
        const disposableClick = documentList.nodeClick.subscribe((e) => {
            expect(e.value).toBe(node);
            disposableClick.unsubscribe();
            done();
        });
        documentList.onNodeClick(node);
    });

    it('should display folder content on click', () => {
        const node = new FolderNode('<display name>');

        spyOn(documentList, 'loadFolder').and.returnValue(Promise.resolve(true));

        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(node);

        expect(documentList.loadFolder).toHaveBeenCalled();
    });

    it('should not display folder content when no target node provided', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'loadFolder').and.stub();

        documentList.onNodeClick(null);
        expect(documentList.loadFolder).not.toHaveBeenCalled();

    });

    it('should display folder content only on folder node click', () => {
        expect(documentList.navigate).toBe(true);
        spyOn(documentList, 'loadFolder').and.stub();

        const node = new FileNode();
        documentList.onNodeClick(node);

        expect(documentList.loadFolder).not.toHaveBeenCalled();
    });

    it('should not display folder content on click when navigation is off', () => {
        spyOn(documentList, 'loadFolder').and.stub();

        const node = new FolderNode('<display name>');
        documentList.navigate = false;
        documentList.onNodeClick(node);

        expect(documentList.loadFolder).not.toHaveBeenCalled();
    });

    it('should execute context action on callback', () => {
        const action = {
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
        spyOn(documentList, 'loadFolder').and.stub();
        spyOn(documentList, 'contextActionCallback').and.stub();
        const value = {};
        documentList.ngOnInit();
        documentList.contextActionHandler.next(value);
        expect(documentList.contextActionCallback).toHaveBeenCalledWith(value);
    });

    it('should suppress default context menu', () => {
        documentList.contextMenuActions = true;
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onShowContextMenu(eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
    });

    it('should not suppress default context menu', () => {
        documentList.contextMenuActions = false;
        spyOn(eventMock, 'preventDefault').and.stub();
        documentList.onShowContextMenu(eventMock);
        expect(eventMock.preventDefault).not.toHaveBeenCalled();
    });

    it('should emit file preview event on single click', (done) => {
        const file = new FileNode();
        const disposablePreview = documentList.preview.subscribe((e) => {
            expect(e.value).toBe(file);
            disposablePreview.unsubscribe();
            done();
        });
        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(file);
    });

    it('should emit file preview event on double click', (done) => {
        const file = new FileNode();
        const disposablePreview = documentList.preview.subscribe((e) => {
            expect(e.value).toBe(file);
            disposablePreview.unsubscribe();
            done();
        });
        documentList.navigationMode = DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
    });

    it('should perform folder navigation on single click', () => {
        const folder = new FolderNode();
        spyOn(documentList, 'navigateTo').and.stub();

        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);
        expect(documentList.navigateTo).toHaveBeenCalled();
    });

    it('should perform folder navigation on double click', () => {
        const folder = new FolderNode();
        spyOn(documentList, 'navigateTo').and.stub();

        documentList.navigationMode = DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);
        expect(documentList.navigateTo).toHaveBeenCalled();
    });

    it('should not perform folder navigation on double click when single mode', () => {
        const folder = new FolderNode();
        spyOn(documentList, 'navigateTo').and.stub();

        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);

        expect(documentList.navigateTo).not.toHaveBeenCalled();
    });

    it('should not perform folder navigation on double click when navigation off', () => {
        const folder = new FolderNode();
        spyOn(documentList, 'navigateTo').and.stub();

        documentList.navigate = false;
        documentList.navigationMode = DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);

        expect(documentList.navigateTo).not.toHaveBeenCalled();
    });

    it('should perform navigation for folder node only', () => {
        const folder = new FolderNode();
        const file = new FileNode();

        spyOn(documentList, 'loadFolder').and.stub();

        expect(documentList.navigateTo(folder.entry)).toBeTruthy();
        expect(documentList.navigateTo(file.entry)).toBeFalsy();
        expect(documentList.navigateTo(null)).toBeFalsy();
    });

    it('should perform navigation through corret linked folder', () => {
        const linkFolder = new FolderNode();
        linkFolder.entry.id = 'link-folder';
        linkFolder.entry.nodeType = 'app:folderlink';
        linkFolder.entry.properties['cm:destination'] = 'normal-folder';

        spyOn(documentList, 'loadFolder').and.stub();

        expect(documentList.navigateTo(linkFolder.entry)).toBeTruthy();
        expect(documentList.currentFolderId).toBe('normal-folder');
    });

    it('should require valid node for file preview', () => {
        const file = new FileNode();
        file.entry = null;
        let called = false;

        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.preview.subscribe(() => called = true);

        documentList.onNodeClick(file);
        expect(called).toBeFalsy();

        documentList.navigationMode = DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(file);
        expect(called).toBeFalsy();
    });

    it('should require valid node for folder navigation', () => {
        const folder = new FolderNode();
        folder.entry = null;
        spyOn(documentList, 'navigateTo').and.stub();

        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.onNodeClick(folder);

        documentList.navigationMode = DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.onNodeDblClick(folder);

        expect(documentList.navigateTo).not.toHaveBeenCalled();
    });

    it('should display folder content from loadFolder on reload if folderNode defined', () => {
        documentList.folderNode = new NodeMinimal();

        spyOn(documentList, 'loadFolder').and.callThrough();
        documentList.reload();
        expect(documentList.loadFolder).toHaveBeenCalled();
    });

    it('should display folder content from loadFolderByNodeId on reload if currentFolderId defined', () => {
        documentList.currentFolderId = 'id-folder';
        spyOn(documentList, 'loadFolder').and.stub();
        documentList.reload();
        expect(documentList.loadFolder).toHaveBeenCalled();
    });

    it('should require node to resolve context menu actions', () => {
        expect(documentList.getContextActions(null)).toBeNull();

        const file = new FileNode();
        file.entry = null;

        expect(documentList.getContextActions(file)).toBeNull();
    });

    it('should fetch context menu actions for a file node', () => {
        const actionModel: any = {};
        spyOn(documentList, 'getNodeActions').and.returnValue([actionModel]);

        const file = new FileNode();
        const actions = documentList.getContextActions(file);

        expect(documentList.getNodeActions).toHaveBeenCalledWith(file);
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(file);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });

    it('should fetch context menu actions for a folder node', () => {
        const actionModel: any = {};
        spyOn(documentList, 'getNodeActions').and.returnValue([actionModel]);

        const folder = new FolderNode();
        const actions = documentList.getContextActions(folder);

        expect(documentList.getNodeActions).toHaveBeenCalledWith(folder);
        expect(actions.length).toBe(1);
        expect(actions[0].model).toBe(actionModel);
        expect(actions[0].node).toBe(folder);
        expect(actions[0].subject).toBe(documentList.contextActionHandler);
    });

    it('should fetch no context menu actions for unknown type', () => {
        spyOn(documentList, 'getNodeActions').and.stub();

        const node = new FileNode();
        node.entry.isFile = false;
        node.entry.isFolder = false;

        const actions = documentList.getContextActions(node);
        expect(actions).toBeNull();
    });

    it('should return null value when no content actions found', () => {
        spyOn(documentList, 'getNodeActions').and.returnValue([]);

        const file = new FileNode();
        const actions = documentList.getContextActions(file);

        expect(actions).toBeNull();
        expect(documentList.getNodeActions).toHaveBeenCalled();
    });

    it('should enforce single-click on mobile browser', () => {
        spyOn(documentList, 'isMobile').and.returnValue(true);
        documentList.navigationMode = DocumentListComponent.DOUBLE_CLICK_NAVIGATION;
        documentList.ngOnInit();
        expect(documentList.isMobile).toHaveBeenCalled();
        expect(documentList.navigationMode).toBe(DocumentListComponent.SINGLE_CLICK_NAVIGATION);
    });

    it('should display [empty folder] template ', () => {
        fixture.detectChanges();
        documentList.dataTable = new DataTableComponent(null, null);
        expect(documentList.dataTable).toBeDefined();
        expect(fixture.debugElement.query(By.css('adf-empty-list'))).not.toBeNull();
    });

    it('should display no permission template when the user has no permission', () => {
        documentList.noPermission = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.adf-no-permission__template'))).not.toBeNull();
    });

    it('should display loading template when data is loading', () => {
        documentList.loading = true;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('mat-progress-spinner'))).not.toBeNull();
    });

    it('should empty folder NOT show the pagination', () => {
        documentList.dataTable = new DataTableComponent(null, null);

        expect(documentList.isEmpty()).toBeTruthy();
        expect(element.querySelector('alfresco-pagination')).toBe(null);
    });

    it('should set row filter and reload contents if currentFolderId is set when setting rowFilter', () => {
        fixture.detectChanges();
        const filter = <RowFilter> {};
        documentList.currentFolderId = 'id';
        spyOn(documentList.data, 'setFilter').and.callThrough();

        documentList.rowFilter = filter;

        expect(documentList.data.setFilter).toHaveBeenCalledWith(filter);
        expect(spyFolder).toHaveBeenCalled();
    });

    it('should NOT reload contents if currentFolderId is NOT set when setting rowFilter', () => {
        spyFolder.calls.reset();
        documentList.currentFolderId = null;

        documentList.ngOnChanges({ rowFilter: new SimpleChange(null, <RowFilter> {}, true) });

        expect(spyFolder).not.toHaveBeenCalled();
    });

    it('should set image resolver for underlying adapter', () => {
        fixture.detectChanges();
        const resolver = <ImageResolver> {};
        spyOn(documentList.data, 'setImageResolver').and.callThrough();

        documentList.ngOnChanges({ imageResolver: new SimpleChange(null, resolver, true) });

        expect(documentList.data.setImageResolver).toHaveBeenCalledWith(resolver);
    });

    it('should emit [nodeClick] event on row click', () => {
        const node = new NodeMinimalEntry();

        spyOn(documentList, 'onNodeClick').and.callThrough();
        documentList.onNodeClick(node);
        expect(documentList.onNodeClick).toHaveBeenCalledWith(node);
    });

    it('should emit node-click DOM event', (done) => {
        const node = new NodeMinimalEntry();

        document.addEventListener('node-click', () => {
            done();
        });

        documentList.onNodeClick(node);
    });

    it('should emit [nodeDblClick] event on row double-click', () => {
        const node = new NodeMinimalEntry();

        spyOn(documentList, 'onNodeDblClick').and.callThrough();
        documentList.onNodeDblClick(node);
        expect(documentList.onNodeDblClick).toHaveBeenCalledWith(node);
    });

    it('should emit node-dblclick DOM event', (done) => {
        const node = new NodeMinimalEntry();

        document.addEventListener('node-dblclick', () => {
            done();
        });

        documentList.onNodeDblClick(node);
    });

    it('should load folder by ID on init', () => {
        spyOn(documentList, 'loadFolder').and.returnValue(Promise.resolve());

        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';

        fixture.detectChanges();

        expect(documentList.loadFolder).toHaveBeenCalled();
    });

    it('should emit error when getFolderNode fails', (done) => {
        const error = { message: '{ "error": { "statusCode": 501 } }' };
        spyFolder.and.returnValue(throwError(error));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe(error);
            disposableError.unsubscribe();
            done();
        });
        documentList.currentFolderId = '123';
        documentList.loadFolder();
    });

    it('should emit folderChange event when a folder node is clicked', (done) => {
        spyOn(documentList, 'reload').and.stub();

        documentList.folderChange.subscribe((folderNode) => {
            expect(folderNode.value.id).toBe('fake-node');
            done();
        });
        documentList.onNodeDblClick(new NodeEntry({ entry: { id: 'fake-node', isFolder: true } }));
    });

    it('should set no permission when getFolderNode fails with 403', (done) => {
        const error = { message: '{ "error": { "statusCode": 403 } }' };
        spyFolder.and.returnValue(throwError(error));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe(error);
            expect(documentList.noPermission).toBe(true);
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '123';
        documentList.loadFolder();
    });

    it('should reset noPermission upon reload', () => {
        documentList.currentFolderId = 'fake-node-id';
        documentList.noPermission = true;
        fixture.detectChanges();

        documentList.reload();
        fixture.detectChanges();

        expect(documentList.noPermission).toBeFalsy();
    });

    it('should reload contents if node data changes after previously got noPermission error', () => {
        fixture.detectChanges();
        spyOn(documentList.data, 'loadPage').and.callThrough();

        documentList.noPermission = true;
        fixture.detectChanges();

        documentList.ngOnChanges({ node: new SimpleChange(null, { list: { entities: {} } }, true) });

        expect(documentList.data.loadPage).toHaveBeenCalled();
        expect(documentList.noPermission).toBeFalsy();
    });

    it('should noPermission be true if navigate to a folder with no  permission', () => {
        const error = { message: '{ "error": { "statusCode": 403 } }' };

        documentList.currentFolderId = '1d26e465-dea3-42f3-b415-faa8364b9692';
        documentList.folderNode = new NodeMinimal();
        documentList.folderNode.id = '1d26e465-dea3-42f3-b415-faa8364b9692';

        spyFolderNode.and.returnValue(of({ entry: fakeNodeWithNoPermission }));
        spyFolder.and.returnValue(throwError(error));

        documentList.loadFolder();
        const clickedFolderNode = new FolderNode('fake-folder-node');
        documentList.onNodeDblClick(clickedFolderNode);

        expect(documentList.noPermission).toBeTruthy();
    });

    it('should allow to perform navigation for virtual sources', () => {
        spyFolderNode = spyOn(documentListService, 'loadFolderByNodeId').and.callFake(() => {
            return of({ currentNode: {}, children: { list: { pagination: {} } } });
        });

        const sources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-'];
        const node = new FolderNode('folder');

        documentList.currentFolderId = 'node-id';
        expect(documentList.canNavigateFolder(node.entry)).toBeTruthy();

        sources.forEach((source) => {
            documentList.currentFolderId = source;
            expect(documentList.canNavigateFolder(node.entry)).toBeTruthy();
        });
    });

    it('should fetch trashcan', () => {
        spyOn(apiService.nodesApi, 'getDeletedNodes').and.returnValue(Promise.resolve(null));

        documentList.currentFolderId = '-trashcan-';
        documentList.loadFolder();
        expect(apiService.nodesApi.getDeletedNodes).toHaveBeenCalled();
    });

    it('should emit error when fetch trashcan fails', (done) => {
        spyOn(apiService.nodesApi, 'getDeletedNodes').and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-trashcan-';
        documentList.loadFolder();
    });

    it('should fetch shared links', () => {
        const sharedlinksApi = apiService.getInstance().core.sharedlinksApi;
        spyOn(sharedlinksApi, 'findSharedLinks').and.returnValue(Promise.resolve(null));

        documentList.currentFolderId = '-sharedlinks-';
        documentList.loadFolder();
        expect(sharedlinksApi.findSharedLinks).toHaveBeenCalled();
    });

    it('should emit error when fetch shared links fails', (done) => {
        spyOn(apiService.getInstance().core.sharedlinksApi, 'findSharedLinks')
            .and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-sharedlinks-';
        documentList.loadFolder();
    });

    it('should fetch sites', () => {
        const sitesApi = apiService.getInstance().core.sitesApi;

        documentList.currentFolderId = '-sites-';
        documentList.loadFolder();
        expect(sitesApi.getSites).toHaveBeenCalled();
    });

    it('should emit error when fetch sites fails', (done) => {
        spyGetSites.and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-sites-';
        documentList.loadFolder();
    });

    it('should fetch user membership sites', () => {
        const peopleApi = apiService.getInstance().core.peopleApi;
        spyOn(peopleApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve(fakeGetSiteMembership));

        documentList.currentFolderId = '-mysites-';
        documentList.loadFolder();
        expect(peopleApi.listSiteMembershipsForPerson).toHaveBeenCalled();
    });

    it('should emit error when fetch membership sites fails', (done) => {
        spyOn(apiService.getInstance().core.peopleApi, 'listSiteMembershipsForPerson')
            .and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-mysites-';
        documentList.loadFolder();
    });

    it('should fetch favorites', () => {
        const favoritesApi = apiService.getInstance().core.favoritesApi;

        documentList.currentFolderId = '-favorites-';
        documentList.loadFolder();
        expect(favoritesApi.getFavorites).toHaveBeenCalled();
    });

    it('should emit error when fetch favorites fails', (done) => {
        spyFavorite.and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-favorites-';
        documentList.loadFolder();
    });

    it('should emit error when fetch recent fails on search call', (done) => {
        spyOn(customResourcesService, 'loadFolderByNodeId').and.returnValue(throwError('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-recent-';
        documentList.loadFolder();
    });

    it('should have correct currentFolderId on loading folder by node id', () => {
        documentList.currentFolderId = '12345-some-id-6789';

        const peopleApi = apiService.getInstance().core.peopleApi;
        spyOn(peopleApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve(fakeGetSiteMembership));

        documentList.currentFolderId = '-mysites-';
        documentList.loadFolder();
        expect(documentList.currentFolderId).toBe('-mysites-');
    });

    it('should reload data upon changing pagination settings', () => {
        spyOn(documentList, 'reload').and.stub();

        documentList.maxItems = 0;

        documentList.updatePagination({
            maxItems: 10,
            skipCount: 10
        });

        expect(documentList.reload).toHaveBeenCalled();
    });

    it('should NOT reload data on first call of ngOnChanges', () => {
        spyOn(documentList, 'reload').and.stub();

        const firstChange = true;
        documentList.ngOnChanges({ skipCount: new SimpleChange(undefined, 10, firstChange) });

        expect(documentList.reload).not.toHaveBeenCalled();
    });

    it('should add includeFields in the server request when present', () => {
        documentList.includeFields = ['test-include'];
        documentList.currentFolderId = 'fake-id';

        fixture.detectChanges();

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, {
            where: undefined,
            maxItems: 25,
            skipCount: 0,
            rootFolderId: 'fake-id'
        }, ['test-include']);
    });

    it('should add where in the server request when present', () => {
        documentList.includeFields = ['test-include'];
        documentList.where = '(isFolder=true)';
        documentList.currentFolderId = 'fake-id';

        fixture.detectChanges();

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, {
            where: '(isFolder=true)',
            maxItems: 25,
            skipCount: 0,
            rootFolderId: 'fake-id'
        }, ['test-include']);
    });

    it('should reset the pagination when enter in a new folder', () => {
        const folder = new FolderNode();
        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.updatePagination({
            maxItems: 10,
            skipCount: 10
        });

        documentList.onNodeClick(folder);

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, {
            maxItems: 25,
            skipCount: 0,
            rootFolderId: 'folder-id',
            where: undefined
        }, undefined);
    });
});
