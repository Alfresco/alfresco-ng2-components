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

import { Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { FacetField, SearchCategory, TabbedFacetField } from '../../models';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchFacetChipTabbedComponent } from './search-facet-chip-tabbed/search-facet-chip-tabbed.component';
import { SearchFacetChipComponent } from './search-facet-chip/search-facet-chip.component';
import { SearchWidgetChipComponent } from './search-widget-chip/search-widget-chip.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-search-filter-chips',
    standalone: true,
    imports: [CommonModule, MatChipsModule, TranslatePipe, SearchFacetChipTabbedComponent, SearchFacetChipComponent, SearchWidgetChipComponent],
    templateUrl: './search-filter-chips.component.html',
    styleUrls: ['./search-filter-chips.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFilterChipsComponent implements OnInit {
    private queryBuilder = inject(SearchQueryBuilderService);
    private facetFiltersService = inject(SearchFacetFiltersService);

    private readonly destroyRef = inject(DestroyRef);

    /** Toggles whether to show or not the context facet filters. */
    @Input()
    showContextFacets: boolean = true;

    facetChipTabbedId = '';

    get categories(): SearchCategory[] {
        return this.queryBuilder.categories || [];
    }

    get tabbedFacet(): TabbedFacetField | null {
        return this.facetFiltersService.tabbedFacet;
    }

    get responseFacets(): FacetField[] {
        return this.facetFiltersService.responseFacets || [];
    }

    ngOnInit() {
        this.queryBuilder.executed
            .asObservable()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => (this.facetChipTabbedId = 'search-fact-chip-tabbed-' + this.facetFiltersService.tabbedFacet?.fields.join('-')));
    }
}
