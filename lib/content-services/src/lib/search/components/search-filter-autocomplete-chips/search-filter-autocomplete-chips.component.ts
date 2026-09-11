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

import { Component, DestroyRef, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchWidget } from '../../models/search-widget.interface';
import { SearchWidgetSettings } from '../../models/search-widget-settings.interface';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchFilterList } from '../../models/search-filter-list.model';
import { TagService } from '../../../tag/services/tag.service';
import { CategoryService } from '../../../category/services/category.service';
import { AutocompleteField, AutocompleteOption } from '../../models/autocomplete-option.interface';
import { CommonModule } from '@angular/common';
import { SearchChipAutocompleteInputComponent } from '../search-chip-autocomplete-input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SitesService } from '../../../common/services/sites.service';
import { SearchService } from '../../services/search.service';
import { SearchRequest } from '@alfresco/js-api';

interface AutocompleteFetchState {
    options: AutocompleteOption[] | null;
    loading: boolean;
}

@Component({
    selector: 'adf-search-filter-autocomplete-chips',
    imports: [CommonModule, SearchChipAutocompleteInputComponent, TranslatePipe, MatButtonModule],
    templateUrl: './search-filter-autocomplete-chips.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterAutocompleteChipsComponent implements SearchWidget, OnInit {
    private readonly tagService = inject(TagService);
    private readonly categoryService = inject(CategoryService);
    private readonly sitesService = inject(SitesService);
    private readonly searchService = inject(SearchService);
    private readonly loadingSubject$ = new BehaviorSubject<boolean>(false);
    private readonly inputChange$ = new Subject<string>();
    private readonly asyncFields: string[] = [
        AutocompleteField.CATEGORIES,
        AutocompleteField.TAG,
        AutocompleteField.LOCATION,
        AutocompleteField.PARENT_FOLDER
    ];
    private readonly resetSubject$ = new Subject<void>();
    private readonly autocompleteOptionsSubject$ = new BehaviorSubject<AutocompleteOption[]>([]);
    private readonly destroyRef = inject(DestroyRef);

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    options: SearchFilterList<AutocompleteOption[]>;
    startValue: AutocompleteOption[] = [];
    displayValue$ = new ReplaySubject<string>(1);
    selectedOptions: AutocompleteOption[] = [];
    enableChangeUpdate: boolean;
    reset$: Observable<void> = this.resetSubject$.asObservable();
    autocompleteOptions$: Observable<AutocompleteOption[]> = this.autocompleteOptionsSubject$.asObservable();
    loading$ = this.loadingSubject$.asObservable();

    constructor() {
        this.options = new SearchFilterList<AutocompleteOption[]>();
    }

    ngOnInit() {
        if (this.settings) {
            this.setOptions();
            if (this.startValue?.length > 0) {
                this.setValue(this.startValue);
            }
            this.enableChangeUpdate = this.settings.allowUpdateOnChange ?? true;
        }
        this.inputChange$
            .pipe(
                switchMap((value) =>
                    this.fetchOptions(value).pipe(
                        map((options): AutocompleteFetchState => ({ options, loading: false })),
                        catchError((): Observable<AutocompleteFetchState> => of({ options: [], loading: false })),
                        startWith<AutocompleteFetchState>({ options: null, loading: true })
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(({ options, loading }) => {
                this.loadingSubject$.next(loading);
                if (options) {
                    this.autocompleteOptionsSubject$.next(options);
                }
            });
        this.context.populateFilters
            .asObservable()
            .pipe(
                map((filterQueries) => filterQueries[this.id]),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((filterQuery) => {
                if (filterQuery) {
                    this.selectedOptions = filterQuery;
                    this.updateQuery(false);
                } else if (!filterQuery && this.selectedOptions.length) {
                    this.reset(false);
                }
                this.context.filterLoaded.next();
            });
    }

    reset(updateContext = true) {
        this.selectedOptions = [];
        this.context.filterRawParams[this.id] = undefined;
        this.resetSubject$.next();
        this.updateQuery(updateContext);
    }

    submitValues() {
        this.updateQuery();
    }

    hasValidValue(): boolean {
        return !!this.selectedOptions;
    }

    getCurrentValue(): AutocompleteOption[] {
        return this.selectedOptions;
    }

    onOptionsChange(selectedOptions: AutocompleteOption[]) {
        this.selectedOptions = selectedOptions;
        if (this.enableChangeUpdate) {
            this.updateQuery();
        }
    }

    setValue(value: AutocompleteOption[]) {
        this.selectedOptions = value;
        this.displayValue$.next(this.selectedOptions.join(', '));
        this.submitValues();
    }

    onInputChange(value: string) {
        const field = this.settings?.field;
        if (field && this.asyncFields.includes(field)) {
            this.inputChange$.next(value);
        }
    }

    optionComparator(option1: AutocompleteOption, option2: AutocompleteOption): boolean {
        if (!option1 || !option2) return false;
        if (option1.id && option2.id) {
            return option1.id.toUpperCase() === option2.id.toUpperCase();
        }
        if (option1.value && option2.value) {
            return option1.value.toUpperCase() === option2.value.toUpperCase();
        }
        return false;
    }

    private updateQuery(updateContext = true) {
        this.context.filterRawParams[this.id] = this.selectedOptions.length > 0 ? this.selectedOptions : undefined;
        this.displayValue$.next(this.selectedOptions.map((option) => option.value).join(', '));
        if (this.context && this.settings?.field) {
            let queryFragments;
            switch (this.settings.field) {
                case AutocompleteField.CATEGORIES:
                case AutocompleteField.PARENT_FOLDER:
                    queryFragments = this.selectedOptions.map((val) => `${this.settings.field}:"workspace://SpacesStore/${val.id}"`);
                    break;
                case AutocompleteField.LOCATION:
                    queryFragments = this.selectedOptions.map((val) => val.query ?? `${this.settings.field}:"${val.id || val.value}"`);
                    break;
                default:
                    queryFragments = this.selectedOptions.map((val) => val.query ?? `${this.settings.field}:"${val.value}"`);
                    break;
            }
            this.context.queryFragments[this.id] = queryFragments.join(' OR ');
            if (updateContext) {
                this.context.execute();
            }
        }
    }

    private setOptions() {
        switch (this.settings?.field) {
            case AutocompleteField.TAG:
            case AutocompleteField.CATEGORIES:
            case AutocompleteField.LOCATION:
            case AutocompleteField.PARENT_FOLDER:
                this.autocompleteOptionsSubject$.next([]);
                break;
            default:
                this.autocompleteOptionsSubject$.next(this.settings.autocompleteOptions);
        }
    }

    private fetchOptions(searchTerm: string): Observable<AutocompleteOption[]> {
        switch (this.settings?.field) {
            case AutocompleteField.CATEGORIES:
                return this.searchForExistingCategories(searchTerm);
            case AutocompleteField.TAG:
                return this.searchForExistingTags(searchTerm);
            case AutocompleteField.LOCATION:
                return this.getSitesOptions();
            case AutocompleteField.PARENT_FOLDER:
                return this.searchFolders(searchTerm);
            default:
                return of([]);
        }
    }

    private searchForExistingCategories(searchTerm: string): Observable<AutocompleteOption[]> {
        return this.categoryService.searchCategories(searchTerm, 0, 15).pipe(
            map((existingCategoriesResult) =>
                existingCategoriesResult.list.entries.map((rowEntry) => {
                    const path = rowEntry.entry.path.name.split('/').splice(3).join('/');
                    const fullPath = path ? `${path}/${rowEntry.entry.name}` : rowEntry.entry.name;
                    return { id: rowEntry.entry.id, value: rowEntry.entry.name, fullPath };
                })
            )
        );
    }

    private searchForExistingTags(searchTerm: string): Observable<AutocompleteOption[]> {
        return this.tagService.searchTags(searchTerm, { orderBy: 'tag', direction: 'asc' }, false, 0, 15).pipe(
            map((existingTagsResult) =>
                existingTagsResult.list.entries.map((tag) => ({
                    id: tag.entry.id,
                    value: tag.entry.tag
                }))
            )
        );
    }

    private getSitesOptions(): Observable<AutocompleteOption[]> {
        return this.sitesService.getSites().pipe(
            map((sites) => {
                const predefinedOptions = this.settings?.autocompleteOptions || [];
                const sitesOptions = sites.list.entries
                    .filter((siteEntry) => siteEntry.entry.visibility === 'public' || siteEntry.entry?.role)
                    .map<AutocompleteOption>((siteEntry) => ({
                        id: siteEntry.entry.id,
                        value: siteEntry.entry.title
                    }));
                return [...sitesOptions, ...predefinedOptions];
            })
        );
    }

    private searchFolders(searchTerm: string): Observable<AutocompleteOption[]> {
        const wildcard = this.context?.wildcardsEnabled ? '*' : '';
        const filterQueries = [...(this.context?.config.filterQueries ?? []), { query: "TYPE:'cm:folder'" }];
        const queryBody: SearchRequest = {
            query: {
                language: 'afts',
                query: `cm:name:"${wildcard}${searchTerm}${wildcard}"`
            },
            include: ['path'],
            filterQueries
        };

        return this.searchService.searchByQueryBody(queryBody, false).pipe(
            map((folders) =>
                folders.list.entries.map((folderEntry) => {
                    const fullPath = folderEntry.entry.path.name
                        ? `${folderEntry.entry.path.name}/${folderEntry.entry.name}`
                        : folderEntry.entry.name;
                    return { id: folderEntry.entry.id, value: folderEntry.entry.name, fullPath };
                })
            )
        );
    }
}
