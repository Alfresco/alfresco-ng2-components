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

import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
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
export class SearchSettingsComponent implements OnInit {

    selectedFacetQueries: string[] = [];
    selectedBuckets: FacetFieldBucket[] = [];
    responseFacetQueries: FacetQuery[] = [];
    responseFacetFields: ResponseFacetField[] = [];

    @Input()
    queryBuilder: SearchQueryBuilder;

    ngOnInit() {
        if (this.queryBuilder) {
            this.queryBuilder.executed.subscribe(data => {
                this.onDataLoaded(data);
            });
        }
    }

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
        const facetQuery = this.queryBuilder.getFacetQuery(query.label);

        if (event.checked) {
            query.$checked = true;
            this.selectedFacetQueries.push(facetQuery.label);

            if (facetQuery) {
                this.queryBuilder.addFilterQuery(facetQuery.query);
            }
        } else {
            query.$checked = false;
            this.selectedFacetQueries = this.selectedFacetQueries.filter(q => q !== query.label);

            if (facetQuery) {
                this.queryBuilder.removeFilterQuery(facetQuery.query);
            }
        }

        this.queryBuilder.update();
    }

    onFacetToggle(event: MatCheckboxChange, field: ResponseFacetField, bucket: FacetFieldBucket) {
        if (event.checked) {
            bucket.$checked = true;
            this.selectedBuckets.push({ ...bucket });
            this.queryBuilder.addFilterQuery(bucket.filterQuery);
        } else {
            bucket.$checked = false;
            const idx = this.selectedBuckets.findIndex(
                b => b.$field === bucket.$field && b.label === bucket.label
            );

            if (idx >= 0) {
                this.selectedBuckets.splice(idx, 1);
            }
            this.queryBuilder.removeFilterQuery(bucket.filterQuery);
        }

        this.queryBuilder.update();
    }

    unselectFacetQuery(label: string) {
        const facetQuery = this.queryBuilder.getFacetQuery(label);
        this.selectedFacetQueries = this.selectedFacetQueries.filter(q => q !== label);

        this.queryBuilder.removeFilterQuery(facetQuery.query);
        this.queryBuilder.update();
    }

    unselectFacetBucket(bucket: FacetFieldBucket) {
        const idx = this.selectedBuckets.findIndex(
            b => b.$field === bucket.$field && b.label === bucket.label
        );

        if (idx >= 0) {
            this.selectedBuckets.splice(idx, 1);
        }
        this.queryBuilder.removeFilterQuery(bucket.filterQuery);
        this.queryBuilder.update();
    }

    onDataLoaded(data: any) {
        const context = data.list.context;

        if (context) {
            this.responseFacetQueries = (context.facetQueries || []).map(q => {
                q.$checked = this.selectedFacetQueries.includes(q.label);
                return q;
            });

            const expandedFields = this.responseFacetFields.filter(f => f.$expanded).map(f => f.label);

            this.responseFacetFields = (context.facetsFields || []).map(
                (field: ResponseFacetField) => {
                    field.$expanded = expandedFields.includes(field.label);

                    (field.buckets || []).forEach(bucket => {
                        bucket.$field = field.label;
                        bucket.$checked = false;

                        const previousBucket = this.selectedBuckets.find(
                            b => b.$field === bucket.$field && b.label === bucket.label
                        );
                        if (previousBucket) {
                           bucket.$checked = true;
                        }
                    });
                    return field;
                }
            );
        } else {
            this.responseFacetQueries = [];
            this.responseFacetFields = [];
        }
    }

}
