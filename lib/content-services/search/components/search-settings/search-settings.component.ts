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

import { Component, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { SearchQueryBuilder } from '../../search-query-builder';
import { FacetQuery } from '../../facet-query.interface';
import { ResponseFacetField } from '../../response-facet-field.interface';
import { FacetFieldBucket } from '../../facet-field-bucket.interface';
import { SearchCategory } from '../../search-category.interface';
import { ResponseFacetQuery } from '../../response-facet-query.interface';

@Component({
    selector: 'adf-search-settings',
    templateUrl: './search-settings.component.html',
    styleUrls: ['./search-settings.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-settings' }
})
export class SearchSettingsComponent {

    selectedFacetQueries: string[] = [];
    selectedBuckets: FacetFieldBucket[] = [];

    @Input()
    queryBuilder: SearchQueryBuilder;

    @Input()
    responseFacetQueries: FacetQuery[] = [];

    @Input()
    responseFacetFields: ResponseFacetField[] = [];

    @Output()
    facetQueryToggle = new EventEmitter<{ event: MatCheckboxChange, query: ResponseFacetQuery }>();

    @Output()
    facetFieldToggle = new EventEmitter<{ event: MatCheckboxChange, field: ResponseFacetField, bucket: FacetFieldBucket }>();

    onCategoryExpanded(category: SearchCategory) {
        category.expanded = true;
    }

    onCategoryCollapsed(category: SearchCategory) {
        category.expanded = false;
    }

    onFacetFieldExpanded(field: ResponseFacetField) {
        field.$expanded = true;
    }

    onFacetFieldCollapsed(field: ResponseFacetField) {
        field.$expanded = false;
    }

    onFacetQueryToggle(event: MatCheckboxChange, query: ResponseFacetQuery) {
        this.facetQueryToggle.next({event, query});
    }

    onFacetToggle(event: MatCheckboxChange, field: ResponseFacetField, bucket: FacetFieldBucket) {
        this.facetFieldToggle.next({ event, field, bucket });
    }

}
