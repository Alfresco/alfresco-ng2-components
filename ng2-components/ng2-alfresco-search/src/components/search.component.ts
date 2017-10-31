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

import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { NodePaging } from 'alfresco-js-api';
import { SearchOptions, SearchService } from 'ng2-alfresco-core';
import { Subject } from 'rxjs/Subject';

let _uniqueAutocompleteIdCounter = 0;

@Component({
    moduleId: module.id,
    selector: 'adf-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'adfSearchAutocomplete',
    host: {
        'class': 'adf-search'
    }
})
export class SearchComponent implements AfterContentInit, OnChanges {

    @ViewChild('panel')
    panel: ElementRef;

    @ContentChild(TemplateRef)
    template: TemplateRef<any>;

    @Input()
    displayWith: ((value: any) => string) | null = null;

    @Input()
    maxResults: number = 5;

    @Input()
    resultSort: string = null;

    @Input()
    rootNodeId: string = '-root-';

    @Input()
    resultType: string = null;

    @Input()
    searchTerm: string = '';

    @Input('class')
    set classList(classList: string) {
        if (classList && classList.length) {
            classList.split(' ').forEach(className => this._classList[className.trim()] = true);
            this._elementRef.nativeElement.className = '';
        }
    }

    @Output()
    success: EventEmitter<NodePaging> = new EventEmitter();

    showPanel: boolean = false;
    results: NodePaging;

    get isOpen(): boolean {
        return this._isOpen && this.showPanel;
    }

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    _isOpen: boolean = false;

    keyPressedStream: Subject<string> = new Subject();

    _classList: { [key: string]: boolean } = {};

    id: string = `search-${_uniqueAutocompleteIdCounter++}`;

    constructor(
        private searchService: SearchService,
        private changeDetectorRef: ChangeDetectorRef,
        private _elementRef: ElementRef) {
        this.keyPressedStream.asObservable()
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe((searchedWord: string) => {
                this.displaySearchResults(searchedWord);
            });
    }

    ngAfterContentInit() {
        this.setVisibility();
    }

    ngOnChanges(changes) {
        if (changes.searchTerm) {
            this.cleanResults();
            this.displaySearchResults(changes.searchTerm.currentValue);
        }
    }

    resetResults() {
        this.cleanResults();
        this.setVisibility();
    }

    private cleanResults() {
        if (this.results) {
            this.results = {};
        }
    }

    private displaySearchResults(searchTerm) {
        let searchOpts: SearchOptions = {
            include: ['path'],
            rootNodeId: this.rootNodeId,
            nodeType: this.resultType,
            maxItems: this.maxResults,
            orderBy: this.resultSort
        };
        if (searchTerm !== null && searchTerm !== '') {
            searchTerm = searchTerm + '*';
            this.searchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(
                results => {
                    this.results = <NodePaging>results;
                    this.success.emit(this.results);
                    this.setVisibility();
                },
                error => {
                    this.results = null;
                }
                );
        }
    }

    _setScrollTop(scrollTop: number): void {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }

    _getScrollTop(): number {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }

    hidePanel() {
        if (this.isOpen) {
            this._classList['adf-search-show'] = false;
            this._classList['adf-search-hide'] = true;
            this.isOpen = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    setVisibility() {
        this.showPanel = !!this.results &&
                         !!this.results.list &&
                         !!this.results.list.entries.length;
        this._classList['adf-search-show'] = this.showPanel;
        this._classList['adf-search-hide'] = !this.showPanel;
        this.changeDetectorRef.markForCheck();
    }
}
