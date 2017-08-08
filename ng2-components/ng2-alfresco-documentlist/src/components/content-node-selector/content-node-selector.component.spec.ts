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

import { DebugElement, EventEmitter } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { AlfrescoContentService, AlfrescoTranslationService, CoreModule, SearchService, SiteModel } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { MaterialModule } from '../../material.module';
import { DocumentListService } from '../../services/document-list.service';
import { DropdownBreadcrumbComponent } from '../breadcrumb/dropdown-breadcrumb.component';
import { DocumentListComponent } from '../document-list.component';
import { DocumentMenuActionComponent } from '../document-menu-action.component';
import { EmptyFolderContentDirective } from '../empty-folder/empty-folder-content.directive';
import { DropdownSitesComponent } from '../site-dropdown/sites-dropdown.component';
import { ContentNodeSelectorComponent } from './content-node-selector.component';

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
        ]
    }
};

describe('ContentNodeSelectorComponent', () => {
    let component: ContentNodeSelectorComponent;
    let fixture: ComponentFixture<ContentNodeSelectorComponent>;
    let element: DebugElement;
    let data: any;
    let searchService: SearchService;
    let searchSpy: jasmine.Spy;

    let _resolve: Function;
    let _reject: Function;

    function typeToSearchBox(searchTerm = 'string-to-search') {
        let searchInput = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-input"]'));
        searchInput.nativeElement.value = searchTerm;
        searchInput.triggerEventHandler('input', {});
        fixture.detectChanges();
    }

    function respondWithSearchResults(result) {
        _resolve(result);
    }

    function setupTestbed(plusProviders) {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                DataTableModule.forRoot(),
                MaterialModule
            ],
            declarations: [
                DocumentListComponent,
                DocumentMenuActionComponent,
                EmptyFolderContentDirective,
                DropdownSitesComponent,
                DropdownBreadcrumbComponent,
                ContentNodeSelectorComponent
            ],
            providers: [
                AlfrescoContentService,
                AlfrescoTranslationService,
                DocumentListService,
                SearchService,
                ...plusProviders
            ]
        });
    }

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    describe('Dialog features', () => {

        beforeEach(async(() => {
            data = {
                title: 'Move along citizen...',
                select: new EventEmitter<MinimalNodeEntryEntity>(),
                rowFilter: () => {},
                imageResolver: () => 'piccolo',
                currentFolderId: 'cat-girl-nuku-nuku'
            };

            setupTestbed([{ provide: MD_DIALOG_DATA, useValue: data }]);
            TestBed.compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ContentNodeSelectorComponent);
            element = fixture.debugElement;
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        describe('Data injecting with the "Material dialog way"', () => {

            it('should show the INJECTED title', () => {
                const titleElement = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-title"]'));
                expect(titleElement).not.toBeNull();
                expect(titleElement.nativeElement.innerText).toBe('Move along citizen...');
            });

            it('should pass through the injected currentFolderId to the documentlist', () => {
                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
            });

            it('should pass through the injected rowFilter to the documentlist', () => {
                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.rowFilter).toBe(data.rowFilter);
            });

            it('should pass through the injected imageResolver to the documentlist', () => {
                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.imageResolver).toBe(data.imageResolver);
            });

            it('should trigger the INJECTED select event when selection has been made', (done) => {
                const expectedNode = <MinimalNodeEntryEntity> {};
                data.select.subscribe((nodes) => {
                    expect(nodes.length).toBe(1);
                    expect(nodes[0]).toBe(expectedNode);
                    done();
                });

                component.chosenNode = expectedNode;
                component.choose();
            });
        });

        describe('Cancel button', () => {

            let dummyMdDialogRef;

            beforeEach(() => {
                dummyMdDialogRef = <MdDialogRef<ContentNodeSelectorComponent>> { close: () => {} };
            });

            it('should be shown if dialogRef is injected', () => {
                const componentInstance = new ContentNodeSelectorComponent(null, null, null, data, dummyMdDialogRef);
                expect(componentInstance.inDialog).toBeTruthy();
            });

            it('should should call the close method in the injected dialogRef', () => {
                spyOn(dummyMdDialogRef, 'close');
                const componentInstance = new ContentNodeSelectorComponent(null, null, null, data, dummyMdDialogRef);

                componentInstance.close();

                expect(dummyMdDialogRef.close).toHaveBeenCalled();
            });
        });
    });

    describe('General component features', () => {

        beforeEach(async(() => {
            setupTestbed([]);
            TestBed.compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ContentNodeSelectorComponent);
            element = fixture.debugElement;
            component = fixture.componentInstance;

            searchService = TestBed.get(SearchService);
            searchSpy = spyOn(searchService, 'getQueryNodesPromise').and.callFake(() => {
                return new Promise((resolve, reject) => {
                    _resolve = resolve;
                    _reject = reject;
                });
            });
        });

        describe('Parameters', () => {

            it('should show the title', () => {
                component.title = 'Move along citizen...';
                fixture.detectChanges();

                const titleElement = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-title"]'));
                expect(titleElement).not.toBeNull();
                expect(titleElement.nativeElement.innerText).toBe('Move along citizen...');
            });

            it('should trigger the select event when selection has been made', (done) => {
                const expectedNode = <MinimalNodeEntryEntity> {};
                component.select.subscribe((nodes) => {
                    expect(nodes.length).toBe(1);
                    expect(nodes[0]).toBe(expectedNode);
                    done();
                });

                component.chosenNode = expectedNode;
                component.choose();
            });
        });

        describe('Breadcrumbs', () => {

            let documentListService,
                expectedDefaultFolderNode;

            beforeEach(() => {
                expectedDefaultFolderNode = <MinimalNodeEntryEntity> { path: { elements: [] } };
                documentListService = TestBed.get(DocumentListService);
                spyOn(documentListService, 'getFolderNode').and.returnValue(Promise.resolve(expectedDefaultFolderNode));
                component.currentFolderId = 'cat-girl-nuku-nuku';
                fixture.detectChanges();
            });

            it('should show the breadcrumb for the currentFolderId by default', (done) => {
                fixture.detectChanges();

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb).not.toBeNull();
                    expect(breadcrumb.componentInstance.folderNode).toBe(expectedDefaultFolderNode);
                    done();
                });
            });

            it('should not show the breadcrumb if search was performed as last action', (done) => {
                typeToSearchBox();
                respondWithSearchResults(ONE_FOLDER_RESULT);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb).toBeNull();
                    done();
                });
            });

            it('should show the breadcrumb again on folder navigation in the results list', (done) => {
                typeToSearchBox();
                respondWithSearchResults(ONE_FOLDER_RESULT);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    component.onFolderChange();
                    fixture.detectChanges();
                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb).not.toBeNull();
                    done();
                });
            });

            it('should show the breadcrumb for the selected node when search results are displayed', (done) => {
                const alfrescoContentService = TestBed.get(AlfrescoContentService);
                spyOn(alfrescoContentService, 'hasPermission').and.returnValue(true);

                typeToSearchBox();
                respondWithSearchResults(ONE_FOLDER_RESULT);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();

                    const chosenNode = <MinimalNodeEntryEntity> { path: { elements: [] } };
                    component.onNodeSelect({ detail: { node: { entry: chosenNode} } });
                    fixture.detectChanges();

                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb).not.toBeNull();
                    expect(breadcrumb.componentInstance.folderNode).toBe(chosenNode);
                    done();
                });
            });

            it('should NOT show the breadcrumb for the selected node when not on search results list', (done) => {
                const alfrescoContentService = TestBed.get(AlfrescoContentService);
                spyOn(alfrescoContentService, 'hasPermission').and.returnValue(true);

                typeToSearchBox();
                respondWithSearchResults(ONE_FOLDER_RESULT);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    component.onFolderChange();
                    fixture.detectChanges();

                    const chosenNode = <MinimalNodeEntryEntity> { path: { elements: [] } };
                    component.onNodeSelect({ detail: { node: { entry: chosenNode} } });
                    fixture.detectChanges();

                    const breadcrumb = fixture.debugElement.query(By.directive(DropdownBreadcrumbComponent));
                    expect(breadcrumb).not.toBeNull();
                    expect(breadcrumb.componentInstance.folderNode).toBe(expectedDefaultFolderNode);
                    done();
                });
            });
        });

        describe('Search functionality', () => {

            function defaultSearchOptions(rootNodeId = undefined) {
                return {
                    include: ['path', 'allowableOperations'],
                    skipCount: 0,
                    rootNodeId,
                    nodeType: 'cm:folder',
                    maxItems: 200,
                    orderBy: null
                };
            }

            beforeEach(() => {
                component.currentFolderId = 'cat-girl-nuku-nuku';
                fixture.detectChanges();
            });

            it('should load the results by calling the search api on search change', () => {
                typeToSearchBox('kakarot');

                expect(searchSpy).toHaveBeenCalledWith('kakarot*', defaultSearchOptions());
            });

            it('should reset the currently chosen node in case of starting a new search', () => {
                component.chosenNode = <MinimalNodeEntryEntity> {};
                typeToSearchBox('kakarot');

                expect(component.chosenNode).toBeNull();
            });

            it('should NOT call the search api if the searchTerm length is less than 4 characters', () => {
                typeToSearchBox('1');
                typeToSearchBox('12');
                typeToSearchBox('123');

                expect(searchSpy).not.toHaveBeenCalled();
            });

            xit('should debounce the search call by 500 ms', () => {

            });

            it('should call the search api on changing the site selectbox\'s value', () => {
                typeToSearchBox('vegeta');
                expect(searchSpy.calls.count()).toBe(1, 'Search count should be one after only one search');

                component.siteChanged(<SiteModel> { guid: 'namek' });

                expect(searchSpy.calls.count()).toBe(2, 'Search count should be two after the site change');
                expect(searchSpy.calls.argsFor(1)).toEqual(['vegeta*', defaultSearchOptions('namek') ]);
            });

            it('should show the search icon by default without the X (clear) icon', () => {
                fixture.detectChanges();
                let searchIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-icon"]'));
                let clearIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));

                expect(searchIcon).not.toBeNull('Search icon should be in the DOM');
                expect(clearIcon).toBeNull('Clear icon should NOT be in the DOM');
            });

            it('should show the X (clear) icon without the search icon when the search contains at least one character', () => {
                fixture.detectChanges();
                typeToSearchBox('123');

                let searchIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-icon"]'));
                let clearIcon = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));

                expect(searchIcon).toBeNull('Search icon should NOT be in the DOM');
                expect(clearIcon).not.toBeNull('Clear icon should be in the DOM');
            });

            it('should clear the search field, nodes and chosenNode when clicking on the X (clear) icon', () => {
                component.chosenNode = <MinimalNodeEntryEntity> {};
                component.nodes = [ component.chosenNode ];
                component.searchTerm = 'piccolo';
                component.showingSearchResults = true;

                component.clear();

                expect(component.searchTerm).toBe('');
                expect(component.nodes).toEqual([]);
                expect(component.chosenNode).toBeNull();
                expect(component.showingSearchResults).toBeFalsy();
            });

            it('should show the current folder\'s content instead of search results if search was not performed', () => {
                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
            });

            it('should pass through the rowFilter to the documentList', () => {
                const filter = () => {};
                component.rowFilter = filter;

                fixture.detectChanges();

                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.rowFilter).toBe(filter);
            });

            it('should pass through the imageResolver to the documentList', () => {
                const resolver = () => 'piccolo';
                component.imageResolver = resolver;

                fixture.detectChanges();

                let documentList = fixture.debugElement.query(By.directive(DocumentListComponent));
                expect(documentList).not.toBeNull('Document list should be shown');
                expect(documentList.componentInstance.imageResolver).toBe(resolver);
            });

            it('should show the result list when search was performed', async(() => {
                typeToSearchBox();
                respondWithSearchResults(ONE_FOLDER_RESULT);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                    expect(documentList).not.toBeNull('Document list should be shown');
                    expect(documentList.componentInstance.currentFolderId).toBeNull();
                });
            }));

            it('should highlight the results when search was performed in the next timeframe', fakeAsync(() => {
                spyOn(component.highlighter, 'highlight');
                typeToSearchBox('shenron');
                respondWithSearchResults(ONE_FOLDER_RESULT);

                expect(component.highlighter.highlight).not.toHaveBeenCalled();
                tick();
                expect(component.highlighter.highlight).toHaveBeenCalledWith('shenron');
            }));

            it('should show the default text instead of result list if search was cleared', async(() => {
                typeToSearchBox();
                respondWithSearchResults(ONE_FOLDER_RESULT);

                fixture.whenStable().then(() => {
                    fixture.detectChanges();
                    let clearButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-search-clear"]'));
                    expect(clearButton).not.toBeNull('Clear button should be in DOM');
                    clearButton.triggerEventHandler('click', {});
                    fixture.detectChanges();

                    let documentList = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-document-list"]'));
                    expect(documentList).not.toBeNull('Document list should be shown');
                    expect(documentList.componentInstance.currentFolderId).toBe('cat-girl-nuku-nuku');
                });
            }));

            xit('should do something with pagination or with many results', () => {

            });

            xit('should trigger some kind of error when error happened during search', () => {

            });
        });

        describe('Cancel button', () => {

            it('should not be shown if dialogRef is NOT injected', () => {
                const closeButton = fixture.debugElement.query(By.css('[content-node-selector-actions-cancel]'));
                expect(closeButton).toBeNull();
            });
        });

        describe('Choose button', () => {

            const entry: MinimalNodeEntryEntity = <MinimalNodeEntryEntity> {};
            let hasPermission;

            beforeEach(() => {
                const alfrescoContentService = TestBed.get(AlfrescoContentService);
                spyOn(alfrescoContentService, 'hasPermission').and.callFake(() => hasPermission);
            });

            it('should be disabled by default', () => {
                fixture.detectChanges();

                let chooseButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
                expect(chooseButton.nativeElement.disabled).toBe(true);
            });

            it('should be enabled when clicking on a node (with the right permissions) in the list (onNodeSelect)', () => {
                hasPermission = true;

                component.onNodeSelect({ detail: { node: { entry } } });
                fixture.detectChanges();

                let chooseButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
                expect(chooseButton.nativeElement.disabled).toBe(false);
            });

            it('should remain disabled when clicking on a node (with the WRONG permissions) in the list (onNodeSelect)', () => {
                hasPermission = false;

                component.onNodeSelect({ detail: { node: { entry } } });
                fixture.detectChanges();

                let chooseButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
                expect(chooseButton.nativeElement.disabled).toBe(true);
            });

            it('should become disabled when clicking on a node (with the WRONG permissions) after previously selecting a right node', () => {
                hasPermission = true;
                component.onNodeSelect({ detail: { node: { entry } } });
                fixture.detectChanges();

                hasPermission = false;
                component.onNodeSelect({ detail: { node: { entry } } });
                fixture.detectChanges();

                let chooseButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
                expect(chooseButton.nativeElement.disabled).toBe(true);
            });

            it('should become disabled when changing directory after previously selecting a right node', () => {
                hasPermission = true;
                component.onNodeSelect({ detail: { node: { entry } } });
                fixture.detectChanges();

                component.onFolderChange();
                fixture.detectChanges();

                let chooseButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
                expect(chooseButton.nativeElement.disabled).toBe(true);
            });

            it('should be disabled when resetting the chosen node', () => {
                hasPermission = true;
                component.onNodeSelect({ detail: { node: { entry: <MinimalNodeEntryEntity> {} } } });
                fixture.detectChanges();

                component.resetChosenNode();
                fixture.detectChanges();

                let chooseButton = fixture.debugElement.query(By.css('[data-automation-id="content-node-selector-actions-choose"]'));
                expect(chooseButton.nativeElement.disabled).toBe(true);
            });
        });

        describe('Mini integration test', () => {

            xit('should trigger the select event properly when search results are loaded, one element is selected and choose button is clicked', () => {

            });
        });

    });
});
