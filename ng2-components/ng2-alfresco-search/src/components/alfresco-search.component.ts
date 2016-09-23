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

import { Component, EventEmitter, Input, Output, Optional, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AlfrescoSearchService } from './../services/alfresco-search.service';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-search',
    styleUrls: ['./alfresco-search.component.css'],
    templateUrl: './alfresco-search.component.html'
})
export class AlfrescoSearchComponent implements OnChanges, OnInit {

    baseComponentPath = __moduleName.replace('/components/alfresco-search.component.js', '');

    @Input()
    searchTerm: string = '';

    @Output()
    preview: EventEmitter<any> = new EventEmitter();

    @Output()
    resultsEmitter = new EventEmitter();

    @Output()
    errorEmitter = new EventEmitter();

    results: any;

    errorMessage;

    queryParamName = 'q';

    constructor(private alfrescoSearchService: AlfrescoSearchService,
                private translate: AlfrescoTranslationService,
                private _alfrescoThumbnailService: AlfrescoThumbnailService,
                @Optional() private route: ActivatedRoute) {

        if (translate !== null) {
            translate.addTranslationFolder('node_modules/ng2-alfresco-search/dist/src');
        }

        this.results = null;
    }

    ngOnInit(): void {
        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchTerm = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                this.displaySearchResults(this.searchTerm);
            });
        } else {
            this.displaySearchResults(this.searchTerm);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['searchTerm']) {
            this.displaySearchResults(changes['searchTerm'].currentValue);
        }
    }

    /**
     * Gets thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getMimeTypeIcon(node: any): string {
        if (node.entry.content && node.entry.content.mimeType) {
            let icon = this._alfrescoThumbnailService.getMimeTypeIcon(node.entry.content.mimeType);
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
            return 'SEARCH.ICONS.' + this._alfrescoThumbnailService.getMimeTypeKey(node.entry.content.mimeType);
        } else {
            return '';
        }
    }

    /**
     * Loads and displays search results
     * @param searchTerm Search query entered by user
     */
    public displaySearchResults(searchTerm): void {
        if (searchTerm !== null) {
            this.alfrescoSearchService
                .getLiveSearchResults(searchTerm)
                .subscribe(
                    results => {
                        this.results = results.list.entries;
                        this.resultsEmitter.emit(this.results);
                        this.errorMessage = null;
                    },
                    error => {
                        this.results = null;
                        this.errorMessage = <any>error;
                        this.errorEmitter.emit(error);
                    }
                );
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
