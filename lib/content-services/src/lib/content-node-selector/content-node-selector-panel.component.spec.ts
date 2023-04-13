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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
    MinimalNode,
    Node,
    NodeEntry,
    NodePaging,
    ResultSetPaging,
    SiteEntry,
    SitePaging,
    UserInfo
} from '@alfresco/js-api';
import {
    AppConfigService,
    setupTestBed,
    DataRow,
    ThumbnailService,
    DataColumn
} from '@alfresco/adf-core';
import { ContentService } from '../common/services/content.service';
import { UploadService } from '../common/services/upload.service';
import { NodesApiService } from '../common/services/nodes-api.service';
import { FileModel, FileUploadStatus } from '../common/models/file.model';
import { FileUploadCompleteEvent } from '../common/events/file.event';

import { of, throwError } from 'rxjs';
import { DropdownBreadcrumbComponent } from '../breadcrumb';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel.component';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DocumentListService } from '../document-list/services/document-list.service';
import { DropdownSitesComponent } from '../site-dropdown/sites-dropdown.component';
import { NodeEntryEvent, ShareDataRow, ShareDataTableAdapter } from '../document-list';
import { TranslateModule } from '@ngx-translate/core';
import { SearchQueryBuilderService } from '../search';
import { ContentNodeSelectorPanelService } from './content-node-selector-panel.service';
import { mockContentModelTextProperty } from '../mock/content-model.mock';
import { SitesService } from '../common/services/sites.service';

const fakeResultSetPaging: ResultSetPaging = {
    list: {
        pagination: {
            totalItems: 1
        },
        entries: [
            {
                entry: {
                    id: '123',
                    name: 'MyFolder',
                    isFile: false,
                    isFolder: true,
                    nodeType: 'mock'
                }
            }
        ]
    }
};

describe('ContentNodeSelectorPanelComponent', () => {
    let component: ContentNodeSelectorPanelComponent;
    let fixture: ComponentFixture<ContentNodeSelectorPanelComponent>;
    let nodeService: NodesApiService;
    let sitesService: SitesService;
    const fakeNodeEntry = new Node({ id: 'fakeId' });
    const nodeEntryEvent = new NodeEntryEvent(fakeNodeEntry);
    let searchQueryBuilderService: SearchQueryBuilderService;
    let contentNodeSelectorPanelService: ContentNodeSelectorPanelService;
    let uploadService: UploadService;
    let thumbnailService: ThumbnailService;
    let contentService: ContentService;

    const triggerSearchResults = (searchResults: ResultSetPaging) => {
        component.queryBuilderService.executed.next(searchResults);
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    describe('General component features', () => {

        beforeEach(() => {
            fixture = TestBed.createComponent(ContentNodeSelectorPanelComponent);
            component = fixture.componentInstance;
            component.debounceSearch = 0;

            nodeService = TestBed.inject(NodesApiService);
            sitesService = TestBed.inject(SitesService);
            contentNodeSelectorPanelService = TestBed.inject(ContentNodeSelectorPanelService);
            uploadService = TestBed.inject(UploadService);
            contentService = TestBed.inject(ContentService);
            thumbnailService = TestBed.inject(ThumbnailService);

            searchQueryBuilderService = component.queryBuilderService;
            component.queryBuilderService.resetToDefaults();

            spyOn(nodeService, 'getNode').and.returnValue(of(new MinimalNode({
                id: 'fake-node',
                path: { elements: [{ nodeType: 'st:site', name: 'fake-site' }] }
            })));
            const fakeSite = new SiteEntry({
                entry: {
                    id: 'fake-site',
                    guid: 'fake-site',
                    title: 'fake-site',
                    visibility: 'visible'
                }
            });
            spyOn(sitesService, 'getSite').and.returnValue(of(fakeSite));
        });

        afterEach(() => {
            fixture.destroy();
        });

        describe('Site selection', () => {

            beforeEach(() => {
                spyOn(sitesService, 'getSites').and.returnValue(of(new SitePaging({ list: { entries: [] } })));
                component.currentFolderId = 'fake-starting-folder';
            });

            it('should trigger siteChange event on init with parent site Title of start folder', async () => {
                await component.siteChange.subscribe((siteTitle: string) => {
                    expect(siteTitle).toBe('fake-site');
                });

                component.ngOnInit();
                fixture.detectChanges();
                expect(component.startSiteGuid).toBe('fake-site');
            });

            it('should trigger siteChange event when a site is selected in sites-dropdown', async () => {
                const fakeSiteEntry = new SiteEntry({ entry: { title: 'fake-new-site', guid: 'fake-new-site' } });
                fixture.detectChanges();
                await fixture.whenStable();

                await component.siteChange.subscribe((siteTitle: string) => {
                    expect(siteTitle).toBe('fake-new-site');
                });

                const sitesDropdown = fixture.debugElement.query(By.directive(DropdownSitesComponent));
                sitesDropdown.componentInstance.selectedSite({ value: fakeSiteEntry });
            });
        });

        describe('Parameters', () => {

            let documentListService: DocumentListService;

            beforeEach(() => {
                documentListService = TestBed.inject(DocumentListService);

                spyOn(documentListService, 'getFolderNode').and.returnValue(of(new NodeEntry()));
                spyOn(documentListService, 'getFolder').and.returnValue(throwError('No results for test'));
                spyOn(sitesService, 'getSites').and.returnValue(of(new SitePaging({
                    list: {
                        entries: [
                            { entry: { guid: 'namek', id: 'namek' } },
                            { entry: { guid: 'blog', id: 'blog' } }
                        ]
                    }
                })));

                component.currentFolderId = 'cat-girl-nuku-nuku';
                fixture.detectChanges();
            });

            it('should the document list use the server ordering', () => {
                expect(component.documentList.sortingMode).toBe('server');
            });

            it('should trigger the select event when selection has been made', async () => {
                const expectedNode = { id: 'fakeid' } as Node;
                await component.select.subscribe((nodes) => {
                    expect(nodes.length).toBe(1);
                    expect(nodes[0]).toBe(expectedNode);
                });

                component.chosenNode = [expectedNode];
            });

            it('should be able to filter out the exclude site content', () => {
                component.excludeSiteContent = ['blog'];
                fixture.detectChanges();

                const testSiteContent = new Node({ id: 'blog-id', properties: { 'st:componentId': 'blog' } });
                expect(component.rowFilter({ node: { entry: testSiteContent } } as any, null, null))
                    .toBe(false, 'did not filter out blog');
            });

            it('should still be able to filter out the exclude site content after rowFilter changes', () => {
                const filterFunction1 = () => true;
                const filterFunction2 = (row: ShareDataRow) => {
                    const node: Node = row.node.entry;
                    return node.isFile;
                };

                component.excludeSiteContent = ['blog'];
                component.rowFilter = filterFunction1;
                fixture.detectChanges();

                const testSiteContent = new Node({
                    id: 'blog-id',
                    properties: { 'st:componentId': 'blog' },
                    isFile: true
                });
                expect(component.rowFilter({ node: { entry: testSiteContent } } as any, null, null))
                    .toBe(false, 'did not filter out blog with filterFunction1');

                component.rowFilter = filterFunction2;
                fixture.detectChanges();
                expect(component.rowFilter({ node: { entry: testSiteContent } } as any, null, null))
                    .toBe(false, 'did not filter out blog with filterFunction2');
            });

            it('should NOT filter out any site content by default', () => {
                fixture.detectChanges();

                const testSiteContent = new Node({ id: 'blog-id', properties: { 'st:componentId': 'blog' } });
                expect(component.rowFilter({ node: { entry: testSiteContent } } as any, null, null)).toBe(true);
            });

            it('should render search input by default', () => {
                fixture.detectChanges();
                expect(fixture.debugElement.nativeElement.querySelector('.adf-content-node-selector-content-input'))
                    .not.toBe(null);
            });

            it('should not render search input if `showSearch` is false', () => {
                component.showSearch = false;
                fixture.detectChanges();
                expect(fixture.debugElement.nativeElement.querySelector('.adf-content-node-selector-content-input'))
                    .toBe(null);
            });

            it('should render sites list dropdown by default', () => {
                fixture.detectChanges();
                expect(fixture.debugElement.nativeElement.querySelector('adf-sites-dropdown'))
                    .not.toBe(null);
            });

            it('should not render sites list dropdown if `showDropdownSiteList` is false', () => {
                component.showDropdownSiteList = false;
                fixture.detectChanges();
                expect(fixture.debugElement.nativeElement.querySelector('adf-sites-dropdown'))
                    .toBe(null);
            });
        });

        describe('Breadcrumbs', () => {

            let documentListService: DocumentListService;

            beforeEach(() => {
                documentListService = TestBed.inject(DocumentListService);

                spyOn(documentListService, 'getFolderNode').and.returnValue(of(new NodeEntry()));
                spyOn(documentListService, 'getFolder').and.returnValue(throwError('No results for test'));
                spyOn(sitesService, 'getSites').and.returnValue(of(new SitePaging({ list: { entries: [] } })));

                component.currentFolderId = 'cat-girl-nuku-nuku';
                fixture.detectChanges();
            });

            it('should show the breadcrumb for the currentFolderId by default', async () => {
                fixture.detectChanges();
                await fixture.whenStable();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);

            });

            it('should not show the breadcrumb if search was performed as last action', async () => {
                searchQueryBuilderService.userQuery = 'mock-search-term';
                searchQueryBuilderService.update();
                triggerSearchResults(fakeResultSetPaging);

                fixture.detectChanges();
                await fixture.whenStable();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).toBeNull();
            });

            it('should show the breadcrumb again on folder navigation in the results list', async () => {
                triggerSearchResults(fakeResultSetPaging);

                component.onFolderChange(nodeEntryEvent);
                fixture.detectChanges();
                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();

            });

            it('should show the breadcrumb in search results for a valid node selection', async () => {
                searchQueryBuilderService.userQuery = 'mock-search-term';
                searchQueryBuilderService.update();
                triggerSearchResults(fakeResultSetPaging);

                const chosenNode = new Node({ path: { elements: ['one'] } });
                component.onCurrentSelection([{ entry: chosenNode }]);
                fixture.detectChanges();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode.path).toBe(chosenNode.path);
            });

            it('should show the breadcrumb in search results even for an invalid node selection', async () => {
                component.isSelectionValid = (node: Node) => node.isFile;
                searchQueryBuilderService.userQuery = 'mock-search-term';
                searchQueryBuilderService.update();
                triggerSearchResults(fakeResultSetPaging);

                const chosenNode = new Node({ path: { elements: ['fake-path'] }, isFile: false, isFolder: true });
                component.onCurrentSelection([{ entry: chosenNode }]);
                fixture.detectChanges();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode.path).toBe(chosenNode.path);
            });

            it('should NOT show the breadcrumb for the selected node when not on search results list', async () => {
                triggerSearchResults(fakeResultSetPaging);
                fixture.detectChanges();

                component.onFolderChange(nodeEntryEvent);
                fixture.detectChanges();

                const chosenNode = { path: { elements: [] } } as Node;
                component.onCurrentSelection([{ entry: chosenNode }]);
                fixture.detectChanges();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);
            });

            it('should keep breadcrumb folderNode unchanged if breadcrumbTransform is NOT defined', async () => {
                fixture.detectChanges();
                await fixture.whenStable();
                expect(component.breadcrumbTransform).toBeNull();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);
            });

            it('should make changes to breadcrumb folderNode if breadcrumbTransform is defined', async () => {
                const transformedFolderNode = {
                    id: 'trans-node',
                    name: 'trans-node-name',
                    path: { elements: [{ id: 'testId', name: 'testName' }] }
                };
                component.breadcrumbTransform = (() => transformedFolderNode);

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.breadcrumbTransform).not.toBeNull();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb.componentInstance.route[0].name).toBe('testName');
                expect(breadcrumb.componentInstance.route[0].id).toBe('testId');
            });
        });

        describe('Chosen node', () => {

            const entry: Node = { id: 'fakeid' } as Node;
            const nodePage: NodePaging = { list: { pagination: {} } };
            let hasAllowableOperations;
            const fakeFolderNode = { id: 'fakeNodeId', isFolder: true } as Node;

            const returnHasPermission = (): boolean => hasAllowableOperations;

            beforeEach(() => {
                const schema = [{}] as DataColumn[];
                const rows = [{}, {}] as DataRow[];
                component.documentList.data = new ShareDataTableAdapter(thumbnailService, contentService, schema);
                spyOn(component.documentList.data, 'getRows').and.returnValue(rows);
                spyOn(sitesService, 'getSites').and.returnValue(of(new SitePaging({ list: { entries: [] } })));
            });

            it('should the selection become the currently navigated folder when the folder loads (Acts as destination for cases like copy action)', () => {
                component.documentList.folderNode = fakeFolderNode;
                component.onFolderLoaded(nodePage);

                expect(component.chosenNode).toEqual([fakeFolderNode]);
            });

            it('should update the pagination after filtering rows on copy and move action', () => {
                component.documentList.folderNode = fakeFolderNode;
                const fakeNodePage: NodePaging = {
                    list: {
                        pagination: {
                            hasMoreItems: true,
                            maxItems: 1,
                            totalItems: 2
                        },
                        entries: [
                            {
                                entry: {
                                    id: '123',
                                    name: 'MyFolder',
                                    isFile: false,
                                    isFolder: true,
                                    nodeType: 'mock',
                                    modifiedAt: new Date(),
                                    modifiedByUser: new UserInfo(),
                                    createdAt: new Date(),
                                    createdByUser: new UserInfo()
                                }
                            },
                            {
                                entry: {
                                    id: '456',
                                    name: 'MyFolder2',
                                    isFile: false,
                                    isFolder: true,
                                    nodeType: 'mock',
                                    modifiedAt: new Date(),
                                    modifiedByUser: new UserInfo(),
                                    createdAt: new Date(),
                                    createdByUser: new UserInfo()
                                }
                            }
                        ]
                    }
                };
                component.documentList.ready.emit(fakeNodePage);
                component.onFolderLoaded(fakeNodePage);

                expect(fakeNodePage.list.pagination.hasMoreItems).toBe(true);
                fakeNodePage.list.pagination.maxItems = 25;
                component.onFolderLoaded(fakeNodePage);

                expect(fakeNodePage.list.pagination.hasMoreItems).toBe(false);
            });

            describe('in the case when isSelectionValid is a custom function for checking permissions,', () => {

                beforeEach(() => {
                    component.isSelectionValid = returnHasPermission;
                });

                it('should NOT be null after clicking on a node (with the right permissions) in the list (onNodeSelect)', async () => {
                    hasAllowableOperations = true;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode[0]).toBe(entry);
                    });

                    component.onCurrentSelection([{ entry }]);
                });

                it('should remain empty when clicking on a node (with the WRONG permissions) in the list (onNodeSelect)', async () => {
                    hasAllowableOperations = false;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toEqual([]);
                        expect(component.chosenNode).toEqual([]);
                    });

                    component.onCurrentSelection([{ entry }]);
                });

                it('should become empty when clicking on a node (with the WRONG permissions) after previously selecting a right node', async () => {
                    component.select.subscribe((nodes) => {
                        if (hasAllowableOperations) {
                            expect(nodes).toBeDefined();
                            expect(nodes).not.toBeNull();
                            expect(component.chosenNode[0]).not.toBeNull();
                        } else {
                            expect(nodes).toBeDefined();
                            expect(nodes).toEqual([]);
                            expect(component.chosenNode).toEqual([]);
                        }
                    });

                    hasAllowableOperations = true;
                    component.onCurrentSelection([{ entry }]);

                    hasAllowableOperations = false;
                    component.onCurrentSelection([{ entry }]);
                });

                it('should be empty when the chosenNode is reset', async () => {
                    hasAllowableOperations = true;
                    component.onCurrentSelection([{ entry: {} as Node }]);

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                    });

                    component.resetChosenNode();
                });
            });

            describe('in the case when isSelectionValid is null', () => {

                beforeEach(() => {
                    component.isSelectionValid = null;
                });

                it('should NOT be null after selecting node because isSelectionValid would be reset to defaultValidation function', async () => {
                    component.documentList.folderNode = entry;
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode[0]).not.toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.documentList.ready.emit(nodePage);
                    fixture.detectChanges();
                });

                it('should NOT be null after clicking on a node in the list (onNodeSelect)', async () => {
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode[0]).not.toBeNull();
                        expect(component.chosenNode[0].id).toBe('fakeid');
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.onCurrentSelection([{ entry }]);
                });

                it('should be null when the chosenNode is reset', async () => {
                    fixture.detectChanges();
                    component.onCurrentSelection([{ entry: {} as Node }]);

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.resetChosenNode();
                    fixture.detectChanges();
                });
            });

            describe('in the case when isSelectionValid is not defined', () => {

                beforeEach(() => {
                    component.isSelectionValid = undefined;
                });

                it('should NOT be null after selecting node because isSelectionValid would be the defaultValidation function', async () => {
                    component.documentList.folderNode = entry;
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode[0]).not.toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.documentList.ready.emit(nodePage);
                    fixture.detectChanges();
                });

                it('should be null when the chosenNode is reset', async () => {
                    fixture.detectChanges();
                    component.onCurrentSelection([{ entry: {} as Node }]);

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.resetChosenNode();
                    fixture.detectChanges();
                });
            });

            describe('interaction with upload functionality', () => {
                let documentListService: DocumentListService;

                beforeEach(() => {
                    documentListService = TestBed.inject(DocumentListService);

                    spyOn(documentListService, 'getFolderNode');
                    spyOn(documentListService, 'getFolder');
                });

                it('should trigger preselection only after the upload batch contains all the uploads of the queue and no other uploads are in progress', fakeAsync(() => {
                    fixture.detectChanges();
                    component.selectionMode = 'multiple';

                    const isUploadingSpy = spyOn(uploadService, 'isUploading').and.returnValue(true);
                    const documentListReloadSpy = spyOn(component.documentList, 'reloadWithoutResettingSelection');

                    const fakeFileModels = [new FileModel({
                        name: 'fake-name',
                        size: 100
                    } as File), new FileModel({ name: 'fake-name-2', size: 200 } as File)];
                    const fileUploadCompleteEvent = new FileUploadCompleteEvent(fakeFileModels[0], 1, fakeFileModels[0], 0);
                    uploadService.fileUploadComplete.next(fileUploadCompleteEvent);

                    tick(500);
                    fixture.detectChanges();

                    expect(component.currentUploadBatch).toEqual([fileUploadCompleteEvent.data]);
                    expect(component.preselectedNodes).toEqual([]);
                    expect(documentListReloadSpy).not.toHaveBeenCalled();

                    isUploadingSpy.and.returnValue(false);

                    const secondFileUploadCompleteEvent = new FileUploadCompleteEvent(fakeFileModels[1], 2, fakeFileModels[1], 0);
                    uploadService.fileUploadComplete.next(secondFileUploadCompleteEvent);
                    tick(500);

                    expect(component.currentUploadBatch).toEqual([]);
                    expect(component.preselectedNodes).toEqual([fileUploadCompleteEvent.data, secondFileUploadCompleteEvent.data]);
                    expect(documentListReloadSpy).toHaveBeenCalled();
                }));

                it('should call document list to unselect the row of the deleted upload', () => {
                    fixture.detectChanges();

                    const documentListUnselectRowSpy = spyOn(component.documentList, 'unselectRowFromNodeId');
                    const documentListReloadSpy = spyOn(component.documentList, 'reloadWithoutResettingSelection');
                    const fakeFileModel = new FileModel({ name: 'fake-name', size: 10000000 } as File);
                    const fakeNodes = [{ id: 'fakeNodeId' }, { id: 'fakeNodeId2' }] as Node[];

                    fakeFileModel.data = { entry: fakeNodes[0] };
                    fakeFileModel.status = FileUploadStatus.Deleted;
                    uploadService.cancelUpload(fakeFileModel);

                    expect(documentListUnselectRowSpy).toHaveBeenCalledWith(fakeNodes[0].id);
                    expect(documentListReloadSpy).toHaveBeenCalled();
                });

                it('should return only the last uploaded node to become preselected when the selection mode is single', () => {
                    fixture.detectChanges();
                    const fakeNodes = [new NodeEntry({ id: 'fakeNode1' }), new NodeEntry({ id: 'fakeNode2' })];
                    component.currentUploadBatch = fakeNodes;
                    component.selectionMode = 'single';

                    expect(component.getPreselectNodesBasedOnSelectionMode()).toEqual([fakeNodes[1]]);
                });

                it('should return all the uploaded nodes to become preselected when the selection mode is multiple', () => {
                    fixture.detectChanges();
                    const fakeNodes = [new NodeEntry({ id: 'fakeNode1' }), new NodeEntry({ id: 'fakeNode2' })];
                    component.currentUploadBatch = fakeNodes;
                    component.selectionMode = 'multiple';

                    expect(component.getPreselectNodesBasedOnSelectionMode()).toEqual(fakeNodes);
                });

                it('should return an empty array when no files are uploaded', () => {
                    fixture.detectChanges();
                    component.currentUploadBatch = [];

                    expect(component.getPreselectNodesBasedOnSelectionMode()).toEqual([]);
                });
            });

        });

        describe('Search panel', () => {

            beforeEach(() => {
                contentNodeSelectorPanelService.customModels = undefined;
            });

            it('should search panel be collapsed by default and expand when clicking the filter button', async () => {
                contentNodeSelectorPanelService.customModels = [mockContentModelTextProperty];
                fixture.detectChanges();

                expect(component.searchPanelExpanded).toEqual(false);

                const toggleFiltersPanelButton = fixture.debugElement.query(By.css('[data-automation-id="adf-toggle-search-panel-button"]'));
                toggleFiltersPanelButton.nativeElement.click();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.searchPanelExpanded).toEqual(true);
            });

            it('should search panel be present when the filter section is expanded', () => {
                component.searchPanelExpanded = true;
                fixture.detectChanges();

                const searchPanelContainer = fixture.debugElement.query(By.css('[data-automation-id="adf-search-panel-container"]'));

                expect(searchPanelContainer).not.toBe(null);
            });

            it('should filter button be present only when there are custom models', () => {
                contentNodeSelectorPanelService.customModels = [mockContentModelTextProperty];
                fixture.detectChanges();

                const toggleFiltersPanelButton = fixture.debugElement.query(By.css('[data-automation-id="adf-toggle-search-panel-button"]'));

                expect(toggleFiltersPanelButton).not.toEqual(null);
            });

            it('should filter button not be present when there are no custom models', () => {
                fixture.detectChanges();

                const toggleFiltersPanelButton = fixture.debugElement.query(By.css('[data-automation-id="adf-toggle-search-panel-button"]'));

                expect(toggleFiltersPanelButton).toEqual(null);
            });
        });

        describe('Sorting', () => {
            let appConfigService: AppConfigService;

            beforeEach(() => {
                appConfigService = TestBed.inject(AppConfigService);
            });

            it('should read the sorting value from appConfig json in case it is present', async () => {
                const fakeSortingConfig = ['fakeKey', 'fakeAsc'];

                appConfigService.config = Object.assign(appConfigService.config, {
                    'adf-content-node-selector': { sorting: fakeSortingConfig }
                });
                fixture.detectChanges();

                expect(component.sorting).toEqual(fakeSortingConfig);
            });

            it('should take default sorting when there is no content node selector sorting config in appConfig json', async () => {
                appConfigService.config = null;
                fixture.detectChanges();

                expect(component.sorting).toEqual(['createdAt', 'desc']);
            });
        });

        describe('Selected nodes counter', () => {
            it('should getSelectedCount return 0 by default', () => {
                expect(component.getSelectedCount()).toBe(0);
            });

            it('should getSelectedCount return 1 when node is selected', () => {
                component.onCurrentSelection([{ entry: new Node({ id: 'fake', isFile: true }) }]);

                expect(component.getSelectedCount()).toBe(1);
            });

            it('should getSelectedCount return 0 when the chosen nodes are reset', () => {
                component.onCurrentSelection([{ entry: new Node({ id: 'fake', isFile: true }) }]);
                component.resetChosenNode();

                expect(component.getSelectedCount()).toBe(0);
            });

            it('should not render component input if `showNodeCounter` is false', async () => {
                component.showNodeCounter = false;
                fixture.detectChanges();
                await fixture.whenStable();
                expect(fixture.debugElement.nativeElement.querySelector('adf-node-counter')).toBe(null);
            });
        });
    });
});
