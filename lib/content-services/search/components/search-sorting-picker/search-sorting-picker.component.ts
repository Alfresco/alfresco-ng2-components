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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { SearchSortingDefinition } from '../../search-sorting-definition.interface';

@Component({
    selector: 'adf-search-sorting-picker',
    templateUrl: './search-sorting-picker.component.html',
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-sorting-picker' }
})
export class SearchSortingPickerComponent implements OnInit {

    options: SearchSortingDefinition[] = [];
    value: string;
    ascending: boolean;

    constructor(private queryBuilder: SearchQueryBuilderService) {}

    ngOnInit() {
        this.options = this.queryBuilder.getSortingOptions();

        const primary = this.queryBuilder.getPrimarySorting();
        if (primary) {
            this.value = primary.key;
            this.ascending = primary.ascending;
        }
    }

    onChanged(sorting: { key: string, ascending: boolean }) {
        this.value = sorting.key;
        this.ascending = sorting.ascending;
        this.applySorting();
    }

    private findOptionByKey(key: string): SearchSortingDefinition {
        if (key) {
            return this.options.find(opt => opt.key === key);
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

}
