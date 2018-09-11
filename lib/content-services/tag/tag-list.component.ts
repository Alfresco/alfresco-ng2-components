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

import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { TagService } from './services/tag.service';
import { PaginationModel } from '@alfresco/adf-core';

/**
 * This component provide a list of all the tag inside the ECM
 */
@Component({
    selector: 'adf-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagListComponent implements OnInit {

    /** Emitted when a tag is selected. */
    @Output()
    result = new EventEmitter();

    /**
     * Array of tags that are displayed
     */
    tagsEntries: any = [];

    /**
     * Number of items per iteration
     */
    size: number = 10;

    defaultPagination: PaginationModel;
    pagination: PaginationModel;

    isLoading = false;
    isSizeMinimum = true;

    /**
     * Constructor
     * @param tagService
     */
    constructor(private tagService: TagService) {

        this.defaultPagination = {
            skipCount: 0,
            maxItems: this.size,
            hasMoreItems: false
        };

        this.pagination = this.defaultPagination;

        this.tagService.refresh.subscribe(() => {
            this.tagsEntries = [];
            this.refreshTag(this.defaultPagination);
        });
    }

    ngOnInit() {
        return this.refreshTag(this.defaultPagination);
    }

    refreshTag(opts?: any) {
        this.tagService.getAllTheTags(opts).subscribe((tags: any) => {
            this.tagsEntries = this.tagsEntries.concat(tags.list.entries);
            this.pagination = tags.list.pagination;
            this.result.emit(this.tagsEntries);
            this.isLoading = false;
        });
    }

    loadMoreTags() {
        if (this.pagination.hasMoreItems) {
            this.isLoading = true;
            this.isSizeMinimum = false;

            this.refreshTag({
                skipCount: this.pagination.skipCount + this.pagination.count,
                maxItems: this.size
            });
        }
    }

    loadLessTags() {
        this.isSizeMinimum = false;
        this.tagsEntries = this.tagsEntries.slice(0, this.tagsEntries.length - this.pagination.count);
        this.pagination.skipCount = this.pagination.skipCount - this.pagination.count;
        this.pagination.hasMoreItems = true;

        if (this.tagsEntries.length <= this.size) {
            this.isSizeMinimum = true;
        }
    }
}
