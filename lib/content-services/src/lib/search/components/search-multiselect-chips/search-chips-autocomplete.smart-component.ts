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

import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SearchWidget } from '../../models/search-widget.interface';
import {
    SearchQueryBuilderService,
    SearchWidgetSettings,
    SitesService,
    TagService
} from '@alfresco/adf-content-services';
import { SearchFilterList } from '../../models/search-filter-list.model';

export interface SearchMultiselectChipsOption {
    name: string;
    value: string;
}

@Component({
    selector: 'adf-search-chips-autocomplete-smart',
    templateUrl: './search-chips-autocomplete.smart-component.html',
    styleUrls: ['search-chips-autocomplete.smart-component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchChipsAutocompleteSmartComponent implements SearchWidget, OnInit {
    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    options: SearchFilterList<SearchMultiselectChipsOption>;
    startValue: any = null;
    operator: string = 'OR';
    isActive = false;
    enableChangeUpdate = true;
    // todo - set type
    displayValue$: Subject<string> = new Subject<string>();


    separatorKeysCodes: number[] = [ENTER, COMMA];
    fruitCtrl = new FormControl('');
    private resetSubject$ = new Subject<void>();
    reset$: Observable<void> = this.resetSubject$.asObservable();
    allOptions: string[] = [];
    selectedOptions: string[] = [];

    constructor( private tagService: TagService, private sitesService: SitesService) {
        this.options = new SearchFilterList<SearchMultiselectChipsOption>();
    }

    ngOnInit() {

        if (this.settings) {

            this.loadOptions()
            if (this.startValue) {
                this.setValue(this.startValue);
            }
        }
    }

    reset() {
        this.selectedOptions = [];
        this.resetSubject$.next();
        this.updateQuery(null);
    }

    submitValues() {
        this.updateQuery(this.selectedOptions);
    }

    hasValidValue() {
        return !!this.selectedOptions;
    }

    getCurrentValue(){
        return this.selectedOptions;
    }

    onOptionsChange(selectedOptions){
        this.selectedOptions = selectedOptions;
    }

    setValue(value: string[]) {
        this.selectedOptions = value;
        this.displayValue$.next(this.selectedOptions.join(', '));
        this.submitValues();
    }

    private updateQuery(value: string[]) {
        this.displayValue$.next(this.selectedOptions.join(', '));
        const query = this.selectedOptions.map(val => `${this.settings.field}: "${val}"`).join(` ${this.operator} `);
        console.log(value)
        if (this.context && this.settings && this.settings.field) {
            console.log(this.context)
            this.context.queryFragments[this.id] = query;
            this.context.update();
        }
    }

    private loadOptions () {
        switch (this.settings.field) {
            case 'TAG':
                this.tagService.getAllTheTags().subscribe(res => { this.allOptions = res.list.entries.map(tag => tag.entry.tag)})
                break;
            case 'SITE':
                this.sitesService.getSites().subscribe(res => { this.allOptions = res.list.entries.map(site => site.entry.title)})
                break;
        }
    }
}
