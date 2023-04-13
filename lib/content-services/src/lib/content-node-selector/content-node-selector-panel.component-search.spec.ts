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
    RequestScope,
    ResultSetPaging,
    SiteEntry,
    SitePaging
} from '@alfresco/js-api';
import { setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel.component';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DocumentListService } from '../document-list/services/document-list.service';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { CustomResourcesService } from '../document-list/services/custom-resources.service';
import { NodeEntryEvent, ShareDataRow } from '../document-list';
import { TranslateModule } from '@ngx-translate/core';
import { SearchQueryBuilderService } from '../search';
import { mockQueryBody } from '../mock/search-query.mock';
import { SitesService } from '../common/services/sites.service';
import { NodesApiService } from '../common/services/nodes-api.service';

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
    const debounceSearch = 200;
    let component: ContentNodeSelectorPanelComponent;
    let fixture: ComponentFixture<ContentNodeSelectorPanelComponent>;
    let nodeService: NodesApiService;
    let sitesService: SitesService;
    let searchSpy: jasmine.Spy;
    const fakeNodeEntry = new Node({ id: 'fakeId' });
    const nodeEntryEvent = new NodeEntryEvent(fakeNodeEntry);
    let searchQueryBuilderService: SearchQueryBuilderService;

    const typeToSearchBox = (searchTerm = 'string-to-search') => {
        const searchInput = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-input"]'));
        searchInput.nativeElement.value = searchTerm;
        component.searchInput.setValue(searchTerm);
        fixture.detectChanges();
    };

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

        beforeEach(async () => {
            fixture = TestBed.createComponent(ContentNodeSelectorPanelComponent);
            component = fixture.componentInstance;
            component.debounceSearch = 0;

            nodeService = TestBed.inject(NodesApiService);
            sitesService = TestBed.inject(SitesService);

            searchQueryBuilderService = component.queryBuilderService;
            component.queryBuilderService.resetToDefaults();

            spyOn(nodeService, 'getNode').and.returnValue(of(new MinimalNode({
                id: 'fake-node',
                path: { elements: [{ nodeType: 'st:site', name: 'fake-site' }] }
            })));
            searchSpy = spyOn(searchQueryBuilderService, 'execute');
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

        afterEach(async () => {
            fixture.destroy();
            component = null;
        });

        describe('Search functionality', () => {
            let getCorrespondingNodeIdsSpy;
            let customResourcesService: CustomResourcesService;
            const entry: Node = { id: 'fakeid' } as Node;

            beforeEach(() => {
                const documentListService = TestBed.inject(DocumentListService);
                const expectedDefaultFolderNode = new NodeEntry();
                component.isSelectionValid = (node: Node) => node.isFile;

                spyOn(documentListService, 'getFolderNode').and.returnValue(of(expectedDefaultFolderNode));
                spyOn(documentListService, 'getFolder').and.returnValue(of(new NodePaging({
                    list: {
                        pagination: {},
                        entries: [],
                        source: {}
                    }
                })));

                spyOn(sitesService, 'getSites').and.returnValue(of(new SitePaging({ list: { entries: [] } })));

                customResourcesService = TestBed.inject(CustomResourcesService);
                getCorrespondingNodeIdsSpy = spyOn(customResourcesService, 'getCorrespondingNodeIds').and
                    .callFake((id) => {
                        if (id === '-sites-') {
                            return of(['123456testId', '09876543testId']);
                        }
                        return of([id]);
                    });

                component.currentFolderId = 'cat-girl-nuku-nuku';
                component.documentList.ngOnInit();

                fixture.detectChanges();
            });

            it('should the user query get updated when the user types in the search input', fakeAsync(() => {
                const updateSpy = spyOn(searchQueryBuilderService, 'update');
                typeToSearchBox('search-term');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(updateSpy).toHaveBeenCalled();
                expect(searchQueryBuilderService.userQuery).toEqual('(search-term*)');
                expect(component.searchTerm).toEqual('search-term');
            }));

            it('should perform a search when the queryBody gets updated and it is defined', fakeAsync(() => {
                typeToSearchBox('search-term');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy).toHaveBeenCalledWith(mockQueryBody);
            }));

            it('should NOT perform a search and clear the results when the queryBody gets updated and it is NOT defined', async () => {
                spyOn(component, 'clearSearch');

                searchQueryBuilderService.userQuery = '';
                searchQueryBuilderService.update();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(searchSpy).not.toHaveBeenCalled();
                expect(component.clearSearch).toHaveBeenCalled();
            });

            it('should reset the search term when clicking the clear icon', async () => {
                component.searchTerm = 'search-term';
                searchQueryBuilderService.userQuery = 'search-term';
                spyOn(component, 'clearSearch');

                fixture.detectChanges();
                const clearIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));
                clearIcon.nativeElement.click();

                fixture.detectChanges();

                expect(searchQueryBuilderService.userQuery).toEqual('');
                expect(component.searchTerm).toEqual('');
                expect(component.clearSearch).toHaveBeenCalled();
            });

            it('should load the results by calling the search api on search change', fakeAsync(() => {
                typeToSearchBox('search-term');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy).toHaveBeenCalledWith(mockQueryBody);
            }));

            it('should the query include the show files filterQuery', fakeAsync(() => {
                component.showFilesInResult = true;
                typeToSearchBox('search-term');

                const expectedQueryBody = mockQueryBody;
                expectedQueryBody.filterQueries.push({
                    query: `TYPE:'cm:folder' OR TYPE:'cm:content'`
                });

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBody);
            }));

            it('should reset the currently chosen node in case of starting a new search', fakeAsync(() => {
                component.chosenNode = [entry];
                typeToSearchBox('kakarot');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(component.chosenNode).toBeNull();
            }));

            it('should update the breadcrumb when changing to a custom site', async () => {
                component.documentList.folderNode = { id: 'fakeNodeId', isFolder: true, path: {} } as Node;

                component.siteChanged({ entry: { guid: '-mysites-', title: 'My Sites' } } as SiteEntry);

                expect(component.breadcrumbFolderTitle).toBe('My Sites');
            });

            it('should perform a search when selecting a site with the correct query', fakeAsync(() => {
                typeToSearchBox('search-term');

                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1, 'Search count should be one after only one search');

                component.siteChanged({ entry: { guid: 'namek' } } as SiteEntry);

                const expectedQueryBody = mockQueryBody;
                expectedQueryBody.filterQueries = [{ query: `ANCESTOR:'workspace://SpacesStore/namek'` }];

                expect(searchSpy.calls.count()).toBe(2, 'Search count should be two after the site change');
                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBody);
            }));

            it('should create the query with the right parameters on changing the site selectBox value from a custom dropdown menu', fakeAsync(() => {
                component.dropdownSiteList = { list: { entries: [{ entry: { guid: '-sites-' } }, { entry: { guid: 'namek' } }] } } as SitePaging;
                component.documentList.folderNode = { id: 'fakeNodeId', isFolder: true, path: {} } as Node;
                fixture.detectChanges();

                typeToSearchBox('search-term');

                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1);

                component.siteChanged({ entry: { guid: '-sites-' } } as SiteEntry);

                const expectedQueryBodyWithSiteChange = mockQueryBody;
                expectedQueryBodyWithSiteChange.filterQueries = [
                    { query: `ANCESTOR:'workspace://SpacesStore/-sites-' OR ANCESTOR:'workspace://SpacesStore/123456testId' OR ANCESTOR:'workspace://SpacesStore/09876543testId'` }
                ];

                expect(searchSpy).toHaveBeenCalled();
                expect(searchSpy.calls.count()).toBe(2);
                expect(searchSpy).toHaveBeenCalledWith(mockQueryBody);
                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBodyWithSiteChange);
            }));

            it('should get the corresponding node ids on search when a known alias is selected from dropdown', fakeAsync(() => {
                component.documentList.folderNode = { id: 'fakeNodeId', isFolder: true, path: {} } as Node;

                typeToSearchBox('vegeta');

                tick(debounceSearch);

                component.siteChanged({ entry: { guid: '-sites-' } } as SiteEntry);
                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(1, 'getCorrespondingNodeIdsSpy calls count should be one after the site changes to known alias \'-sites\-');
                expect(getCorrespondingNodeIdsSpy.calls.mostRecent().args[0]).toEqual('-sites-');
            }));

            it('should get the corresponding node ids on search when a known alias is selected from CUSTOM dropdown', fakeAsync(() => {
                component.dropdownSiteList = { list: { entries: [{ entry: { guid: '-sites-' } }, { entry: { guid: 'namek' } }] } } as SitePaging;
                component.documentList.folderNode = { id: 'fakeNodeId', isFolder: true, path: {} } as Node;

                fixture.detectChanges();

                typeToSearchBox('vegeta');

                tick(debounceSearch);

                component.siteChanged({ entry: { guid: '-sites-' } } as SiteEntry);
                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(1);
                expect(getCorrespondingNodeIdsSpy.calls.mostRecent().args[0]).toEqual('-sites-');
            }));

            it('should NOT get the corresponding node ids on search when NOTHING is selected from dropdown', fakeAsync(() => {
                component.dropdownSiteList = { list: { entries: [{ entry: { guid: '-sites-' } }, { entry: { guid: 'namek' } }] } } as SitePaging;
                fixture.detectChanges();

                typeToSearchBox('vegeta');

                tick(debounceSearch);

                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(0, 'getCorrespondingNodeIdsSpy calls count should be 0 when no site is selected');
            }));

            it('should NOT get the corresponding node ids on search when NO known alias is selected from dropdown', fakeAsync(() => {
                typeToSearchBox('vegeta');
                tick(debounceSearch);

                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(0, 'getCorrespondingNodeIdsSpy should not be called');

                component.siteChanged({ entry: { guid: 'namek' } } as SiteEntry);

                expect(getCorrespondingNodeIdsSpy).not.toHaveBeenCalled();
            }));

            it('should NOT get the corresponding node ids on search when NO known alias is selected from CUSTOM dropdown', fakeAsync(() => {
                component.dropdownSiteList = { list: { entries: [{ entry: { guid: '-sites-' } }, { entry: { guid: 'namek' } }] } } as SitePaging;
                fixture.detectChanges();

                typeToSearchBox('vegeta');
                tick(debounceSearch);

                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(0, 'getCorrespondingNodeIdsSpy should not be called');

                component.siteChanged({ entry: { guid: 'namek' } } as SiteEntry);

                expect(getCorrespondingNodeIdsSpy).not.toHaveBeenCalled();
            }));

            it('should show the search icon by default without the X (clear) icon', fakeAsync(() => {
                fixture.detectChanges();
                tick(debounceSearch);

                const searchIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-icon"]'));
                const clearIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));

                expect(searchIcon).not.toBeNull('Search icon should be in the DOM');
                expect(clearIcon).toBeNull('Clear icon should NOT be in the DOM');
            }));

            it('should show the X (clear) icon without the search icon when the search contains at least one character', fakeAsync(() => {
                fixture.detectChanges();
                typeToSearchBox('123');
                tick(debounceSearch);

                fixture.detectChanges();

                const searchIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-icon"]'));
                const clearIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));

                expect(searchIcon).toBeNull('Search icon should NOT be in the DOM');
                expect(clearIcon).not.toBeNull('Clear icon should be in the DOM');
            }));

            it('should clear the search field, nodes and chosenNode when clicking on the X (clear) icon', async () => {
                component.chosenNode = [entry];

                component.nodePaging = {
                    list: {
                        entries: [{ entry }]
                    }
                };
                component.searchTerm = 'piccolo';
                component.showingSearchResults = true;

                component.clear();

                expect(component.searchTerm).toBe('');
                expect(component.nodePaging).toEqual(null);
                expect(component.chosenNode).toBeNull();
                expect(component.showingSearchResults).toBeFalsy();
            });

            it('should the query restrict the search to the currentFolderId in case is defined', fakeAsync(() => {
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = true;
                component.ngOnInit();
                typeToSearchBox('search-term');
                tick(debounceSearch);

                const expectedQueryBody = mockQueryBody;
                expectedQueryBody.filterQueries = [{ query: `ANCESTOR:'workspace://SpacesStore/my-root-id'` }];

                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBody);
            }));

            it('should emit showingSearch event with true while searching', async () => {
                searchQueryBuilderService.userQuery = 'mock-search-term';
                searchQueryBuilderService.update();
                spyOn(customResourcesService, 'hasCorrespondingNodeIds').and.returnValue(true);
                const showingSearchSpy = spyOn(component.showingSearch, 'emit');

                component.queryBuilderService.execute({ query: { query: 'search' } });

                triggerSearchResults(fakeResultSetPaging);
                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.showingSearchResults).toBe(true);
                expect(showingSearchSpy).toHaveBeenCalledWith(true);
            });

            it('should emit showingSearch event with false if you remove search term without clicking on X (icon) icon', fakeAsync(() => {
                const showingSearchSpy = spyOn(component.showingSearch, 'emit');
                typeToSearchBox('');
                tick(debounceSearch);

                fixture.detectChanges();

                expect(component.showingSearchResults).toBe(false);
                expect(showingSearchSpy).toHaveBeenCalledWith(false);
            }));

            it('should emit showingResults event with false when clicking on the X (clear) icon', async () => {
                const showingSearchSpy = spyOn(component.showingSearch, 'emit');
                component.chosenNode = [entry];

                component.nodePaging = {
                    list: {
                        entries: [{ entry }]
                    }
                };
                component.searchTerm = 'piccolo';
                component.showingSearchResults = true;

                component.clear();

                expect(component.showingSearchResults).toBe(false);
                expect(showingSearchSpy).toHaveBeenCalledWith(false);
            });

            it('should emit showingResults event with false if search api fails', async () => {
                searchQueryBuilderService.userQuery = 'mock-search-term';
                searchQueryBuilderService.update();
                getCorrespondingNodeIdsSpy.and.throwError('Failed');
                const showingSearchSpy = spyOn(component.showingSearch, 'emit');
                component.queryBuilderService.execute({ query: { query: 'search' } });

                triggerSearchResults(fakeResultSetPaging);
                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.showingSearchResults).toBe(true);
                expect(showingSearchSpy).toHaveBeenCalledWith(true);
            });

            it('should the query restrict the search to the site and not to the currentFolderId in case is changed', async () => {
                component.queryBuilderService.userQuery = 'search-term*';
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = true;
                component.siteChanged({ entry: { guid: 'my-site-id' } } as SiteEntry);

                const expectedQueryBodyWithSiteChange = mockQueryBody;
                expectedQueryBodyWithSiteChange.filterQueries = [
                    { query: `ANCESTOR:'workspace://SpacesStore/my-site-id'` }
                ];

                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBodyWithSiteChange);
            });

            it('should restrict the breadcrumb to the currentFolderId in case restrictedRoot is true', async () => {
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = true;
                component.ngOnInit();
                expect(component.breadcrumbRootId).toEqual('my-root-id');
            });

            it('should NOT restrict the breadcrumb to the currentFolderId in case restrictedRoot is false', async () => {
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = false;
                component.ngOnInit();
                expect(component.breadcrumbRootId).toBeUndefined();
            });

            it('should clear the search field, nodes and chosenNode when deleting the search input', fakeAsync(() => {
                spyOn(component, 'clearSearch').and.callThrough();
                typeToSearchBox('a');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy.calls.count()).toBe(1);

                typeToSearchBox('');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy.calls.count()).toBe(1, 'no other search has been performed');
                expect(component.clearSearch).toHaveBeenCalled();
                expect(component.folderIdToShow).toBe('cat-girl-nuku-nuku', 'back to the folder in which the search was performed');
            }));

            it('should folderIdToShow equal the folder node id when navigation changes', async () => {
                component.folderIdToShow = null;
                const folderChangeEvent: NodeEntryEvent = new NodeEntryEvent(fakeNodeEntry);
                component.onFolderChange(folderChangeEvent);

                expect(component.folderIdToShow).toEqual(fakeNodeEntry.id);
            });

            it('should clear the search field, nodes and chosenNode on folder navigation in the results list', async () => {
                spyOn(component, 'clearSearch').and.callThrough();
                triggerSearchResults(fakeResultSetPaging);

                fixture.detectChanges();

                component.onFolderChange(nodeEntryEvent);
                fixture.detectChanges();

                expect(component.clearSearch).toHaveBeenCalled();
            });

            it('should show nodes from the same folder as selected in the dropdown on clearing the search input', fakeAsync(() => {
                typeToSearchBox('piccolo');
                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1);

                component.siteChanged({ entry: { guid: 'namek' } } as SiteEntry);

                expect(searchSpy.calls.count()).toBe(2);

                component.clear();

                expect(component.searchTerm).toBe('');
                expect(component.folderIdToShow).toBe('namek');
            }));

            it('should show the current folder\'s content instead of search results if search was not performed', async () => {
                const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
            });

            it('should pass through the rowFilter to the documentList', async () => {
                const filter = (shareDataRow: ShareDataRow) =>
                    shareDataRow.node.entry.name === 'impossible-name';

                component.rowFilter = filter;

                fixture.detectChanges();

                const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.rowFilter({
                    node: {
                        entry: new Node({
                            name: 'impossible-name',
                            id: 'name'
                        })
                    }
                }))
                    .toBe(filter({
                        node: {
                            entry: new Node({
                                name: 'impossible-name',
                                id: 'name'
                            })
                        }
                    } as ShareDataRow));
            });

            it('should pass through the excludeSiteContent to the rowFilter of the documentList', async () => {
                component.excludeSiteContent = ['blog'];

                fixture.detectChanges();

                const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.rowFilter).toBeTruthy('Document list should have had a rowFilter');

                const testSiteContent = new Node({ id: 'blog-id', properties: { 'st:componentId': 'blog' } });
                expect(documentList.componentInstance.rowFilter({ node: { entry: testSiteContent } }, null, null))
                    .toBe(false);
            });

            it('should pass through the imageResolver to the documentList', async () => {
                const resolver = () => 'piccolo';
                component.imageResolver = resolver;

                fixture.detectChanges();

                const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.imageResolver).toBe(resolver);
            });

            it('should show the result list when search was performed', (done) => {
                typeToSearchBox();

                setTimeout(() => {
                    triggerSearchResults(fakeResultSetPaging);

                    fixture.detectChanges();
                    const documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                    expect(documentList).not.toBeNull('Document list should be shown');
                    expect(component.hasValidQuery).toEqual(true);
                    expect(documentList.componentInstance.currentFolderId).toBeNull();
                    done();
                }, 300);
            });

            it('should not show the result list when results are returned but there is no search term typed', (done) => {
                searchQueryBuilderService.userQuery = '';
                searchQueryBuilderService.update();

                setTimeout(() => {
                    triggerSearchResults(fakeResultSetPaging);
                    fixture.detectChanges();

                    expect(component.hasValidQuery).toEqual(false);
                    expect(component.showingSearchResults).toEqual(false);
                    done();
                }, 300);
            });

            it('should highlight the results when search was performed in the next timeframe', (done) => {
                typeToSearchBox('My');

                setTimeout(() => {
                    triggerSearchResults(fakeResultSetPaging);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        expect(fixture.debugElement.nativeElement.querySelector('.adf-highlight').innerHTML).toBe('My');

                        done();
                    });
                }, 300);
            });

            it('should show the default text instead of result list if search was cleared', (done) => {
                typeToSearchBox();

                setTimeout(() => {
                    triggerSearchResults(fakeResultSetPaging);
                    fixture.detectChanges();

                    fixture.whenStable().then(() => {
                        const clearButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));
                        expect(clearButton).not.toBeNull('Clear button should be in DOM');
                        clearButton.triggerEventHandler('click', {});
                        fixture.detectChanges();

                        const documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                        expect(documentList).not.toBeNull('Document list should be shown');
                        expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
                        done();
                    });
                }, 300);
            });

            it('should reload the original folderId when clearing the search input', fakeAsync(() => {
                typeToSearchBox('search-term');
                tick(debounceSearch);
                fixture.detectChanges();

                expect(component.folderIdToShow).toBe(null);

                typeToSearchBox('');
                tick(debounceSearch);
                fixture.detectChanges();

                expect(component.folderIdToShow).toBe('cat-girl-nuku-nuku');
            }));

            it('should set the folderIdToShow to the default "currentFolderId" if siteId is undefined', (done) => {
                component.siteChanged({ entry: { guid: 'Kame-Sennin Muten Roshi' } } as SiteEntry);
                fixture.detectChanges();

                let documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                expect(documentList.componentInstance.currentFolderId).toBe('Kame-Sennin Muten Roshi');

                component.siteChanged({ entry: { guid: undefined } } as SiteEntry);
                fixture.detectChanges();

                documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');

                done();
            });

            describe('Pagination "Load more" button', () => {

                it('should NOT be shown by default', () => {
                    fixture.detectChanges();
                    const pagination = fixture.debugElement.query(By.css('[data-automation-id="adf-infinite-pagination-button"]'));
                    expect(pagination).toBeNull();
                });

                it('button callback should load the next batch of folder results when there is no searchTerm', () => {
                    component.searchTerm = '';
                    fixture.detectChanges();

                    component.getNextPageOfSearch({
                        hasMoreItems: false,
                        skipCount: 10,
                        maxItems: 45,
                        totalItems: 0
                    });

                    fixture.detectChanges();
                    expect(component.searchTerm).toBe('');

                    expect(component.infiniteScroll).toBeTruthy();
                    expect(component.queryBuilderService.paging.maxItems).toBe(45);
                    expect(searchSpy).not.toHaveBeenCalled();
                });

                it('should set its loading state to true to perform a new search', async () => {
                    component.prepareDialogForNewSearch(mockQueryBody);
                    fixture.detectChanges();
                    await fixture.whenStable();

                    const spinnerSelector = By.css('[data-automation-id="content-node-selector-search-pagination"] [data-automation-id="adf-infinite-pagination-spinner"]');
                    const paginationLoading = fixture.debugElement.query(spinnerSelector);

                    expect(paginationLoading).not.toBeNull();
                });

                it('Should infinite pagination target be null when we use it for search ', fakeAsync(() => {
                    component.showingSearchResults = true;
                    typeToSearchBox('shenron');
                    tick(debounceSearch);
                    fixture.detectChanges();

                    expect(component.target).toBeNull();
                }));

                it('Should infinite pagination target be present when search finish', () => {
                    triggerSearchResults(fakeResultSetPaging);
                    fixture.detectChanges();

                    expect(component.target).not.toBeNull();
                });

                it('Should infinite pagination target on init be the document list', fakeAsync(() => {
                    component.showingSearchResults = true;

                    expect(component.target).toEqual(component.documentList);
                }));

                it('Should set the scope to nodes when the component inits', () => {
                    const expectedScope: RequestScope = { locations: 'nodes' };
                    const setScopeSpy = spyOn(component.queryBuilderService, 'setScope');
                    component.ngOnInit();

                    expect(setScopeSpy).toHaveBeenCalledWith(expectedScope);
                });
            });
        });

    });
});
