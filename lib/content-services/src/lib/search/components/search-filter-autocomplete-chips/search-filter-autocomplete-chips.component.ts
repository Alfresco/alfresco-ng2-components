/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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

@Component({
    selector: 'adf-search-filter-autocomplete-chips',
    imports: [CommonModule, SearchChipAutocompleteInputComponent, TranslatePipe, MatButtonModule],
    templateUrl: './search-filter-autocomplete-chips.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterAutocompleteChipsComponent implements SearchWidget, OnInit {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    options: SearchFilterList<AutocompleteOption[]>;
    startValue: AutocompleteOption[] = [];
    displayValue$ = new ReplaySubject<string>(1);
    selectedOptions: AutocompleteOption[] = [];
    enableChangeUpdate: boolean;

    private resetSubject$ = new Subject<void>();
    reset$: Observable<void> = this.resetSubject$.asObservable();
    private autocompleteOptionsSubject$ = new BehaviorSubject<AutocompleteOption[]>([]);
    autocompleteOptions$: Observable<AutocompleteOption[]> = this.autocompleteOptionsSubject$.asObservable();

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private tagService: TagService,
        private categoryService: CategoryService,
        private sitesService: SitesService
    ) {
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
            this.context.update();
        }
    }

    setValue(value: AutocompleteOption[]) {
        this.selectedOptions = value;
        this.displayValue$.next(this.selectedOptions.join(', '));
        this.submitValues();
    }

    onInputChange(value: string) {
        if (this.settings.field === AutocompleteField.CATEGORIES && value) {
            this.searchForExistingCategories(value);
        }
        if (this.settings.field === AutocompleteField.LOCATION && value) {
            this.populateSitesOptions();
        }
    }

    optionComparator(option1: AutocompleteOption, option2: AutocompleteOption): boolean {
        return option1.id ? option1.id.toUpperCase() === option2.id.toUpperCase() : option1.value.toUpperCase() === option2.value.toUpperCase();
    }

    private updateQuery(updateContext = true) {
        this.context.filterRawParams[this.id] = this.selectedOptions.length > 0 ? this.selectedOptions : undefined;
        this.displayValue$.next(this.selectedOptions.map((option) => option.value).join(', '));
        if (this.context && this.settings && this.settings.field) {
            let queryFragments;
            switch (this.settings.field) {
                case AutocompleteField.CATEGORIES:
                    queryFragments = this.selectedOptions.map((val) => `${this.settings.field}:"workspace://SpacesStore/${val.id}"`);
                    break;
                case AutocompleteField.LOCATION:
                    queryFragments = this.selectedOptions.map((val) => val.query ?? `${this.settings.field}:"${val.id}"`);
                    break;
                default:
                    queryFragments = this.selectedOptions.map((val) => val.query ?? `${this.settings.field}:"${val.value}"`);
                    break;
            }
            this.context.queryFragments[this.id] = queryFragments.join(' OR ');
            if (updateContext) {
                this.context.update();
            }
        }
    }

    private setOptions() {
        switch (this.settings.field) {
            case AutocompleteField.TAG:
                this.tagService.getAllTheTags().subscribe((tagPaging) => {
                    this.autocompleteOptionsSubject$.next(
                        tagPaging.list.entries.map((tag) => ({
                            value: tag.entry.tag
                        }))
                    );
                });
                break;
            case AutocompleteField.CATEGORIES:
                this.autocompleteOptionsSubject$.next([]);
                break;
            case AutocompleteField.LOCATION:
                this.autocompleteOptionsSubject$.next([]);
                break;
            default:
                this.autocompleteOptionsSubject$.next(this.settings.autocompleteOptions);
        }
    }

    private searchForExistingCategories(searchTerm: string) {
        this.categoryService.searchCategories(searchTerm, 0, 15).subscribe((existingCategoriesResult) => {
            this.autocompleteOptionsSubject$.next(
                existingCategoriesResult.list.entries.map((rowEntry) => {
                    const path = rowEntry.entry.path.name.split('/').splice(3).join('/');
                    const fullPath = path ? `${path}/${rowEntry.entry.name}` : rowEntry.entry.name;
                    return { id: rowEntry.entry.id, value: rowEntry.entry.name, fullPath };
                })
            );
        });
    }

    private populateSitesOptions(): void {
        this.sitesService
            .getSites()
            .pipe(
                map((sites) => {
                    const predefinedOptions = this.settings?.autocompleteOptions || [];
                    const sitesOptions = sites.list.entries.map((siteEntry) => ({
                        id: siteEntry.entry.id,
                        value: siteEntry.entry.title
                    }));
                    return [...sitesOptions, ...predefinedOptions];
                })
            )
            .subscribe((options) => this.autocompleteOptionsSubject$.next(options));
    }
}
