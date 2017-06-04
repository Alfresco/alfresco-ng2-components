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
import { AlfrescoSearchService, SearchOptions } from './../services/alfresco-search.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { NodePaging, Pagination } from 'alfresco-js-api';

@Component({
    selector: 'alfresco-search',
    styleUrls: ['./alfresco-search.component.css'],
    templateUrl: './alfresco-search.component.html'
})
export class AlfrescoSearchComponent implements OnChanges, OnInit {

    static SINGLE_CLICK_NAVIGATION: string = 'click';
    static DOUBLE_CLICK_NAVIGATION: string = 'dblclick';

    @Input()
    searchTerm: string = '';

    @Input()
    maxResults: number = 20;

    @Input()
    resultSort: string = null;

    @Input()
    rootNodeId: string = '-root-';

    @Input()
    resultType: string = null;

    @Input()
    navigationMode: string = AlfrescoSearchComponent.DOUBLE_CLICK_NAVIGATION; // click|dblclick

    @Input()
    emptyFolderImageUrl: string = require('../assets/images/empty_doc_lib.svg');

    @Output()
    resultsLoad = new EventEmitter();

    @Output()
    preview: EventEmitter<any> = new EventEmitter<any>();

    pagination: Pagination;
    errorMessage;
    queryParamName = 'q';
    skipCount: number = 0;
    nodeResults: NodePaging;

    constructor(private searchService: AlfrescoSearchService,
                private translateService: AlfrescoTranslationService,
                @Optional() private route: ActivatedRoute) {
    }

    ngOnInit() {
        if (this.translateService !== null) {
            this.translateService.addTranslationFolder('ng2-alfresco-search', 'assets/ng2-alfresco-search');
        }

        if (this.route) {
            this.route.params.forEach((params: Params) => {
                this.searchTerm = params.hasOwnProperty(this.queryParamName) ? params[this.queryParamName] : null;
                this.displaySearchResults(this.searchTerm);
            });
        } else {
            this.displaySearchResults(this.searchTerm);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['searchTerm']) {
            this.searchTerm = changes['searchTerm'].currentValue;
            this.skipCount = 0;
            this.displaySearchResults(this.searchTerm);
        }
    }

    onPreviewFile(event: any) {
        if (event.value) {
            this.preview.emit({
                value: event.value
            });
        }
    }

    /**
     * Loads and displays search results
     * @param searchTerm Search query entered by user
     */
    private displaySearchResults(searchTerm) {
        if (searchTerm && this.searchService) {
            let searchOpts: SearchOptions = {
                include: ['path'],
                skipCount: this.skipCount,
                rootNodeId: this.rootNodeId,
                nodeType: this.resultType,
                maxItems: this.maxResults,
                orderBy: this.resultSort
            };
            this.searchService
                .getNodeQueryResults(searchTerm, searchOpts)
                .subscribe(
                    results => {
                        this.nodeResults = results;
                        this.pagination = results.list.pagination;
                        this.resultsLoad.emit(results.list.entries);
                        this.errorMessage = null;
                    },
                    error => {
                        if (error.status !== 400) {
                            this.errorMessage = <any>error;
                            this.resultsLoad.error(error);
                        }
                    }
                );
        }
    }

    public onChangePageSize(event: Pagination): void {
        this.maxResults = event.maxItems;
        this.displaySearchResults(this.searchTerm);
    }

    public onNextPage(event: Pagination): void {
        this.skipCount = event.skipCount;
        this.displaySearchResults(this.searchTerm);
    }

    public onPrevPage(event: Pagination): void {
        this.skipCount = event.skipCount;
        this.displaySearchResults(this.searchTerm);
    }
}
