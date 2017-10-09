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

import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MinimalNodeEntity } from 'alfresco-js-api';
import { SearchOptions, SearchService } from 'ng2-alfresco-core';
import { ThumbnailService } from 'ng2-alfresco-core';

@Component({
    selector: 'adf-search-autocomplete, alfresco-search-autocomplete',
    templateUrl: './search-autocomplete.component.html',
    styleUrls: ['./search-autocomplete.component.scss'],
    animations: [
        trigger('transformAutocomplete', [
            state('void', style({
                opacity: 0,
                transform: 'scale(0.01, 0.01)'
            })),
            state('enter-start', style({
                opacity: 1,
                transform: 'scale(1, 0.5)'
            })),
            state('enter', style({
                transform: 'scale(1, 1)'
            })),
            transition('void => enter-start', animate('100ms linear')),
            transition('enter-start => enter', animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
            transition('* => void', animate('150ms 50ms linear', style({opacity: 0})))
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class SearchAutocompleteComponent implements OnChanges {

    @Input()
    searchTerm: string = '';

    results: any = null;

    errorMessage: string = null;

    @Input()
    ngClass: any;

    @Input()
    maxResults: number = 5;

    @Input()
    resultSort: string = null;

    @Input()
    rootNodeId: string = '-root';

    @Input()
    resultType: string = null;

    @Input()
    highlight: boolean = false;

    @Output()
    fileSelect: EventEmitter<any> = new EventEmitter();

    @Output()
    searchFocus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

    @Output()
    cancel = new EventEmitter();

    @Output()
    resultsLoad = new EventEmitter();

    @Output()
    scrollBack = new EventEmitter();

    @ViewChild('resultsTableBody', {}) resultsTableBody: ElementRef;

    panelAnimationState: 'void' | 'enter-start' | 'enter' = 'void';

    constructor(private searchService: SearchService,
                private thumbnailService: ThumbnailService) {
    }

    ngOnChanges(changes) {
        if (changes.searchTerm) {
            this.results = null;
            this.errorMessage = null;
            this.displaySearchResults(changes.searchTerm.currentValue);
        }
    }

    /**
     * Loads and displays search results
     * @param searchTerm Search query entered by user
     */
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
                        this.results = results.list.entries.slice(0, this.maxResults);

                        if (results && results.list) {
                            this.startAnimation();
                        }

                        this.errorMessage = null;
                        this.resultsLoad.emit(this.results);
                    },
                    error => {
                        this.results = null;
                        this.errorMessage = <any> error;
                        this.resultsLoad.error(error);
                    }
                );
        }
    }

    /**
     * Gets thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getMimeTypeIcon(node: MinimalNodeEntity): string {
        let mimeType;

        if (node.entry.content && node.entry.content.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }

        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    focusResult(): void {
        let firstResult: any = this.resultsTableBody.nativeElement.querySelector('tr');
        firstResult.focus();
    }

    private getNextElementSibling(node: Element): Element {
        return node.nextElementSibling;
    }

    private getPreviousElementSibling(node: Element): Element {
        return node.previousElementSibling;
    }

    onItemClick(node: MinimalNodeEntity): void {
        if (node && node.entry) {
            this.fileSelect.emit(node);
        }
    }

    onRowFocus($event: FocusEvent): void {
        this.searchFocus.emit($event);
    }

    onRowBlur($event: FocusEvent): void {
        this.searchFocus.emit($event);
    }

    onRowEnter(node: MinimalNodeEntity): void {
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.fileSelect.emit(node);
            }
        }
    }

    onRowArrowDown($event: KeyboardEvent): void {
        let nextElement: any = this.getNextElementSibling(<Element> $event.target);
        if (nextElement) {
            nextElement.focus();
        }
    }

    onRowArrowUp($event: KeyboardEvent): void {
        let previousElement: any = this.getPreviousElementSibling(<Element> $event.target);
        if (previousElement) {
            previousElement.focus();
        } else {
            this.scrollBack.emit($event);
        }
    }

    onRowEscape($event: KeyboardEvent): void {
        this.cancel.emit($event);
    }

    startAnimation() {
        this.panelAnimationState = 'enter-start';
    }

    resetAnimation() {
        this.panelAnimationState = 'void';
    }

    onAnimationDone(event: AnimationEvent) {
        if (event.toState === 'enter-start') {
            this.panelAnimationState = 'enter';
        }
    }

}
