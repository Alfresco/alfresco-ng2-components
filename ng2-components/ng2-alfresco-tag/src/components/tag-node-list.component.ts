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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { TagService } from '../services/tag.service';

/**
 *
 * This component, ShowNodeTag a list of the tag on relative a node
 *
 * @returns {TagNodeList} .
 */

@Component({
    selector: 'adf-tag-node-list, alfresco-tag-node-list',
    templateUrl: './tag-node-list.component.html',
    styleUrls: ['./tag-node-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagNodeListComponent implements OnChanges {

    @Input()
    nodeId: string;

    tagsEntries: any;

    @Output()
    results = new EventEmitter();

    /**
     * Constructor
     * @param tagService
     */
    constructor(private tagService: TagService) {
        this.tagService.refresh.subscribe(() => {
            this.refreshTag();
        });
    }

    ngOnChanges() {
        return this.refreshTag();
    }

    refreshTag() {
        this.tagService.getTagsByNodeId(this.nodeId).subscribe((data) => {
            this.tagsEntries = data.list.entries;
            this.results.emit(this.tagsEntries);
        });
    }

    removeTag(tag: string) {
        this.tagService.removeTag(this.nodeId, tag).subscribe(() => {
            this.refreshTag();
        });
    }
}
