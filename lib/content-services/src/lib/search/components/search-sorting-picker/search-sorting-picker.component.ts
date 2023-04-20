/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchSortingDefinition } from '../../models/search-sorting-definition.interface';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';

@Component({
    selector: 'adf-search-sorting-picker',
    templateUrl: './search-sorting-picker.component.html',
    styleUrls: ['./search-sorting-picker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-sorting-picker' }
})
export class SearchSortingPickerComponent implements OnInit {

    options: SearchSortingDefinition[] = [];
    value: string;
    ascending: boolean;

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) private queryBuilder: SearchQueryBuilderService) {}

    ngOnInit() {
        this.options = this.queryBuilder.getSortingOptions();

        const primary = this.queryBuilder.getPrimarySorting();
        if (primary) {
            this.value = primary.key;
            this.ascending = primary.ascending;
        }
    }

    onValueChanged(key: string) {
        this.value = key;
        this.ascending = this.getSortingOrder();
        this.applySorting();
    }

    onSortingChanged(ascending: boolean) {
        this.ascending = ascending;
        this.applySorting();
    }

    private findOptionByKey(key: string): SearchSortingDefinition {
        if (key) {
            return this.options.find((opt) => opt.key === key);
        }
        return null;
    }

    private applySorting() {
        const option = this.findOptionByKey(this.value);
        if (option) {
            this.queryBuilder.sorting = [{
                ...option,
                ascending: this.ascending
            }];
            this.queryBuilder.update();
        }
    }

    private getSortingOrder(): boolean {
        const option = this.findOptionByKey(this.value);
        if (option) {
            return option.ascending;
        }

        return this.queryBuilder.getPrimarySorting().ascending;
    }

}
