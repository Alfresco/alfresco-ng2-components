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

import { TranslationService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
import { TagService } from './services/tag.service';
import { Subject } from 'rxjs';
import { TagPaging } from '@alfresco/js-api';
import { takeUntil } from 'rxjs/operators';

/**
 *
 * This component, provide a list of the tags relative a node with actions button to add or remove new tag
 */

@Component({
    selector: 'adf-tag-node-actions-list',
    templateUrl: './tag-actions.component.html',
    styleUrls: ['./tag-actions.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-tag-node-actions-list' }
})
export class TagActionsComponent implements OnChanges, OnInit, OnDestroy {

    /** The identifier of a node. */
    @Input()
    nodeId: string;

    /** Emitted when a tag is added successfully. */
    @Output()
    successAdd: EventEmitter<any> = new EventEmitter();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter();

    /** Emitted when an action is chosen. */
    @Output()
    result = new EventEmitter();

    newTagName: string;
    tagsEntries: any;
    errorMsg: string;
    disableAddTag: boolean = true;

    private onDestroy$ = new Subject<boolean>();

    constructor(private tagService: TagService, private translateService: TranslationService) {
    }

    ngOnInit() {
        this.tagService.refresh
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => this.refreshTag());
    }

    ngOnChanges() {
        return this.refreshTag();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    refreshTag() {
        if (this.nodeId) {
            this.tagService.getTagsByNodeId(this.nodeId).subscribe((tagPaging: TagPaging) => {
                this.tagsEntries = tagPaging.list.entries;
                this.disableAddTag = false;
                this.result.emit(this.tagsEntries);
            }, () => {
                this.tagsEntries = null;
                this.disableAddTag = true;
                this.result.emit(this.tagsEntries);
            });
        }
    }

    addTag() {
        if (this.searchTag(this.newTagName)) {
            this.errorMsg = this.translateService.instant('TAG.MESSAGES.EXIST');
            this.error.emit(this.errorMsg);
        } else {
            this.tagService.addTag(this.nodeId, this.newTagName).subscribe(() => {
                this.newTagName = '';
                this.successAdd.emit(this.nodeId);
            });
        }
    }

    searchTag(searchTagName: string) {
        if (this.tagsEntries) {
            return this.tagsEntries.find((currentTag) => (searchTagName === currentTag.entry.tag));
        }
    }

    cleanErrorMsg() {
        this.errorMsg = '';
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag);
    }
}
