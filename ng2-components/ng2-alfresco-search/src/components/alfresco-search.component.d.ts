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
import { EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlfrescoSearchService } from './../services/alfresco-search.service';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { MinimalNodeEntity } from 'alfresco-js-api';
export declare class AlfrescoSearchComponent implements OnChanges, OnInit {
    private alfrescoSearchService;
    private translate;
    private _alfrescoThumbnailService;
    private route;
    static SINGLE_CLICK_NAVIGATION: string;
    static DOUBLE_CLICK_NAVIGATION: string;
    searchTerm: string;
    maxResults: number;
    resultSort: string;
    rootNodeId: string;
    resultType: string;
    navigationMode: string;
    navigate: EventEmitter<MinimalNodeEntity>;
    resultsLoad: EventEmitter<{}>;
    results: any;
    errorMessage: any;
    queryParamName: string;
    baseComponentPath: string;
    constructor(alfrescoSearchService: AlfrescoSearchService, translate: AlfrescoTranslationService, _alfrescoThumbnailService: AlfrescoThumbnailService, route: ActivatedRoute);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    getMimeTypeIcon(node: any): string;
    private resolveIconPath(icon);
    getMimeTypeKey(node: any): string;
    private displaySearchResults(searchTerm);
    onItemClick(node: any, event?: Event): void;
    onItemDblClick(node: MinimalNodeEntity): void;
}
