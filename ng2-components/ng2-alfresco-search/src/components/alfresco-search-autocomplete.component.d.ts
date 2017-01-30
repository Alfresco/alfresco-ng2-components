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
import { ElementRef, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { AlfrescoSearchService } from './../services/alfresco-search.service';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
export declare class AlfrescoSearchAutocompleteComponent implements OnInit, OnChanges {
    private alfrescoSearchService;
    private translate;
    private alfrescoThumbnailService;
    searchTerm: string;
    results: any;
    errorMessage: any;
    ngClass: any;
    maxResults: number;
    resultSort: string;
    rootNodeId: string;
    resultType: string;
    fileSelect: EventEmitter<any>;
    searchFocus: EventEmitter<FocusEvent>;
    cancel: EventEmitter<{}>;
    resultsLoad: EventEmitter<{}>;
    scrollBack: EventEmitter<{}>;
    resultsTableBody: ElementRef;
    baseComponentPath: string;
    constructor(alfrescoSearchService: AlfrescoSearchService, translate: AlfrescoTranslationService, alfrescoThumbnailService: AlfrescoThumbnailService);
    ngOnInit(): void;
    ngOnChanges(changes: any): void;
    private displaySearchResults(searchTerm);
    getMimeTypeIcon(node: MinimalNodeEntity): string;
    resolveIconPath(icon: string): string;
    getMimeTypeKey(node: MinimalNodeEntity): string;
    focusResult(): void;
    onItemClick(node: MinimalNodeEntity): void;
    onRowFocus($event: FocusEvent): void;
    onRowBlur($event: FocusEvent): void;
    onRowEnter(node: MinimalNodeEntity): void;
    private getNextElementSibling(node);
    private getPreviousElementSibling(node);
    onRowArrowDown($event: KeyboardEvent): void;
    onRowArrowUp($event: KeyboardEvent): void;
    onRowEscape($event: KeyboardEvent): void;
}
