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
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NodeEntry, Node, SiteEntry, SitePaging, NodePaging } from '@alfresco/js-api';
import { SearchService, SitesService, setupTestBed, NodesApiService } from '@alfresco/adf-core';
import { Observable, Observer, of, throwError } from 'rxjs';
import { DropdownBreadcrumbComponent } from '../breadcrumb';
import { ContentNodeSelectorPanelComponent } from './content-node-selector-panel.component';
import { ContentNodeSelectorService } from './content-node-selector.service';
import { ContentTestingModule } from '../testing/content.testing.module';
import { DocumentListService } from '../document-list/services/document-list.service';
import { DocumentListComponent } from '../document-list/components/document-list.component';
import { DropdownSitesComponent } from '../site-dropdown/sites-dropdown.component';
import { CustomResourcesService } from '../document-list/services/custom-resources.service';
import { ShareDataRow } from '../document-list';
import { TranslateModule } from '@ngx-translate/core';

const ONE_FOLDER_RESULT = {
    list: {
        entries: [
            {
                entry: {
                    id: '123', name: 'MyFolder', isFile: false, isFolder: true,
                    createdByUser: { displayName: 'John Doe' },
                    modifiedByUser: { displayName: 'John Doe' }
                }
            }
        ],
        pagination: {
            hasMoreItems: true
        }
    }
};

describe('ContentNodeSelectorComponent', () => {
    const debounceSearch = 200;
    let component: ContentNodeSelectorPanelComponent;
    let fixture: ComponentFixture<ContentNodeSelectorPanelComponent>;
    let contentNodeSelectorService: ContentNodeSelectorService;
    let searchService: SearchService;
    let nodeService: NodesApiService;
    let sitesService: SitesService;
    let searchSpy: jasmine.Spy;
    let cnSearchSpy: jasmine.Spy;

    let _observer: Observer<NodePaging>;

    function typeToSearchBox(searchTerm = 'string-to-search') {
        const searchInput = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-input"]'));
        searchInput.nativeElement.value = searchTerm;
        component.searchInput.setValue(searchTerm);
        fixture.detectChanges();
    }

    function respondWithSearchResults(result) {
        _observer.next(result);
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

            searchService = TestBed.inject(SearchService);
            nodeService = TestBed.inject(NodesApiService);
            contentNodeSelectorService = TestBed.inject(ContentNodeSelectorService);
            sitesService = TestBed.inject(SitesService);

            spyOn(nodeService,  'getNode').and.returnValue(of({ id: 'fake-node', path: { elements: [{ nodeType: 'st:site', name: 'fake-site'}] } }));
            cnSearchSpy = spyOn(contentNodeSelectorService, 'search').and.callThrough();
            searchSpy = spyOn(searchService, 'searchByQueryBody').and.callFake(() => {
                return new Observable((observer: Observer<NodePaging>) => {
                    _observer = observer;
                });
            });
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
                expect(component.documentList.sorting).toBe('server');
            });

            it('should trigger the select event when selection has been made', (done) => {
                const expectedNode = <Node> {};
                component.select.subscribe((nodes) => {
                    expect(nodes.length).toBe(1);
                    expect(nodes[0]).toBe(expectedNode);
                    done();
                });

                component.chosenNode = expectedNode;
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

            it('should not show the breadcrumb if search was performed as last action', fakeAsync(() => {
                typeToSearchBox();
                tick(debounceSearch);

                fixture.detectChanges();

                respondWithSearchResults(ONE_FOLDER_RESULT);

                tick(debounceSearch);

                fixture.detectChanges();

                tick(debounceSearch);

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).toBeNull();
            }));

            it('should show the breadcrumb again on folder navigation in the results list', fakeAsync(() => {
                typeToSearchBox();
                tick(debounceSearch);

                fixture.detectChanges();

                respondWithSearchResults(ONE_FOLDER_RESULT);
                tick(debounceSearch);

                fixture.detectChanges();

                tick(debounceSearch);

                component.onFolderChange();
                fixture.detectChanges();
                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();

            }));

            it('should show the breadcrumb for the selected node when search results are displayed', fakeAsync(() => {
                typeToSearchBox();

                tick(debounceSearch);

                fixture.detectChanges();

                respondWithSearchResults(ONE_FOLDER_RESULT);
                fixture.detectChanges();

                tick(debounceSearch);

                const chosenNode = new Node({ path: { elements: ['one'] } });
                component.onNodeSelect({ detail: { node: { entry: chosenNode } } });
                fixture.detectChanges();

                tick(debounceSearch);

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode.path).toBe(chosenNode.path);
            }));

            it('should NOT show the breadcrumb for the selected node when not on search results list', fakeAsync(() => {
                typeToSearchBox();

                fixture.detectChanges();

                respondWithSearchResults(ONE_FOLDER_RESULT);
                fixture.detectChanges();

                component.onFolderChange();
                fixture.detectChanges();

                const chosenNode = <Node> { path: { elements: [] } };
                component.onNodeSelect({ detail: { node: { entry: chosenNode } } });
                fixture.detectChanges();

                tick(debounceSearch);

                const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                expect(breadcrumb).not.toBeNull();
                expect(breadcrumb.componentInstance.folderNode).toEqual(undefined);
            }));

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

            const defaultSearchOptions = (searchTerm, rootNodeId = undefined, skipCount = 0, showFiles = false) => {

                const parentFiltering = rootNodeId ? [{ query: `ANCESTOR:'workspace://SpacesStore/${rootNodeId}'` }] : [];

                const defaultSearchNode: any = {
                    query: {
                        query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
                    },
                    include: ['path', 'allowableOperations', 'properties'],
                    paging: {
                        maxItems: 25,
                        skipCount: skipCount
                    },
                    filterQueries: [
                        { query: `TYPE:'cm:folder'${ showFiles ? " OR TYPE:'cm:content'" : '' }` },
                        { query: 'NOT cm:creator:System' },
                        ...parentFiltering
                    ],
                    scope: {
                        locations: ['nodes']
                    }
                };

                return defaultSearchNode;
            };

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

                const customResourcesService = TestBed.inject(CustomResourcesService);
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

            it('should load the results by calling the search api on search change', fakeAsync(() => {
                typeToSearchBox('kakarot');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy).toHaveBeenCalledWith(defaultSearchOptions('kakarot'));
            }));

            it('should show files in results by calling the search api on search change', fakeAsync(() => {
                component.showFilesInResult = true;
                typeToSearchBox('kakarot');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy).toHaveBeenCalledWith(defaultSearchOptions('kakarot', undefined, 0, true));
            }));

            it('should reset the currently chosen node in case of starting a new search', fakeAsync(() => {
                component.chosenNode = <Node> {};
                typeToSearchBox('kakarot');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(component.chosenNode).toBeNull();
            }));

            it('should update the breadcrumb when changing to a custom site', fakeAsync(() => {
                component.siteChanged(<SiteEntry> { entry: { guid: '-mysites-', title: 'My Sites' } });

                expect(component.breadcrumbFolderTitle).toBe('My Sites');
            }));

            it('should call the search api on changing the site selectBox value', fakeAsync(() => {
                typeToSearchBox('vegeta');

                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1, 'Search count should be one after only one search');

                component.siteChanged(<SiteEntry> { entry: { guid: 'namek' } });

                expect(searchSpy.calls.count()).toBe(2, 'Search count should be two after the site change');
                expect(searchSpy.calls.argsFor(1)).toEqual([defaultSearchOptions('vegeta', 'namek')]);
            }));

            it('should call the content node selector\'s search with the right parameters on changing the site selectbox\'s value', fakeAsync(() => {
                typeToSearchBox('vegeta');

                tick(debounceSearch);
                expect(cnSearchSpy.calls.count()).toBe(1);

                component.siteChanged(<SiteEntry> { entry: { guid: '-sites-' } });

                expect(cnSearchSpy).toHaveBeenCalled();
                expect(cnSearchSpy.calls.count()).toBe(2);
                expect(cnSearchSpy).toHaveBeenCalledWith('vegeta', undefined, 0, 25, [], false);
                expect(cnSearchSpy).toHaveBeenCalledWith('vegeta', '-sites-', 0, 25, ['123456testId', '09876543testId'], false);
            }));

            it('should call the content node selector\'s search with the right parameters on changing the site selectBox value from a custom dropdown menu', fakeAsync(() => {
                component.dropdownSiteList = <SitePaging> { list: { entries: [<SiteEntry> { entry: { guid: '-sites-' } }, <SiteEntry> { entry: { guid: 'namek' } }] } };
                fixture.detectChanges();

                typeToSearchBox('vegeta');

                tick(debounceSearch);

                expect(cnSearchSpy.calls.count()).toBe(1);

                component.siteChanged(<SiteEntry> { entry: { guid: '-sites-' } });

                expect(cnSearchSpy).toHaveBeenCalled();
                expect(cnSearchSpy.calls.count()).toBe(2);
                expect(cnSearchSpy).toHaveBeenCalledWith('vegeta', undefined, 0, 25, [], false);
                expect(cnSearchSpy).toHaveBeenCalledWith('vegeta', '-sites-', 0, 25, ['123456testId', '09876543testId'], false);
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
                component.chosenNode = <Node> {};
                component.nodePaging = {
                    list: {
                        entries: [{ entry: component.chosenNode }]
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

            it('should clear the search field, nodes and chosenNode when deleting the search input', fakeAsync(() => {
                spyOn(component, 'clear').and.callThrough();
                typeToSearchBox('a');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy.calls.count()).toBe(1);

                typeToSearchBox('');

                tick(debounceSearch);
                fixture.detectChanges();

                expect(searchSpy.calls.count()).toBe(1, 'no other search has been performed');
                expect(component.clear).toHaveBeenCalled();
                expect(component.folderIdToShow).toBe('cat-girl-nuku-nuku', 'back to the folder in which the search was performed');
            }));

            it('should clear the search field, nodes and chosenNode on folder navigation in the results list', fakeAsync(() => {
                spyOn(component, 'clearSearch').and.callThrough();
                typeToSearchBox('a');

                tick(debounceSearch);
                fixture.detectChanges();

                respondWithSearchResults(ONE_FOLDER_RESULT);

                tick();
                fixture.detectChanges();

                component.onFolderChange();
                fixture.detectChanges();

                expect(component.clearSearch).toHaveBeenCalled();

            }));

            it('should show nodes from the same folder as selected in the dropdown on clearing the search input', fakeAsync(() => {
                typeToSearchBox('piccolo');
                tick(debounceSearch);

                expect(searchSpy.calls.count()).toBe(1);

                component.siteChanged(<SiteEntry> { entry: { guid: 'namek' } });

                expect(searchSpy.calls.count()).toBe(2);
                expect(searchSpy.calls.argsFor(1)).toEqual([defaultSearchOptions('piccolo', 'namek')]);

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
                    respondWithSearchResults(ONE_FOLDER_RESULT);

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
                    respondWithSearchResults(ONE_FOLDER_RESULT);
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
                    respondWithSearchResults(ONE_FOLDER_RESULT);
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

            it('should reload the original documentList when clearing the search input', fakeAsync(() => {
                typeToSearchBox('shenron');

                tick(debounceSearch);

                respondWithSearchResults(ONE_FOLDER_RESULT);

                typeToSearchBox('');

                tick(debounceSearch);

                fixture.detectChanges();

                const documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
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
                    expect(component.pagination.maxItems).toBe(45);
                    expect(searchSpy).not.toHaveBeenCalled();
                });

                it('should set its loading state to true after search was started', fakeAsync(() => {
                    component.showingSearchResults = true;

                    typeToSearchBox('shenron');

                    tick(debounceSearch);

                    fixture.detectChanges();

                    tick(debounceSearch);

                    const spinnerSelector = By.css('[data-automation-id="content-node-selector-search-pagination"] [data-automation-id="adf-infinite-pagination-spinner"]');
                    const paginationLoading = fixture.debugElement.query(spinnerSelector);
                    expect(paginationLoading).not.toBeNull();
                }));

                it('Should infinite pagination target be null when we use it for search ', fakeAsync(() => {
                    component.showingSearchResults = true;

                    typeToSearchBox('shenron');

                    tick(debounceSearch);

                    fixture.detectChanges();

                    tick(debounceSearch);

                    expect(component.target).toBeNull();
                }));

                it('Should infinite pagination target be present when search finish', fakeAsync(() => {
                    component.showingSearchResults = true;

                    typeToSearchBox('shenron');

                    tick(debounceSearch);

                    fixture.detectChanges();

                    typeToSearchBox('');

                    tick(debounceSearch);

                    fixture.detectChanges();

                    expect(component.target).not.toBeNull();
                }));

                it('Should infinite pagination target on init be the document list', fakeAsync(() => {
                    component.showingSearchResults = true;

                    expect(component.target).toEqual(component.documentList);
                }));
            });
        });

        describe('Chosen node', () => {

            const entry: Node = <Node> {};
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

                it('should NOT be null after selecting node with the necessary permissions', async(() => {
                    hasAllowableOperations = true;
                    component.documentList.folderNode = entry;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode).toBe(entry);
                    });

                    component.documentList.ready.emit(nodePage);
                    fixture.detectChanges();
                }));

                it('should be null after selecting node without the necessary permissions', async(() => {
                    hasAllowableOperations = false;
                    component.documentList.folderNode = entry;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                    });

                    component.documentList.ready.emit(nodePage);
                    fixture.detectChanges();
                }));

                it('should NOT be null after clicking on a node (with the right permissions) in the list (onNodeSelect)', async(() => {
                    hasAllowableOperations = true;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode).toBe(entry);
                    });

                    component.onNodeSelect({ detail: { node: { entry } } });
                    fixture.detectChanges();
                }));

                it('should remain null when clicking on a node (with the WRONG permissions) in the list (onNodeSelect)', async(() => {
                    hasAllowableOperations = false;

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                    });

                    component.onNodeSelect({ detail: { node: { entry } } });
                    fixture.detectChanges();
                }));

                it('should become null when clicking on a node (with the WRONG permissions) after previously selecting a right node', async(() => {
                    component.select.subscribe((nodes) => {

                        if (hasAllowableOperations) {
                            expect(nodes).toBeDefined();
                            expect(nodes).not.toBeNull();
                            expect(component.chosenNode).not.toBeNull();

                        } else {
                            expect(nodes).toBeDefined();
                            expect(nodes).toBeNull();
                            expect(component.chosenNode).toBeNull();
                        }
                    });

                    hasAllowableOperations = true;
                    component.onNodeSelect({ detail: { node: { entry } } });
                    fixture.detectChanges();

                    hasAllowableOperations = false;
                    component.onNodeSelect({ detail: { node: { entry } } });
                    fixture.detectChanges();
                }));

                it('should be null when the chosenNode is reset', async(() => {
                    hasAllowableOperations = true;
                    component.onNodeSelect({ detail: { node: { entry: <Node> {} } } });
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                    });

                    component.resetChosenNode();
                    fixture.detectChanges();
                }));
            });

            describe('in the case when isSelectionValid is null', () => {

                beforeEach(() => {
                    component.isSelectionValid = null;
                });

                it('should NOT be null after selecting node because isSelectionValid would be reset to defaultValidation function', async(() => {
                    component.documentList.folderNode = entry;
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode).not.toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.documentList.ready.emit(nodePage);
                    fixture.detectChanges();
                }));

                it('should NOT be null after clicking on a node in the list (onNodeSelect)', async(() => {
                    fixture.detectChanges();
                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode).not.toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.onNodeSelect({ detail: { node: { entry } } });
                    fixture.detectChanges();
                }));

                it('should be null when the chosenNode is reset', async(() => {
                    fixture.detectChanges();
                    component.onNodeSelect({ detail: { node: { entry: <Node> {} } } });
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.resetChosenNode();
                    fixture.detectChanges();
                }));
            });

            describe('in the case when isSelectionValid is not defined', () => {

                beforeEach(() => {
                    component.isSelectionValid = undefined;
                });

                it('should NOT be null after selecting node because isSelectionValid would be the defaultValidation function', async(() => {
                    component.documentList.folderNode = entry;
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode).not.toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.documentList.ready.emit(nodePage);
                    fixture.detectChanges();
                }));

                it('should NOT be null after clicking on a node in the list (onNodeSelect)', async(() => {
                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).not.toBeNull();
                        expect(component.chosenNode).not.toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });
                    fixture.detectChanges();

                    component.onNodeSelect({ detail: { node: { entry } } });
                    fixture.detectChanges();
                }));

                it('should be null when the chosenNode is reset', async(() => {
                    fixture.detectChanges();

                    component.onNodeSelect({ detail: { node: { entry: <Node> {} } } });
                    fixture.detectChanges();

                    component.select.subscribe((nodes) => {
                        expect(nodes).toBeDefined();
                        expect(nodes).toBeNull();
                        expect(component.chosenNode).toBeNull();
                        expect(component.isSelectionValid).not.toBeNull();
                    });

                    component.resetChosenNode();
                    fixture.detectChanges();
                }));
            });
        });
    });
});
