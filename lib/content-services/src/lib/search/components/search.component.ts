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

import { SearchService } from '../services/search.service';
import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NodePaging, ResultSetPaging } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchComponentInterface } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-search',
    imports: [CommonModule, TranslateModule],
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    exportAs: 'searchAutocomplete',
    host: { class: 'adf-search' }
})
export class SearchComponent implements SearchComponentInterface, AfterContentInit, OnChanges {
    @ViewChild('panel', { static: true })
    panel: ElementRef;

    @ContentChild(TemplateRef)
    template: TemplateRef<any>;

    /** Function that maps an option's value to its display value in the trigger. */
    @Input()
    displayWith: ((value: any) => string) | null = null;

    /** Maximum number of results to show in the search. */
    @Input()
    maxResults: number = 20;

    /** Number of results to skip from the results pagination. */
    @Input()
    skipResults: number = 0;

    /**
     * Search term to use when executing the search. Updating this value will
     * run a new search and update the results.
     */
    @Input()
    searchTerm: string = '';

    /** CSS class for display. */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('class')
    set classList(classList: string) {
        if (classList?.length) {
            classList.split(' ').forEach((className) => (this._classList[className.trim()] = true));
            this._elementRef.nativeElement.className = '';
        }
    }

    /** Emitted when search results have fully loaded. */
    @Output()
    resultLoaded: EventEmitter<NodePaging> = new EventEmitter();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    showPanel: boolean = false;
    results: NodePaging;

    get isOpen(): boolean {
        return this._isOpen && this.showPanel;
    }

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    _isOpen: boolean = false;
    keyPressedStream = new Subject<string>();
    _classList: { [key: string]: boolean } = {};
    constructor(private searchService: SearchService, private _elementRef: ElementRef) {
        this.keyPressedStream.pipe(debounceTime(200), takeUntilDestroyed()).subscribe((searchedWord) => {
            this.loadSearchResults(searchedWord);
        });

        searchService.dataLoaded.pipe(takeUntilDestroyed()).subscribe(
            (nodePaging) => this.onSearchDataLoaded(nodePaging),
            (error) => this.onSearchDataError(error)
        );
    }

    ngAfterContentInit() {
        this.setVisibility();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.searchTerm?.currentValue) {
            this.loadSearchResults(changes.searchTerm.currentValue);
        }
    }
    resetResults() {
        this.cleanResults();
        this.setVisibility();
    }

    reload() {
        this.loadSearchResults(this.searchTerm);
    }

    private cleanResults() {
        if (this.results) {
            this.results = {};
        }
    }

    private loadSearchResults(searchTerm?: string) {
        this.resetResults();
        if (searchTerm) {
            this.searchService.search(searchTerm, this.maxResults, this.skipResults).subscribe(
                (result) => this.onSearchDataLoaded(result),
                (err) => this.onSearchDataError(err)
            );
        } else {
            this.cleanResults();
        }
    }

    onSearchDataLoaded(resultSetPaging: ResultSetPaging) {
        if (resultSetPaging) {
            this.results = resultSetPaging as NodePaging;
            this.resultLoaded.emit(this.results);
            this.isOpen = true;
            this.setVisibility();
        }
    }

    onSearchDataError(error: { status: number }) {
        if (error?.status !== 400) {
            this.results = null;
            this.error.emit(error);
        }
    }

    hidePanel() {
        if (this.isOpen) {
            this._classList['adf-search-show'] = false;
            this._classList['adf-search-hide'] = true;
            this.isOpen = false;
        }
    }

    setVisibility() {
        this.showPanel = !!this.results && !!this.results.list;
        this._classList['adf-search-show'] = this.showPanel;
        this._classList['adf-search-hide'] = !this.showPanel;
    }
}
