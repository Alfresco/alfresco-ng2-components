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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { FacetFieldBucket } from '../../models/facet-field-bucket.interface';
import { FacetField } from '../../models/facet-field.interface';
import { SearchFacetFiltersService } from '../../services/search-facet-filters.service';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFilterCardComponent } from './search-filter-card/search-filter-card.component';
import { ResetSearchDirective } from '../reset-search.directive';
import { SearchFacetFieldComponent } from '../search-facet-field';
import { SearchFacetTabbedContentComponent } from '../search-filter-chips';

@Component({
    selector: 'adf-search-filter',
    imports: [
        CommonModule,
        MatExpansionModule,
        MatButtonModule,
        TranslateModule,
        SearchFilterCardComponent,
        ResetSearchDirective,
        SearchFacetFieldComponent,
        SearchFacetTabbedContentComponent
    ],
    templateUrl: './search-filter.component.html',
    styleUrls: ['./search-filter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-filter' }
})
export class SearchFilterComponent {
    /** Toggles whether to show or not the context facet filters. */
    @Input()
    showContextFacets: boolean = true;

    facetQueriesLabel: string = 'Facet Queries';
    facetExpanded = {
        default: false
    };
    displayResetButton: boolean;

    constructor(public queryBuilder: SearchQueryBuilderService, public facetFiltersService: SearchFacetFiltersService) {
        if (queryBuilder.config?.facetQueries) {
            this.facetQueriesLabel = queryBuilder.config.facetQueries.label || 'Facet Queries';
            this.facetExpanded['query'] = queryBuilder.config.facetQueries.expanded;
        }
        if (queryBuilder.config?.facetFields) {
            this.facetExpanded['field'] = queryBuilder.config.facetFields.expanded;
        }
        if (queryBuilder.config?.facetIntervals) {
            this.facetExpanded['interval'] = queryBuilder.config.facetIntervals.expanded;
        }
        this.displayResetButton = this.queryBuilder.config && !!this.queryBuilder.config.resetButton;
    }

    shouldExpand(field: FacetField): boolean {
        return this.facetExpanded[field.type] || this.facetExpanded['default'];
    }

    getBucketCountDisplay(bucket: FacetFieldBucket): string {
        return bucket.count === null ? '' : `(${bucket.count})`;
    }
}
