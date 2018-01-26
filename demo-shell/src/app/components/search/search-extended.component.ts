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

import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NodePaging, Pagination, QueryBody, MinimalNodeEntity } from 'alfresco-js-api';
import { SearchComponent } from '@alfresco/adf-content-services';
import { ThumbnailService } from '@alfresco/adf-core';
import { SearchService, SearchConfigurationService } from '@alfresco/adf-core';
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
    resultNodePageList: NodePaging;
    maxItems: number;
    skipCount = 0;
    pagination: Pagination;
    queryBody: QueryBody;
    useServiceApproach = false;

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

    generateQueryBody(searchTerm: string): QueryBody {
        if (this.useServiceApproach) {
            return null;
        } else {
            return {
                query: {
                    query: searchTerm ? `${searchTerm}* OR name:${searchTerm}*` : searchTerm
                },
                include: ['path', 'allowableOperations'],
                filterQueries: [
                    /*tslint:disable-next-line */
                    { query: "TYPE:'cm:folder' OR TYPE:'cm:content'" },
                    { query: 'NOT cm:creator:System' }]
            };
        }
    }
}
