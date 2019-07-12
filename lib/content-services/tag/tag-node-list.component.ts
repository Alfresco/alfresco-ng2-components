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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { TagService } from './services/tag.service';
import { TagPaging } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 *
 * This component, ShowNodeTag a list of the tag on relative a node
 */

@Component({
    selector: 'adf-tag-node-list',
    templateUrl: './tag-node-list.component.html',
    styleUrls: ['./tag-node-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagNodeListComponent implements OnChanges, OnDestroy, OnInit {
    /** The identifier of a node. */
    @Input()
    nodeId: string;

    /** Show delete button */
    @Input()
    showDelete = true;

    tagsEntries: any;

    /** Emitted when a tag is selected. */
    @Output()
    results = new EventEmitter();

    private onDestroy$ = new Subject<boolean>();

    /**
     * Constructor
     * @param tagService
     */
    constructor(private tagService: TagService) {
    }

    ngOnChanges() {
        this.refreshTag();
    }

    ngOnInit() {
        this.tagService.refresh
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.refreshTag());
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    refreshTag() {
        if (this.nodeId) {
            this.tagService.getTagsByNodeId(this.nodeId).subscribe((tagPaging: TagPaging) => {
                this.tagsEntries = tagPaging.list.entries;
                this.results.emit(this.tagsEntries);
            });
        }
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }
}
