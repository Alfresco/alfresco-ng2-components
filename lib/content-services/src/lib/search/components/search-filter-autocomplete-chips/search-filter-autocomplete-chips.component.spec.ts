/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SearchFilterAutocompleteChipsComponent } from './search-filter-autocomplete-chips.component';
import { of, ReplaySubject, Subject, throwError } from 'rxjs';
import { AutocompleteField, AutocompleteOption } from '../../models/autocomplete-option.interface';
import { TagService } from '../../../tag/services/tag.service';
import { SitesService } from '../../../common/services/sites.service';
import { ResultSetPaging, SitePaging } from '@alfresco/js-api';
import { CategoryService } from '../../../category';
import { SearchService } from '../../services/search.service';
import { AppConfigService } from '@alfresco/adf-core';

describe('SearchFilterAutocompleteChipsComponent', () => {
    let component: SearchFilterAutocompleteChipsComponent;
    let fixture: ComponentFixture<SearchFilterAutocompleteChipsComponent>;
    let tagService: TagService;
    let sitesService: SitesService;
    let categoryService: CategoryService;
    let searchService: SearchService;
    let appConfig: AppConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SearchFilterAutocompleteChipsComponent]
        });

        fixture = TestBed.createComponent(SearchFilterAutocompleteChipsComponent);
        component = fixture.componentInstance;
        tagService = TestBed.inject(TagService);
        sitesService = TestBed.inject(SitesService);
        categoryService = TestBed.inject(CategoryService);
        searchService = TestBed.inject(SearchService);
        appConfig = TestBed.inject(AppConfigService);
        component.id = 'test-id';
        component.context = {
            queryFragments: {
                createdDatetimeRange: ''
            },
            filterRawParams: {},
            populateFilters: new ReplaySubject(1),
            execute: jasmine.createSpy('execute'),
            get wildcardsEnabled(): boolean {
                return appConfig.get<boolean>('search-wildcards-enabled', true);
            }
        } as any;
        component.settings = {
            field: 'test',
            allowUpdateOnChange: true,
            hideDefaultAction: false,
            allowOnlyPredefinedValues: false,
            autocompleteOptions: [{ value: 'option1' }, { value: 'option2' }]
        };
        fixture.detectChanges();
    });

    /**
     * Add new auto-complete input
     *
     * @param value value to add
     */
    function addNewOption(value: string) {
        const inputElement = fixture.debugElement.query(By.css('adf-search-chip-autocomplete-input input')).nativeElement;
        inputElement.value = value;
        inputElement.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13 }));
        fixture.detectChanges();
    }

    it('should set autocomplete options on init', (done) => {
        component.settings.autocompleteOptions = [{ value: 'test 1' }, { value: 'test 2' }];
        component.ngOnInit();
        component.autocompleteOptions$.subscribe((result) => {
            expect(result).toEqual([{ value: 'test 1' }, { value: 'test 2' }]);
            done();
        });
    });

    it('should update display value when options changes', () => {
        const newOption = 'option1';
        spyOn(component, 'onOptionsChange').and.callThrough();
        spyOn(component.displayValue$, 'next');
        addNewOption(newOption);

        expect(component.onOptionsChange).toHaveBeenCalled();
        expect(component.displayValue$.next).toHaveBeenCalledOnceWith(newOption);
    });

    it('should reset value and display value when reset button is clicked', () => {
        component.setValue([{ value: 'option1' }, { value: 'option2' }]);
        fixture.detectChanges();
        expect(component.selectedOptions).toEqual([{ value: 'option1' }, { value: 'option2' }]);
        expect(component.context.filterRawParams[component.id]).toEqual([{ value: 'option1' }, { value: 'option2' }]);
        spyOn(component.displayValue$, 'next');
        const clearBtn: HTMLButtonElement = fixture.debugElement.query(
            By.css('[data-automation-id="adf-search-chip-autocomplete-btn-clear"]')
        ).nativeElement;
        clearBtn.click();

        expect(component.context.queryFragments[component.id]).toBe('');
        expect(component.context.execute).toHaveBeenCalled();
        expect(component.selectedOptions).toEqual([]);
        expect(component.displayValue$.next).toHaveBeenCalledWith('');
        expect(component.context.filterRawParams[component.id]).toBeUndefined();
    });

    it('should correctly compose the search query', () => {
        component.selectedOptions = [{ value: 'option2' }, { value: 'option1' }];
        const applyBtn: HTMLButtonElement = fixture.debugElement.query(
            By.css('[data-automation-id="adf-search-chip-autocomplete-btn-apply"]')
        ).nativeElement;
        applyBtn.click();
        fixture.detectChanges();

        expect(component.context.execute).toHaveBeenCalled();
        expect(component.context.queryFragments[component.id]).toBe('test:"option2" OR test:"option1"');
        expect(component.context.filterRawParams[component.id]).toEqual([{ value: 'option2' }, { value: 'option1' }]);

        component.settings.field = AutocompleteField.CATEGORIES;
        component.selectedOptions = [{ id: 'test-id', value: 'test' }];
        applyBtn.click();
        fixture.detectChanges();
        expect(component.context.queryFragments[component.id]).toBe('cm:categories:"workspace://SpacesStore/test-id"');
        expect(component.context.filterRawParams[component.id]).toEqual([{ id: 'test-id', value: 'test' }]);
    });

    it('should populate filter state when populate filters event has been observed', () => {
        component.context.filterLoaded = new ReplaySubject(1);
        spyOn(component.context.filterLoaded, 'next').and.stub();
        spyOn(component.displayValue$, 'next').and.stub();
        fixture.detectChanges();
        component.context.populateFilters.next({ 'test-id': [{ value: 'option2' }, { value: 'option1' }] });
        fixture.detectChanges();

        expect(component.displayValue$.next).toHaveBeenCalledWith('option2, option1');
        expect(component.context.filterRawParams[component.id]).toEqual([{ value: 'option2' }, { value: 'option1' }]);
        expect(component.selectedOptions).toEqual([{ value: 'option2' }, { value: 'option1' }]);
        expect(component.context.filterLoaded.next).toHaveBeenCalled();
    });

    it('should populate LOCATION field options with sites and predefined values from config', (done) => {
        const sitesMock: SitePaging = {
            list: {
                pagination: {},
                entries: [{ entry: { guid: 'site1', id: 'site1', title: 'Marketing', visibility: 'public' } }]
            }
        };
        component.settings.field = AutocompleteField.LOCATION;
        component.settings.autocompleteOptions = [{ value: 'Repository', query: `PATH:'somePath'` }];
        spyOn(sitesService, 'getSites').and.returnValue(of(sitesMock));
        component.onInputChange('mark');
        component.autocompleteOptions$.subscribe((result) => {
            expect(result).toEqual([
                { id: 'site1', value: 'Marketing' },
                { value: 'Repository', query: `PATH:'somePath'` }
            ]);
            done();
        });
    });

    it('should filter LOCATION field options', (done) => {
        const sitesMock: SitePaging = {
            list: {
                pagination: {},
                entries: [
                    { entry: { guid: 'site1', id: 'site1', title: 'Marketing', visibility: 'public' } },
                    { entry: { guid: 'site2', id: 'site2', title: 'Finance', visibility: 'moderated' } },
                    { entry: { guid: 'site3', id: 'site3', title: 'HR', visibility: 'private' } },
                    { entry: { guid: 'site4', id: 'site4', title: 'Legal', visibility: 'private', role: 'Consumer' } },
                    { entry: { guid: 'site5', id: 'site5', title: 'IT', visibility: 'moderated', role: 'SiteManager' } }
                ]
            }
        };
        component.settings.field = AutocompleteField.LOCATION;
        component.settings.autocompleteOptions = [];
        spyOn(sitesService, 'getSites').and.returnValue(of(sitesMock));
        component.onInputChange('mark');
        component.autocompleteOptions$.subscribe((result) => {
            expect(result).toEqual([
                { id: 'site1', value: 'Marketing' },
                { id: 'site4', value: 'Legal' },
                { id: 'site5', value: 'IT' }
            ]);
            done();
        });
    });

    it('should use id if present, otherwise value, in LOCATION query fragment', () => {
        component.settings.field = AutocompleteField.LOCATION;
        component.settings.autocompleteOptions = [];
        component.selectedOptions = [{ id: 'site1', value: 'Marketing' }, { value: 'custom' }];
        component.submitValues();
        expect(component.context.queryFragments[component.id]).toBe('SITE:"site1" OR SITE:"custom"');
    });

    it('should still call sitesService.getSites when input is empty for LOCATION field', () => {
        component.settings.field = AutocompleteField.LOCATION;
        const getSitesSpy = spyOn(sitesService, 'getSites').and.returnValue(
            of({
                list: { entries: [], pagination: {} }
            })
        );

        component.onInputChange('');

        expect(getSitesSpy).toHaveBeenCalled();
    });

    it('should still call categoryService.searchCategories when input is empty for CATEGORIES field', () => {
        component.settings.field = AutocompleteField.CATEGORIES;
        const categoryService = TestBed.inject(CategoryService);
        const searchSpy = spyOn(categoryService, 'searchCategories').and.returnValue(
            of({
                list: { entries: [], pagination: {} }
            })
        );

        component.onInputChange('');

        expect(searchSpy).toHaveBeenCalledWith('', 0, 15);
    });

    it('should search for tags if field = TAG and input is not empty', () => {
        component.settings.field = AutocompleteField.TAG;
        const searchSpy = spyOn(tagService, 'searchTags').and.returnValue(
            of({
                list: {
                    pagination: {},
                    entries: [{ entry: { tag: 'tag1', id: 'id1' } }, { entry: { tag: 'tag2', id: 'id2' } }]
                }
            })
        );

        component.onInputChange('tag');

        expect(searchSpy).toHaveBeenCalledWith('tag', { orderBy: 'tag', direction: 'asc' }, false, 0, 15);
    });

    describe('loading state', () => {
        function categoriesResult(name: string): ResultSetPaging {
            return { list: { pagination: {}, entries: [{ entry: { id: `${name}-id`, name, path: { name: '/a/b' } } }] } } as ResultSetPaging;
        }

        it('should be false initially', (done) => {
            component.loading$.subscribe((loading) => {
                expect(loading).toBeFalse();
                done();
            });
        });

        it('should toggle true while fetching and back to false once results arrive', () => {
            component.settings.field = AutocompleteField.CATEGORIES;
            const response$ = new Subject<any>();
            spyOn(categoryService, 'searchCategories').and.returnValue(response$.asObservable());
            const emitted: boolean[] = [];
            component.loading$.subscribe((loading) => emitted.push(loading));

            component.onInputChange('mark');
            expect(emitted).toEqual([false, true]);

            response$.next(categoriesResult('Marketing'));
            response$.complete();
            expect(emitted).toEqual([false, true, false]);
        });

        it('should clear loading and emit empty options when the fetch fails', () => {
            component.settings.field = AutocompleteField.CATEGORIES;
            spyOn(categoryService, 'searchCategories').and.returnValue(throwError(() => new Error('failure')));
            const loadingStates: boolean[] = [];
            const optionResults: AutocompleteOption[][] = [];
            component.loading$.subscribe((loading) => loadingStates.push(loading));
            component.autocompleteOptions$.subscribe((options) => optionResults.push(options));

            component.onInputChange('mark');

            expect(loadingStates).toEqual([false, true, false]);
            expect(optionResults[optionResults.length - 1]).toEqual([]);
        });

        it('should keep the stream alive after a failed fetch', () => {
            component.settings.field = AutocompleteField.CATEGORIES;
            const searchSpy = spyOn(categoryService, 'searchCategories').and.returnValues(
                throwError(() => new Error('failure')),
                of(categoriesResult('Marketing'))
            );
            const optionResults: AutocompleteOption[][] = [];
            component.autocompleteOptions$.subscribe((options) => optionResults.push(options));

            component.onInputChange('mark');
            component.onInputChange('mark');

            expect(searchSpy).toHaveBeenCalledTimes(2);
            expect(optionResults[optionResults.length - 1]).toEqual([{ id: 'Marketing-id', value: 'Marketing', fullPath: 'Marketing' }]);
        });

        it('should ignore results from a superseded request', () => {
            component.settings.field = AutocompleteField.CATEGORIES;
            const firstResponse$ = new Subject<any>();
            const secondResponse$ = new Subject<any>();
            spyOn(categoryService, 'searchCategories').and.returnValues(firstResponse$.asObservable(), secondResponse$.asObservable());
            const optionResults: AutocompleteOption[][] = [];
            component.autocompleteOptions$.subscribe((options) => optionResults.push(options));

            component.onInputChange('ma');
            component.onInputChange('mark');

            secondResponse$.next(categoriesResult('Fresh'));
            secondResponse$.complete();
            firstResponse$.next(categoriesResult('Stale'));
            firstResponse$.complete();

            expect(optionResults[optionResults.length - 1]).toEqual([{ id: 'Fresh-id', value: 'Fresh', fullPath: 'Fresh' }]);
            expect(optionResults.some((result) => result.some((option) => option.value === 'Stale'))).toBeFalse();
        });

        it('should not trigger a fetch for a non-async field', () => {
            component.settings.field = 'test';
            const searchSpy = spyOn(categoryService, 'searchCategories');
            component.onInputChange('mark');
            expect(searchSpy).not.toHaveBeenCalled();
        });
    });

    describe('PARENT_FOLDER field', () => {
        const folderPaging: ResultSetPaging = {
            list: {
                pagination: {},
                entries: [{ entry: { id: 'folder1', name: 'Documents', path: { name: '/Company Home/Sites/ws/folderA' } } }]
            }
        } as ResultSetPaging;

        function mockWildcardsEnabled(enabled: boolean) {
            spyOn(appConfig, 'get').and.callFake((key: string, defaultValue?: any) => (key === 'search-wildcards-enabled' ? enabled : defaultValue));
        }

        beforeEach(() => {
            component.settings.field = AutocompleteField.PARENT_FOLDER;
            component.context.config = { filterQueries: [{ query: 'existing' }] } as any;
        });

        it('should search folders and map results into options with full paths', (done) => {
            spyOn(searchService, 'searchByQueryBody').and.returnValue(of(folderPaging));
            component.onInputChange('doc');
            component.autocompleteOptions$.subscribe((result) => {
                expect(result).toEqual([{ id: 'folder1', value: 'Documents', fullPath: '/Company Home/Sites/ws/folderA/Documents' }]);
                done();
            });
        });

        it('should fall back to the folder name when the path name is empty', (done) => {
            const folderWithoutPath: ResultSetPaging = {
                list: {
                    pagination: {},
                    entries: [{ entry: { id: 'folder2', name: 'Documents', path: { name: '' } } }]
                }
            } as ResultSetPaging;
            spyOn(searchService, 'searchByQueryBody').and.returnValue(of(folderWithoutPath));
            component.onInputChange('doc');
            component.autocompleteOptions$.subscribe((result) => {
                expect(result).toEqual([{ id: 'folder2', value: 'Documents', fullPath: 'Documents' }]);
                done();
            });
        });

        it('should build a folder-scoped query without emitting the dataLoaded event', () => {
            mockWildcardsEnabled(true);
            const searchSpy = spyOn(searchService, 'searchByQueryBody').and.returnValue(of(folderPaging));
            component.onInputChange('doc');

            const [queryBody, shouldEmit] = searchSpy.calls.mostRecent().args;
            expect(shouldEmit).toBeFalse();
            expect(queryBody.query.query).toBe(`cm:name:"*doc*"`);
            expect(queryBody.include).toEqual(['path']);
            expect(queryBody.filterQueries).toEqual([{ query: 'existing' }, { query: "TYPE:'cm:folder'" }]);
        });

        it('should not mutate the shared context filter queries', () => {
            spyOn(searchService, 'searchByQueryBody').and.returnValue(of(folderPaging));
            component.onInputChange('doc');
            component.onInputChange('docs');
            expect(component.context.config.filterQueries).toEqual([{ query: 'existing' }]);
        });

        it('should not wrap the search term with wildcards when wildcards are disabled', () => {
            mockWildcardsEnabled(false);
            component.context.config = {} as any;
            const searchSpy = spyOn(searchService, 'searchByQueryBody').and.returnValue(of(folderPaging));
            component.onInputChange('doc');

            const [queryBody] = searchSpy.calls.mostRecent().args;
            expect(queryBody.query.query).toBe(`cm:name:"doc"`);
            expect(queryBody.filterQueries).toEqual([{ query: "TYPE:'cm:folder'" }]);
        });

        it('should compose the query fragment using the node reference', () => {
            component.selectedOptions = [{ id: 'folder1', value: 'Documents' }];
            component.submitValues();
            expect(component.context.queryFragments[component.id]).toBe('ANCESTOR:"workspace://SpacesStore/folder1"');
        });
    });

    describe('optionComparator', () => {
        it('should return false if either option is undefined', () => {
            expect(component.optionComparator(undefined, { value: 'A' })).toBe(false);
            expect(component.optionComparator({ value: 'A' }, undefined)).toBe(false);
        });

        it('should compare by id if both have id', () => {
            expect(component.optionComparator({ id: 'abc', value: 'B' }, { id: 'ABC', value: 'B' })).toBe(true);
            expect(component.optionComparator({ id: 'abc', value: 'B' }, { id: 'def', value: 'B' })).toBe(false);
        });

        it('should compare by value if both have value and one has no id', () => {
            expect(component.optionComparator({ value: 'A', id: 'id1' }, { value: 'a' })).toBe(true);
            expect(component.optionComparator({ value: 'A', id: 'id1' }, { value: 'B' })).toBe(false);
        });

        it('should return false if only one has id or value', () => {
            expect(component.optionComparator({ id: 'abc' } as AutocompleteOption, { value: 'abc' })).toBe(false);
            expect(component.optionComparator({ value: 'abc' }, { id: 'abc' } as AutocompleteOption)).toBe(false);
        });
    });
});
