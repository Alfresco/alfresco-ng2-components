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

import { LogService } from '@alfresco/adf-core';
import { ApiClientsService } from '@alfresco/adf-core/api';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TagBody, TagPaging, TagEntry } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class TagService {

    get tagsApi() {
        return this.apiClientsService.get('ContentClient.tags');
    }

    /** Emitted when tag information is updated. */
    @Output()
    refresh = new EventEmitter();

    constructor(private apiClientsService: ApiClientsService, private logService: LogService) {}

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

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
