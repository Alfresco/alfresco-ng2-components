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

import { AppConfigService } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { SearchConfiguration } from '../../models';

@Component({
    selector: 'adf-search-input',
    imports: [CommonModule, MatFormFieldModule, MatInputModule, TranslateModule],
    templateUrl: `./search-input.component.html`,
    styleUrls: ['./search-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchInputComponent implements OnInit {
    @Input()
    value = '';

    @Input()
    label = 'SEARCH.INPUT.LABEL';

    @Input()
    placeholder = 'SEARCH.INPUT.PLACEHOLDER';

    @Input()
    fields = ['cm:name'];

    @Output()
    changed = new EventEmitter<string>();

    constructor(private appConfig: AppConfigService) {}

    ngOnInit(): void {
        const searchConfig = this.appConfig.get<SearchConfiguration>('search') || {};
        if (searchConfig['app:fields']) {
            this.fields = searchConfig['app:fields'];
        }
    }

    onSearchInputChanged(event: Event) {
        const input = event.target as HTMLInputElement;
        const searchTerm = input.value;

        const query = this.formatSearchQuery(searchTerm, this.fields);
        if (query) {
            this.changed.emit(decodeURIComponent(query));
        }
    }

    private formatSearchQuery(userInput: string, fields = ['cm:name']): string {
        if (!userInput) {
            return null;
        }

        if (/^https?:\/\//.test(userInput)) {
            return this.formatFields(fields, userInput);
        }

        userInput = userInput.trim();

        if (userInput.includes(':') || userInput.includes('"')) {
            return userInput;
        }

        const words = userInput.split(' ');

        if (words.length > 1) {
            const separator = words.some(this.isOperator) ? ' ' : ' AND ';
            return words.map((term) => (this.isOperator(term) ? term : this.formatFields(fields, term))).join(separator);
        }

        return this.formatFields(fields, userInput);
    }

    private isOperator(input: string): boolean {
        if (input) {
            input = input.trim().toUpperCase();

            const operators = ['AND', 'OR'];
            return operators.includes(input);
        }
        return false;
    }

    private formatFields(fields: string[], term: string): string {
        let prefix = '';
        let suffix = '*';

        if (term.startsWith('=')) {
            prefix = '=';
            suffix = '';
            term = term.substring(1);
        }

        if (term === '*') {
            prefix = '';
            suffix = '';
        }

        return '(' + fields.map((field) => `${prefix}${field}:"${term}${suffix}"`).join(' OR ') + ')';
    }
}
