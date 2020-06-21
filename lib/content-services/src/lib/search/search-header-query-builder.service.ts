/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Injectable } from '@angular/core';
import { AlfrescoApiService, AppConfigService, NodesApiService } from '@alfresco/adf-core';
import { SearchConfiguration } from './search-configuration.interface';
import { BaseQueryBuilderService } from './base-query-builder.service';
import { SearchCategory } from './search-category.interface';
import { MinimalNode } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class SearchHeaderQueryBuilderService extends BaseQueryBuilderService {

    private customSources = ['-trashcan-', '-sharedlinks-', '-sites-', '-mysites-', '-favorites-', '-recent-', '-my-'];

    activeFilters: string[] = [];
    currentParentFolderID: string;

    constructor(appConfig: AppConfigService, alfrescoApiService: AlfrescoApiService, private nodeApiService: NodesApiService) {
        super(appConfig, alfrescoApiService);
    }

    public isFilterServiceActive(): boolean {
        return true;
    }

    loadConfiguration(): SearchConfiguration {
        return this.appConfig.get<SearchConfiguration>('search-headers');
    }

    setupCurrentPagination(maxItems: number, skipCount: number) {
        if (!this.paging ||
            (this.paging &&
                this.paging.maxItems !== maxItems || this.paging.skipCount !== skipCount)) {
            this.paging = { maxItems, skipCount };
            this.execute();
        }
    }

    setActiveFilter(columnActivated: string) {
        this.activeFilters.push(columnActivated);
    }

    isNoFilterActive(): boolean {
        return this.activeFilters.length === 0;
    }

    removeActiveFilter(columnRemoved: string) {
        const removeIndex = this.activeFilters.findIndex((column) => column === columnRemoved);
        this.activeFilters.splice(removeIndex, 1);
    }

    getCategoryForColumn(columnKey: string): SearchCategory {
        let foundCategory = null;
        if (this.categories !== null) {
            foundCategory = this.categories.find(
                category => category.columnKey === columnKey
            );
        }
        return foundCategory;
    }

    setCurrentRootFolderId(currentFolderId: string, previousFolderId: string) {
        if (this.customSources.includes(currentFolderId)) {
            if (currentFolderId !== this.currentParentFolderID) {
                this.nodeApiService.getNode(currentFolderId).subscribe((nodeEntity: MinimalNode) => {
                    this.updateCurrentParentFilter(nodeEntity.id, previousFolderId);
                });
            }
        } else {
            this.updateCurrentParentFilter(currentFolderId, previousFolderId);
        }
    }

    private updateCurrentParentFilter(currentFolderId: string, previousFolderId: string) {
        const alreadyAddedFilter = this.filterQueries.find(filterQueries =>
            filterQueries.query.includes(currentFolderId)
        );

        if (!alreadyAddedFilter) {
            this.removeOldFolderFiltering(previousFolderId, this.currentParentFolderID);
            this.currentParentFolderID = currentFolderId;
            this.filterQueries.push({
                query: `PARENT:"workspace://SpacesStore/${currentFolderId}"`
            });
        }
    }

    private removeOldFolderFiltering(previousFolderId: string, actualSetFolderId: string) {
        if (previousFolderId || actualSetFolderId) {
            const folderIdToRetrieve = previousFolderId ? previousFolderId : actualSetFolderId;
            const oldFilterIndex = this.filterQueries.findIndex(filterQueries =>
                filterQueries.query.includes(folderIdToRetrieve)
            );
            if (oldFilterIndex) {
                this.filterQueries.splice(oldFilterIndex, 1);
            }
        }
    }
}
