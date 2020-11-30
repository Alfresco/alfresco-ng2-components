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

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { tick, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NodeEntry, Node, SiteEntry, SitePaging, NodePaging, ResultSetPaging, RequestScope } from '@alfresco/js-api';
import { SitesService, setupTestBed, NodesApiService } from '@alfresco/adf-core';
import { of, throwError } from 'rxjs';
import { DropdownBreadcrumbComponent } from '../breadcrumb';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel.component';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DocumentListService } from '../document-list/services/document-list.service';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { DropdownSitesComponent } from '../site-dropdown/sites-dropdown.component';
import { CustomResourcesService } from '../document-list/services/custom-resources.service';
import { NodeEntryEvent, ShareDataRow } from '../document-list';
import { TranslateModule } from '@ngx-translate/core';
import { SearchQueryBuilderService } from '../search';
import { mockQueryBody } from '../mock/search-query.mock';
import { ContentNodeSelectorPanelService } from './content-node-selector-panel.service';
import { mockContentModelTextProperty } from '../mock/content-model.mock';

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
    let contentNodeSelectorPanelService: ContentNodeSelectorPanelService;

    function typeToSearchBox(searchTerm = 'string-to-search') {
        const searchInput = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-input"]'));
        searchInput.nativeElement.value = searchTerm;
        component.searchInput.setValue(searchTerm);
        fixture.detectChanges();
    }

    function triggerSearchResults(searchResults: ResultSetPaging) {
        component.queryBuilderService.executed.next(searchResults);
    }

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
            searchQueryBuilderService = component.queryBuilderService;
            component.queryBuilderService.resetToDefaults();

            spyOn(nodeService,  'getNode').and.returnValue(of({ id: 'fake-node', path: { elements: [{ nodeType: 'st:site', name: 'fake-site'}] } }));
            searchSpy = spyOn(searchQueryBuilderService, 'execute');
            const fakeSite = new SiteEntry({ entry: { id: 'fake-site', guid: 'fake-site', title: 'fake-site', visibility: 'visible' } });
            spyOn(sitesService, 'getSite').and.returnValue(of(fakeSite));
        });

        afterEach(() => {
            fixture.destroy();
        });

        describe('Parameters', () => {

            let documentListService: DocumentListService;

            beforeEach(() => {
                documentListService = TestBed.inject(DocumentListService);

                spyOn(documentListService, 'getFolderNode').and.returnValue(of(<NodeEntry> { entry: { path: { elements: [] } } }));
                spyOn(documentListService, 'getFolder').and.returnValue(throwError('No results for test'));
                spyOn(sitesService, 'getSites').and.returnValue(of({
                    list: {
                        entries: [<SiteEntry> { entry: { guid: 'namek', id: 'namek' } },
                            <SiteEntry> { entry: { guid: 'blog', id: 'blog' } }]
                    }
                }));

                component.currentFolderId = 'cat-girl-nuku-nuku';
                fixture.detectChanges();
            });

            it('should the document list use the server ordering', () => {
                expect(component.documentList.sortingMode).toBe('server');
            });

            it('should trigger the select event when selection has been made', (done) => {
                const expectedNode = <Node> { id: 'fakeid'};
                component.select.subscribe((nodes) => {
                    expect(nodes.length).toBe(1);
                    expect(nodes[0]).toBe(expectedNode);
                    done();
                });

                component.chosenNode = [expectedNode];
            });

            it('should be able to filter out the exclude site content', () => {
                component.excludeSiteContent = ['blog'];
                fixture.detectChanges();

                const testSiteContent = new Node({ id: 'blog-id', properties: { 'st:componentId': 'blog' } });
                expect(component.rowFilter(<any> { node: { entry: testSiteContent } }, null, null))
                    .toBe(false, 'did not filter out blog');
            });

            it('should still be able to filter out the exclude site content after rowFilter changes', () => {
                const filterFunction1 = () => {
                    return true;
                };
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
                expect(component.rowFilter(<any> { node: { entry: testSiteContent } }, null, null))
                    .toBe(false, 'did not filter out blog with filterFunction1');

                component.rowFilter = filterFunction2;
                fixture.detectChanges();
                expect(component.rowFilter(<any> { node: { entry: testSiteContent } }, null, null))
                    .toBe(false, 'did not filter out blog with filterFunction2');
            });

            it('should NOT filter out any site content by default', () => {
                fixture.detectChanges();

                const testSiteContent = new Node({ id: 'blog-id', properties: { 'st:componentId': 'blog' } });
                expect(component.rowFilter(<any> { node: { entry: testSiteContent } }, null, null)).toBe(true);
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

                spyOn(documentListService, 'getFolderNode').and.returnValue(of(<NodeEntry> { entry: { path: { elements: [] } } }));
                spyOn(documentListService, 'getFolder').and.returnValue(throwError('No results for test'));
                spyOn(sitesService, 'getSites').and.returnValue(of({ list: { entries: [] } }));

                component.currentFolderId = 'cat-girl-nuku-nuku';
                fixture.detectChanges();
            });

            it('should show the breadcrumb for the currentFolderId by default', (done) => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb).not.toBeNull();
                    expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);
                    done();
                });
            });

            it('should not show the breadcrumb if search was performed as last action', async () => {
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

            it('should show the breadcrumb for the selected node when search results are displayed', async () => {
                triggerSearchResults(fakeResultSetPaging);

                const chosenNode = new Node({ path: { elements: ['one'] } });
                component.onCurrentSelection([ { entry: chosenNode } ]);
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

                const chosenNode = <Node> { path: { elements: [] } };
                component.onCurrentSelection([ { entry: chosenNode } ]);
                fixture.detectChanges();

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);
            });

            it('should keep breadcrumb folderNode unchanged if breadcrumbTransform is NOT defined', (done) => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(component.breadcrumbTransform).toBeNull();

                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);
                    done();
                });
            });

            it('should make changes to breadcrumb folderNode if breadcrumbTransform is defined', (done) => {
                const transformedFolderNode = <Node> {
                    id: 'trans-node',
                    name: 'trans-node-name',
                    path: { elements: [{ id: 'testId', name: 'testName' }] }
                };
                component.breadcrumbTransform = (() => {
                    return transformedFolderNode;
                });
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    expect(component.breadcrumbTransform).not.toBeNull();

                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb.componentInstance.route[0].name).toBe('testName');
                    expect(breadcrumb.componentInstance.route[0].id).toBe('testId');
                    done();
                });
            });

            it('should be able to set current folder id based on breadcrumb navigation path option', async () => {
                triggerSearchResults(fakeResultSetPaging);

                const chosenNode = new Node({ path: { elements: [{ id: 'node-one-id',  name: 'one' }, { id: 'node-two-id',  name: 'two' }, { id: 'node-three-id',  name: 'three' }] } });
                component.onCurrentSelection([ { entry: chosenNode } ]);
                fixture.detectChanges();

                const breadcrumb = document.querySelector('[data-automation-id="dropdown-breadcrumb-trigger"]');
                breadcrumb.dispatchEvent(new MouseEvent('click'));
                fixture.detectChanges();

                const pathOption = document.querySelectorAll('.adf-dropdown-breadcrumb-path-option');
                pathOption[0].dispatchEvent(new MouseEvent('click'));

                expect(component.folderIdToShow).toBe('node-three-id');
            });
        });

        describe('Site selection', () => {

            beforeEach(() => {
                spyOn(sitesService, 'getSites').and.returnValue(of({ list: { entries: [] } }));
                component.currentFolderId = 'fake-starting-folder';
            });

            it('should trigger siteChange event on init with parent site Title of start folder', (done) => {
                component.siteChange.subscribe((siteTitle: string) => {
                    expect(siteTitle).toBe('fake-site');
                    done();
                });

                component.ngOnInit();
                fixture.detectChanges();
                expect(component.startSiteGuid).toBe('fake-site');
            });

            it('should trigger siteChange event when a site is selected in sites-dropdown', (done) => {
                const fakeSiteEntry = new SiteEntry({ entry: { title: 'fake-new-site', guid: 'fake-new-site' } });
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    component.siteChange.subscribe((siteTitle: string) => {
                        expect(siteTitle).toBe('fake-new-site');
                        done();
                    });

                    const sitesDropdown = fixture.debugElement.query(By.directive(DropdownSitesComponent));
                    sitesDropdown.componentInstance.selectedSite({value: fakeSiteEntry});
                });
            });
        });

        describe('Search functionality', () => {
            let getCorrespondingNodeIdsSpy;
            let customResourcesService: CustomResourcesService;
            const entry: Node = <Node> { id: 'fakeid'};

            beforeEach(() => {
                const documentListService = TestBed.inject(DocumentListService);
                const expectedDefaultFolderNode = <NodeEntry> { entry: { path: { elements: [] } } };

                spyOn(documentListService, 'getFolderNode').and.returnValue(of(expectedDefaultFolderNode));
                spyOn(documentListService, 'getFolder').and.returnValue(of({
                    list: {
                        pagination: {},
                        entries: [],
                        source: {}
                    }
                }));

                spyOn(sitesService, 'getSites').and.returnValue(of({ list: { entries: [] } }));

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

            it('should perform a search when the queryBody gets updated and it is defined', async () => {
                searchQueryBuilderService.userQuery = 'search-term*';
                searchQueryBuilderService.update();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(searchSpy).toHaveBeenCalledWith(mockQueryBody);
            });

            it('should NOT perform a search and clear the results when the queryBody gets updated and it is NOT defined', async () => {
                spyOn(component, 'clearSearch');

                searchQueryBuilderService.userQuery = '';
                searchQueryBuilderService.update();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(searchSpy).not.toHaveBeenCalled();
                expect(component.clearSearch).toHaveBeenCalled();
            });

            it('should reset the search term when clicking the clear icon',  () => {
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
                component.siteChanged(<SiteEntry> { entry: { guid: '-mysites-', title: 'My Sites' } });

                expect(component.breadcrumbFolderTitle).toBe('My Sites');
            });

            it('should perform a search when selecting a site with the correct query', fakeAsync(() => {
                typeToSearchBox('search-term');

                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1, 'Search count should be one after only one search');

                component.siteChanged(<SiteEntry> { entry: { guid: 'namek' } });

                const expectedQueryBody = mockQueryBody;
                expectedQueryBody.filterQueries = [ { query: `ANCESTOR:'workspace://SpacesStore/namek'`} ];

                expect(searchSpy.calls.count()).toBe(2, 'Search count should be two after the site change');
                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBody);
            }));

            it('should create the query with the right parameters on changing the site selectBox value from a custom dropdown menu', fakeAsync(() => {
                component.dropdownSiteList = <SitePaging> { list: { entries: [<SiteEntry> { entry: { guid: '-sites-' } }, <SiteEntry> { entry: { guid: 'namek' } }] } };
                fixture.detectChanges();

                typeToSearchBox('search-term');

                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1);

                component.siteChanged(<SiteEntry> { entry: { guid: '-sites-' } });

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
                typeToSearchBox('vegeta');

                tick(debounceSearch);

                component.siteChanged(<SiteEntry> { entry: { guid: '-sites-' } });
                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(1, 'getCorrespondingNodeIdsSpy calls count should be one after the site changes to known alias \'-sites\-');
                expect(getCorrespondingNodeIdsSpy.calls.mostRecent().args[0]).toEqual('-sites-');
            }));

            it('should get the corresponding node ids on search when a known alias is selected from CUSTOM dropdown', fakeAsync(() => {
                component.dropdownSiteList = <SitePaging> { list: { entries: [<SiteEntry> { entry: { guid: '-sites-' } }, <SiteEntry> { entry: { guid: 'namek' } }] } };
                fixture.detectChanges();

                typeToSearchBox('vegeta');

                tick(debounceSearch);

                component.siteChanged(<SiteEntry> { entry: { guid: '-sites-' } });
                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(1);
                expect(getCorrespondingNodeIdsSpy.calls.mostRecent().args[0]).toEqual('-sites-');
            }));

            it('should NOT get the corresponding node ids on search when NOTHING is selected from dropdown', fakeAsync(() => {
                component.dropdownSiteList = <SitePaging> { list: { entries: [<SiteEntry> { entry: { guid: '-sites-' } }, <SiteEntry> { entry: { guid: 'namek' } }] } };
                fixture.detectChanges();

                typeToSearchBox('vegeta');

                tick(debounceSearch);

                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(0, 'getCorrespondingNodeIdsSpy calls count should be 0 when no site is selected');
            }));

            it('should NOT get the corresponding node ids on search when NO known alias is selected from dropdown', fakeAsync(() => {
                typeToSearchBox('vegeta');
                tick(debounceSearch);

                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(0, 'getCorrespondingNodeIdsSpy should not be called');

                component.siteChanged(<SiteEntry> { entry: { guid: 'namek' } });

                expect(getCorrespondingNodeIdsSpy).not.toHaveBeenCalled();
            }));

            it('should NOT get the corresponding node ids on search when NO known alias is selected from CUSTOM dropdown', fakeAsync(() => {
                component.dropdownSiteList = <SitePaging> { list: { entries: [<SiteEntry> { entry: { guid: '-sites-' } }, <SiteEntry> { entry: { guid: 'namek' } }] } };
                fixture.detectChanges();

                typeToSearchBox('vegeta');
                tick(debounceSearch);

                expect(getCorrespondingNodeIdsSpy.calls.count()).toBe(0, 'getCorrespondingNodeIdsSpy should not be called');

                component.siteChanged(<SiteEntry> { entry: { guid: 'namek' } });

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

            it('should clear the search field, nodes and chosenNode when clicking on the X (clear) icon', () => {
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
                expectedQueryBody.filterQueries = [ { query: `ANCESTOR:'workspace://SpacesStore/my-root-id'`} ];

                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBody);
            }));

            it('should emit showingSearch event with true while searching', async () => {
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

            it('should emit showingResults event with false when clicking on the X (clear) icon', () => {
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
                getCorrespondingNodeIdsSpy.and.throwError('Failed');
                const showingSearchSpy = spyOn(component.showingSearch, 'emit');
                component.queryBuilderService.execute({ query: { query: 'search' } });

                triggerSearchResults(fakeResultSetPaging);
                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.showingSearchResults).toBe(true);
                expect(showingSearchSpy).toHaveBeenCalledWith(true);
            });

            it('should the query restrict the search to the site and not to the currentFolderId in case is changed', () => {
                component.queryBuilderService.userQuery = 'search-term*';
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = true;
                component.siteChanged(<SiteEntry> { entry: { guid: 'my-site-id' } });

                const expectedQueryBodyWithSiteChange = mockQueryBody;
                expectedQueryBodyWithSiteChange.filterQueries = [
                    { query: `ANCESTOR:'workspace://SpacesStore/my-site-id'` }
                ];

                expect(searchSpy).toHaveBeenCalledWith(expectedQueryBodyWithSiteChange);
            });

            it('should restrict the breadcrumb to the currentFolderId in case restrictedRoot is true', () => {
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = true;
                component.ngOnInit();
                expect(component.breadcrumbRootId).toEqual('my-root-id');
            });

            it('should NOT restrict the breadcrumb to the currentFolderId in case restrictedRoot is false', () => {
                component.currentFolderId = 'my-root-id';
                component.restrictRootToCurrentFolderId = false;
                component.ngOnInit();
                expect(component.breadcrumbRootId).toBeUndefined();
            });

            it('should clear the search field, nodes and chosenNode when deleting the search input', fakeAsync (() => {
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

            it('should clear the search field, nodes and chosenNode on folder navigation in the results list', async () => {
                spyOn(component, 'clearSearch').and.callThrough();
                triggerSearchResults(fakeResultSetPaging);

                fixture.detectChanges();

                component.onFolderChange(nodeEntryEvent);
                fixture.detectChanges();

                expect(component.clearSearch).toHaveBeenCalled();
            });

            it('should show nodes from the same folder as selected in the dropdown on clearing the search input', fakeAsync (() => {
                typeToSearchBox('piccolo');
                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1);

                component.siteChanged(<SiteEntry> { entry: { guid: 'namek' } });

                expect(searchSpy.calls.count()).toBe(2);

                component.clear();

                expect(component.searchTerm).toBe('');
                expect(component.folderIdToShow).toBe('namek');
            }));

            it('should show the current folder\'s content instead of search results if search was not performed', () => {
                const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
            });

            it('should pass through the rowFilter to the documentList', () => {
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
                    .toBe(filter(<ShareDataRow> {
                        node: {
                            entry: new Node({
                                name: 'impossible-name',
                                id: 'name'
                            })
                        }
                    }));
            });

            it('should pass through the excludeSiteContent to the rowFilter of the documentList', () => {
                component.excludeSiteContent = ['blog'];

                fixture.detectChanges();

                const documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.rowFilter).toBeTruthy('Document list should have had a rowFilter');

                const testSiteContent = new Node({ id: 'blog-id', properties: { 'st:componentId': 'blog' } });
                expect(documentList.componentInstance.rowFilter(<any> { node: { entry: testSiteContent } }, null, null))
                    .toBe(false);
            });

            it('should pass through the imageResolver to the documentList', () => {
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
                    expect(documentList.componentInstance.currentFolderId).toBeNull();
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
                component.siteChanged(<SiteEntry> { entry: { guid: 'Kame-Sennin Muten Roshi' } });
                fixture.detectChanges();

                let documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                expect(documentList.componentInstance.currentFolderId).toBe('Kame-Sennin Muten Roshi');

                component.siteChanged(<SiteEntry> { entry: { guid: undefined } });
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

                it('should set its loading state to true to perform a new search', async() => {
                    component.prepareDialogForNewSearch(mockQueryBody);
                    fixture.detectChanges();
                    await fixture.whenStable();

                    const spinnerSelector = By.css('[data-automation-id="content-node-selector-search-pagination"] [data-automation-id="adf-infinite-pagination-spinner"]');
                    const paginationLoading = fixture.debugElement.query(spinnerSelector);

                    expect(paginationLoading).not.toBeNull();
                });

                it('Should infinite pagination target be null when we use it for search ', fakeAsync (() => {
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

        describe('Chosen node', () => {

            const entry: Node = <Node> { id: 'fakeid'};
            const nodePage: NodePaging = <NodePaging> { list: {}, pagination: {} };
            let hasAllowableOperations;

            function returnHasPermission(): boolean {
                return hasAllowableOperations;
            }

            beforeEach(() => {
                spyOn(sitesService, 'getSites').and.returnValue(of({ list: { entries: [] } }));
            });

            describe('in the case when isSelectionValid is a custom function for checking permissions,', () => {

                beforeEach(() => {
                    component.isSelectionValid = returnHasPermission;
                });

                it('should NOT be null after selecting node with the necessary permissions', async () => {
                    hasAllowableOperations = true;
                    component.documentList.folderNode = entry;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode[0]).toBe(entry);
                    });

                    component.documentList.ready.emit(nodePage);
                });

                it('should be null after selecting node without the necessary permissions', async () => {
                    hasAllowableOperations = false;
                    component.documentList.folderNode = entry;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                    });

                    component.documentList.ready.emit(nodePage);
                });

                it('should NOT be null after clicking on a node (with the right permissions) in the list (onNodeSelect)', async() => {
                    hasAllowableOperations = true;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode[0]).toBe(entry);
                    });

                    component.onCurrentSelection([ { entry } ]);
                });

                it('should remain empty when clicking on a node (with the WRONG permissions) in the list (onNodeSelect)', async () => {
                    hasAllowableOperations = false;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toEqual([]);
                        expect(component.chosenNode).toEqual([]);
                    });

                    component.onCurrentSelection([ { entry } ]);
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
                    component.onCurrentSelection([{ entry: <Node> {} }]);

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
                    component.onCurrentSelection([{ entry: <Node> {} }]);

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
                    component.onCurrentSelection([{ entry: <Node> {} }]);

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

        });

        describe('Search panel', () => {

            beforeEach(() => {
                contentNodeSelectorPanelService.customModels = undefined;
            });

            it ('should search panel be collapsed by default and expand when clicking the filter button', async() => {
                contentNodeSelectorPanelService.customModels = [mockContentModelTextProperty];
                fixture.detectChanges();

                expect(component.searchPanelExpanded).toEqual(false);

                const toggleFiltersPanelButton = fixture.debugElement.query(By.css('[data-automation-id="adf-toggle-search-panel-button"]'));
                toggleFiltersPanelButton.nativeElement.click();

                fixture.detectChanges();
                await fixture.whenStable();

                expect(component.searchPanelExpanded).toEqual(true);
            });

            it ('should search panel be present when the filter section is expanded',  () => {
                component.searchPanelExpanded = true;
                fixture.detectChanges();

                const searchPanelContainer = fixture.debugElement.query(By.css('[data-automation-id="adf-search-panel-container"]'));

                expect(searchPanelContainer).not.toBe(null);
            });

            it('should filter button be present only when there are custom models',  () => {
                contentNodeSelectorPanelService.customModels = [mockContentModelTextProperty];
                fixture.detectChanges();

                const toggleFiltersPanelButton = fixture.debugElement.query(By.css('[data-automation-id="adf-toggle-search-panel-button"]'));

                expect(toggleFiltersPanelButton).not.toEqual(null);
            });

            it('should filter button not be present when there are no custom models',  () => {
                fixture.detectChanges();

                const toggleFiltersPanelButton = fixture.debugElement.query(By.css('[data-automation-id="adf-toggle-search-panel-button"]'));

                expect(toggleFiltersPanelButton).toEqual(null);
            });
        });
    });
});
