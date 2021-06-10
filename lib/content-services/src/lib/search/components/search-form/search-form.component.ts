/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { SearchQueryBuilderService } from '../../search-query-builder.service';
import { SearchForm } from '../../models/search-form.interface';
import { SEARCH_QUERY_SERVICE_TOKEN } from '../../search-query-service.token';

@Component({
  selector: 'adf-search-form',
  templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnInit {
    @Output()
    formChange: EventEmitter<SearchForm> = new EventEmitter<SearchForm>();

    selected: number;
    searchForms: SearchForm[] = [];

    constructor(@Inject(SEARCH_QUERY_SERVICE_TOKEN) private queryBuilder: SearchQueryBuilderService) {}

    ngOnInit(): void {
      this.searchForms = this.queryBuilder.getSearchConfigurationDetails();
      this.selected = this.searchForms.find(form => form.selected)?.index;
    }

    onSelectionChange(index: number) {
        this.formChange.emit(this.searchForms[index]);
    }
}
