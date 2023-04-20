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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, QueryList, Component, ViewChild, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
    setupTestBed,
    AlfrescoApiService,
    DataColumnListComponent,
    DataColumnComponent,
    DataColumn,
    DataTableComponent,
    DataTableModule,
    ObjectDataTableAdapter,
    ShowHeaderMode,
    ThumbnailService, AppConfigService
} from '@alfresco/adf-core';
import { ContentService } from '../../common/services/content.service';

import { Subject, of, throwError } from 'rxjs';
import {
    FileNode,
    FolderNode,
    fakeNodeAnswerWithNOEntries,
    fakeNodeWithNoPermission,
    fakeGetSitesAnswer,
    fakeGetSiteMembership,
    mockPreselectedNodes,
    mockNodePagingWithPreselectedNodes,
    mockNode1,
    mockNode2,
    mockNode3
} from '../../mock';
import { ContentActionModel } from '../models/content-action.model';
import { NodeMinimal, NodeMinimalEntry, NodePaging } from '../models/document-library.model';
import { ImageResolver } from './../data/image-resolver.model';
import { RowFilter } from './../data/row-filter.model';

import { DocumentListService } from './../services/document-list.service';
import { CustomResourcesService } from './../services/custom-resources.service';
import { DocumentListComponent } from './document-list.component';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { FavoritePaging, NodeEntry } from '@alfresco/js-api';
import { By } from '@angular/platform-browser';
import { DocumentListModule } from '../document-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { ShareDataRow } from '../data/share-data-row.model';
import { DocumentLoaderNode } from '../models/document-folder.model';
import { matIconRegistryMock } from '../../testing/mat-icon-registry-mock';
import { domSanitizerMock } from '../../testing/dom-sanitizer-mock';
import { MatDialog } from '@angular/material/dialog';
import { FileAutoDownloadComponent } from './file-auto-download/file-auto-download.component';

const mockDialog = {
    open: jasmine.createSpy('open')
};

describe('DocumentList', () => {

    let documentList: DocumentListComponent;
    let documentListService: DocumentListService;
    let apiService: AlfrescoApiService;
    let customResourcesService: CustomResourcesService;
    let thumbnailService: ThumbnailService;
    let contentService: ContentService;
    let appConfigService: AppConfigService;
    let fixture: ComponentFixture<DocumentListComponent>;
    let element: HTMLElement;
    let eventMock: any;
    let spyGetSites: any;
    let spyFavorite: any;
    let spyFolder: any;
    let spyFolderNode: any;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
            { provide: MatDialog, useValue: mockDialog }
        ]
    });

    beforeEach(() => {
        eventMock = {
            preventDefault: () => {}
        };

        fixture = TestBed.createComponent(DocumentListComponent);

        element = fixture.nativeElement;
        documentList = fixture.componentInstance;

        documentListService = TestBed.inject(DocumentListService);
        apiService = TestBed.inject(AlfrescoApiService);
        customResourcesService = TestBed.inject(CustomResourcesService);
        thumbnailService = TestBed.inject(ThumbnailService);
        contentService = TestBed.inject(ContentService);
        appConfigService = TestBed.inject(AppConfigService);

        spyFolder = spyOn(documentListService, 'getFolder').and.returnValue(of({ list: {} }));
        spyFolderNode = spyOn(documentListService, 'getFolderNode').and.returnValue(of(new NodeEntry({ entry: {} })));
        spyOn(documentList['nodesApi'], 'getNode').and.returnValue(Promise.resolve(new NodeEntry({ entry: {} })));

        documentList.ngOnInit();
        documentList.currentFolderId = 'no-node';

        spyGetSites = spyOn(customResourcesService.sitesApi, 'listSites').and.returnValue(Promise.resolve(fakeGetSitesAnswer));
        spyFavorite = spyOn(customResourcesService.favoritesApi, 'listFavorites').and.returnValue(Promise.resolve(new FavoritePaging({ list: { entries: [] } })));
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('presets', () => {

        const validatePreset = (keys: string[]) => {
            const columns = documentList.data.getColumns();
            expect(columns.length).toBe(keys.length);

            keys.forEach((key, index) => {
                expect(columns[index].key).toBe(key);
            });
        };

        it('should load -trashcan- preset', async () => {
            documentList.currentFolderId = '-trashcan-';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'name',
                'path',
                'content.sizeInBytes',
                'archivedAt',
                'archivedByUser.displayName'
            ]);
        });

        it('should load -sites- preset', async () => {
            documentList.currentFolderId = '-sites-';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'title',
                'visibility'
            ]);
        });

        it('shuld load -mysites- preset', async () => {
            documentList.currentFolderId = '-mysites-';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'title',
                'visibility'
            ]);
        });

        it('should load -favorites- preset', async () => {
            documentList.currentFolderId = '-favorites-';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'name',
                'path',
                'content.sizeInBytes',
                'modifiedAt',
                'modifiedByUser.displayName'
            ]);
        });

        it('should load -recent- preset', async () => {
            documentList.currentFolderId = '-recent-';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'name',
                'path',
                'content.sizeInBytes',
                'modifiedAt'
            ]);
        });

        it('should load -sharedlinks- preset', async () => {
            documentList.currentFolderId = '-sharedlinks-';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'name',
                'path',
                'content.sizeInBytes',
                'modifiedAt',
                'modifiedByUser.displayName',
                'sharedByUser.displayName'
            ]);
        });

        it('should load default preset', async () => {
            documentList.currentFolderId = 'f5dacdb9-6d07-4fe9-9f2a-dedc21bae603';

            fixture.detectChanges();
            await fixture.whenStable();

            validatePreset([
                '$thumbnail',
                'name',
                'content.sizeInBytes',
                'modifiedAt',
                'modifiedByUser.displayName'
            ]);
        });
    });

    it('should not reset the selection when preselectNodes input changes', () => {
        const resetSelectionSpy = spyOn(documentList, 'resetSelection').and.callThrough();
        documentList.selection = [{ entry: mockNode3 }];
        const changes: SimpleChanges = {
            preselectNodes: {
                previousValue: undefined,
                currentValue: mockPreselectedNodes,
                firstChange: true,
                isFirstChange(): boolean {
                    return this.firstChange;
                }
            }
        };
        documentList.ngOnChanges(changes);

        expect(resetSelectionSpy).not.toHaveBeenCalled();
        expect(documentList.selection).toEqual([{ entry: mockNode3 }]);
    });

    it('should reset the selection for every change other than preselectNodes', () => {
        const resetSelectionSpy = spyOn(documentList, 'resetSelection').and.callThrough();
        documentList.selection = [{ entry: mockNode3 }];
        const changes: SimpleChanges = {
            mockChange: {
                previousValue: undefined,
                currentValue: ['mockChangeValue'],
                firstChange: true,
                isFirstChange(): boolean {
                    return this.firstChange;
                }
            }
        };
        documentList.ngOnChanges(changes);

        expect(resetSelectionSpy).toHaveBeenCalled();
        expect(documentList.selection).toEqual([]);
    });

    it('should reloadWithoutResettingSelection not reset the selection', () => {
        documentList.selection = [{ entry: mockNode3 }];
        documentList.reloadWithoutResettingSelection();

        expect(documentList.selection).toEqual([{ entry: mockNode3 }]);
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

        const column = {
            title: 'title',
            key: 'source',
            cssClass: 'css',
            srTitle: '',
            type: 'text',
            format: ''
        } as DataColumn;

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
        documentList.showHeader = ShowHeaderMode.Data;

        fixture.detectChanges();

        expect(element.querySelector('.adf-datatable-header')).toBe(null);
    });

    it('should show the header if showHeader is true', () => {
        documentList.showHeader = ShowHeaderMode.Data;

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
        action.handler = () => {};

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
                disabled: (node): boolean => node.entry.name === 'custom'
            }),
            new ContentActionModel({
                target: 'document',
                title: 'Action2',
                disabled: (): boolean => false
            })
        ];

        let actions = documentList.getNodeActions({ entry: { id: 1, isFile: true, name: 'xyz' } });

        expect(actions.length).toBe(2);
        expect(actions[0].disabled).toBe(false);
        expect(actions[1].disabled).toBe(false);

        actions = documentList.getNodeActions({ entry: { id: 2, isFile: true, name: 'custom' } });

        expect(actions.length).toBe(2);
        expect(actions[0].disabled).toBe(true);
        expect(actions[1].disabled).toBe(false);
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

        spyOn(documentList, 'loadFolder').and.stub();

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
        documentList.dataTable = new DataTableComponent(null, null, matIconRegistryMock, domSanitizerMock);
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
        documentList.dataTable = new DataTableComponent(null, null, matIconRegistryMock, domSanitizerMock);

        expect(documentList.isEmpty()).toBeTruthy();
        expect(element.querySelector('alfresco-pagination')).toBe(null);
    });

    it('should set row filter and reload contents if currentFolderId is set when setting rowFilter', () => {
        fixture.detectChanges();
        const filter = {} as RowFilter;
        documentList.currentFolderId = 'id';
        spyOn(documentList.data, 'setFilter').and.callThrough();

        documentList.rowFilter = filter;

        expect(documentList.data.setFilter).toHaveBeenCalledWith(filter);
        expect(spyFolder).toHaveBeenCalled();
    });

    it('should NOT reload contents if currentFolderId is NOT set when setting rowFilter', () => {
        spyFolder.calls.reset();
        documentList.currentFolderId = null;

        documentList.ngOnChanges({ rowFilter: new SimpleChange(null, {} as RowFilter, true) });

        expect(spyFolder).not.toHaveBeenCalled();
    });

    it('should set image resolver for underlying adapter', () => {
        fixture.detectChanges();
        const resolver = {} as ImageResolver;
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

    it('should emit node-click DOM event', () => {
        const node = new NodeMinimalEntry();

        document.addEventListener('node-click', (res) => {
            expect(res).toBeDefined();
        });

        documentList.onNodeClick(node);
    });

    it('should emit [nodeDblClick] event on row double-click', () => {
        const node = new NodeMinimalEntry();

        spyOn(documentList, 'onNodeDblClick').and.callThrough();
        documentList.onNodeDblClick(node);
        expect(documentList.onNodeDblClick).toHaveBeenCalledWith(node);
    });

    it('should emit node-dblclick DOM event', () => {
        const node = new NodeMinimalEntry();

        document.addEventListener('node-dblclick', (res) => {
            expect(res).toBeDefined();
        });

        documentList.onNodeDblClick(node);
    });

    it('should load folder by ID on init', async () => {
        spyOn(documentList, 'loadFolder').and.stub();

        fixture.detectChanges();

        documentList.ngOnChanges({ currentFolderId: new SimpleChange(undefined, '1d26e465-dea3-42f3-b415-faa8364b9692', true) });

        await fixture.whenStable();

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
        spyFolderNode = spyOn(documentListService, 'loadFolderByNodeId').and.callFake(() => of(new DocumentLoaderNode(null, { list: { pagination: {} } })));

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
        const trashcanApi = customResourcesService.trashcanApi;
        spyOn(trashcanApi, 'listDeletedNodes').and.returnValue(Promise.resolve(null));

        documentList.currentFolderId = '-trashcan-';
        documentList.loadFolder();
        expect(trashcanApi.listDeletedNodes).toHaveBeenCalled();
    });

    it('should emit error when fetch trashcan fails', (done) => {
        spyOn(customResourcesService.trashcanApi, 'listDeletedNodes').and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-trashcan-';
        documentList.loadFolder();
    });

    it('should fetch shared links', () => {
        const sharedlinksApi = customResourcesService.sharedLinksApi;
        spyOn(sharedlinksApi, 'listSharedLinks').and.returnValue(Promise.resolve(null));

        documentList.currentFolderId = '-sharedlinks-';
        documentList.loadFolder();
        expect(sharedlinksApi.listSharedLinks).toHaveBeenCalled();
    });

    it('should emit error when fetch shared links fails', (done) => {
        spyOn(customResourcesService.sharedLinksApi, 'listSharedLinks').and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-sharedlinks-';
        documentList.loadFolder();
    });

    it('should fetch sites', () => {
        const sitesApi = customResourcesService.sitesApi;

        documentList.currentFolderId = '-sites-';
        documentList.loadFolder();
        expect(sitesApi.listSites).toHaveBeenCalled();
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
        const sitesApi = customResourcesService.sitesApi;
        spyOn(sitesApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve(fakeGetSiteMembership));

        documentList.currentFolderId = '-mysites-';
        documentList.loadFolder();
        expect(sitesApi.listSiteMembershipsForPerson).toHaveBeenCalled();
    });

    it('should emit error when fetch membership sites fails', (done) => {
        spyOn(customResourcesService.sitesApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.reject('error'));

        const disposableError = documentList.error.subscribe((val) => {
            expect(val).toBe('error');
            disposableError.unsubscribe();
            done();
        });

        documentList.currentFolderId = '-mysites-';
        documentList.loadFolder();
    });

    it('should fetch favorites', () => {
        const favoritesApi = customResourcesService.favoritesApi;

        documentList.currentFolderId = '-favorites-';
        documentList.loadFolder();
        expect(favoritesApi.listFavorites).toHaveBeenCalled();
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
        spyOn(customResourcesService.sitesApi, 'listSiteMembershipsForPerson').and.returnValue(Promise.resolve(fakeGetSiteMembership));

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

        documentList.ngOnChanges({ currentFolderId: new SimpleChange(undefined, 'fake-id', true) });

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, {
            where: undefined,
            maxItems: 25,
            skipCount: 0,
            orderBy: ['isFolder desc', 'name asc'],
            rootFolderId: 'fake-id'
        }, ['test-include']);
    });

    it('should add where in the server request when present', () => {
        documentList.includeFields = ['test-include'];
        documentList.where = '(isFolder=true)';
        documentList.currentFolderId = 'fake-id';

        documentList.ngOnChanges({ currentFolderId: new SimpleChange(undefined, 'fake-id', true) });

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, {
            where: '(isFolder=true)',
            maxItems: 25,
            skipCount: 0,
            orderBy: ['isFolder desc', 'name asc'],
            rootFolderId: 'fake-id'
        }, ['test-include']);
    });

    it('should add orderBy in the server request', () => {
        documentList.includeFields = ['test-include'];
        documentList.sorting = ['size', 'desc'];
        documentList.where = null;
        documentList.currentFolderId = 'fake-id';

        documentList.ngOnChanges({ currentFolderId: new SimpleChange(undefined, 'fake-id', true) });

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, {
            maxItems: 25,
            skipCount: 0,
            where: null,
            orderBy: ['isFolder desc', 'size desc'],
            rootFolderId: 'fake-id'
        }, ['test-include']);
    });

    it('should reset the pagination when enter in a new folder', () => {
        documentList.ngOnChanges({ currentFolderId: new SimpleChange(undefined, 'fake-id', true) });
        const folder = new FolderNode();
        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        documentList.updatePagination({
            maxItems: 10,
            skipCount: 10
        });

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, Object({
            maxItems: 10,
            skipCount: 10,
            orderBy: ['isFolder desc', 'name asc'],
            rootFolderId: 'no-node',
            where: undefined
        }), undefined);

        documentList.onNodeClick(folder);

        expect(documentListService.getFolder).toHaveBeenCalledWith(null, Object({
            maxItems: 25,
            skipCount: 0,
            orderBy: ['isFolder desc', 'name asc'],
            rootFolderId: 'folder-id',
            where: undefined
        }), undefined);
    });

    it('should display fileAutoDownload dialog if node size exceeds appConfig.viewer.fileAutoDownloadSizeThresholdInMB', async () => {
        appConfigService.config = {
            ...appConfigService.config,
            viewer: {
                enableFileAutoDownload: true,
                fileAutoDownloadSizeThresholdInMB: 10
            }
        };
        documentList.navigationMode = DocumentListComponent.SINGLE_CLICK_NAVIGATION;
        const node = { entry: {
                ...mockNode1,
                content: {
                    ...mockNode1.content,
                    sizeInBytes: 104857600
                }
            } };
        documentList.onNodeClick(node);

        fixture.detectChanges();
        await fixture.whenStable();

        expect(mockDialog.open).toHaveBeenCalledWith(FileAutoDownloadComponent, { disableClose: true, data: node });
    });

    describe('Preselect nodes', () => {

        beforeEach(() => {
            spyOn(thumbnailService, 'getMimeTypeIcon').and.returnValue(`assets/images/ft_ic_created.svg`);
        });

        it('should return only the first node of the preselectedNodes when selection mode is single', async () => {
            documentList.selectionMode = 'single';
            fixture.detectChanges();

            documentList.node = mockNodePagingWithPreselectedNodes;
            documentList.preselectNodes = mockPreselectedNodes;
            documentList.reload();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(documentList.preselectNodes.length).toBe(2);
            expect(documentList.getPreselectedNodesBasedOnSelectionMode().length).toBe(1);
        });

        it('should return all the preselectedNodes when selection mode is multiple', async () => {
            documentList.selectionMode = 'multiple';
            fixture.detectChanges();

            documentList.node = mockNodePagingWithPreselectedNodes;
            documentList.preselectNodes = mockPreselectedNodes;
            documentList.reload();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(documentList.preselectNodes.length).toBe(2);
            expect(documentList.getPreselectedNodesBasedOnSelectionMode().length).toBe(2);
        });

        it('should call the datatable select row method for each preselected node', async () => {
            const datatableSelectRowSpy = spyOn(documentList.dataTable, 'selectRow');
            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];

            spyOn(documentList, 'preselectRowsOfPreselectedNodes');
            documentList.preselectedRows = fakeDatatableRows;
            documentList.preselectNodes = mockPreselectedNodes;
            documentList.selectionMode = 'multiple';
            documentList.onPreselectNodes();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(datatableSelectRowSpy.calls.count()).toEqual(fakeDatatableRows.length);
        });

        it('should not emit nodeSelected event when preselectedNodes is undefined/empty', async () => {
            const nodeSelectedSpy = spyOn(documentList.nodeSelected, 'emit');

            fixture.detectChanges();

            documentList.node = mockNodePagingWithPreselectedNodes;
            documentList.preselectNodes = [];
            documentList.reload();

            fixture.detectChanges();
            await fixture.whenStable();

            expect(nodeSelectedSpy).not.toHaveBeenCalled();
        });

        it('should return only the first preselected row when selection mode is single', () => {
            documentList.selectionMode = 'single';
            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];
            documentList.preselectedRows = fakeDatatableRows;
            const preselectedRows = documentList.getPreselectedRowsBasedOnSelectionMode();

            expect(preselectedRows.length).toEqual(1);
            expect(preselectedRows[0]).toEqual(fakeDatatableRows[0]);
        });

        it('should return all the preselected rows when selection mode is multiple', () => {
            documentList.selectionMode = 'multiple';
            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];
            documentList.preselectedRows = fakeDatatableRows;
            const preselectedRows = documentList.getPreselectedRowsBasedOnSelectionMode();

            expect(preselectedRows.length).toEqual(2);
            expect(preselectedRows).toEqual(fakeDatatableRows);
        });

        it('should return an empty array when there are no preselected rows', () => {
            documentList.preselectedRows = undefined;
            const preselectedRows = documentList.getPreselectedRowsBasedOnSelectionMode();

            expect(preselectedRows).toEqual([]);
        });

        it('should the combined selection be only the first preselected row when selection mode is single', () => {
            const getSelectionFromAdapterSpy = spyOn(documentList.data, 'getSelectedRows');
            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];
            documentList.preselectedRows = fakeDatatableRows;
            documentList.selectionMode = 'single';
            const selection = documentList.getSelectionBasedOnSelectionMode();

            expect(selection.length).toEqual(1);
            expect(selection[0]).toEqual(fakeDatatableRows[0]);
            expect(getSelectionFromAdapterSpy).not.toHaveBeenCalled();
        });

        it('should get the selection from the adapter when selection mode is multiple', () => {
            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];
            fakeDatatableRows[0].isSelected = true;
            fakeDatatableRows[1].isSelected = false;
            documentList.data.setRows(fakeDatatableRows);

            const getSelectionFromAdapterSpy = spyOn(documentList.data, 'getSelectedRows').and.callThrough();
            documentList.selectionMode = 'multiple';
            documentList.preselectedRows = fakeDatatableRows;
            const selection = documentList.getSelectionBasedOnSelectionMode();

            expect(getSelectionFromAdapterSpy).toHaveBeenCalled();
            expect(selection.length).toEqual(1);
            expect(selection[0]).toEqual(fakeDatatableRows[0]);
        });

        it('should preserve the existing selection when selection mode is multiple', () => {
            fixture.detectChanges();
            documentList.node = mockNodePagingWithPreselectedNodes;
            documentList.selection = [{ entry: mockNode1 }, { entry: mockNode2 }];
            documentList.selectionMode = 'multiple';
            documentList.reloadWithoutResettingSelection();
            const selectedRows = documentList.data.getSelectedRows();

            expect(selectedRows.length).toEqual(2);
            expect(selectedRows[0].id).toEqual(mockNode1.id);
            expect(selectedRows[0].isSelected).toEqual(true);
            expect(selectedRows[1].id).toEqual(mockNode2.id);
            expect(selectedRows[1].isSelected).toEqual(true);
        });

        it('should not preserve the existing selection when selection mode is single', () => {
            fixture.detectChanges();
            documentList.node = mockNodePagingWithPreselectedNodes;
            documentList.selection = [{ entry: mockNode1 }, { entry: mockNode2 }];
            documentList.selectionMode = 'single';
            documentList.reloadWithoutResettingSelection();
            const selectedRows = documentList.data.getSelectedRows();

            expect(selectedRows.length).toEqual(0);
        });

        it('should unselect the row from the node id', () => {
            const datatableSelectRowSpy = spyOn(documentList.dataTable, 'selectRow');
            const getRowByNodeIdSpy = spyOn(documentList.data, 'getRowByNodeId').and.callThrough();
            const onNodeUnselectSpy = spyOn(documentList, 'onNodeUnselect');
            const getSelectionSpy = spyOn(documentList, 'getSelectionBasedOnSelectionMode').and.callThrough();

            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];
            fakeDatatableRows[0].isSelected = true;
            documentList.data.setRows(fakeDatatableRows);
            let selection = documentList.data.getSelectedRows();

            expect(selection.length).toEqual(1);

            documentList.unselectRowFromNodeId(mockPreselectedNodes[0].entry.id);
            selection = documentList.data.getSelectedRows() as ShareDataRow[];

            expect(selection).toEqual([]);
            expect(getSelectionSpy).toHaveBeenCalled();
            expect(getRowByNodeIdSpy).toHaveBeenCalledWith(mockPreselectedNodes[0].entry.id);
            expect(datatableSelectRowSpy).toHaveBeenCalledWith(fakeDatatableRows[0], false);
            expect(onNodeUnselectSpy).toHaveBeenCalledWith({ row: undefined, selection });
        });

        it('should preselect the rows of the preselected nodes', () => {
            const getRowByNodeIdSpy = spyOn(documentList.data, 'getRowByNodeId').and.callThrough();
            const getPreselectedNodesSpy = spyOn(documentList, 'getPreselectedNodesBasedOnSelectionMode').and.callThrough();

            const fakeDatatableRows = [new ShareDataRow(mockPreselectedNodes[0], contentService, null), new ShareDataRow(mockPreselectedNodes[1], contentService, null)];
            documentList.data.setRows(fakeDatatableRows);

            documentList.selectionMode = 'multiple';
            documentList.preselectNodes = [...mockPreselectedNodes, { entry: mockNode3 }];

            documentList.preselectRowsOfPreselectedNodes();
            const selectedRows = documentList.data.getSelectedRows();

            expect(getPreselectedNodesSpy).toHaveBeenCalled();
            expect(selectedRows.length).toEqual(2);
            expect(selectedRows[0].isSelected).toEqual(true);
            expect(selectedRows[1].isSelected).toEqual(true);

            expect(documentList.preselectedRows.length).toEqual(2);
            expect(documentList.preselectedRows).toEqual(fakeDatatableRows);

            expect(getRowByNodeIdSpy).toHaveBeenCalledWith(fakeDatatableRows[0].id);
            expect(getRowByNodeIdSpy).toHaveBeenCalledWith(fakeDatatableRows[1].id);
        });

        it('should select the rows of the preselected nodes and emit the new combined selection', () => {
            const hasPreselectedNodesSpy = spyOn(documentList, 'hasPreselectedNodes').and.callThrough();
            const preselectRowsOfPreselectedNodesSpy = spyOn(documentList, 'preselectRowsOfPreselectedNodes').and.callThrough();
            const getPreselectedRowsBasedOnSelectionModeSpy = spyOn(documentList, 'getPreselectedRowsBasedOnSelectionMode').and.callThrough();
            const onNodeSelectSpy = spyOn(documentList, 'onNodeSelect').and.callThrough();

            const fakeDatatableRows = [
                new ShareDataRow(mockPreselectedNodes[0], contentService, null),
                new ShareDataRow(mockPreselectedNodes[1], contentService, null),
                new ShareDataRow({ entry: mockNode3 }, contentService, null)
            ];
            fakeDatatableRows[2].isSelected = true;
            documentList.data.setRows(fakeDatatableRows);

            documentList.selection = [{ entry: mockNode3 }];
            documentList.selectionMode = 'multiple';
            documentList.preselectNodes = mockPreselectedNodes;
            documentList.onPreselectNodes();
            const selection = documentList.data.getSelectedRows() as ShareDataRow[];

            expect(hasPreselectedNodesSpy).toHaveBeenCalled();
            expect(preselectRowsOfPreselectedNodesSpy).toHaveBeenCalled();
            expect(getPreselectedRowsBasedOnSelectionModeSpy).toHaveBeenCalled();
            expect(selection.length).toEqual(3);
            expect(selection[0].id).toEqual(mockNode1.id);
            expect(selection[1].id).toEqual(mockNode2.id);
            expect(selection[2].id).toEqual(mockNode3.id);
            expect(onNodeSelectSpy).toHaveBeenCalledWith({ row: undefined, selection });
        });
    });
});

@Component({
    template: `
        <adf-document-list  #customDocumentList>
            <adf-custom-loading-content-template>
                <span id="custom-loading-template">This is a custom loading template</span>
            </adf-custom-loading-content-template>
            <adf-custom-empty-content-template>
                <span id="custom-empty-template">This is a custom empty template</span>
            </adf-custom-empty-content-template>
            <adf-custom-no-permission-template>
                <span id="custom-no-permission-template">This is a custom no permission template</span>
            </adf-custom-no-permission-template>
        </adf-document-list>
    `
})
class CustomTemplateComponent {
    @ViewChild('customDocumentList')
    customDocumentList: DocumentListComponent;
}

describe('DocumentListComponent rendering', () => {
    let fixture: ComponentFixture<CustomTemplateComponent>;
    let component: CustomTemplateComponent;
    let element: HTMLElement;

    setupTestBed({
        declarations: [CustomTemplateComponent],
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule,
            DataTableModule,
            DocumentListModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should display custom loading template if defined', () => {
        component.customDocumentList.dataTable.loading = true;
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('span[id="custom-loading-template"]');
        expect(element).toBeDefined();
        expect(element.innerText).toBe('This is a custom loading template');
    });

    it('should display custom empty template if defined', () => {
        component.customDocumentList.dataTable.data = new ObjectDataTableAdapter();
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('span[id="custom-empty-template"]');
        expect(element).toBeDefined();
        expect(element.innerText).toBe('This is a custom empty template');
    });

    it('should display custom no permission template if defined', () => {
        component.customDocumentList.dataTable.noPermission = true;
        fixture.detectChanges();
        element = fixture.nativeElement.querySelector('span[id="custom-no-permission-template"]');
        expect(element).toBeDefined();
        expect(element.innerText).toBe('This is a custom no permission template');
    });

    it('should display rows and columns correctly', () => {
        const data = new ObjectDataTableAdapter(
            [
                { id: 1, name: 'Name 1' },
                { id: 2, name: 'Name 2' },
                { id: 3, name: 'Name 3' }
            ],
            [
                { type: 'text', key: 'id', title: 'Id' },
                { type: 'text', key: 'name', title: 'Name' }
            ]
        );

        component.customDocumentList.dataTable.data = data;
        fixture.detectChanges();
        const rows = fixture.nativeElement.querySelectorAll('.adf-datatable-body adf-datatable-row');
        expect(rows).toBeDefined();
        expect(rows.length).toBe(3);
        const cell1 = fixture.nativeElement.querySelector('div[title="Name"][data-automation-id="Name 1"]');
        expect(cell1.innerText).toBe('Name 1');
        const cell2 = fixture.nativeElement.querySelector('div[title="Name"][data-automation-id="Name 2"]');
        expect(cell2.innerText).toBe('Name 2');
        const cell3 = fixture.nativeElement.querySelector('div[title="Id"][data-automation-id="Name 3"]');
        expect(cell3.innerText).toBe('3');
    });

});
