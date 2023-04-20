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

import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Pagination, QueryBody, MinimalNodeEntity } from '@alfresco/js-api';
import { ThumbnailService } from '@alfresco/adf-core';
import { SearchService, SearchConfigurationService, SearchComponent } from '@alfresco/adf-content-services';
import { TestSearchConfigurationService } from './search-config-test.service';

@Component({
    selector: 'app-search-extended-component',
    templateUrl: './search-extended.component.html',
    styleUrls: ['./search-extended.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: SearchConfigurationService, useClass: TestSearchConfigurationService },
        SearchService
    ]
})
export class SearchExtendedComponent {

    @ViewChild('search')
    search: SearchComponent;

    queryParamName = 'q';
    searchedWord = '';
    queryBodyString = '';
    errorMessage = '';
    maxItems: number;
    skipCount = 0;
    pagination: Pagination;
    queryBody: QueryBody;

    constructor(public thumbnailService: ThumbnailService) {

    }

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

}
