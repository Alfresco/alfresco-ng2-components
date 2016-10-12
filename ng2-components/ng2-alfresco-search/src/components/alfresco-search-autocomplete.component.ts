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

import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { AlfrescoSearchService } from './../services/alfresco-search.service';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

@Component({
    moduleId: module.id,
    selector: 'alfresco-search-autocomplete',
    templateUrl: './alfresco-search-autocomplete.component.html',
    styleUrls: ['./alfresco-search-autocomplete.component.css']
})
export class AlfrescoSearchAutocompleteComponent implements OnInit, OnChanges {

    baseComponentPath = module.id.replace('/components/alfresco-search-autocomplete.component.js', '');

    @Input()
    searchTerm: string = '';

    results: any = null;

    errorMessage;

    @Input()
    ngClass: any;

    @Output()
    preview: EventEmitter<any> = new EventEmitter();

    @Output()
    resultsEmitter = new EventEmitter();

    @Output()
    errorEmitter = new EventEmitter();

    constructor(private alfrescoSearchService: AlfrescoSearchService,
                private translate: AlfrescoTranslationService,
                private alfrescoThumbnailService: AlfrescoThumbnailService) {
    }

    ngOnInit(): void {
        if (this.translate) {
            this.translate.addTranslationFolder('node_modules/ng2-alfresco-search/dist/src');
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
    public displaySearchResults(searchTerm) {
        if (searchTerm !== null && searchTerm !== '') {
            this.alfrescoSearchService
                .getSearchNodesPromise(searchTerm)
                .then(
                    results => {
                        this.results = results.list.entries;
                        this.errorMessage = null;
                        this.resultsEmitter.emit(this.results);
                    },
                    error => {
                        this.results = null;
                        this.errorMessage = <any>error;
                        this.errorEmitter.emit(error);
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
            return `${this.baseComponentPath}/img/${icon}`;
        }
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

    onItemClick(node, event?: Event): void {
        if (event) {
            event.preventDefault();
        }
        if (node && node.entry) {
            if (node.entry.isFile) {
                this.preview.emit({
                    value: node
                });
            }
        }
    }

}
