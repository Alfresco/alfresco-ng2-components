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

import { AlfrescoApiService, LogService, UserPreferencesService } from '@alfresco/adf-core';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
    RequestQuery,
    RequestSortDefinitionInner,
    ResultSetContextFacetQueries,
    SearchApi,
    Tag,
    TagBody,
    TagEntry,
    TagPaging,
    TagPagingList,
    TagsApi
} from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    private _tagsApi: TagsApi;
    get tagsApi(): TagsApi {
        this._tagsApi = this._tagsApi ?? new TagsApi(this.apiService.getInstance());
        return this._tagsApi;
    }

    private _searchApi: SearchApi;
    get searchApi(): SearchApi {
        this._searchApi = this._searchApi ?? new SearchApi(this.apiService.getInstance());
        return this._searchApi;
    }

    /** Emitted when tag information is updated. */
    @Output()
    refresh = new EventEmitter();

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService,
                private userPreferencesService: UserPreferencesService) {
    }

    /**
     * Gets a list of tags added to a node.
     *
     * @param nodeId ID of the target node
     * @returns TagPaging object (defined in JS-API) containing the tags
     */
    getTagsByNodeId(nodeId: string): Observable<TagPaging> {
        return from(this.tagsApi.listTagsForNode(nodeId)).pipe(
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Gets a list of all the tags already defined in the repository.
     *
     * @param opts Options supported by JS-API
     * @returns TagPaging object (defined in JS-API) containing the tags
     */
    getAllTheTags(opts?: any): Observable<TagPaging> {
        return from(this.tagsApi.listTags(opts))
            .pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Adds a tag to a node.
     *
     * @param nodeId ID of the target node
     * @param tagName Name of the tag to add
     * @returns TagEntry object (defined in JS-API) with details of the new tag
     */
    addTag(nodeId: string, tagName: string): Observable<TagEntry> {
        const tagBody = new TagBody();
        tagBody.tag = tagName;

        const observableAdd = from(this.tagsApi.createTagForNode(nodeId, [tagBody]));

        observableAdd.subscribe((tagEntry: TagEntry) => {
            this.refresh.emit(tagEntry);
        }, (err) => {
            this.handleError(err);
        });

        return observableAdd;
    }

    /**
     * Removes a tag from a node.
     *
     * @param nodeId ID of the target node
     * @param tag Name of the tag to remove
     * @returns Null object when the operation completes
     */
    removeTag(nodeId: string, tag: string): Observable<any> {
        const observableRemove = from(this.tagsApi.deleteTagFromNode(nodeId, tag));

        observableRemove.subscribe((data) => {
            this.refresh.emit(data);
        }, (err) => {
            this.handleError(err);
        });

        return observableRemove;
    }

    /**
     * Creates tags.
     *
     * @param tags list of tags to create.
     * @returns Created tags.
     */
    createTags(tags: TagBody[]): Observable<TagEntry[]> {
        const observableAdd$: Observable<TagEntry[]> = from(this.tagsApi.createTags(tags));
        observableAdd$.subscribe(
            (tagsEntries: TagEntry[]) => this.refresh.emit(tagsEntries),
            (err) => this.handleError(err)
        );
        return observableAdd$;
    }

    /**
     * Update a tag
     *
     * @param tagId The identifier of a tag.
     * @param tagBody The updated tag.
     * @returns Updated tag.
     */
    updateTag(tagId: string, tagBody: TagBody): Observable<TagEntry> {
        const observableUpdate$: Observable<TagEntry> = from(this.tagsApi.updateTag(tagId, tagBody));
        observableUpdate$.subscribe(
            (tagEntry: TagEntry) => this.refresh.emit(tagEntry),
            (err) => this.handleError(err)
        );
        return observableUpdate$;
    }

    /**
     * Find tags which name contains searched name.
     *
     * @param name Value for name which should be used during searching tags.
     * @param skipCount Specify how many first results should be skipped. Default 0.
     * @param maxItems Specify max number of returned tags. Default is specified by UserPreferencesService.
     * @returns Found tags which name contains searched name.
     */
    searchTags(name: string, skipCount = 0, maxItems?: number): Observable<TagPaging> {
        maxItems = maxItems || this.userPreferencesService.paginationSize;
        const sortingByName: RequestSortDefinitionInner = new RequestSortDefinitionInner();
        sortingByName.field = 'cm:name';
        sortingByName.ascending = true;
        sortingByName.type = RequestSortDefinitionInner.TypeEnum.FIELD;
        return from(this.searchApi.search({
            query: {
                language: RequestQuery.LanguageEnum.Afts,
                query: `PATH:"/cm:categoryRoot/cm:taggable/*" AND cm:name:"*${name}*"`
            },
            paging: {
                skipCount,
                maxItems
            },
            sort: [sortingByName]
        })).pipe(map((resultSetPaging) => {
            const tagPaging = new TagPaging();
            tagPaging.list = new TagPagingList();
            tagPaging.list.pagination = resultSetPaging.list.pagination;
            tagPaging.list.entries = resultSetPaging.list.entries.map((resultEntry) => {
                const tagEntry = new TagEntry();
                tagEntry.entry = new Tag();
                tagEntry.entry.tag = resultEntry.entry.name;
                tagEntry.entry.id = resultEntry.entry.id;
                return tagEntry;
            });
            return tagPaging;
        }), catchError((error) => this.handleError(error)));
    }

    /**
     * Get usage counters for passed tags.
     *
     * @param tags Array of tags names for which there should be returned counters.
     * @returns Array of usage counters for specified tags.
     */
    getCountersForTags(tags: string[]): Observable<ResultSetContextFacetQueries[]> {
        return from(this.searchApi.search({
            query: {
                language: RequestQuery.LanguageEnum.Afts,
                query: `*`
            },
            facetQueries: tags.map((tag) => ({
                query: `TAG:"${tag}"`,
                label: tag
            }))
        })).pipe(
            map((paging) => paging.list?.context?.facetQueries),
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Find tag which name matches exactly to passed name.
     *
     * @param name Value for name which should be used during finding exact tag.
     * @returns Found tag which name matches exactly to passed name.
     */
    findTagByName(name: string): Observable<TagEntry> {
        return this.getAllTheTags({ name }).pipe(
            map((result) => result.list.entries[0]),
            catchError((error) => this.handleError(error))
        );
    }

    /**
     * Deletes a tag with tagId.
     * This will cause the tag to be removed from all nodes.
     * You must have admin rights to delete a tag.
     *
     * @param tagId of the tag to be deleted
     * @returns Null object when the operation completes
     */
    deleteTag(tagId: string): Observable<void> {
        return from(this.tagsApi.deleteTag(tagId)).pipe(
            tap((data) => this.refresh.emit(data))
        );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
