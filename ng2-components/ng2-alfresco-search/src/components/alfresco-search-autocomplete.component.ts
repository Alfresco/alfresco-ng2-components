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

import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, Output, ViewChild } from '@angular/core';
import { AlfrescoSearchService, SearchOptions } from './../services/alfresco-search.service';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

@Component({
    moduleId: module.id,
    selector: 'alfresco-search-autocomplete',
    templateUrl: './alfresco-search-autocomplete.component.html',
    styleUrls: ['./alfresco-search-autocomplete.component.css']
})
export class AlfrescoSearchAutocompleteComponent implements OnInit, OnChanges {

    @Input()
    searchTerm: string = '';

    results: any = null;

    errorMessage;

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

    constructor(private alfrescoSearchService: AlfrescoSearchService,
                private translate: AlfrescoTranslationService,
                private alfrescoThumbnailService: AlfrescoThumbnailService) {
    }

    ngOnInit(): void {
        if (this.translate) {
            this.translate.addTranslationFolder('ng2-alfresco-search', 'node_modules/ng2-alfresco-search/dist/src');
        }
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
            this.alfrescoSearchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(
                    results => {
                        this.results = results.list.entries.slice(0, this.maxResults);
                        this.errorMessage = null;
                        this.resultsLoad.emit(this.results);
                    },
                    error => {
                        this.results = null;
                        this.errorMessage = <any>error;
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
    getMimeTypeIcon(node: any): string {
        if (node.entry.content && node.entry.content.mimeType) {
            let icon = this.alfrescoThumbnailService.getMimeTypeIcon(node.entry.content.mimeType);
            return this.resolveIconPath(icon);
        }
    }

    resolveIconPath(icon: string): string {
        let result = null;
        try {
            // webpack
            result = require(`./../img/${icon}`);
        } catch (e) {
            // system.js
            if (module && module.id) {
                let baseComponentPath = module.id.replace('/components/alfresco-search-autocomplete.component.js', '');
                result = `${baseComponentPath}/img/${icon}`;
            }
        }
        return result;
    }

    /**
     * Gets thumbnail message key for the given document node, which can be used to look up alt text
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getMimeTypeKey(node: any): string {
        if (node.entry.content && node.entry.content.mimeType) {
            return 'SEARCH.ICONS.' + this.alfrescoThumbnailService.getMimeTypeKey(node.entry.content.mimeType);
        } else {
            return '';
        }
    }

    focusResult(): void {
        let firstResult: any = this.resultsTableBody.nativeElement.querySelector('tr');
        firstResult.focus();
    }

    onItemClick(node): void {
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.fileSelect.emit({
                    value: node
                });
            }
        }
    }

    onRowFocus($event: FocusEvent): void {
        this.searchFocus.emit($event);
    }

    onRowBlur($event: FocusEvent): void {
        this.searchFocus.emit($event);
    }

    onRowEnter(node): void {
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.fileSelect.emit({
                    value: node
                });
            }
        }
    }

    private getNextElementSibling(node: Element): Element {
        return node.nextElementSibling;
    }

    private getPreviousElementSibling(node: Element): Element {
        return node.previousElementSibling;
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

}
