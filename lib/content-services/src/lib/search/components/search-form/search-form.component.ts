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

import { Component, EventEmitter, inject, Output, ViewEncapsulation } from '@angular/core';
import { SearchQueryBuilderService } from '../../services/search-query-builder.service';
import { SearchForm } from '../../models/search-form.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'adf-search-form',
    imports: [CommonModule, MatButtonModule, TranslateModule, MatMenuModule, MatIconModule],
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchFormComponent {
    private queryBuilder = inject(SearchQueryBuilderService);

    searchForms$ = this.queryBuilder.searchForms;

    /** Emitted when the form change */
    @Output()
    formChange: EventEmitter<SearchForm> = new EventEmitter<SearchForm>();

    onSelectionChange(form: SearchForm) {
        this.queryBuilder.updateSelectedConfiguration(form.index);
        this.formChange.emit(form);
    }

    getSelected(forms: SearchForm[]): string {
        return forms.find((form) => form.selected)?.name;
    }
}
