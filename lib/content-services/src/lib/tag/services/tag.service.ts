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

import { AlfrescoApiService, LogService, UserPreferencesService } from '@alfresco/adf-core';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TagBody, TagEntry, TagPaging, TagsApi } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class TagService {

    private _tagsApi: TagsApi;
    get tagsApi(): TagsApi {
        this._tagsApi = this._tagsApi ?? new TagsApi(this.apiService.getInstance());
        return this._tagsApi;
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
     * @param includedCounts True if count field should be included in response object for each tag, false otherwise.
     * @returns TagPaging object (defined in JS-API) containing the tags
     */
    getAllTheTags(opts?: any, includedCounts?: boolean): Observable<TagPaging> {
        return from(this.tagsApi.listTags({
            include: includedCounts ? ['count'] : undefined,
            ...opts
        })).pipe(catchError((err) => this.handleError(err)));
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
    removeTag(nodeId: string, tag: string): Observable<void> {
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
     * @param sorting Object which configures sorting. OrderBy field specifies field used for sorting, direction specified ascending or descending direction.
     * Default sorting is ascending by tag field.
     * @param includedCounts True if count field should be included in response object for each tag, false otherwise.
     * @param skipCount Specify how many first results should be skipped. Default 0.
     * @param maxItems Specify max number of returned tags. Default is specified by UserPreferencesService.
     * @returns Found tags which name contains searched name.
     */
    searchTags(name: string, sorting = { orderBy: 'tag', direction: 'asc' },
               includedCounts?: boolean, skipCount = 0, maxItems?: number): Observable<TagPaging> {
        maxItems = maxItems || this.userPreferencesService.paginationSize;
        return this.getAllTheTags({
            tag: `*${name}*`,
            skipCount,
            maxItems,
            sorting,
            matching: true
        }, includedCounts).pipe(catchError((err) => this.handleError(err)));
    }

    /**
     * Find tag which name matches exactly to passed name.
     *
     * @param name Value for name which should be used during finding exact tag.
     * @returns Found tag which name matches exactly to passed name.
     */
    findTagByName(name: string): Observable<TagEntry> {
        return this.getAllTheTags({ tag: name }).pipe(
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

    /**
     * Assign tags to node. If tag is new then tag is also created additionally, if tag already exists then it is just assigned.
     *
     * @param nodeId Id of node to which tags should be assigned.
     * @param tags List of tags to create and assign or just assign if they already exist.
     *
     * @return Just linked tags to node or single tag if linked only one tag.
     */
    assignTagsToNode(nodeId: string, tags: TagBody[]): Observable<TagPaging | TagEntry> {
        return from(this.tagsApi.assignTagsToNode(nodeId, tags)).pipe(
            tap((data) => this.refresh.emit(data))
        );
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
